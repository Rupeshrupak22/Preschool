const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { sendResponse } = require('../utils/response');
const router = express.Router();

// GET /api/v1/events
router.get('/', authenticate, async (req, res) => {
  try {
    const { limit } = req.query;

    const events = await prisma.notifications.findMany({
      orderBy: { created_at: 'desc' },
      take: limit ? parseInt(limit) : 50,
    });

    res.json(events);
  } catch (err) {
    console.error('Fetch events error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// POST /api/v1/events
router.post('/', authenticate, authorize('teacher', 'principal', 'admin'), async (req, res) => {
  try {
    const { user_email, title, message, channel } = req.body;

    const event = await prisma.notifications.create({
      data: {
        id: require('crypto').randomUUID().replace(/-/g, '').slice(0, 25),
        user_email: user_email || null,
        title,
        message,
        channel: channel || 'email',
        status: 'queued',
      },
    });

    res.status(201).json(event);
  } catch (err) {
    console.error('Create event error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// DELETE /api/v1/events/:id
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await prisma.notifications.delete({ where: { id: req.params.id } });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Delete event error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

module.exports = router;
