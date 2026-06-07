const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { sendResponse } = require('../utils/response');
const router = express.Router();

// GET /api/v1/leads
router.get('/', authenticate, authorize('admin', 'principal'), async (req, res) => {
  try {
    const leads = await prisma.leads.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(leads);
  } catch (err) {
    console.error('Fetch leads error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// POST /api/v1/leads
router.post('/', async (req, res) => {
  try {
    const { type, name, email, phone, school, city, message, class_level, interest } = req.body;

    if (!email || !String(email).includes('@')) {
      return res.status(400).json({ error: 'Valid email required.' });
    }

    const lead = await prisma.leads.create({
      data: {
        id: require('crypto').randomUUID().replace(/-/g, '').slice(0, 25),
        type: type || 'demo',
        name: name || null,
        email,
        phone: phone || null,
        school: school || null,
        city: city || null,
        message: message || null,
        class_level: class_level || null,
        interest: interest || null,
      },
    });

    res.status(201).json({ ok: true, lead });
  } catch (err) {
    console.error('Create lead error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// DELETE /api/v1/leads/:id
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await prisma.leads.delete({ where: { id: req.params.id } });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    console.error('Delete lead error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

module.exports = router;
