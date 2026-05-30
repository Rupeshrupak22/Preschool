/**
 * Set production-grade credentials for all roles
 * All passwords are 256-bit (64 hex chars)
 */

const mysql = require('mysql2/promise');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

let hashFn;
try {
  const argon2 = require('argon2');
  hashFn = (pw) => argon2.hash(pw, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 });
} catch {
  const bcrypt = require('bcryptjs');
  hashFn = (pw) => bcrypt.hash(pw, 12);
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

// ─── CREDENTIALS ────────────────────────────────────────────────────
const CREDS = {
  admin: {
    email: 'rupeshrupak609@gmail.com',
    password: '01e17a4d8cc4ce3924e5530bfd80c72ac3d6917ff7a54a30ec12bcf46eae6140',
    name: 'Rupesh Admin',
  },
  teacher: {
    email: 'teacher@adyapan.com',
    password: 'e60238be72504d66282872a3c5d505bb5869935580cd836ad6faf117c11eb89c',
    staffKey: 'ddf8d93b267a23753596df4be950330e092c8fbd1610ab740548d7fc6a261edc',
    name: 'Adyapan Teacher',
  },
  principal: {
    email: 'principal@adyapan.com',
    password: '2564f0e3176d44ff3f6bd5c2a98a71f9d7a5a7dcf30253aae46984cf9deea8b6',
    accessKey: 'f6acf258da641d77f7b2cc3a306a425932d739586e5e2bf91577bf84a8b0debb',
    name: 'Adyapan Principal',
  },
};

async function main() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 4000),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'preschool',
    ssl: process.env.MYSQL_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  });

  // ─── ADMIN ────────────────────────────────────────────────────────
  console.log('━━━ ADMIN ━━━');
  const adminHash = await hashFn(CREDS.admin.password);
  const [adminRows] = await pool.query('SELECT id FROM users WHERE email = ?', [CREDS.admin.email]);

  if (adminRows.length > 0) {
    await pool.query(
      'UPDATE users SET password_hash = ?, password = ?, role = ?, name = ? WHERE email = ?',
      [adminHash, adminHash, 'admin', CREDS.admin.name, CREDS.admin.email]
    );
    console.log('✅ Updated');
  } else {
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 25);
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, password, role, signup_source)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, CREDS.admin.name, CREDS.admin.email, adminHash, adminHash, 'admin', 'seed']
    );
    console.log('✅ Created');
  }

  // ─── TEACHER ──────────────────────────────────────────────────────
  console.log('\n━━━ TEACHER ━━━');
  const teacherPwHash = await hashFn(CREDS.teacher.password);
  const teacherKeyHash = await hashFn(CREDS.teacher.staffKey);
  const [teacherRows] = await pool.query('SELECT id FROM teachers WHERE email = ?', [CREDS.teacher.email]);

  if (teacherRows.length > 0) {
    await pool.query(
      'UPDATE teachers SET password_hash = ?, staff_key_hash = ?, teacher_name = ?, status = ? WHERE email = ?',
      [teacherPwHash, teacherKeyHash, CREDS.teacher.name, 'active', CREDS.teacher.email]
    );
    console.log('✅ Updated');
  } else {
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 25);
    await pool.query(
      `INSERT INTO teachers (id, school_id, school_name, teacher_name, email, password_hash, staff_key_hash, subject, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, 'school_001', 'Adyapan School', CREDS.teacher.name, CREDS.teacher.email, teacherPwHash, teacherKeyHash, 'Mathematics', 'active']
    );
    console.log('✅ Created');
  }

  // ─── PRINCIPAL ────────────────────────────────────────────────────
  console.log('\n━━━ PRINCIPAL ━━━');
  const principalPwHash = await hashFn(CREDS.principal.password);
  const principalKeyHash = await hashFn(CREDS.principal.accessKey);
  const [principalRows] = await pool.query('SELECT id FROM principals WHERE email = ?', [CREDS.principal.email]);

  if (principalRows.length > 0) {
    await pool.query(
      'UPDATE principals SET password_hash = ?, access_key_hash = ?, principal_name = ?, status = ? WHERE email = ?',
      [principalPwHash, principalKeyHash, CREDS.principal.name, 'active', CREDS.principal.email]
    );
    console.log('✅ Updated');
  } else {
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 25);
    await pool.query(
      `INSERT INTO principals (id, school_id, school_name, principal_name, email, password_hash, access_key_hash, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, 'school_001', 'Adyapan School', CREDS.principal.name, CREDS.principal.email, principalPwHash, principalKeyHash, 'active']
    );
    console.log('✅ Created');
  }

  // ─── SUMMARY ──────────────────────────────────────────────────────
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════════════════╗');
  console.log('║              PRODUCTION CREDENTIALS (256-bit / 64 hex)                  ║');
  console.log('╠══════════════════════════════════════════════════════════════════════════╣');
  console.log('║                                                                          ║');
  console.log('║  ADMIN:                                                                  ║');
  console.log('║    Email:    rupeshrupak609@gmail.com                                    ║');
  console.log('║    Password: 01e17a4d8cc4ce3924e5530bfd80c72ac3d6917ff7a54a30ec12bcf46eae6140 ║');
  console.log('║                                                                          ║');
  console.log('║  TEACHER:                                                                ║');
  console.log('║    Email:     teacher@adyapan.com                                        ║');
  console.log('║    Password:  e60238be72504d66282872a3c5d505bb5869935580cd836ad6faf117c11eb89c ║');
  console.log('║    Staff Key: ddf8d93b267a23753596df4be950330e092c8fbd1610ab740548d7fc6a261edc ║');
  console.log('║                                                                          ║');
  console.log('║  PRINCIPAL:                                                              ║');
  console.log('║    Email:      principal@adyapan.com                                     ║');
  console.log('║    Password:   2564f0e3176d44ff3f6bd5c2a98a71f9d7a5a7dcf30253aae46984cf9deea8b6 ║');
  console.log('║    Access Key: f6acf258da641d77f7b2cc3a306a425932d739586e5e2bf91577bf84a8b0debb ║');
  console.log('║                                                                          ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════╝');
  console.log('\n⚠️  SAVE THESE CREDENTIALS SECURELY. They cannot be recovered from the database.');

  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
