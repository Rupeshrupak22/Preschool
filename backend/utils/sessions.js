const crypto = require('crypto');

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000;
const REFRESH_REUSE_GRACE_MS = 5000;

const sessionsByUser = new Map();
const sessionsById = new Map();

function newSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

function cleanup() {
  const now = Date.now();
  for (const [sid, session] of sessionsById.entries()) {
    if (session.expiresAt <= now) {
      sessionsById.delete(sid);
      if (sessionsByUser.get(session.userId)?.sid === sid) {
        sessionsByUser.delete(session.userId);
      }
    }
  }
}

const timer = setInterval(cleanup, 5 * 60 * 1000);
timer.unref();

function getActiveSession(userId) {
  cleanup();
  return sessionsByUser.get(userId) || null;
}

function createSession({ user, refreshJti, fingerprint, userAgent, ip, replace = false }) {
  cleanup();
  const existing = getActiveSession(user.id);
  if (existing && !replace) {
    return { conflict: true, session: existing };
  }

  if (existing) {
    sessionsById.delete(existing.sid);
  }

  const now = Date.now();
  const session = {
    sid: newSessionId(),
    userId: user.id,
    email: user.email,
    role: user.role,
    refreshJti,
    previousRefreshJti: null,
    previousRefreshValidUntil: 0,
    fingerprint,
    userAgent,
    ip,
    createdAt: now,
    lastSeenAt: now,
    expiresAt: now + INACTIVITY_LIMIT_MS,
  };

  sessionsByUser.set(user.id, session);
  sessionsById.set(session.sid, session);
  return { conflict: false, session };
}

function validateSession({ userId, sid }) {
  cleanup();
  const session = sid ? sessionsById.get(sid) : null;
  if (!session || session.userId !== userId) {
    return { valid: false, reason: 'Session expired. Please login again.' };
  }

  const now = Date.now();
  if (session.expiresAt <= now) {
    destroySession(userId, sid);
    return { valid: false, reason: 'Session inactive for 15 minutes. Please login again.' };
  }

  session.lastSeenAt = now;
  session.expiresAt = now + INACTIVITY_LIMIT_MS;
  return { valid: true, session };
}

function rotateRefreshToken({ userId, sid, oldRefreshJti, newRefreshJti }) {
  const result = validateSession({ userId, sid });
  if (!result.valid) return result;

  const { session } = result;
  const now = Date.now();
  const currentMatches = session.refreshJti === oldRefreshJti;
  const graceMatches = session.previousRefreshJti === oldRefreshJti && session.previousRefreshValidUntil >= now;

  if (!currentMatches && !graceMatches) {
    destroySession(userId, sid);
    return { valid: false, reason: 'Refresh token reuse detected. Please login again.' };
  }

  if (currentMatches) {
    session.previousRefreshJti = oldRefreshJti;
    session.previousRefreshValidUntil = now + REFRESH_REUSE_GRACE_MS;
  }
  session.refreshJti = newRefreshJti;
  session.lastSeenAt = now;
  session.expiresAt = now + INACTIVITY_LIMIT_MS;
  return { valid: true, session };
}

function setSessionRefreshJti({ userId, sid, refreshJti }) {
  const session = sessionsById.get(sid);
  if (!session || session.userId !== userId) return false;
  session.refreshJti = refreshJti;
  return true;
}

function destroySession(userId, sid) {
  const session = sid ? sessionsById.get(sid) : sessionsByUser.get(userId);
  if (session) {
    sessionsById.delete(session.sid);
    if (sessionsByUser.get(session.userId)?.sid === session.sid) {
      sessionsByUser.delete(session.userId);
    }
  }
}

module.exports = {
  INACTIVITY_LIMIT_MS,
  REFRESH_REUSE_GRACE_MS,
  createSession,
  getActiveSession,
  validateSession,
  rotateRefreshToken,
  setSessionRefreshJti,
  destroySession,
};
