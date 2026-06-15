const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { hashPassword, hashAccessKey, generateAccessKey } = require('../utils/password');
const router = express.Router();

// GET /api/v1/teachers
router.get('/', authenticate, authorize('admin', 'principal', 'teacher'), async (req, res) => {
  try {
    const { search, schoolId } = req.query;
    let where = {};

    if (req.user.role === 'teacher') {
      where.id = req.user.teacher_id || req.user.id;
    } else if (req.user.role === 'principal') {
      where.schoolId = req.user.school_id || '__no_school__';
    } else if (schoolId) {
      where.schoolId = schoolId;
    }

    if (search) {
      where.OR = [
        { teacher_name: { contains: search } },
        { subject: { contains: search } },
      ];
    }

    const teachers = await prisma.teacher.findMany({
      where,
      orderBy: { created_at: 'desc' },
      select: teacherPublicSelect(),
    });

    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/teachers/:id
router.get('/:id', authenticate, authorize('admin', 'principal', 'teacher'), async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: req.params.id },
      select: teacherPublicSelect(),
    });

    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    if (!canAccessTeacher(req.user, teacher)) return res.status(403).json({ error: 'Access denied' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/teachers
router.post('/', authenticate, authorize('admin', 'principal'), async (req, res) => {
  try {
    const { teacher_name, email, password, subject, phone, schoolId, school_name, assigned_classes } = req.body;
    if (!teacher_name || !email || !password) return res.status(400).json({ error: 'teacher_name, email and password are required' });
    const staffKey = req.body.staffKey || generateAccessKey();
    const finalSchoolId = req.user.role === 'principal' ? req.user.school_id : schoolId;
    const finalSchoolName = req.user.role === 'principal' ? req.user.school_name : school_name;

    const teacher = await prisma.teacher.create({
      data: {
        teacher_name,
        email: email.toLowerCase().trim(),
        password_hash: await hashPassword(password),
        staff_key_hash: hashAccessKey(staffKey),
        subject: subject || null,
        phone: phone || null,
        schoolId: finalSchoolId,
        school_name: finalSchoolName,
        assigned_classes: assigned_classes || null,
      },
      select: teacherPublicSelect(),
    });

    res.status(201).json({ ...teacher, staffKey });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Teacher with this email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/v1/teachers/:id
router.put('/:id', authenticate, authorize('admin', 'principal'), async (req, res) => {
  try {
    const existing = await prisma.teacher.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Teacher not found' });
    if (!canAccessTeacher(req.user, existing)) return res.status(403).json({ error: 'Access denied' });
    const allowed = (({ teacher_name, subject, phone, assigned_classes, status }) => ({
      teacher_name, subject, phone, assigned_classes, status, updated_at: new Date(),
    }))(req.body);
    Object.keys(allowed).forEach((key) => allowed[key] === undefined && delete allowed[key]);

    const teacher = await prisma.teacher.update({
      where: { id: req.params.id },
      data: allowed,
      select: teacherPublicSelect(),
    });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/v1/teachers/:id
router.delete('/:id', authenticate, authorize('admin', 'principal'), async (req, res) => {
  try {
    const existing = await prisma.teacher.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Teacher not found' });
    if (!canAccessTeacher(req.user, existing)) return res.status(403).json({ error: 'Access denied' });
    await prisma.teacher.delete({ where: { id: req.params.id } });
    res.json({ message: 'Teacher removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function teacherPublicSelect() {
  return {
    id: true,
    schoolId: true,
    school_name: true,
    teacher_name: true,
    email: true,
    subject: true,
    phone: true,
    assigned_classes: true,
    status: true,
    last_login_at: true,
    created_at: true,
    updated_at: true,
  };
}

function canAccessTeacher(user, teacher) {
  if (user.role === 'admin') return true;
  if (user.role === 'teacher') return teacher.id === (user.teacher_id || user.id);
  if (user.role === 'principal') return Boolean(user.school_id && teacher.schoolId === user.school_id);
  return false;
}

module.exports = router;
