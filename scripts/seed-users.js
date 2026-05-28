/**
 * ADYAPAN — Seed Multiple Users to Database (TiDB/MySQL)
 * 
 * Usage: node scripts/seed-users.js
 * 
 * Edit the USERS array below to add your users.
 * Run this script to insert them all at once.
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

// ═══════════════════════════════════════════════════════════════
// EDIT THIS SECTION — Add your users here
// ═══════════════════════════════════════════════════════════════

const USERS = [
  // ─── ADMINS ───
  {
    role: "admin",
    name: "Adyapan Admin",
    email: "admin@adyapan.com",
    password: "Admin@1234"
  },

  // ─── SCHOOLS ───
  // Add schools first (principals and teachers reference them)
  // Schools are auto-created when you add a principal

  // ─── PRINCIPALS ───
  {
    role: "principal",
    name: "Dr. Rupesh Kumar",
    email: "rupeshrupak609@gmail.com",
    password: "Principal@1234",
    schoolKey: "ADYAPAN-SCHOOL-KEY",  // Principal uses this to login
    school: "Adyapan Model School",
    schoolId: "school_adyapan_model"
  },

  // ─── TEACHERS ───
  {
    role: "teacher",
    name: "Adyapan Teacher",
    email: "teacher@adyapan.com",
    password: "Teacher@1234",
    staffKey: "ADYAPAN-STAFF-KEY",  // Teacher uses this to login
    school: "Adyapan Model School",
    schoolId: "school_adyapan_model",
    subject: "Future Skills",
    classes: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]
  },

  // ─── STUDENTS ───
  {
    role: "student",
    name: "Demo Student",
    email: "student@adyapan.com",
    password: "Student@1234",
    phone: "9999999999",
    classLevel: "Class 8",
    school: "Adyapan Model School"
  },

  // Add more students below:
  // {
  //   role: "student",
  //   name: "Student Name",
  //   email: "email@example.com",
  //   password: "Password1",
  //   phone: "9876543210",
  //   classLevel: "Class 9",
  //   school: "School Name"
  // },
];

// ═══════════════════════════════════════════════════════════════
// DO NOT EDIT BELOW THIS LINE
// ═══════════════════════════════════════════════════════════════

function id(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

async function getConnection() {
  const caPath = process.env.MYSQL_SSL_CA_PATH;
  const ca = process.env.MYSQL_SSL_CA || (caPath && fs.existsSync(caPath) ? fs.readFileSync(caPath, "utf8") : undefined);
  const host = process.env.MYSQL_HOST || "127.0.0.1";
  const sslEnabled = process.env.MYSQL_SSL === "true" || Boolean(ca) || host.includes("tidbcloud.com");
  const ssl = sslEnabled ? (ca ? { ca, minVersion: "TLSv1.2", rejectUnauthorized: true } : { minVersion: "TLSv1.2", rejectUnauthorized: true }) : undefined;

  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (databaseUrl) {
    return mysql.createConnection({ uri: databaseUrl, ssl });
  }

  return mysql.createConnection({
    host,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "preschool",
    ssl
  });
}

async function main() {
  const conn = await getConnection();
  let added = 0;
  let skipped = 0;
  let errors = 0;

  console.log("\n🚀 ADYAPAN — Seeding users to database...\n");

  try {
    for (const user of USERS) {
      try {
        const passwordHash = await bcrypt.hash(user.password, 12);

        if (user.role === "admin" || user.role === "student") {
          const [existing] = await conn.query("SELECT id FROM users WHERE email = ?", [user.email]);
          if (existing.length > 0) {
            console.log(`  ⏭  ${user.role.toUpperCase()} ${user.email} — already exists, skipping`);
            skipped++;
            continue;
          }

          const userId = id("user");
          await conn.query(
            `INSERT INTO users (id, name, email, password_hash, phone, class_level, class_name, school_name, school, role, signup_source)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin')`,
            [userId, user.name, user.email, passwordHash, user.phone || null, user.classLevel || null, user.classLevel || null, user.school || null, user.school || null, user.role]
          );

          if (user.role === "student") {
            await conn.query(
              `INSERT INTO students (id, user_id, name, email, phone, class_level, class_name, school_name, school, signup_source)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin')
               ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)`,
              [id("student"), userId, user.name, user.email, user.phone || null, user.classLevel || null, user.classLevel || null, user.school || null, user.school || null]
            );
          }

          console.log(`  ✓  ${user.role.toUpperCase()} — ${user.name} (${user.email})`);
          added++;

        } else if (user.role === "principal") {
          const [existing] = await conn.query("SELECT id FROM principals WHERE email = ?", [user.email]);
          if (existing.length > 0) {
            console.log(`  ⏭  PRINCIPAL ${user.email} — already exists, skipping`);
            skipped++;
            continue;
          }

          const accessKeyHash = await bcrypt.hash(user.schoolKey.toUpperCase(), 12);
          const schoolId = user.schoolId || id("school");

          // Ensure school exists
          await conn.query(
            `INSERT INTO schools (id, name, status) VALUES (?, ?, 'active')
             ON DUPLICATE KEY UPDATE name = VALUES(name)`,
            [schoolId, user.school]
          );

          await conn.query(
            `INSERT INTO principals (id, school_id, school_name, principal_name, email, password_hash, access_key_hash, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
            [id("principal"), schoolId, user.school, user.name, user.email, passwordHash, accessKeyHash]
          );

          console.log(`  ✓  PRINCIPAL — ${user.name} (${user.email}) | School: ${user.school}`);
          console.log(`     School Key: ${user.schoolKey.toUpperCase()}`);
          added++;

        } else if (user.role === "teacher") {
          const [existing] = await conn.query("SELECT id FROM teachers WHERE email = ?", [user.email]);
          if (existing.length > 0) {
            console.log(`  ⏭  TEACHER ${user.email} — already exists, skipping`);
            skipped++;
            continue;
          }

          const staffKeyHash = await bcrypt.hash(user.staffKey.toUpperCase(), 12);
          const schoolId = user.schoolId || id("school");
          const assignedClasses = user.classes || [];

          await conn.query(
            `INSERT INTO teachers (id, school_id, school_name, teacher_name, email, password_hash, staff_key_hash, subject, phone, assigned_classes, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
            [id("teacher"), schoolId, user.school, user.name, user.email, passwordHash, staffKeyHash, user.subject || null, user.phone || null, JSON.stringify(assignedClasses)]
          );

          console.log(`  ✓  TEACHER — ${user.name} (${user.email}) | School: ${user.school}`);
          console.log(`     Subject: ${user.subject || "All"} | Classes: ${assignedClasses.join(", ") || "All"}`);
          console.log(`     Staff Key: ${user.staffKey.toUpperCase()}`);
          added++;
        }
      } catch (err) {
        console.error(`  ✗  ERROR for ${user.email}: ${err.message}`);
        errors++;
      }
    }

    console.log(`\n═══════════════════════════════════════════`);
    console.log(`  Added: ${added} | Skipped: ${skipped} | Errors: ${errors}`);
    console.log(`═══════════════════════════════════════════\n`);
  } finally {
    await conn.end();
  }
}

main().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
