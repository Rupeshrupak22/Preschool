const argon2 = require('argon2');
const crypto = require('crypto');

// Argon2id config (OWASP recommended)
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,   // 64 MB
  timeCost: 3,         // 3 iterations
  parallelism: 1,      // 1 thread
};

/**
 * Hash password using Argon2id
 */
async function hashPassword(password) {
  return argon2.hash(password, ARGON2_OPTIONS);
}

/**
 * Verify password against Argon2id hash
 * Also supports legacy bcrypt hashes for migration
 */
async function verifyPassword(password, hash) {
  // Argon2 hash starts with $argon2
  if (hash.startsWith('$argon2')) {
    return argon2.verify(hash, password);
  }

  // Legacy bcrypt hash ($2a$, $2b$, $2y$)
  if (/^\$2[aby]\$/.test(hash)) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(password, hash);
  }

  // Plain text (legacy seed data) — direct compare
  return password === hash;
}

/**
 * Check if hash needs upgrade to Argon2id
 */
function needsRehash(hash) {
  return !hash.startsWith('$argon2');
}

/**
 * Generate 256-bit access key (hex)
 */
function generateAccessKey() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash access key using SHA-256 (store only this)
 */
function hashAccessKey(accessKey) {
  return crypto.createHash('sha256').update(accessKey).digest('hex');
}

/**
 * Verify access key against stored hash
 */
function verifyAccessKey(accessKey, storedHash) {
  const hash = hashAccessKey(accessKey);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

module.exports = {
  hashPassword,
  verifyPassword,
  needsRehash,
  generateAccessKey,
  hashAccessKey,
  verifyAccessKey,
};
