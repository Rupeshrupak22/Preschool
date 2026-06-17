const crypto = require('crypto');
const prisma = require('../lib/prisma');

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000;
const REFRESH_REUSE_GRACE_MS = 5000;

let initPromise;

function newSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

function toDbDate(value) {
  return new Date(value);
}

function fromRow(row) {
  if (!row) return null;
  return {
    sid: row.sid,
    userId: row.user_id,
    email: row.email,
    role: row.role,
    refreshJti: row.refresh_jti,
    previousRefreshJti: row.previous_refresh_jti,
    previousRefreshValidUntil: row.previous_refresh_valid_until ? new Date(row.previous_refresh_valid_until).getTime() : 0,
    fingerprint: row.fingerprint,
    userAgent: row.user_agent,
    ip: row.ip_address,
    createdAt: new Date(row.created_at).getTime(),
    lastSeenAt: new Date(row.last_seen_at).getTime(),
    expiresAt: new Date(row.expires_at).getTime(),
  };
}

async function ensureSessionTable() {
  if (!initPromise) {
    initPromise = (async () => {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS active_sessions (
          user_id VARCHAR(64) NOT NULL PRIMARY KEY,
          sid VARCHAR(64) NOT NULL UNIQUE,
          email VARCHAR(190) NOT NULL,
          role VARCHAR(30) NOT NULL,
          refresh_jti VARCHAR(64) NULL,
          previous_refresh_jti VARCHAR(64) NULL,
          previous_refresh_valid_until DATETIME NULL,
          fingerprint VARCHAR(128) NULL,
          user_agent TEXT NULL,
          ip_address VARCHAR(80) NULL,
          created_at DATETIME NOT NULL,
          last_seen_at DATETIME NOT NULL,
          expires_at DATETIME NOT NULL,
          KEY idx_active_sessions_sid (sid),
          KEY idx_active_sessions_expires_at (expires_at)
        )
      `);
      // Auto-add columns that may be missing from older table versions
      const alterColumns = [
        'ALTER TABLE active_sessions ADD COLUMN refresh_jti VARCHAR(64) NULL',
        'ALTER TABLE active_sessions ADD COLUMN previous_refresh_jti VARCHAR(64) NULL',
        'ALTER TABLE active_sessions ADD COLUMN previous_refresh_valid_until DATETIME NULL',
        'ALTER TABLE active_sessions ADD COLUMN fingerprint VARCHAR(128) NULL',
        'ALTER TABLE active_sessions ADD COLUMN user_agent TEXT NULL',
        'ALTER TABLE active_sessions ADD COLUMN ip_address VARCHAR(80) NULL',
      ];
      for (const sql of alterColumns) {
        try { await prisma.$executeRawUnsafe(sql); } catch (_) { /* column already exists */ }
      }
    })();
  }
  return initPromise;
}

async function cleanupExpiredSessions() {
  await ensureSessionTable();
  await prisma.$executeRawUnsafe('DELETE FROM active_sessions WHERE expires_at <= NOW()');
}

async function getActiveSession(userId) {
  await cleanupExpiredSessions();
  const rows = await prisma.$queryRawUnsafe(
    'SELECT * FROM active_sessions WHERE user_id = ? LIMIT 1',
    userId
  );
  return fromRow(rows?.[0]);
}

async function createSession({ user, refreshJti, fingerprint, userAgent, ip, replace = false }) {
  await cleanupExpiredSessions();
  const existing = await getActiveSession(user.id);
  if (existing && !replace) {
    return { conflict: true, session: existing };
  }

  if (existing) {
    await destroyAllSessions(user.id);
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

  await ensureSessionTable();
  await prisma.$executeRawUnsafe(
    `INSERT INTO active_sessions
      (user_id, sid, email, role, refresh_jti, previous_refresh_jti, previous_refresh_valid_until, fingerprint, user_agent, ip_address, created_at, last_seen_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       sid = VALUES(sid),
       email = VALUES(email),
       role = VALUES(role),
       refresh_jti = VALUES(refresh_jti),
       previous_refresh_jti = VALUES(previous_refresh_jti),
       previous_refresh_valid_until = VALUES(previous_refresh_valid_until),
       fingerprint = VALUES(fingerprint),
       user_agent = VALUES(user_agent),
       ip_address = VALUES(ip_address),
       created_at = VALUES(created_at),
       last_seen_at = VALUES(last_seen_at),
       expires_at = VALUES(expires_at)`,
    session.userId,
    session.sid,
    session.email,
    session.role,
    session.refreshJti,
    session.previousRefreshJti,
    null,
    session.fingerprint,
    session.userAgent,
    session.ip,
    toDbDate(session.createdAt),
    toDbDate(session.lastSeenAt),
    toDbDate(session.expiresAt)
  );

  return { conflict: false, session };
}

async function validateSession({ userId, sid }) {
  await cleanupExpiredSessions();
  const rows = await prisma.$queryRawUnsafe(
    'SELECT * FROM active_sessions WHERE user_id = ? AND sid = ? LIMIT 1',
    userId,
    sid
  );
  const session = fromRow(rows?.[0]);
  if (!session) {
    return { valid: false, reason: 'Session expired. Please login again.' };
  }

  const now = Date.now();
  if (session.expiresAt <= now) {
    await destroySession(userId, sid);
    return { valid: false, reason: 'Session inactive for 15 minutes. Please login again.' };
  }

  session.lastSeenAt = now;
  session.expiresAt = now + INACTIVITY_LIMIT_MS;
  await prisma.$executeRawUnsafe(
    'UPDATE active_sessions SET last_seen_at = ?, expires_at = ? WHERE user_id = ? AND sid = ?',
    toDbDate(session.lastSeenAt),
    toDbDate(session.expiresAt),
    userId,
    sid
  );

  return { valid: true, session };
}

async function rotateRefreshToken({ userId, sid, oldRefreshJti, newRefreshJti }) {
  const result = await validateSession({ userId, sid });
  if (!result.valid) return result;

  const { session } = result;
  const now = Date.now();
  const currentMatches = session.refreshJti === oldRefreshJti;
  const graceMatches = session.previousRefreshJti === oldRefreshJti && session.previousRefreshValidUntil >= now;

  if (!currentMatches && !graceMatches) {
    await destroySession(userId, sid);
    return { valid: false, reason: 'Refresh token reuse detected. Please login again.' };
  }

  const previousRefreshJti = currentMatches ? oldRefreshJti : session.previousRefreshJti;
  const previousRefreshValidUntil = currentMatches
    ? now + REFRESH_REUSE_GRACE_MS
    : session.previousRefreshValidUntil;

  await prisma.$executeRawUnsafe(
    `UPDATE active_sessions
     SET refresh_jti = ?,
         previous_refresh_jti = ?,
         previous_refresh_valid_until = ?,
         last_seen_at = ?,
         expires_at = ?
     WHERE user_id = ? AND sid = ?`,
    newRefreshJti,
    previousRefreshJti,
    previousRefreshValidUntil ? toDbDate(previousRefreshValidUntil) : null,
    toDbDate(now),
    toDbDate(now + INACTIVITY_LIMIT_MS),
    userId,
    sid
  );

  return { valid: true, session: { ...session, refreshJti: newRefreshJti } };
}

async function setSessionRefreshJti({ userId, sid, refreshJti }) {
  await ensureSessionTable();
  const result = await prisma.$executeRawUnsafe(
    'UPDATE active_sessions SET refresh_jti = ? WHERE user_id = ? AND sid = ?',
    refreshJti,
    userId,
    sid
  );
  return result > 0;
}

async function destroySession(userId, sid) {
  await ensureSessionTable();
  if (sid) {
    await prisma.$executeRawUnsafe('DELETE FROM active_sessions WHERE user_id = ? AND sid = ?', userId, sid);
    return;
  }
  await destroyAllSessions(userId);
}

async function destroyAllSessions(userId) {
  await ensureSessionTable();
  await prisma.$executeRawUnsafe('DELETE FROM active_sessions WHERE user_id = ?', userId);
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
  destroyAllSessions,
};
