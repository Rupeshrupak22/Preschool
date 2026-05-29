const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const { sendResponse } = require('../utils/response');
const { validateBody, validateEmail, validatePassword } = require('../middleware/validate');

const router = express.Router();

// POST /api/v1/auth/login
router.post('/login', validateBody('email', 'password'), validateEmail, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return sendResponse(res, 401, false, 'Invalid email or password');
    }

    // Check password (bcrypt hash first, then plain fallback for legacy data)
    let isValid = false;
    let shouldUpgrade = false;

    if (user.password_hash && /^\$2[aby]\$/.test(user.password_hash)) {
      isValid = await bcrypt.compare(password, user.password_hash);
    }

    if (!isValid && user.password) {
      if (/^\$2[aby]\$/.test(user.password)) {
        isValid = await bcrypt.compare(password, user.password);
      } else {
        // Plain text password (legacy) — upgrade it
        isValid = (password === user.password);
        if (isValid) shouldUpgrade = true;
      }
    }

    if (!isValid) {
      return sendResponse(res, 401, false, 'Invalid email or password');
    }

    // Upgrade plain password to bcrypt hash
    if (shouldUpgrade) {
      const hash = await bcrypt.hash(password, 12);
      await prisma.users.update({
        where: { id: user.id },
        data: { password_hash: hash, password: hash },
      });
    }

    // Log login event
    try {
      await prisma.login_events.create({
        data: {
          id: crypto.randomUUID(),
          user_id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          source: req.body.platform || 'unknown',
          status: 'success',
          ip_address: req.ip || null,
          user_agent: req.get('user-agent') || null,
        },
      });
    } catch (_) { /* non-critical */ }

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    sendResponse(res, 200, true, 'Login successful', {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        class_level: user.class_level,
        class_name: user.class_name,
        school_name: user.school_name,
        school_id: user.school_id,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// POST /api/v1/auth/register
router.post('/register', validateBody('name', 'email', 'password'), validateEmail, validatePassword, async (req, res) => {
  try {
    const { name, email, password, phone, role, class_level, class_name, school_name, school_id, school } = req.body;

    const existing = await prisma.users.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return sendResponse(res, 409, false, 'User with this email already exists');
    }

    const password_hash = await bcrypt.hash(password, 12);

    const user = await prisma.users.create({
      data: {
        id: crypto.randomUUID().replace(/-/g, '').slice(0, 25),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash,
        password: password_hash,
        phone: phone || null,
        role: role || 'student',
        class_level: class_level || null,
        class_name: class_name || null,
        school_name: school_name || school || null,
        school_id: school_id || null,
        signup_source: req.body.platform || 'app',
      },
    });

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    sendResponse(res, 201, true, 'Registration successful', {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        class_level: user.class_level,
        class_name: user.class_name,
        school_name: user.school_name,
        school_id: user.school_id,
      },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// GET /api/v1/auth/me
router.get('/me', require('../middleware/auth').authenticate, async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, role: true, phone: true,
        class_level: true, class_name: true, school_name: true,
        school_id: true, otp_verified: true, created_at: true,
      },
    });

    if (!user) return sendResponse(res, 404, false, 'User not found');
    sendResponse(res, 200, true, 'User fetched', { user });
  } catch (err) {
    console.error('Auth/me error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// POST /api/v1/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendResponse(res, 400, false, 'Refresh token required');

    const { verifyToken } = require('../utils/token');
    const decoded = verifyToken(refreshToken);

    if (decoded.type !== 'refresh') {
      return sendResponse(res, 401, false, 'Invalid refresh token');
    }

    const user = await prisma.users.findUnique({ where: { id: decoded.id } });
    if (!user) return sendResponse(res, 404, false, 'User not found');

    const newToken = generateAccessToken(user);
    sendResponse(res, 200, true, 'Token refreshed', { token: newToken });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return sendResponse(res, 401, false, 'Invalid or expired refresh token');
    }
    sendResponse(res, 500, false, 'Internal server error');
  }
});

module.exports = router;
