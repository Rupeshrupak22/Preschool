const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { sendResponse } = require('../utils/response');
const router = express.Router();

// GET /api/v1/students
router.get('/', authenticate, async (req, res) => {
  try {
    const { search, schoolId } = req.query;
    let where = {};

    if (req.user.role === 'student') {
      where.user_id = req.user.id;
    } else if (req.user.role === 'teacher' || req.user.role === 'principal') {
      where.schoolId = req.user.school_id || '__no_school__';
    } else if (schoolId) {
      where.schoolId = schoolId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { class_level: { contains: search } },
      ];
    }

    const students = await prisma.student.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    res.json(students);
  } catch (err) {
    console.error('Fetch students error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// GET /api/v1/students/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
    });

    if (!student) return res.status(404).json({ error: 'Student not found' });
    if (!canAccessStudent(req.user, student)) return res.status(403).json({ error: 'Access denied' });
    res.json(student);
  } catch (err) {
    console.error('Fetch student error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// POST /api/v1/students
router.post('/', authenticate, authorize('admin', 'principal'), async (req, res) => {
  try {
    const { name, email, phone, class_level, school_name, parent_name, parent_phone, schoolId } = req.body;
    const finalSchoolId = req.user.role === 'principal' ? req.user.school_id : schoolId;

    const student = await prisma.student.create({
      data: {
        name,
        email,
        phone: phone || null,
        class_level: class_level || null,
        school_name: school_name || null,
        parent_name: parent_name || null,
        parent_phone: parent_phone || null,
        schoolId: finalSchoolId || null,
      },
    });

    res.status(201).json(student);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Student with this email already exists' });
    }
    console.error('Create student error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// PUT /api/v1/students/:id
router.put('/:id', authenticate, authorize('admin', 'principal', 'teacher'), async (req, res) => {
  try {
    const existing = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Student not found' });
    if (!canAccessStudent(req.user, existing)) return res.status(403).json({ error: 'Access denied' });

    const allowed = (({ name, phone, class_level, school_name, parent_name, parent_phone, status }) => ({
      name, phone, class_level, school_name, parent_name, parent_phone, status,
    }))(req.body);
    Object.keys(allowed).forEach((key) => allowed[key] === undefined && delete allowed[key]);

    const student = await prisma.student.update({
      where: { id: req.params.id },
      data: allowed,
    });
    res.json(student);
  } catch (err) {
    console.error('Update student error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// DELETE /api/v1/students/:id
router.delete('/:id', authenticate, authorize('admin', 'principal'), async (req, res) => {
  try {
    const existing = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Student not found' });
    if (!canAccessStudent(req.user, existing)) return res.status(403).json({ error: 'Access denied' });
    await prisma.student.delete({ where: { id: req.params.id } });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Delete student error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

function canAccessStudent(user, student) {
  if (user.role === 'admin') return true;
  if (user.role === 'student') return student.user_id === user.id || student.email === user.email;
  if (user.role === 'teacher' || user.role === 'principal') {
    return Boolean(user.school_id && student.schoolId === user.school_id);
  }
  return false;
}

module.exports = router;
