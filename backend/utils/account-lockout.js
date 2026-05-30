/**
 * Account Lockout
 * Student/teacher: 5 consecutive failed attempts.
 * Principal/admin: 3 consecutive failed attempts.
 * 
 * Lockout duration: 15 minutes.
 * Auto-unlock after timer expires.
 * 
 * For multi-instance: replace Map with Redis HASH + TTL.
 */

const accounts = new Map(); // email → { failures, lockedUntil, lockCount }

const BASE_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function thresholdForRole(role = 'student') {
  return ['principal', 'admin'].includes(role) ? 3 : 5;
}

function keyFor(email, role = 'student') {
  return `${role}:${email.toLowerCase().trim()}`;
}

// Cleanup every 30 minutes
const timer = setInterval(() => {
  const now = Date.now();
  for (const [email, data] of accounts.entries()) {
    if (data.lockedUntil && now > data.lockedUntil && data.failures === 0) {
      accounts.delete(email);
    }
  }
}, 30 * 60 * 1000);
timer.unref();

/**
 * Check if account is currently locked
 * @returns {{ locked: boolean, remainingMs: number, attempts: number }}
 */
function isLocked(email, role = 'student') {
  const key = keyFor(email, role);
  const data = accounts.get(key);
  if (!data) return { locked: false, remainingMs: 0, attempts: 0 };

  if (data.lockedUntil && Date.now() < data.lockedUntil) {
    return {
      locked: true,
      remainingMs: data.lockedUntil - Date.now(),
      attempts: data.failures,
    };
  }

  // Lock expired — reset if was locked
  if (data.lockedUntil && Date.now() >= data.lockedUntil) {
    data.failures = 0;
    data.lockedUntil = null;
  }

  return { locked: false, remainingMs: 0, attempts: data.failures };
}

/**
 * Record a failed login attempt
 * @returns {{ locked: boolean, attempts: number, lockDurationMs: number }}
 */
function recordFailure(email, role = 'student') {
  const key = keyFor(email, role);
  const threshold = thresholdForRole(role);
  let data = accounts.get(key);

  if (!data) {
    data = { failures: 0, lockedUntil: null, lockCount: 0 };
    accounts.set(key, data);
  }

  // If lock expired, reset failures
  if (data.lockedUntil && Date.now() >= data.lockedUntil) {
    data.failures = 0;
    data.lockedUntil = null;
  }

  data.failures += 1;

  if (data.failures >= threshold) {
    data.lockCount += 1;
    const lockDuration = BASE_LOCKOUT_MS;
    data.lockedUntil = Date.now() + lockDuration;
    return { locked: true, attempts: data.failures, lockDurationMs: lockDuration };
  }

  return { locked: false, attempts: data.failures, lockDurationMs: 0 };
}

/**
 * Clear failures on successful login
 */
function clearFailures(email, role) {
  const roles = role ? [role] : ['student', 'teacher', 'principal', 'admin'];
  for (const currentRole of roles) {
    const data = accounts.get(keyFor(email, currentRole));
    if (data) {
      data.failures = 0;
      data.lockedUntil = null;
    }
  }
}

/**
 * Admin: manually unlock an account
 */
function adminUnlock(email) {
  for (const role of ['student', 'teacher', 'principal', 'admin']) {
    accounts.delete(keyFor(email, role));
  }
}

module.exports = { isLocked, recordFailure, clearFailures, adminUnlock, thresholdForRole };
