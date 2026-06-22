const express = require('express');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { sendResponse } = require('../utils/response');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/messages — Get messages for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const email = req.user.email;
    const role = req.user.role;

    const messages = await prisma.$queryRawUnsafe(
      `SELECT id, sender_name, message, is_read, created_at
       FROM admin_messages
       WHERE (recipient_type = 'individual' AND recipient_email = ?)
          OR (recipient_type = 'broadcast' AND recipient_role = ?)
       ORDER BY created_at DESC
       LIMIT 50`,
      email.toLowerCase(),
      role.toLowerCase()
    );

    sendResponse(res, 200, true, 'Messages fetched', { messages });
  } catch (err) {
    console.error('Fetch messages error:', err.message);
    sendResponse(res, 500, false, 'Failed to fetch messages');
  }
});

// POST /api/v1/messages — Send a message (admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { recipient, message } = req.body;

    if (!recipient || !message?.trim()) {
      return sendResponse(res, 400, false, 'Recipient and message are required');
    }

    const id = crypto.randomUUID();
    const senderName = req.user.name || 'Admin';
    const senderEmail = req.user.email;

    if (recipient.includes(':')) {
      const [role, email] = recipient.split(':');
      await prisma.$executeRawUnsafe(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_email, recipient_role, message)
         VALUES (?, ?, ?, 'individual', ?, ?, ?)`,
        id, senderEmail, senderName, email, role, message.trim()
      );
    } else if (recipient === 'all-teachers') {
      await prisma.$executeRawUnsafe(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'teacher', ?)`,
        id, senderEmail, senderName, message.trim()
      );
    } else if (recipient === 'all-principals') {
      await prisma.$executeRawUnsafe(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'principal', ?)`,
        id, senderEmail, senderName, message.trim()
      );
    } else {
      const id2 = crypto.randomUUID();
      await prisma.$executeRawUnsafe(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'teacher', ?)`,
        id, senderEmail, senderName, message.trim()
      );
      await prisma.$executeRawUnsafe(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'principal', ?)`,
        id2, senderEmail, senderName, message.trim()
      );
    }

    sendResponse(res, 201, true, 'Message sent successfully');
  } catch (err) {
    console.error('Send message error:', err.message);
    sendResponse(res, 500, false, 'Failed to send message');
  }
});

// PUT /api/v1/messages/:id/read — Mark message as read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    await prisma.$executeRawUnsafe(
      'UPDATE admin_messages SET is_read = 1 WHERE id = ?',
      req.params.id
    );
    sendResponse(res, 200, true, 'Message marked as read');
  } catch (err) {
    console.error('Mark read error:', err.message);
    sendResponse(res, 500, false, 'Failed to mark message as read');
  }
});

module.exports = router;
