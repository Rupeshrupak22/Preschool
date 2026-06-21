const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/v1/students
router.get('/', authenticate, async (req, res) => {
  try {
    const { search, schoolId } = req.query;
    let where = {};

    if (req.user.role === 'student') {
      where.user_id = req.user.id;
    } else if (req.user.role === 'teacher' || req.user.role === 'principal') {
      // Match by schoolId OR school_name (students may have school_name but no schoolId)
      const userSchoolId = req.user.school_id;
      const userSchoolName = req.user.school_name;
      if (userSchoolId || userSchoolName) {
        where.OR = [
          ...(userSchoolId ? [{ schoolId: userSchoolId }] : []),
          ...(userSchoolName ? [{ school_name: userSchoolName }] : []),
        ];
      } else {
        where.schoolId = '__no_school__';
      }
    } else if (schoolId) {
      where.schoolId = schoolId;
    }

    if (search) {
      const searchCondition = [
        { name: { contains: search } },
        { class_level: { contains: search } },
      ];
      if (where.OR) {
        // Combine school filter AND search filter
        where.AND = [{ OR: where.OR }, { OR: searchCondition }];
        delete where.OR;
      } else {
        where.OR = searchCondition;
      }
    }

    const students = await prisma.student.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
