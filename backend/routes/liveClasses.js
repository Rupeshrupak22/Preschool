const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/v1/live-classes
router.get('/', authenticate, async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'teacher') where.teacher_id = req.user.teacher_id || req.user.id;
    if (req.user.role === 'student' && req.user.class_level) where.class_level = req.user.class_level;
    const classes = await prisma.teacher_class_sessions.findMany({
      where,
      orderBy: { start_time: 'desc' },
    });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/live-classes
router.post('/', authenticate, authorize('teacher', 'principal', 'admin'), async (req, res) => {
  try {
    const { teacher_id, title, class_level, subject, start_time, end_time, room, mode, status } = req.body;
    const finalTeacherId = req.user.role === 'teacher' ? (req.user.teacher_id || req.user.id) : teacher_id;

    const session = await prisma.teacher_class_sessions.create({
      data: {
        id: require('crypto').randomUUID().replace(/-/g, '').slice(0, 25),
        teacher_id: finalTeacherId,
        title,
        class_level,
        subject: subject || null,
        start_time: new Date(start_time),
        end_time: end_time ? new Date(end_time) : null,
        room: room || null,
        mode: mode || 'online',
        status: status || 'scheduled',
      },
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/v1/live-classes/:id
router.put('/:id', authenticate, authorize('teacher', 'principal', 'admin'), async (req, res) => {
  try {
    const existing = await prisma.teacher_class_sessions.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Live class not found' });
    if (req.user.role === 'teacher' && existing.teacher_id !== (req.user.teacher_id || req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const session = await prisma.teacher_class_sessions.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/v1/live-classes/:id
router.delete('/:id', authenticate, authorize('principal', 'admin'), async (req, res) => {
  try {
    await prisma.teacher_class_sessions.delete({ where: { id: req.params.id } });
    res.json({ message: 'Live class removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
