const crypto = require('crypto');
const mysql = require('mysql2/promise');
const argon2 = require('argon2');
const path = require('path');
const fs = require('fs');

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

const ADMIN_KEY = 'a7c9f3e1b2d4056789abcdef01234567890fedcba9876543210abcdef12345678';

async function main() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 4000),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'preschool',
    ssl: process.env.MYSQL_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  });

  const keyHash = await argon2.hash(ADMIN_KEY, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 });

  // Add column if not exists
  const [cols] = await pool.query(
    "SELECT COUNT(*) as c FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='users' AND COLUMN_NAME='access_key_hash'"
  );
  if (Number(cols[0].c) === 0) {
    await pool.query('ALTER TABLE users ADD COLUMN access_key_hash VARCHAR(255)');
    console.log('✅ Column access_key_hash added to users table');
  }

  await pool.query('UPDATE users SET access_key_hash = ? WHERE email = ?', [keyHash, 'rupeshrupak609@gmail.com']);

  console.log('\n━━━ ADMIN ACCESS KEY SET ━━━');
  console.log('Email:      rupeshrupak609@gmail.com');
  console.log('Access Key:', ADMIN_KEY);
  console.log('\n⚠️  Save this key securely!');

  await pool.end();
  process.exit(0);
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
