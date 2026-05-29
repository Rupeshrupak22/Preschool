const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

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

function mysqlSslConfig() {
  const caPath = process.env.MYSQL_SSL_CA_PATH;
  const ca =
    process.env.MYSQL_SSL_CA ||
    (caPath && fs.existsSync(caPath) ? fs.readFileSync(caPath, "utf8") : undefined);
  const enabled =
    process.env.MYSQL_SSL === "true" ||
    Boolean(ca) ||
    String(process.env.MYSQL_HOST || "").includes("tidbcloud.com");

  if (!enabled) return undefined;
  return ca
    ? { ca, minVersion: "TLSv1.2", rejectUnauthorized: true }
    : { minVersion: "TLSv1.2", rejectUnauthorized: true };
}

function dbConfig() {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (databaseUrl) return databaseUrl;

  return {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "preschool",
    ssl: mysqlSslConfig()
  };
}

function id(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function assignedClasses() {
  return String(process.env.TEACHER_ASSIGNED_CLASSES || "Class 9,Class 10")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function ensureTeacherTables(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS teachers (
      id VARCHAR(64) PRIMARY KEY,
      school_id VARCHAR(64) NOT NULL,
      school_name VARCHAR(190) NOT NULL,
      teacher_name VARCHAR(160) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      staff_key_hash VARCHAR(255) NOT NULL,
      subject VARCHAR(120),
      phone VARCHAR(30),
      assigned_classes JSON,
      status VARCHAR(40) NOT NULL DEFAULT 'active',
      last_login_at DATETIME,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_teachers_school_id (school_id),
      KEY idx_teachers_school_name (school_name)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teacher_login_events (
      id VARCHAR(64) PRIMARY KEY,
      teacher_id VARCHAR(64),
      email VARCHAR(190) NOT NULL,
      school_id VARCHAR(64),
      ip_address VARCHAR(80),
      user_agent TEXT,
      status VARCHAR(40) NOT NULL DEFAULT 'success',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_teacher_login_events_email (email),
      KEY idx_teacher_login_events_school_id (school_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teacher_class_sessions (
      id VARCHAR(64) PRIMARY KEY,
      teacher_id VARCHAR(64) NOT NULL,
      title VARCHAR(190) NOT NULL,
      class_level VARCHAR(80) NOT NULL,
      subject VARCHAR(120),
      start_time DATETIME NOT NULL,
      end_time DATETIME,
      room VARCHAR(80),
      mode VARCHAR(40) NOT NULL DEFAULT 'online',
      status VARCHAR(40) NOT NULL DEFAULT 'scheduled',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_teacher_class_sessions_teacher_id (teacher_id),
      KEY idx_teacher_class_sessions_class_level (class_level),
      KEY idx_teacher_class_sessions_start_time (start_time)
    )
  `);
}

async function main() {
  const config = dbConfig();
  const pool =
    typeof config === "string"
      ? await mysql.createPool(config)
      : await mysql.createPool({ ...config, waitForConnections: true, connectionLimit: 5 });
  await ensureTeacherTables(pool);

  const teacher = {
    id: process.env.TEACHER_ID || "teacher_adm_future_skills",
    schoolId: process.env.TEACHER_SCHOOL_ID || process.env.PRINCIPAL_SCHOOL_ID || "ADM",
    schoolName: process.env.TEACHER_SCHOOL_NAME || process.env.PRINCIPAL_SCHOOL_NAME || "ADM",
    teacherName: process.env.TEACHER_NAME || "Adyapan Teacher",
    email: process.env.TEACHER_EMAIL || "teacher@adyapan.com",
    phone: process.env.TEACHER_PHONE || null,
    subject: process.env.TEACHER_SUBJECT || "Future Skills",
    password: process.env.TEACHER_PASSWORD || "Teacher@609!2026",
    staffKey: process.env.TEACHER_STAFF_KEY || "ADM-TEACHER-609",
    classes: assignedClasses()
  };

  const passwordHash = await bcrypt.hash(teacher.password, 12);
  const staffKeyHash = await bcrypt.hash(teacher.staffKey, 12);

  await pool.query(
    `INSERT INTO teachers (id, school_id, school_name, teacher_name, email, password_hash, staff_key_hash, subject, phone, assigned_classes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
     ON DUPLICATE KEY UPDATE
       school_id = VALUES(school_id),
       school_name = VALUES(school_name),
       teacher_name = VALUES(teacher_name),
       password_hash = VALUES(password_hash),
       staff_key_hash = VALUES(staff_key_hash),
       subject = VALUES(subject),
       phone = VALUES(phone),
       assigned_classes = VALUES(assigned_classes),
       status = 'active'`,
    [
      teacher.id,
      teacher.schoolId,
      teacher.schoolName,
      teacher.teacherName,
      teacher.email,
      passwordHash,
      staffKeyHash,
      teacher.subject,
      teacher.phone,
      JSON.stringify(teacher.classes)
    ]
  );

  const [teacherRows] = await pool.query("SELECT id FROM teachers WHERE email = ? LIMIT 1", [teacher.email]);
  const teacherId = teacherRows[0]?.id || teacher.id;
  const sessionSeed = [
    ["teacher_session_future_skills_1", "AI Lab and Prompt Practice", teacher.classes[0] || "Class 9", 1, "Lab A", "offline"],
    ["teacher_session_future_skills_2", "Coding Sprint Review", teacher.classes[1] || teacher.classes[0] || "Class 10", 2, "Online", "online"],
    ["teacher_session_future_skills_3", "Robotics Project Checkpoint", teacher.classes[0] || "Class 9", 4, "Innovation Lab", "offline"]
  ];

  for (const [sessionId, title, classLevel, dayOffset, room, mode] of sessionSeed) {
    await pool.query(
      `INSERT INTO teacher_class_sessions (id, teacher_id, title, class_level, subject, start_time, end_time, room, mode, status)
       VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL ? DAY), INTERVAL 60 MINUTE), ?, ?, 'scheduled')
       ON DUPLICATE KEY UPDATE
         teacher_id = VALUES(teacher_id),
         title = VALUES(title),
         class_level = VALUES(class_level),
         subject = VALUES(subject),
         start_time = VALUES(start_time),
         end_time = VALUES(end_time),
         room = VALUES(room),
         mode = VALUES(mode),
         status = 'scheduled'`,
      [sessionId, teacherId, title, classLevel, teacher.subject, dayOffset, dayOffset, room, mode]
    );
  }

  await pool.end();

  console.log("Teacher account ready");
  console.log(`Email: ${teacher.email}`);
  console.log(`Password: ${teacher.password}`);
  console.log(`Staff key: ${teacher.staffKey}`);
  console.log(`School: ${teacher.schoolName}`);
  console.log(`Classes: ${teacher.classes.join(", ") || "All classes"}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
