/**
 * ADYAPAN — Add User to Database (TiDB/MySQL)
 * 
 * Usage:
 *   node scripts/add-user.js --role student --name "Rahul Kumar" --email "rahul@example.com" --password "Test1234" --phone "9876543210" --class "Class 8" --school "Delhi Public School"
 *   node scripts/add-user.js --role admin --name "Admin" --email "admin@adyapan.com" --password "Admin1234"
 *   node scripts/add-user.js --role principal --name "Dr. Sharma" --email "principal@dps.com" --password "Principal1234" --schoolKey "DPS-KEY-2024" --school "Delhi Public School" --schoolId "school_dps"
 *   node scripts/add-user.js --role teacher --name "Priya Gupta" --email "priya@dps.com" --password "Teacher1234" --staffKey "STAFF-KEY-001" --school "Delhi Public School" --schoolId "school_dps" --subject "Maths" --classes "Class 8,Class 9"
 * 
 * This script adds users directly to the database with hashed passwords.
 * Only use this to manually register users since signup is disabled.
 */

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

// Load env
const rootDir = path.resolve(__dirname, "..");
for (const file of [path.join(rootDir, ".env"), path.join(rootDir, "frontend", ".env.local")]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    process.env[key] ||= value;
  }
}

function id(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function parseArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : "true";
      args[key] = value;
      if (value !== "true") i++;
    }
  }
  return args;
}

async function getConnection() {
  const caPath = process.env.MYSQL_SSL_CA_PATH;
  const ca = process.env.MYSQL_SSL_CA || (caPath && fs.existsSync(caPath) ? fs.readFileSync(caPath, "utf8") : undefined);
  const host = process.env.MYSQL_HOST || "127.0.0.1";
  const sslEnabled = process.env.MYSQL_SSL === "true" || Boolean(ca) || host.includes("tidbcloud.com");

  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (databaseUrl) {
    return mysql.createConnection({ uri: databaseUrl, ssl: sslEnabled ? (ca ? { ca, minVersion: "TLSv1.2", rejectUnauthorized: true } : { minVersion: "TLSv1.2", rejectUnauthorized: true }) : undefined });
  }

  return mysql.createConnection({
    host,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "preschool",
    ssl: sslEnabled ? (ca ? { ca, minVersion: "TLSv1.2", rejectUnauthorized: true } : { minVersion: "TLSv1.2", rejectUnauthorized: true }) : undefined
  });
}

async function addStudent(conn, args) {
  const { name, email, password, phone, class: classLevel, school } = args;
  if (!name || !email || !password) {
    console.error("Required: --name, --email, --password");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const userId = id("user");
  const studentId = id("student");

  // Check if already exists
  const [existing] = await conn.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) {
    console.error(`User with email ${email} already exists!`);
    process.exit(1);
  }

  await conn.query(
    `INSERT INTO users (id, name, email, password_hash, password, phone, class_level, class_name, school_name, school, role, signup_source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'student', 'admin')`,
    [userId, name, email, passwordHash, passwordHash, phone || null, classLevel || null, classLevel || null, school || null, school || null]
  );

  await conn.query(
    `INSERT INTO students (id, user_id, name, email, phone, class_level, class_name, school_name, school, signup_source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), name = VALUES(name)`,
    [studentId, userId, name, email, phone || null, classLevel || null, classLevel || null, school || null, school || null]
  );

  console.log(`✓ Student added: ${name} (${email})`);
  console.log(`  Class: ${classLevel || "Not set"} | School: ${school || "Not set"}`);
}

async function addAdmin(conn, args) {
  const { name, email, password } = args;
  if (!name || !email || !password) {
    console.error("Required: --name, --email, --password");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const userId = id("user");

  const [existing] = await conn.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) {
    // Update role to admin
    await conn.query("UPDATE users SET role = 'admin', password_hash = ? WHERE email = ?", [passwordHash, email]);
    console.log(`✓ Updated existing user to admin: ${name} (${email})`);
    return;
  }

  await conn.query(
    `INSERT INTO users (id, name, email, password_hash, password, role, signup_source)
     VALUES (?, ?, ?, ?, ?, 'admin', 'admin')`,
    [userId, name, email, passwordHash, passwordHash]
  );

  console.log(`✓ Admin added: ${name} (${email})`);
}

