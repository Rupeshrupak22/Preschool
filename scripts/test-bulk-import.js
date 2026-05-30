/**
 * Test bulk import by directly calling the route logic
 * Usage: node scripts/test-bulk-import.js
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mysql = require('mysql2/promise');

// Load env
const envPaths = [path.resolve(__dirname, '../.env'), path.resolve(__dirname, '../frontend/.env.local')];
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i === -1) continue;
      process.env[t.slice(0, i).trim()] = process.env[t.slice(0, i).trim()] || t.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
    }
  }
}

const argon2 = require('argon2');

function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[crypto.randomInt(chars.length)];
  return `ADY-${code}-${new Date().getFullYear()}`;
}

function generateKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[crypto.randomInt(chars.length)];
  return `KEY-${code}`;
}

async function hashPassword(pw) {
  return argon2.hash(pw, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 });
}

async function main() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 4000),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'preschool',
    ssl: process.env.MYSQL_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  });

  // CSV data
  const teachers = [
    { name: 'Rahul Sharma', email: 'rahul@school.com', subject: 'Mathematics', phone: '9876543210', school_name: 'DPS School', classes: 'Class 5;Class 6' },
    { name: 'Priya Singh', email: 'priya@school.com', subject: 'Science', phone: '9876543211', school_name: 'DPS School', classes: 'Class 7' },
  ];

  console.log('━━━ Bulk Import Teachers ━━━\n');

  const results = [];

  for (const teacher of teachers) {
    // Check if exists
    const [existing] = await pool.query('SELECT id FROM teachers WHERE email = ?', [teacher.email]);
    if (existing.length > 0) {
      console.log(`⏭️  Skipped: ${teacher.email} (already exists)`);
      continue;
    }

    const tempPassword = generateTempPassword();
    const staffKey = generateKey();
    const passwordHash = await hashPassword(tempPassword);
    const staffKeyHash = await hashPassword(staffKey);
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 25);
    const assignedClasses = JSON.stringify(teacher.classes.split(';').map((c) => c.trim()));

    await pool.query(
      `INSERT INTO teachers (id, school_id, school_name, teacher_name, email, password_hash, staff_key_hash, subject, phone, assigned_classes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, 'school_dps', teacher.school_name, teacher.name, teacher.email, passwordHash, staffKeyHash, teacher.subject, teacher.phone, assignedClasses, 'active']
    );

    results.push({ name: teacher.name, email: teacher.email, tempPassword, staffKey });
    console.log(`✅ Created: ${teacher.name} (${teacher.email})`);
  }

  if (results.length > 0) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  CREDENTIALS (share with teachers)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    for (const r of results) {
      console.log(`  ${r.name}`);
      console.log(`    Email:     ${r.email}`);
      console.log(`    Password:  ${r.tempPassword}`);
      console.log(`    Staff Key: ${r.staffKey}`);
      console.log('');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  await pool.end();
  process.exit(0);
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
