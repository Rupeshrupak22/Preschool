/**
 * Password hashing with Argon2id (primary) + bcrypt backward compatibility.
 *
 * New passwords are always hashed with Argon2id.
 * On login, if the stored hash is bcrypt, we verify with bcrypt then
 * transparently re-hash with Argon2id and update the DB.
 */
import argon2 from "argon2";
import bcrypt from "bcryptjs";

/**
 * Hash a password using Argon2id (recommended by OWASP).
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}

/**
 * Verify a password against a stored hash.
 * Supports both Argon2id hashes (start with $argon2) and legacy bcrypt hashes (start with $2).
 * Returns { valid, needsRehash } so callers can upgrade bcrypt hashes to argon2id.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<{ valid: boolean; needsRehash: boolean }> {
  // Argon2 hashes start with $argon2
  if (storedHash.startsWith("$argon2")) {
    const valid = await argon2.verify(storedHash, password);
    return { valid, needsRehash: false };
  }

  // Legacy bcrypt hashes start with $2a$, $2b$, or $2y$
  if (storedHash.startsWith("$2")) {
    const valid = await bcrypt.compare(password, storedHash);
    return { valid, needsRehash: valid }; // rehash only if password is correct
  }

  // Unknown hash format
  return { valid: false, needsRehash: false };
}
