/**
 * Progressive Delay for failed login attempts
 * 
 * 1st fail: 1 second delay
 * 2nd fail: 3-4 seconds delay
 * 3rd fail: 10 seconds delay
 * 4th+ fail: 15 seconds delay
 * 
 * Tracks by email (valid email + wrong password scenario)
 */

// In-memory store (use Redis in production for multi-instance)
const failedAttempts = new Map();

// Cleanup old entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of failedAttempts.entries()) {
    // Remove entries older than 30 minutes
    if (now - data.lastAttempt > 30 * 60 * 1000) {
      failedAttempts.delete(key);
    }
  }
}, 30 * 60 * 1000);

/**
 * Get delay in milliseconds based on failed attempt count
 */
function getDelay(attemptCount) {
  switch (attemptCount) {
    case 1: return 1000;       // 1 second
    case 2: return 3500;       // 3.5 seconds
    case 3: return 10000;      // 10 seconds
    default: return 15000;     // 15 seconds (4th+)
  }
}

/**
 * Record a failed login attempt and apply progressive delay
 * Returns a promise that resolves after the delay
 */
async function recordFailedAttempt(email) {
  const key = email.toLowerCase().trim();
  const now = Date.now();

  const existing = failedAttempts.get(key) || { count: 0, lastAttempt: now };

  // Reset if last attempt was more than 15 minutes ago
  if (now - existing.lastAttempt > 15 * 60 * 1000) {
    existing.count = 0;
  }

  existing.count += 1;
  existing.lastAttempt = now;
  failedAttempts.set(key, existing);

  const delay = getDelay(existing.count);

  // Wait for the delay before responding
  await new Promise((resolve) => setTimeout(resolve, delay));

  return {
    attempts: existing.count,
    delayMs: delay,
  };
}

/**
 * Clear failed attempts on successful login
 */
function clearFailedAttempts(email) {
  failedAttempts.delete(email.toLowerCase().trim());
}

/**
 * Get current attempt count for an email
 */
function getAttemptCount(email) {
  const data = failedAttempts.get(email.toLowerCase().trim());
  if (!data) return 0;

  // Reset if older than 15 minutes
  if (Date.now() - data.lastAttempt > 15 * 60 * 1000) {
    failedAttempts.delete(email.toLowerCase().trim());
    return 0;
  }

  return data.count;
}

module.exports = { recordFailedAttempt, clearFailedAttempts, getAttemptCount };
