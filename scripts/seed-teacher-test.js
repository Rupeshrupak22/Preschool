/**
 * Seed a test teacher into the teachers table.
 * Usage: node scripts/seed-teacher-test.js
 * 
 * Make sure .env has MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE set.
 */

const mysql = require('mysql2/promise');
const crypto = require('crypto');

// Try to load argon2, fallback to bcryptjs
let hashFn;
try {
  const argon2 = require('argon2');
  hashFn = (password) => argon2.hash(password, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 });
  console.log('Using Argon2id for hashing');
} catch {
  const bcrypt = require('bcryptjs');
  hashFn = (password) => bcrypt.hash(password, 12);
  console.log('Using bcryptjs for hashing (argon2 not available)');
}

async function main() {
  // Load env from parent .env or frontend .env.local
  const path = require('path');
  const fs = require('fs');
  
  // Try multiple env file locations
  const envPaths = [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../frontend/.env.local'),
    path.resolve(__dirname, '../backend/.env.example'),
  ];
  
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = process.env[key] || value;
      }
    }
  }

  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 4000),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'preschool',
    ssl: process.env.MYSQL_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  });

  // Teacher credentials
  const email = 'teacher@adyapan.com';
  const password = 'ADM-TEACHER-609';
  const staffKey = 'ADM-TEACHER-609'; // Same as password in your screenshot

  console.log('\n--- Seeding Teacher ---');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('Staff Key:', staffKey);

  const passwordHash = await hashFn(password);
  const staffKeyHash = await hashFn(staffKey);

  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 25);

  // Check if already exists
  const [existing] = await pool.query('SELECT id FROM teachers WHERE email = ?', [email]);

  if (existing.length > 0) {
    // Update existing
    await pool.query(
      'UPDATE teachers SET password_hash = ?, staff_key_hash = ?, status = ? WHERE email = ?',
      [passwordHash, staffKeyHash, 'active', email]
    );
    console.log('\n✅ Teacher updated (password & staff key rehashed)');
  } else {
    // Insert new
    await pool.query(
      `INSERT INTO teachers (id, school_id, school_name, teacher_name, email, password_hash, staff_key_hash, subject, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, 'school_001', 'Adyapan School', 'Test Teacher', email, passwordHash, staffKeyHash, 'Mathematics', 'active']
    );
    console.log('\n✅ Teacher created successfully');
  }

  console.log('\n--- Login Credentials ---');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('Staff Key:', staffKey);

  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