async function addPrincipal(conn, args) {
  const { name, email, password, schoolKey, school, schoolId } = args;
  if (!name || !email || !password || !schoolKey || !school) {
    console.error("Required: --name, --email, --password, --schoolKey, --school");
    console.error("Optional: --schoolId (auto-generated if not provided)");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const accessKeyHash = await bcrypt.hash(schoolKey.toUpperCase(), 12);
  const principalId = id("principal");
  const finalSchoolId = schoolId || id("school");

  const [existing] = await conn.query("SELECT id FROM principals WHERE email = ?", [email]);
  if (existing.length > 0) {
    await conn.query(
      `UPDATE principals SET principal_name = ?, password_hash = ?, access_key_hash = ?, school_name = ?, school_id = ?, status = 'active' WHERE email = ?`,
      [name, passwordHash, accessKeyHash, school, finalSchoolId, email]
    );
    console.log(`✓ Updated principal: ${name} (${email})`);
    console.log(`  School: ${school} | School ID: ${finalSchoolId}`);
    console.log(`  School Key: ${schoolKey.toUpperCase()}`);
    return;
  }

  // Also ensure school exists
  await conn.query(
    `INSERT INTO schools (id, name, status) VALUES (?, ?, 'active')
     ON DUPLICATE KEY UPDATE name = VALUES(name)`,
    [finalSchoolId, school]
  );

  await conn.query(
    `INSERT INTO principals (id, school_id, school_name, principal_name, email, password_hash, access_key_hash, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
    [principalId, finalSchoolId, school, name, email, passwordHash, accessKeyHash]
  );

  console.log(`✓ Principal added: ${name} (${email})`);
  console.log(`  School: ${school} | School ID: ${finalSchoolId}`);
  console.log(`  School Key: ${schoolKey.toUpperCase()}`);
}

async function addTeacher(conn, args) {
  const { name, email, password, staffKey, school, schoolId, subject, classes } = args;
  if (!name || !email || !password || !staffKey || !school) {
    console.error("Required: --name, --email, --password, --staffKey, --school");
    console.error("Optional: --schoolId, --subject, --classes (comma-separated like 'Class 8,Class 9')");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const staffKeyHash = await bcrypt.hash(staffKey.toUpperCase(), 12);
  const teacherId = id("teacher");
  const finalSchoolId = schoolId || id("school");
  const assignedClasses = classes ? classes.split(",").map(c => c.trim()) : [];

  const [existing] = await conn.query("SELECT id FROM teachers WHERE email = ?", [email]);
  if (existing.length > 0) {
    await conn.query(
      `UPDATE teachers SET teacher_name = ?, password_hash = ?, staff_key_hash = ?, school_name = ?, school_id = ?, subject = ?, assigned_classes = ?, status = 'active' WHERE email = ?`,
      [name, passwordHash, staffKeyHash, school, finalSchoolId, subject || null, JSON.stringify(assignedClasses), email]
    );
    console.log(`✓ Updated teacher: ${name} (${email})`);
    console.log(`  School: ${school} | Subject: ${subject || "Not set"} | Classes: ${assignedClasses.join(", ") || "All"}`);
    console.log(`  Staff Key: ${staffKey.toUpperCase()}`);
    return;
  }

  await conn.query(
    `INSERT INTO teachers (id, school_id, school_name, teacher_name, email, password_hash, staff_key_hash, subject, phone, assigned_classes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
    [teacherId, finalSchoolId, school, name, email, passwordHash, staffKeyHash, subject || null, args.phone || null, JSON.stringify(assignedClasses)]
  );

  console.log(`✓ Teacher added: ${name} (${email})`);
  console.log(`  School: ${school} | Subject: ${subject || "Not set"} | Classes: ${assignedClasses.join(", ") || "All"}`);
  console.log(`  Staff Key: ${staffKey.toUpperCase()}`);
}

async function main() {
  const args = parseArgs();
  const role = args.role;

  if (!role) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║           ADYAPAN — Add User to Database                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Usage: node scripts/add-user.js --role <role> [options]     ║
║                                                              ║
║  Roles: student, admin, principal, teacher                   ║
║                                                              ║
║  Examples:                                                   ║
║                                                              ║
║  Student:                                                    ║
║    --role student --name "Rahul" --email "r@x.com"           ║
║    --password "Test1234" --class "Class 8"                   ║
║    --school "DPS" --phone "9876543210"                       ║
║                                                              ║
║  Admin:                                                      ║
║    --role admin --name "Admin" --email "admin@adyapan.com"   ║
║    --password "Admin1234"                                    ║
║                                                              ║
║  Principal:                                                  ║
║    --role principal --name "Dr. Sharma"                      ║
║    --email "p@dps.com" --password "Princ1234"                ║
║    --schoolKey "DPS-KEY-2024" --school "DPS"                 ║
║                                                              ║
║  Teacher:                                                    ║
║    --role teacher --name "Priya" --email "t@dps.com"         ║
║    --password "Teach1234" --staffKey "STAFF-001"             ║
║    --school "DPS" --subject "Maths"                          ║
║    --classes "Class 8,Class 9"                               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);
    process.exit(0);
  }

  const conn = await getConnection();

  try {
    switch (role) {
      case "student":
        await addStudent(conn, args);
        break;
      case "admin":
        await addAdmin(conn, args);
        break;
      case "principal":
        await addPrincipal(conn, args);
        break;
      case "teacher":
        await addTeacher(conn, args);
        break;
      default:
        console.error(`Unknown role: ${role}. Use: student, admin, principal, teacher`);
        process.exit(1);
    }
  } finally {
    await conn.end();
  }
}

main().catch((error) => {
  console.error("Failed:", error.message);
  process.exit(1);
});
