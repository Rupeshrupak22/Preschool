const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');
const { sendResponse } = require('../utils/response');
const router = express.Router();

// GET /api/v1/schools
router.get('/', authenticate, authorize('admin', 'principal'), async (req, res) => {
  try {
    const where = req.user.role === 'principal' ? { id: req.user.school_id } : {};
    const schools = await prisma.school.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });
    res.json(schools);
  } catch (err) {
    console.error('Fetch schools error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// GET /api/v1/schools/:id
router.get('/:id', authenticate, authorize('admin', 'principal'), async (req, res) => {
  try {
    if (req.user.role === 'principal' && req.params.id !== req.user.school_id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const school = await prisma.school.findUnique({
      where: { id: req.params.id },
    });

    if (!school) return res.status(404).json({ error: 'School not found' });
    res.json(school);
  } catch (err) {
    console.error('Fetch school error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// POST /api/v1/schools
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, email, phone, city, address, contact_person, status } = req.body;

    const school = await prisma.school.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        city: city || null,
        address: address || null,
        contact_person: contact_person || null,
        status: status || 'lead',
      },
    });

    res.status(201).json(school);
  } catch (err) {
    console.error('Create school error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// PUT /api/v1/schools/:id
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const school = await prisma.school.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(school);
  } catch (err) {
    console.error('Update school error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// DELETE /api/v1/schools/:id
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await prisma.school.delete({ where: { id: req.params.id } });
    res.json({ message: 'School removed successfully' });
  } catch (err) {
    console.error('Delete school error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

module.exports = router;
