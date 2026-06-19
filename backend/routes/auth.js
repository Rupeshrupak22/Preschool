const express = require('express');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, decodeToken } = require('../utils/token');
const { hashPassword, verifyPassword, needsRehash, verifyAccessKeyCredential } = require('../utils/password');
const { sendResponse } = require('../utils/response');
const { validateBody, validateEmail, validatePassword } = require('../middleware/validate');
const { recordFailedAttempt, clearFailedAttempts } = require('../utils/progressive-delay');
const { authenticate } = require('../middleware/auth');
const { isLocked, recordFailure, clearFailures, thresholdForRole } = require('../utils/account-lockout');
const { blacklistToken, isBlacklisted, revokeAllUserTokens } = require('../utils/token-blacklist');
const { logLoginSuccess, logLoginFailed, logAccountLocked, logPasswordChanged, logSuspiciousActivity } = require('../utils/security-logger');
const { generateFingerprint, trackAttempt } = require('../utils/fingerprint');
const {
  createSession,
  setSessionRefreshJti,
  rotateRefreshToken,
  destroySession,
  destroyAllSessions,
  INACTIVITY_LIMIT_MS,
} = require('../utils/sessions');

const router = express.Router();

// ─── POST /api/v1/auth/login ────────────────────────────────────────
router.post('/login', validateBody('email', 'password'), validateEmail, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const fingerprint = generateFingerprint(req);
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const requestedRole = ['student', 'teacher', 'principal', 'admin'].includes(role) ? role : null;

    // 1. Check fingerprint for credential stuffing
    const fpResult = trackAttempt(fingerprint, email);
    if (fpResult.suspicious) {
      logSuspiciousActivity({ email, ip, fingerprint, details: `Credential stuffing detected. ${fpResult.uniqueEmails} unique emails from same client.` });
      return sendResponse(res, 429, false, 'Suspicious activity detected. Please try again later.');
    }

    // 2. Find account in the proper portal/table
    const identity = await findLoginIdentity(email, requestedRole);
    const effectiveRole = identity?.user?.role || requestedRole || 'student';

    // 3. Check account lockout using per-role threshold
    const lockStatus = isLocked(email, effectiveRole);
    if (lockStatus.locked) {
      const minutes = Math.ceil(lockStatus.remainingMs / 60000);
      logLoginFailed({ email, ip, fingerprint, details: `Account locked. ${minutes}min remaining.` });
      return sendResponse(res, 423, false, `Account locked due to too many failed attempts. Try again in ${minutes} minutes.`);
    }

    if (!identity) {
      await recordFailedAttempt(email, effectiveRole);
      recordFailure(email, effectiveRole);
      logLoginFailed({ email, ip, fingerprint, details: 'User not found' });
      return sendResponse(res, 401, false, 'Invalid email or password');
    }

    const { user, source } = identity;

    if (user.status && user.status !== 'active') {
      return sendResponse(res, 403, false, 'Account is not active. Contact admin.');
    }

    // 4. Verify password and required access/staff key
    const storedHash = user.password_hash || user.password;
    const isValid = await verifyPassword(password, storedHash);
    const keyValid = await verifyRequiredAccessKey(req.body, user, source);

    if (!isValid || !keyValid) {
      await recordFailedAttempt(email, user.role);
      const lockResult = recordFailure(email, user.role);
      const threshold = thresholdForRole(user.role);

      if (lockResult.locked) {
        const minutes = Math.ceil(lockResult.lockDurationMs / 60000);
        logAccountLocked({ email, userId: user.id, ip, fingerprint, details: `Locked after ${lockResult.attempts} failures for ${minutes}min` });
        return sendResponse(res, 423, false, `Account locked after ${lockResult.attempts} failed attempts. Try again in ${minutes} minutes.`);
      }

      logLoginFailed({ email, userId: user.id, ip, fingerprint, details: `Wrong credential. Attempt ${lockResult.attempts}/${threshold}` });
      return sendResponse(res, 401, false, 'Invalid email or password', {
        ...(lockResult.attempts >= 2 && { hint: `${threshold - lockResult.attempts} attempts remaining before lockout.` }),
      });
    }

    // 5. Success — clear all counters
    clearFailedAttempts(email);
    clearFailures(email, user.role);

    // 6. Enforce one active session per account
    // Mobile apps automatically replace old sessions (no CSRF-protected clear endpoint needed)
    const isMobileApp = /dart|flutter|android|iphone|okhttp/i.test(req.get('user-agent') || '');
    const sessionResult = await createSession({
      user,
      refreshJti: null,
      fingerprint,
      userAgent: req.get('user-agent') || '',
      ip,
      replace: isMobileApp,
    });

    if (sessionResult.conflict) {
      return sendResponse(res, 409, false,
        `A session for this ${user.role} account is already active on another device. Click "Clear Previous Sessions" to log out all other devices, then log in again.`,
        {
          code: 'ACTIVE_SESSION_EXISTS',
          action: 'CLEAR_PREVIOUS_SESSIONS_AND_RELOGIN',
          role: user.role,
        }
      );
    }

    // 7. Auto-upgrade password to Argon2id where needed
    if (needsRehash(storedHash)) {
      const newHash = await hashPassword(password);
      await updatePasswordForSource(source, user, newHash).catch(() => {});
    }

    // 8. Log success
    logLoginSuccess({ email, userId: user.id, ip, fingerprint });

    // 9. Record login event in DB (fire-and-forget)
    recordLoginEvent(source, user, req, ip).catch(() => {});

    // 10. Generate session-bound tokens
    const token = generateAccessToken(user, sessionResult.session.sid);
    const refreshToken = generateRefreshToken(user, sessionResult.session.sid);
    const refreshPayload = decodeToken(refreshToken);
    await setSessionRefreshJti({ userId: user.id, sid: sessionResult.session.sid, refreshJti: refreshPayload?.jti });

    setAuthCookies(res, token, refreshToken);

    sendResponse(res, 200, true, 'Login successful', {
      token,
      refreshToken,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('Login error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// ─── POST /api/v1/auth/clear-previous-sessions ─────────────────────
// Verifies the same credentials, clears existing sessions, and does NOT log in.
// Client should refresh/reload the login page and ask for credentials again.
router.post('/clear-previous-sessions', validateBody('email', 'password'), validateEmail, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const requestedRole = ['student', 'teacher', 'principal', 'admin'].includes(role) ? role : null;
    const identity = await findLoginIdentity(email, requestedRole);

    if (!identity) {
      await recordFailedAttempt(email, requestedRole || 'student');
      recordFailure(email, requestedRole || 'student');
      return sendResponse(res, 401, false, 'Invalid email or password');
    }

    const { user, source } = identity;
    const lockStatus = isLocked(email, user.role);
    if (lockStatus.locked) {
      const minutes = Math.ceil(lockStatus.remainingMs / 60000);
      return sendResponse(res, 423, false, `Account locked due to too many failed attempts. Try again in ${minutes} minutes.`);
    }

    const storedHash = user.password_hash || user.password;
    const passwordValid = await verifyPassword(password, storedHash);
    const keyValid = await verifyRequiredAccessKey(req.body, user, source);

    if (!passwordValid || !keyValid) {
      await recordFailedAttempt(email, user.role);
      const lockResult = recordFailure(email, user.role);
      if (lockResult.locked) {
        const minutes = Math.ceil(lockResult.lockDurationMs / 60000);
        return sendResponse(res, 423, false, `Account locked after ${lockResult.attempts} failed attempts. Try again in ${minutes} minutes.`);
      }
      return sendResponse(res, 401, false, 'Invalid email or password');
    }

    clearFailedAttempts(email);
    clearFailures(email, user.role);
    await destroyAllSessions(user.id);
    revokeAllUserTokens(user.id);
    clearAuthCookies(res);

    return sendResponse(res, 200, true, 'Previous sessions cleared. Refresh the page and login again.', {
      code: 'PREVIOUS_SESSIONS_CLEARED',
      reloadRequired: true,
    });
  } catch (err) {
    console.error('Clear previous sessions error:', err.message);
    return sendResponse(res, 500, false, 'Internal server error');
  }
});

// ─── POST /api/v1/auth/register ─────────────────────────────────────
router.post('/register', validateBody('name', 'email', 'password'), validateEmail, validatePassword, async (req, res) => {
  try {
    const { name, email, password, phone, role, class_level, class_name, school_name, school_id, school } = req.body;

    // Restrict role assignment — only admin can create non-student accounts
    const allowedSelfRoles = ['student'];
    const assignedRole = allowedSelfRoles.includes(role) ? role : 'student';

    const existing = await prisma.users.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return sendResponse(res, 409, false, 'User with this email already exists');
    }

    // Hash password with Argon2id
    const password_hash = await hashPassword(password);

    const user = await prisma.users.create({
      data: {
        id: crypto.randomUUID().replace(/-/g, '').slice(0, 25),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash,
        password: password_hash,
        phone: phone || null,
        role: assignedRole,
        class_level: class_level || null,
        class_name: class_name || null,
        school_name: school_name || school || null,
        school_id: school_id || null,
        signup_source: req.body.platform || detectPlatform(req),
      },
    });

    const sessionResult = await createSession({
      user,
      refreshJti: null,
      fingerprint: generateFingerprint(req),
      userAgent: req.get('user-agent') || '',
      ip: req.ip || req.connection?.remoteAddress || 'unknown',
      replace: true,
    });
    const token = generateAccessToken(user, sessionResult.session.sid);
    const refreshToken = generateRefreshToken(user, sessionResult.session.sid);
    const refreshPayload = decodeToken(refreshToken);
    await setSessionRefreshJti({ userId: user.id, sid: sessionResult.session.sid, refreshJti: refreshPayload?.jti });
    setAuthCookies(res, token, refreshToken);

    sendResponse(res, 201, true, 'Registration successful', {
      token,
      refreshToken,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('Register error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// ─── GET /api/v1/auth/me ────────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const identity = await findLoginIdentity(req.user.email, req.user.role);
    const user = identity?.user;

    if (!user) return sendResponse(res, 404, false, 'User not found');
    sendResponse(res, 200, true, 'User fetched', { user: sanitizeUser(user) });
  } catch (err) {
    console.error('Auth/me error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// ─── POST /api/v1/auth/refresh ──────────────────────────────────────
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.adyapan_refresh;
    if (!refreshToken) return sendResponse(res, 400, false, 'Missing required fields: refreshToken');

    const decoded = verifyRefreshToken(refreshToken);

    const rotate = await rotateRefreshToken({
      userId: decoded.id,
      sid: decoded.sid,
      oldRefreshJti: decoded.jti,
      newRefreshJti: 'pending',
    });
    if (!rotate.valid) return sendResponse(res, 401, false, rotate.reason);

    const identity = await findLoginIdentity(decoded.email, decoded.role);
    const user = identity?.user;
    if (!user) return sendResponse(res, 404, false, 'User not found');

    const newToken = generateAccessToken(user, decoded.sid);
    const newRefreshToken = generateRefreshToken(user, decoded.sid);
    const newRefreshPayload = decodeToken(newRefreshToken);
    await setSessionRefreshJti({ userId: decoded.id, sid: decoded.sid, refreshJti: newRefreshPayload?.jti });
    setAuthCookies(res, newToken, newRefreshToken);
    sendResponse(res, 200, true, 'Token refreshed', { token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return sendResponse(res, 401, false, 'Invalid or expired refresh token. Please login again.');
    }
    console.error('Refresh error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// ─── POST /api/v1/auth/change-password ──────────────────────────────
router.post('/change-password', authenticate, validateBody('currentPassword', 'newPassword'), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (newPassword.length < 6) {
      return sendResponse(res, 400, false, 'New password must be at least 6 characters.');
    }

    const identity = await findLoginIdentity(req.user.email, req.user.role);
    const user = identity?.user;
    if (!user) return sendResponse(res, 404, false, 'User not found');

    const storedHash = user.password_hash || user.password;
    const isValid = await verifyPassword(currentPassword, storedHash);

    if (!isValid) {
      return sendResponse(res, 401, false, 'Current password is incorrect');
    }

    const newHash = await hashPassword(newPassword);
    await updatePasswordForSource(identity.source, user, newHash);

    // Revoke all existing tokens for this user
    revokeAllUserTokens(user.id);
    logPasswordChanged({ email: user.email, userId: user.id, ip: req.ip });

    sendResponse(res, 200, true, 'Password changed successfully. All sessions revoked.');
  } catch (err) {
    console.error('Change password error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// ─── POST /api/v1/auth/logout ───────────────────────────────────────
router.post('/logout', authenticate, async (req, res) => {
  try {
    if (req.user && req.user.jti) {
      blacklistToken(req.user.jti, 28800);
    }
    await destroySession(req.user.id, req.user.sid);
    clearAuthCookies(res);
    sendResponse(res, 200, true, 'Logged out successfully');
  } catch (err) {
    console.error('Logout error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// ─── POST /api/v1/auth/logout-all ───────────────────────────────────
router.post('/logout-all', authenticate, async (req, res) => {
  try {
    revokeAllUserTokens(req.user.id);
    await destroyAllSessions(req.user.id);
    clearAuthCookies(res);
    sendResponse(res, 200, true, 'All sessions revoked');
  } catch (err) {
    console.error('Logout all error:', err.message);
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// ─── Helpers ────────────────────────────────────────────────────────

function detectPlatform(req) {
  const ua = (req.get('user-agent') || '').toLowerCase();
  if (/android|iphone|ipad|mobile|flutter/.test(ua)) return 'mobile';
  if (ua) return 'web';
  return 'unknown';
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || null,
    class_level: user.class_level || null,
    class_name: user.class_name || null,
    school_name: user.school_name || null,
    school_id: user.school_id || null,
    teacher_id: user.teacher_id || null,
  };
}

async function findLoginIdentity(email, requestedRole) {
  const normalizedEmail = email.toLowerCase().trim();

  if (!requestedRole || requestedRole === 'student' || requestedRole === 'admin') {
    const user = await prisma.users.findUnique({ where: { email: normalizedEmail } });
    if (user && (!requestedRole || user.role === requestedRole || (requestedRole === 'student' && user.role === 'student'))) {
      return { source: 'users', user };
    }
  }

  if (!requestedRole || requestedRole === 'teacher') {
    const teacher = await prisma.teacher.findUnique({ where: { email: normalizedEmail } });
    if (teacher) {
      return {
        source: 'teachers',
        user: {
          ...teacher,
          name: teacher.teacher_name,
          role: 'teacher',
          school_id: teacher.schoolId,
          teacher_id: teacher.id,
        },
      };
    }
  }

  if (!requestedRole || requestedRole === 'principal') {
    const principal = await prisma.principals.findUnique({ where: { email: normalizedEmail } });
    if (principal) {
      return {
        source: 'principals',
        user: {
          ...principal,
          name: principal.principal_name,
          role: 'principal',
          school_id: principal.school_id,
        },
      };
    }
  }

  return null;
}

async function verifyRequiredAccessKey(body, user, source) {
  if (source === 'teachers') {
    const staffKey = body.staffKey || body.accessKey;
    return verifyAccessKeyCredential(staffKey, user.staff_key_hash);
  }

  if (source === 'principals') {
    const accessKey = body.accessKey || body.schoolKey;
    return verifyAccessKeyCredential(accessKey, user.access_key_hash);
  }

  if (user.role === 'admin') {
    const configuredHash = await adminAccessKeyHash(user.email);
    if (!configuredHash) return true;
    return verifyAccessKeyCredential(body.accessKey, configuredHash);
  }

  return true;
}

async function adminAccessKeyHash(email) {
  if (process.env.ADMIN_ACCESS_KEY_HASH) return process.env.ADMIN_ACCESS_KEY_HASH;

  try {
    const rows = await prisma.$queryRawUnsafe(
      'SELECT access_key_hash FROM users WHERE email = ? LIMIT 1',
      email.toLowerCase().trim()
    );
    return rows?.[0]?.access_key_hash || null;
  } catch {
    return null;
  }
}

async function updatePasswordForSource(source, user, newHash) {
  if (source === 'teachers') {
    return prisma.teacher.update({ where: { id: user.id }, data: { password_hash: newHash, updated_at: new Date() } });
  }
  if (source === 'principals') {
    return prisma.principals.update({ where: { id: user.id }, data: { password_hash: newHash, updated_at: new Date() } });
  }
  return prisma.users.update({ where: { id: user.id }, data: { password_hash: newHash, password: newHash, updated_at: new Date() } });
}

async function recordLoginEvent(source, user, req, ip) {
  const data = {
    id: crypto.randomUUID(),
    email: user.email,
    ip_address: ip,
    user_agent: (req.get('user-agent') || '').slice(0, 500),
    status: 'success',
  };

  if (source === 'teachers') {
    return prisma.teacher_login_events.create({
      data: { ...data, teacher_id: user.id, school_id: user.school_id || user.schoolId || null },
    });
  }

  if (source === 'principals') {
    return prisma.principal_login_events.create({
      data: { ...data, principal_id: user.id, school_id: user.school_id || null },
    });
  }

  return prisma.login_events.create({
    data: {
      ...data,
      user_id: user.id,
      name: user.name,
      role: user.role,
      source: req.body.platform || detectPlatform(req),
    },
  });
}

function setAuthCookies(res, token, refreshToken) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: INACTIVITY_LIMIT_MS,
  };

  res.cookie('adyapan_access', token, cookieOptions);
  res.cookie('adyapan_refresh', refreshToken, cookieOptions);
}

function clearAuthCookies(res) {
  const options = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  };
  res.cookie('adyapan_access', '', options);
  res.cookie('adyapan_refresh', '', options);
}

module.exports = router;
