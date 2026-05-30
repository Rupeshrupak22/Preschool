const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const argon2 = require('argon2');

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

async function main() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 4000),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
  });

  const [rows] = await pool.query('SELECT email, password_hash, staff_key_hash, status FROM teachers WHERE email = ?', ['teacher@adyapan.com']);
  
  if (rows.length === 0) {
    console.log('❌ Teacher NOT FOUND in database');
    await pool.end();
    return;
  }

  const teacher = rows[0];
  console.log('Teacher found:', teacher.email, '| Status:', teacher.status);
  console.log('Password hash starts with:', teacher.password_hash.slice(0, 20) + '...');
  console.log('Staff key hash starts with:', teacher.staff_key_hash.slice(0, 20) + '...');

  // Test password verification
  const testPassword = 'e60238be72504d66282872a3c5d505bb5869935580cd836ad6faf117c11eb89c';
  const testStaffKey = 'ddf8d93b267a23753596df4be950330e092c8fbd1610ab740548d7fc6a261edc';

  try {
    const pwValid = await argon2.verify(teacher.password_hash, testPassword);
    console.log('\n✅ Password verify:', pwValid);
  } catch (e) {
    console.log('\n❌ Password verify error:', e.message);
  }

  try {
    const skValid = await argon2.verify(teacher.staff_key_hash, testStaffKey);
    console.log('✅ Staff Key verify:', skValid);
  } catch (e) {
    console.log('❌ Staff Key verify error:', e.message);
  }

  await pool.end();
}

main().catch(e => console.error('Error:', e.message));
