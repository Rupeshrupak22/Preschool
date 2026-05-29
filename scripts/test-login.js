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

  // Get all students with their password hashes
  const [users] = await c.query("SELECT email, password_hash, password, role FROM users WHERE role = 'student' ORDER BY created_at DESC LIMIT 5");
  
  console.log("\n=== Student Users ===");
  for (const user of users) {
    console.log(`\nEmail: ${user.email} | Role: ${user.role}`);
    console.log(`  password_hash exists: ${!!user.password_hash} (length: ${(user.password_hash || '').length})`);
    console.log(`  password exists: ${!!user.password} (length: ${(user.password || '').length})`);
    
    // Test if password_hash is a valid bcrypt hash
    const isValidHash = user.password_hash && user.password_hash.startsWith("$2");
    console.log(`  Is valid bcrypt hash: ${isValidHash}`);
    
    // Try comparing with a test password
    if (isValidHash) {
      const testPasswords = ["Test@1234", "Student@1234", "Ishant@123", "12345678"];
      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, user.password_hash);
        if (match) {
          console.log(`  ✓ Password matches: "${pwd}"`);
          break;
        }
      }
    }
  }

  await c.end();
})();
