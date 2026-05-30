/**
 * Seed/Update all roles with a common key: ADM-TEACHER-609
 * - Admin (users table, role=admin)
 * - Teacher (teachers table)
 * - Principal (principals table)
 * 
 * Usage: node scripts/seed-all-roles.js
 */

const mysql = require('mysql2/promise');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

let hashFn;
try {
  const argon2 = require('argon2');
  hashFn = (pw) => argon2.hash(pw, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 });
  console.log('Using Argon2id\n');
} catch {
  const bcrypt = require('bcryptjs');
  hashFn = (pw) => bcrypt.hash(pw, 12);
  console.log('Using bcryptjs\n');
}

// Load env
const envPaths = [
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../frontend/.env.local'),
];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
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

const COMMON_PASSWORD = 'ADM-TEACHER-609';
const COMMON_KEY = 'ADM-TEACHER-609';  // staff_key / access_key

async function main() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 4000),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'preschool',
    ssl: process.env.MYSQL_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  });

  const passwordHash = await hashFn(COMMON_PASSWORD);
  const keyHash = await hashFn(COMMON_KEY);

  // ─── 1. ADMIN (users table) ───────────────────────────────────────
  console.log('━━━ ADMIN ━━━');
  const adminEmail = 'admin@adyapan.com';
  const [adminRows] = await pool.query('SELECT id FROM users WHERE email = ?', [adminEmail]);

  if (adminRows.length > 0) {
    await pool.query(
      'UPDATE users SET password_hash = ?, password = ?, role = ? WHERE email = ?',
      [passwordHash, passwordHash, 'admin', adminEmail]
    );
    console.log('✅ Admin updated');
  } else {
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 25);
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, password, role, signup_source)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, 'Admin', adminEmail, passwordHash, passwordHash, 'admin', 'seed']
    );
    console.log('✅ Admin created');
  }
  console.log('   Email:', adminEmail);
  console.log('   Password:', COMMON_PASSWORD);

  // ─── 2. TEACHER (teachers table) ──────────────────────────────────
  console.log('\n━━━ TEACHER ━━━');
  const teacherEmail = 'teacher@adyapan.com';
  const [teacherRows] = await pool.query('SELECT id FROM teachers WHERE email = ?', [teacherEmail]);

  if (teacherRows.length > 0) {
    await pool.query(
      'UPDATE teachers SET password_hash = ?, staff_key_hash = ?, status = ? WHERE email = ?',
      [passwordHash, keyHash, 'active', teacherEmail]
    );
    console.log('✅ Teacher updated');
  } else {
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 25);
    await pool.query(
      `INSERT INTO teachers (id, school_id, school_name, teacher_name, email, password_hash, staff_key_hash, subject, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, 'school_001', 'Adyapan School', 'Test Teacher', teacherEmail, passwordHash, keyHash, 'Mathematics', 'active']
    );
    console.log('✅ Teacher created');
  }
  console.log('   Email:', teacherEmail);
  console.log('   Password:', COMMON_PASSWORD);
  console.log('   Staff Key:', COMMON_KEY);

  // ─── 3. PRINCIPAL (principals table) ──────────────────────────────
  console.log('\n━━━ PRINCIPAL ━━━');
  const principalEmail = 'principal@adyapan.com';
  const [principalRows] = await pool.query('SELECT id FROM principals WHERE email = ?', [principalEmail]);

  if (principalRows.length > 0) {
    await pool.query(
      'UPDATE principals SET password_hash = ?, access_key_hash = ?, status = ? WHERE email = ?',
      [passwordHash, keyHash, 'active', principalEmail]
    );
    console.log('✅ Principal updated');
  } else {
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 25);
    await pool.query(
      `INSERT INTO principals (id, school_id, school_name, principal_name, email, password_hash, access_key_hash, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, 'school_001', 'Adyapan School', 'Test Principal', principalEmail, passwordHash, keyHash, 'active']
    );
    console.log('✅ Principal created');
  }
  console.log('   Email:', principalEmail);
  console.log('   Password:', COMMON_PASSWORD);
  console.log('   Access Key:', COMMON_KEY);

  // ─── SUMMARY ──────────────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  ALL CREDENTIALS (Common Key: ADM-TEACHER-609)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('  ADMIN:');
  console.log('    Email:    admin@adyapan.com');
  console.log('    Password: ADM-TEACHER-609');
  console.log('');
  console.log('  TEACHER:');
  console.log('    Email:     teacher@adyapan.com');
  console.log('    Password:  ADM-TEACHER-609');
  console.log('    Staff Key: ADM-TEACHER-609');
  console.log('');
  console.log('  PRINCIPAL:');
  console.log('    Email:      principal@adyapan.com');
  console.log('    Password:   ADM-TEACHER-609');
  console.log('    Access Key: ADM-TEACHER-609');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
