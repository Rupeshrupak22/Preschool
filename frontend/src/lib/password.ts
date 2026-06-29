/**
 * Password hashing with Argon2id (primary) + bcrypt backward compatibility.
 *
 * New passwords are always hashed with Argon2id.
 * On login, if the stored hash is bcrypt, we verify with bcrypt then
 * transparently re-hash with Argon2id and update the DB.
 */
import argon2 from "argon2";
import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "crypto";

/**
 * Hash a password using Argon2id (recommended by OWASP).
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456, // 19 MB — optimized for serverless (Vercel)
    timeCost: 2,
    parallelism: 1,
  });
}

/**
 * Verify a password against a stored hash.
 * Supports Argon2id hashes (start with $argon2), legacy bcrypt hashes (start with $2),
 * and SHA-256 hex hashes (64 hex chars) used by backend for access/staff keys.
 * Returns { valid, needsRehash } so callers can upgrade hashes to argon2id.
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

  // SHA-256 hex hash (64 hex characters) — used by backend hashAccessKey()
  if (/^[a-f0-9]{64}$/i.test(storedHash)) {
    const computed = createHash("sha256").update(password).digest("hex");
    try {
      const valid = timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(storedHash, "hex"));
      return { valid, needsRehash: valid };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }

  // Unknown hash format
  return { valid: false, needsRehash: false };
}
