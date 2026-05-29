/**
 * Fix corrupted password hashes in the database.
 * Some users have plain text passwords instead of bcrypt hashes.
 * This script finds them and re-hashes them.
 */
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

(async () => {
  const c = await mysql.createConnection({
    host: "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com",
    port: 4000,
    user: "2qzWGQyN6thiftY.root",
    password: "9MUnfbzTv0Wcry84",
    database: "preschool",
    ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true }
  });

  // Find users with invalid password hashes (not starting with $2)
  const [users] = await c.query("SELECT id, email, password_hash, password FROM users");
  
  let fixed = 0;
  let alreadyOk = 0;

  console.log("\n=== Checking all user passwords ===\n");

  for (const user of users) {
    const hash = user.password_hash || user.password;
    const isValidBcrypt = hash && hash.startsWith("$2") && hash.length >= 59;

    if (isValidBcrypt) {
      alreadyOk++;
      continue;
    }

    // This user has a plain text or corrupted password
    console.log(`  ⚠ ${user.email} — invalid hash (length: ${(hash || '').length})`);
    
    if (hash && hash.length > 0 && hash.length < 50) {
      // It's likely a plain text password — hash it
      const newHash = await bcrypt.hash(hash, 12);
      await c.query("UPDATE users SET password_hash = ?, password = ? WHERE id = ?", [newHash, newHash, user.id]);
      console.log(`    ✓ Fixed — re-hashed the plain text password`);
      fixed++;
    } else {
      console.log(`    ✗ Cannot fix — password is empty or unknown format`);
    }
  }

  console.log(`\n═══════════════════════════════════`);
  console.log(`  OK: ${alreadyOk} | Fixed: ${fixed} | Total: ${users.length}`);
  console.log(`═══════════════════════════════════\n`);

  await c.end();
})();
