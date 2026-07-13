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

    let messages;

    if (role === 'admin') {
      // Admins see messages sent TO admins (from principals/teachers)
      messages = await prisma.$queryRawUnsafe(
        `SELECT id, sender_email, sender_name, recipient_type, recipient_email, recipient_role, message, is_read, created_at
         FROM admin_messages
         WHERE (recipient_type = 'individual' AND recipient_email = ?)
            OR (recipient_type = 'broadcast' AND recipient_role = 'admin')
         ORDER BY created_at DESC
         LIMIT 50`,
        email.toLowerCase()
      );
    } else {
      // Teachers/Principals see messages sent to them individually or broadcast to their role
      messages = await prisma.$queryRawUnsafe(
        `SELECT id, sender_email, sender_name, recipient_type, recipient_email, recipient_role, message, is_read, created_at
         FROM admin_messages
         WHERE (recipient_type = 'individual' AND recipient_email = ?)
            OR (recipient_type = 'broadcast' AND recipient_role = ?)
         ORDER BY created_at DESC
         LIMIT 50`,
        email.toLowerCase(),
        role.toLowerCase()
      );
    }

    sendResponse(res, 200, true, 'Messages fetched', { messages });
  } catch (err) {
    console.error('Fetch messages error:', err.message);
    sendResponse(res, 500, false, 'Failed to fetch messages');
  }
});

// GET /api/v1/messages/student — Get messages for a student
router.get('/student', authenticate, async (req, res) => {
  try {
    const email = req.user.email;

    const messages = await prisma.$queryRawUnsafe(
      `SELECT id, sender_email, sender_name, message, is_read, created_at
       FROM admin_messages
       WHERE (recipient_type = 'individual' AND recipient_email = ?)
          OR (recipient_type = 'broadcast' AND recipient_role = 'student')
       ORDER BY created_at DESC
       LIMIT 50`,
      email.toLowerCase()
    );

    sendResponse(res, 200, true, 'Messages fetched', { messages });
  } catch (err) {
    console.error('Fetch student messages error:', err.message);
    sendResponse(res, 500, false, 'Failed to fetch messages');
  }
});

// POST /api/v1/messages — Send a message
router.post('/', authenticate, authorize('admin', 'principal', 'teacher'), async (req, res) => {
  try {
    const { recipient, message } = req.body;

    if (!recipient || !message?.trim()) {
      return sendResponse(res, 400, false, 'Recipient and message are required');
    }

    const senderRole = req.user.role;
    const senderEmail = req.user.email;

    // Build sender_name with school context for non-admin roles
    let senderName = req.user.name || senderRole;
    if (senderRole !== 'admin' && req.user.school_name) {
      senderName = `${senderName} – ${senderRole.charAt(0).toUpperCase() + senderRole.slice(1)} (${req.user.school_name})`;
    }

    // Validate sender permissions
    if (senderRole === 'admin') {
      if (recipient === 'all-students' || (recipient.includes(':') && recipient.startsWith('student:'))) {
        return sendResponse(res, 403, false, 'Admin cannot message students directly');
      }
    }

    const id = crypto.randomUUID();

    if (recipient.includes(':')) {
      // Individual message: "teacher:email@example.com" or "principal:email" etc.
      const [targetRole, targetEmail] = recipient.split(':');
      await prisma.$executeRawUnsafe(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_email, recipient_role, message)
         VALUES (?, ?, ?, 'individual', ?, ?, ?)`,
        id, senderEmail, senderName, targetEmail, targetRole, message.trim()
      );
    } else if (recipient === 'all-admins' || recipient === 'admin') {
      await prisma.$executeRawUnsafe(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'admin', ?)`,
        id, senderEmail, senderName, message.trim()
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
    } else if (recipient === 'all-students') {
      await prisma.$executeRawUnsafe(
        `INSERT INTO admin_messages (id, sender_email, sender_name, recipient_type, recipient_role, message)
         VALUES (?, ?, ?, 'broadcast', 'student', ?)`,
        id, senderEmail, senderName, message.trim()
      );
    } else if (recipient === 'all') {
      // Send to all teachers AND principals
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
    } else {
      return sendResponse(res, 400, false, 'Invalid recipient');
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

// DELETE /api/v1/messages/:id — delete a single message
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await prisma.$executeRawUnsafe(
      'DELETE FROM admin_messages WHERE id = ?',
      req.params.id
    );
    sendResponse(res, 200, true, 'Message deleted');
  } catch (err) {
    console.error('Delete message error:', err.message);
    sendResponse(res, 500, false, 'Failed to delete message');
  }
});

// DELETE /api/v1/messages — clear all messages for the authenticated user
router.delete('/', authenticate, async (req, res) => {
  try {
    const email = req.user.email;
    const role = req.user.role;
    await prisma.$executeRawUnsafe(
      `DELETE FROM admin_messages WHERE recipient_email = ? OR (recipient_type = 'broadcast' AND recipient_role = ?)`,
      email, role
    );
    sendResponse(res, 200, true, 'All messages cleared');
  } catch (err) {
    console.error('Clear all messages error:', err.message);
    sendResponse(res, 500, false, 'Failed to clear messages');
  }
});

module.exports = router;
