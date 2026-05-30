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

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  FULL LOGIN VERIFICATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ADMIN
  console.log('🔐 ADMIN (rupeshrupak609@gmail.com)');
  const [adminRows] = await pool.query('SELECT password_hash FROM users WHERE email = ?', ['rupeshrupak609@gmail.com']);
  if (adminRows.length > 0) {
    const pw = '01e17a4d8cc4ce3924e5530bfd80c72ac3d6917ff7a54a30ec12bcf46eae6140';
    const valid = await argon2.verify(adminRows[0].password_hash, pw);
    console.log('   Password:', valid ? '✅ PASS' : '❌ FAIL');
  } else {
    console.log('   ❌ NOT FOUND');
  }

  // TEACHER
  console.log('\n👨‍🏫 TEACHER (teacher@adyapan.com)');
  const [teacherRows] = await pool.query('SELECT password_hash, staff_key_hash FROM teachers WHERE email = ?', ['teacher@adyapan.com']);
  if (teacherRows.length > 0) {
    const pw = 'e60238be72504d66282872a3c5d505bb5869935580cd836ad6faf117c11eb89c';
    const sk = 'ddf8d93b267a23753596df4be950330e092c8fbd1610ab740548d7fc6a261edc';
    const pwValid = await argon2.verify(teacherRows[0].password_hash, pw);
    const skValid = await argon2.verify(teacherRows[0].staff_key_hash, sk);
    console.log('   Password:', pwValid ? '✅ PASS' : '❌ FAIL');
    console.log('   Staff Key:', skValid ? '✅ PASS' : '❌ FAIL');
  } else {
    console.log('   ❌ NOT FOUND');
  }

  // PRINCIPAL
  console.log('\n🏫 PRINCIPAL (principal@adyapan.com)');
  const [principalRows] = await pool.query('SELECT password_hash, access_key_hash FROM principals WHERE email = ?', ['principal@adyapan.com']);
  if (principalRows.length > 0) {
    const pw = '2564f0e3176d44ff3f6bd5c2a98a71f9d7a5a7dcf30253aae46984cf9deea8b6';
    const ak = 'f6acf258da641d77f7b2cc3a306a425932d739586e5e2bf91577bf84a8b0debb';
    const pwValid = await argon2.verify(principalRows[0].password_hash, pw);
    const akValid = await argon2.verify(principalRows[0].access_key_hash, ak);
    console.log('   Password:', pwValid ? '✅ PASS' : '❌ FAIL');
    console.log('   Access Key:', akValid ? '✅ PASS' : '❌ FAIL');
  } else {
    console.log('   ❌ NOT FOUND');
  }

  // DB CONNECTION
  console.log('\n📦 DATABASE');
  const [dbTest] = await pool.query('SELECT COUNT(*) as users FROM users');
  const [students] = await pool.query('SELECT COUNT(*) as count FROM students');
  const [teachers] = await pool.query('SELECT COUNT(*) as count FROM teachers');
  console.log('   Users:', dbTest[0].users);
  console.log('   Students:', students[0].count);
  console.log('   Teachers:', teachers[0].count);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  ALL SYSTEMS CHECK COMPLETE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await pool.end();
}

main().catch(e => console.error('Error:', e.message));
