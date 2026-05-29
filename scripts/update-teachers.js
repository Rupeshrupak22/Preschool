const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mysql = require('mysql2/promise');

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

function genPw() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += c[crypto.randomInt(c.length)];
  return `ADY-${s}-2026`;
}
function genKey() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < 8; i++) s += c[crypto.randomInt(c.length)];
  return `KEY-${s}`;
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

  const teachers = [
    { email: 'rahul@school.com', name: 'Rahul Sharma' },
    { email: 'priya@school.com', name: 'Priya Singh' },
  ];

  console.log('━━━ Updating Teachers with Fresh Credentials ━━━\n');
  const results = [];

  for (const t of teachers) {
    const pw = genPw();
    const key = genKey();
    const pwHash = await argon2.hash(pw, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 });
    const keyHash = await argon2.hash(key, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 });

    await pool.query('UPDATE teachers SET password_hash=?, staff_key_hash=?, status=? WHERE email=?', [pwHash, keyHash, 'active', t.email]);
    results.push({ ...t, password: pw, staffKey: key });
    console.log(`✅ ${t.name} (${t.email})`);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  CREDENTIALS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  for (const r of results) {
    console.log(`  ${r.name}`);
    console.log(`    Email:     ${r.email}`);
    console.log(`    Password:  ${r.password}`);
    console.log(`    Staff Key: ${r.staffKey}\n`);
  }

  await pool.end();
  process.exit(0);
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
