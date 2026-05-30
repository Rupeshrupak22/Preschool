import fs from "node:fs";
import mysql, { type Pool, type PoolOptions, type RowDataPacket } from "mysql2/promise";
import { createEmptyDashboardData, type DashboardData, type Achievement, type FutureSkill } from "@/lib/dashboard/dashboard-data";
import { id } from "@/lib/store";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  classLevel?: string | null;
  schoolName?: string | null;
  role: "student" | "admin";
  signupSource?: string | null;
  otpVerified?: boolean;
  unlockedCourses?: string[];
  createdAt?: string;
  updatedAt?: string;
};

type PrincipalRecord = {
  id: string;
  schoolId: string;
  schoolName: string;
  principalName: string;
  email: string;
  passwordHash: string;
  accessKeyHash: string;
  phone?: string | null;
  status: "active" | "paused";
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type TeacherRecord = {
  id: string;
  schoolId: string;
  schoolName: string;
  teacherName: string;
  email: string;
  passwordHash: string;
  staffKeyHash: string;
  subject?: string | null;
  phone?: string | null;
  assignedClasses: string[];
  status: "active" | "paused";
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type LeadRecord = Record<string, unknown>;
type PaymentRecord = Record<string, unknown>;
type CertificateRecord = Record<string, unknown>;

declare global {
  var mysqlPool: Pool | undefined;
  var mysqlSchemaReady: Promise<void> | undefined;
}

function mysqlSslConfig(): PoolOptions["ssl"] {
  const caPath = process.env.MYSQL_SSL_CA_PATH;
  const ca =
    process.env.MYSQL_SSL_CA ||
    (caPath && fs.existsSync(caPath) ? fs.readFileSync(caPath, "utf8") : undefined);
  const host = process.env.MYSQL_HOST || "";
  const enabled =
    process.env.MYSQL_SSL === "true" ||
    Boolean(ca) ||
    host.includes("tidbcloud.com");

  if (!enabled) return undefined;

  return ca
    ? { ca, minVersion: "TLSv1.2", rejectUnauthorized: true }
    : { minVersion: "TLSv1.2", rejectUnauthorized: true };
}

function mysqlConfig(): PoolOptions {
  return {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "preschool",
    ssl: mysqlSslConfig(),
    waitForConnections: true,
    connectionLimit: 10
  };
}

export function isMysqlConfigured() {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.MYSQL_URL ||
      (process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE)
  );
}

export async function connectDb() {
  if (!isMysqlConfigured()) {
    return null;
  }

  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  global.mysqlPool ??= databaseUrl ? mysql.createPool(databaseUrl) : mysql.createPool(mysqlConfig());
  global.mysqlSchemaReady ??= ensureSchema(global.mysqlPool);
  await global.mysqlSchemaReady;
  return global.mysqlPool;
}

async function ensureSchema(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      phone VARCHAR(30),
      class_level VARCHAR(80),
      class_name VARCHAR(80),
      school_name VARCHAR(190),
      school VARCHAR(190),
      role VARCHAR(30) NOT NULL DEFAULT 'student',
      signup_source VARCHAR(40) NOT NULL DEFAULT 'web',
      otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
      unlocked_courses JSON,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      name VARCHAR(160) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      phone VARCHAR(30),
      class_level VARCHAR(80),
      class_name VARCHAR(80),
      school_name VARCHAR(190),
      school VARCHAR(190),
      parent_name VARCHAR(160),
      parent_phone VARCHAR(30),
      signup_source VARCHAR(40) NOT NULL DEFAULT 'web',
      status VARCHAR(40) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_students_user_id (user_id),
      CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schools (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(190) NOT NULL,
      email VARCHAR(190),
      phone VARCHAR(30),
      city VARCHAR(120),
      address TEXT,
      contact_person VARCHAR(160),
      status VARCHAR(40) NOT NULL DEFAULT 'lead',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(190) NOT NULL,
      slug VARCHAR(190) NOT NULL UNIQUE,
      description TEXT,
      level VARCHAR(80),
      category VARCHAR(120),
      duration VARCHAR(80),
      price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      currency VARCHAR(10) NOT NULL DEFAULT 'INR',
      status VARCHAR(40) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id VARCHAR(64) PRIMARY KEY,
      type VARCHAR(40) NOT NULL,
      name VARCHAR(160),
      email VARCHAR(190) NOT NULL,
      phone VARCHAR(30),
      school VARCHAR(190),
      city VARCHAR(120),
      message TEXT,
      class_level VARCHAR(80),
      class_name VARCHAR(80),
      interest VARCHAR(190),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_leads_email (email)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id VARCHAR(64) PRIMARY KEY,
      user_email VARCHAR(190) NOT NULL,
      plan VARCHAR(160) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(10) NOT NULL DEFAULT 'INR',
      razorpay_order_id VARCHAR(190) UNIQUE,
      razorpay_payment_id VARCHAR(190),
      status VARCHAR(40) NOT NULL DEFAULT 'created',
      receipt_url TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_payments_user_email (user_email)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id VARCHAR(64) PRIMARY KEY,
      user_email VARCHAR(190) NOT NULL,
      course_id VARCHAR(64),
      course_title VARCHAR(190) NOT NULL,
      payment_id VARCHAR(64),
      status VARCHAR(40) NOT NULL DEFAULT 'active',
      enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_enrollments_user_email (user_email),
      CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
      CONSTRAINT fk_enrollments_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS certificates (
      credential_id VARCHAR(90) PRIMARY KEY,
      student_name VARCHAR(160) NOT NULL,
      user_email VARCHAR(190) NOT NULL,
      course VARCHAR(190) NOT NULL,
      qr_code LONGTEXT,
      issued_at DATETIME,
      status VARCHAR(40) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_certificates_user_email (user_email)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(64) PRIMARY KEY,
      user_email VARCHAR(190),
      title VARCHAR(190) NOT NULL,
      message TEXT NOT NULL,
      channel VARCHAR(40) NOT NULL DEFAULT 'email',
      status VARCHAR(40) NOT NULL DEFAULT 'queued',
      read_at DATETIME,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_notifications_user_email (user_email)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS otps (
      id VARCHAR(64) PRIMARY KEY,
      email VARCHAR(190) NOT NULL,
      code VARCHAR(20) NOT NULL,
      expires_at DATETIME NOT NULL,
      consumed_at DATETIME,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_otps_email (email)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS login_events (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      email VARCHAR(190) NOT NULL,
      name VARCHAR(160),
      role VARCHAR(30),
      source VARCHAR(40) NOT NULL DEFAULT 'web',
      ip_address VARCHAR(80),
      user_agent TEXT,
      status VARCHAR(40) NOT NULL DEFAULT 'success',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_login_events_email (email)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS principals (
      id VARCHAR(64) PRIMARY KEY,
      school_id VARCHAR(64) NOT NULL,
      school_name VARCHAR(190) NOT NULL,
      principal_name VARCHAR(160) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      access_key_hash VARCHAR(255) NOT NULL,
      phone VARCHAR(30),
      status VARCHAR(40) NOT NULL DEFAULT 'active',
      last_login_at DATETIME,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_principals_school_id (school_id),
      KEY idx_principals_school_name (school_name)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS principal_login_events (
      id VARCHAR(64) PRIMARY KEY,
      principal_id VARCHAR(64),
      email VARCHAR(190) NOT NULL,
      school_id VARCHAR(64),
      ip_address VARCHAR(80),
      user_agent TEXT,
      status VARCHAR(40) NOT NULL DEFAULT 'success',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_principal_login_events_email (email),
      KEY idx_principal_login_events_school_id (school_id)
    )
  `);

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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS dashboard_snapshots (
      id VARCHAR(64) PRIMARY KEY,
      user_email VARCHAR(190) NOT NULL UNIQUE,
      snapshot JSON NOT NULL,
      source VARCHAR(40) NOT NULL DEFAULT 'seed',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await ensureColumn(pool, "users", "signup_source", "VARCHAR(40) NOT NULL DEFAULT 'web'");
  await ensureColumn(pool, "users", "class_name", "VARCHAR(80)");
  await ensureColumn(pool, "users", "school", "VARCHAR(190)");
  await ensureColumn(pool, "users", "school_id", "VARCHAR(64)");
  await ensureColumn(pool, "students", "signup_source", "VARCHAR(40) NOT NULL DEFAULT 'web'");
  await ensureColumn(pool, "students", "class_name", "VARCHAR(80)");
  await ensureColumn(pool, "students", "school", "VARCHAR(190)");
  await ensureColumn(pool, "students", "school_id", "VARCHAR(64)");
  await ensureColumn(pool, "leads", "class_name", "VARCHAR(80)");
  await ensureColumn(pool, "login_events", "source", "VARCHAR(40) NOT NULL DEFAULT 'web'");
  await ensureColumn(pool, "principals", "last_login_at", "DATETIME");
  await ensureColumn(pool, "teachers", "subject", "VARCHAR(120)");
  await ensureColumn(pool, "teachers", "phone", "VARCHAR(30)");
  await ensureColumn(pool, "teachers", "assigned_classes", "JSON");
  await ensureColumn(pool, "teachers", "last_login_at", "DATETIME");

  // Add indexes for school-based filtering performance
  await ensureIndex(pool, "students", "idx_students_school_name", "school_name");
  await ensureIndex(pool, "students", "idx_students_school_id", "school_id");
  await ensureIndex(pool, "users", "idx_users_school_name", "school_name");
}

async function ensureColumn(pool: Pool, tableName: string, columnName: string, definition: string) {
  if (await hasColumn(pool, tableName, columnName)) return;

  await pool.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
}

async function ensureIndex(pool: Pool, tableName: string, indexName: string, columnName: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND INDEX_NAME = ?`,
    [tableName, indexName]
  );

  if (Number(rows[0]?.count ?? 0) > 0) return;

  try {
    await pool.query(`ALTER TABLE ${tableName} ADD INDEX ${indexName} (${columnName})`);
  } catch {
    // Index may already exist under a different name
  }
}

async function hasColumn(pool: Pool, tableName: string, columnName: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );

  return Number(rows[0]?.count ?? 0) > 0;
}

function parseCourses(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.length > 0) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function parseAssignedClasses(value: unknown): string[] {
  return parseCourses(value)
    .map((item) => item.trim())
    .filter(Boolean);
}

function dateValue(value: unknown) {
  return (value as { toISOString?: () => string })?.toISOString?.() ?? value;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function mapUser(row: RowDataPacket): UserRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    passwordHash: String(row.password_hash),
    phone: row.phone,
    classLevel: row.class_level ?? row.class_name,
    schoolName: row.school_name ?? row.school,
    role: row.role === "admin" ? "admin" : "student",
    signupSource: row.signup_source ?? "web",
    otpVerified: Boolean(row.otp_verified),
    unlockedCourses: parseCourses(row.unlocked_courses),
    createdAt: dateValue(row.created_at) as string,
    updatedAt: dateValue(row.updated_at) as string
  };
}

function mapPrincipal(row: RowDataPacket): PrincipalRecord {
  return {
    id: String(row.id),
    schoolId: String(row.school_id),
    schoolName: String(row.school_name),
    principalName: String(row.principal_name),
    email: String(row.email),
    passwordHash: String(row.password_hash),
    accessKeyHash: String(row.access_key_hash),
    phone: row.phone,
    status: row.status === "paused" ? "paused" : "active",
    lastLoginAt: dateValue(row.last_login_at) as string | null,
    createdAt: dateValue(row.created_at) as string,
    updatedAt: dateValue(row.updated_at) as string
  };
}

function mapTeacher(row: RowDataPacket): TeacherRecord {
  return {
    id: String(row.id),
    schoolId: String(row.school_id),
    schoolName: String(row.school_name),
    teacherName: String(row.teacher_name),
    email: String(row.email),
    passwordHash: String(row.password_hash),
    staffKeyHash: String(row.staff_key_hash),
    subject: row.subject,
    phone: row.phone,
    assignedClasses: parseAssignedClasses(row.assigned_classes),
    status: row.status === "paused" ? "paused" : "active",
    lastLoginAt: dateValue(row.last_login_at) as string | null,
    createdAt: dateValue(row.created_at) as string,
    updatedAt: dateValue(row.updated_at) as string
  };
}

export async function findUserByEmail(email: string) {
  const pool = await connectDb();
  if (!pool) return null;

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] ? mapUser(rows[0]) : null;
}

export async function updateUserProfile(
  email: string,
  data: { name: string; phone?: string | null; classLevel?: string | null; schoolName?: string | null }
) {
  const pool = await connectDb();
  if (!pool) return null;

  // Resolve school_id from school name
  let schoolId: string | null = null;
  if (data.schoolName) {
    const trimmedSchool = data.schoolName.trim();
    const [schoolRows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM schools WHERE TRIM(name) = ? LIMIT 1",
      [trimmedSchool]
    );
    if (schoolRows[0]) {
      schoolId = schoolRows[0].id;
    }
  }

  const hasSchoolIdCol = await hasColumn(pool, "users", "school_id");

  await pool.query(
    `UPDATE users
     SET name = ?, phone = ?, class_level = ?, class_name = ?, school_name = ?, school = ?${hasSchoolIdCol ? ", school_id = ?" : ""}
     WHERE email = ?`,
    [data.name, data.phone ?? null, data.classLevel ?? null, data.classLevel ?? null, data.schoolName ?? null, data.schoolName ?? null, ...(hasSchoolIdCol ? [schoolId] : []), email]
  );

  const hasStudentSchoolIdCol = await hasColumn(pool, "students", "school_id");

  await pool.query(
    `UPDATE students
     SET name = ?, phone = ?, class_level = ?, class_name = ?, school_name = ?, school = ?${hasStudentSchoolIdCol ? ", school_id = ?" : ""}
     WHERE email = ?`,
    [data.name, data.phone ?? null, data.classLevel ?? null, data.classLevel ?? null, data.schoolName ?? null, data.schoolName ?? null, ...(hasStudentSchoolIdCol ? [schoolId] : []), email]
  );

  return findUserByEmail(email);
}

export async function createUser(data: {
  name: string;
  email: string;
  phone: string;
  classLevel: string;
  schoolName?: string;
  passwordHash: string;
  role: "student" | "admin";
  source?: "web" | "mobile" | "app";
}) {
  const pool = await connectDb();
  if (!pool) return null;

  // Resolve school_id from school name for proper linking
  let schoolId: string | null = null;
  if (data.schoolName) {
    const trimmedSchool = data.schoolName.trim();
    const [schoolRows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM schools WHERE TRIM(name) = ? LIMIT 1",
      [trimmedSchool]
    );
    if (schoolRows[0]) {
      schoolId = schoolRows[0].id;
    }
  }

  const user: UserRecord = {
    id: id("user"),
    name: data.name,
    email: data.email,
    phone: data.phone,
    classLevel: data.classLevel,
    schoolName: data.schoolName ?? null,
    passwordHash: data.passwordHash,
    role: data.role,
    signupSource: data.source === "app" ? "mobile" : data.source ?? "web",
    unlockedCourses: ["Future Skills Starter"]
  };

  const hasLegacyPasswordColumn = await hasColumn(pool, "users", "password");
  const hasSchoolIdColumn = await hasColumn(pool, "users", "school_id");
  const userColumns = [
    "id",
    "name",
    "email",
    "password_hash",
    ...(hasLegacyPasswordColumn ? ["password"] : []),
    "phone",
    "class_level",
    "class_name",
    "school_name",
    "school",
    ...(hasSchoolIdColumn ? ["school_id"] : []),
    "role",
    "signup_source",
    "unlocked_courses"
  ];
  const userValues = [
    user.id,
    user.name,
    user.email,
    user.passwordHash,
    ...(hasLegacyPasswordColumn ? [user.passwordHash] : []),
    user.phone,
    user.classLevel,
    user.classLevel,
    user.schoolName,
    user.schoolName,
    ...(hasSchoolIdColumn ? [schoolId] : []),
    user.role,
    user.signupSource,
    JSON.stringify(user.unlockedCourses)
  ];

  await pool.query(
    `INSERT INTO users (${userColumns.join(", ")})
     VALUES (${userColumns.map(() => "?").join(", ")})`,
    userValues
  );

  if (user.role === "student") {
    const hasStudentSchoolId = await hasColumn(pool, "students", "school_id");
    const studentColumns = ["id", "user_id", "name", "email", "phone", "class_level", "class_name", "school_name", "school", ...(hasStudentSchoolId ? ["school_id"] : []), "signup_source"];
    const studentValues = [id("student"), user.id, user.name, user.email, user.phone, user.classLevel, user.classLevel, user.schoolName, user.schoolName, ...(hasStudentSchoolId ? [schoolId] : []), user.signupSource];

    await pool.query(
      `INSERT INTO students (${studentColumns.join(", ")})
       VALUES (${studentColumns.map(() => "?").join(", ")})
       ON DUPLICATE KEY UPDATE
         user_id = VALUES(user_id),
         name = VALUES(name),
         phone = VALUES(phone),
         class_level = VALUES(class_level),
         class_name = VALUES(class_name),
         school_name = VALUES(school_name),
         school = VALUES(school),
         ${hasStudentSchoolId ? "school_id = VALUES(school_id)," : ""}
         signup_source = VALUES(signup_source)`,
      studentValues
    );
  }

  return user;
}

export async function recordLoginEvent(data: {
  user: Pick<UserRecord, "id" | "email" | "name" | "role">;
  ipAddress?: string | null;
  userAgent?: string | null;
  status?: string;
  source?: "web" | "mobile" | "app";
}) {
  const pool = await connectDb();
  if (!pool) return null;

  await pool.query(
    `INSERT INTO login_events (id, user_id, email, name, role, source, ip_address, user_agent, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id("login"),
      data.user.id,
      data.user.email,
      data.user.name,
      data.user.role,
      data.source === "app" ? "mobile" : data.source ?? "web",
      data.ipAddress ?? null,
      data.userAgent ?? null,
      data.status ?? "success"
    ]
  );
}

/**
 * Update password_hash for a user/principal/teacher after Argon2id rehash.
 */
export async function updatePasswordHash(table: "users" | "principals" | "teachers", email: string, newHash: string) {
  const pool = await connectDb();
  if (!pool) return;
  await pool.query(`UPDATE ${table} SET password_hash = ? WHERE email = ?`, [newHash, email]);
}

/**
 * Update access_key_hash for principals after Argon2id rehash.
 */
export async function updateAccessKeyHash(table: "principals", email: string, newHash: string) {
  const pool = await connectDb();
  if (!pool) return;
  await pool.query(`UPDATE ${table} SET access_key_hash = ? WHERE email = ?`, [newHash, email]);
}

/**
 * Update staff_key_hash for teachers after Argon2id rehash.
 */
export async function updateStaffKeyHash(table: "teachers", email: string, newHash: string) {
  const pool = await connectDb();
  if (!pool) return;
  await pool.query(`UPDATE ${table} SET staff_key_hash = ? WHERE email = ?`, [newHash, email]);
}

export async function findPrincipalByEmail(email: string) {
  const pool = await connectDb();
  if (!pool) return null;

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM principals WHERE email = ? LIMIT 1", [email]);
  return rows[0] ? mapPrincipal(rows[0]) : null;
}

export async function upsertPrincipal(data: {
  id?: string;
  schoolId: string;
  schoolName: string;
  principalName: string;
  email: string;
  passwordHash: string;
  accessKeyHash: string;
  phone?: string | null;
  status?: "active" | "paused";
}) {
  const pool = await connectDb();
  if (!pool) return null;

  const principalId = data.id ?? id("principal");
  await pool.query(
    `INSERT INTO principals (id, school_id, school_name, principal_name, email, password_hash, access_key_hash, phone, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       school_id = VALUES(school_id),
       school_name = VALUES(school_name),
       principal_name = VALUES(principal_name),
       password_hash = VALUES(password_hash),
       access_key_hash = VALUES(access_key_hash),
       phone = VALUES(phone),
       status = VALUES(status)`,
    [
      principalId,
      data.schoolId,
      data.schoolName,
      data.principalName,
      data.email,
      data.passwordHash,
      data.accessKeyHash,
      data.phone ?? null,
      data.status ?? "active"
    ]
  );

  return findPrincipalByEmail(data.email);
}

export async function recordPrincipalLoginEvent(data: {
  principal?: Pick<PrincipalRecord, "id" | "email" | "schoolId"> | null;
  email: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  status?: string;
}) {
  const pool = await connectDb();
  if (!pool) return null;

  await pool.query(
    `INSERT INTO principal_login_events (id, principal_id, email, school_id, ip_address, user_agent, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id("principal_login"),
      data.principal?.id ?? null,
      data.email,
      data.principal?.schoolId ?? null,
      data.ipAddress ?? null,
      data.userAgent ?? null,
      data.status ?? "success"
    ]
  );

  if (data.principal?.id && data.status !== "failed") {
    await pool.query("UPDATE principals SET last_login_at = NOW() WHERE id = ?", [data.principal.id]);
  }
}

export async function getPrincipalDashboard(principalId: string) {
  const pool = await connectDb();
  if (!pool) return null;

  const [principalRows] = await pool.query<RowDataPacket[]>("SELECT * FROM principals WHERE id = ? LIMIT 1", [
    principalId
  ]);
  const principal = principalRows[0] ? mapPrincipal(principalRows[0]) : null;
  if (!principal) return null;

  const schoolScope = principal.schoolName.trim();
  const schoolId = principal.schoolId;

  // Use school_id for precise matching when available, fallback to school_name text match
  const hasStudentSchoolId = await hasColumn(pool, "students", "school_id");
  const studentWhereClause = hasStudentSchoolId && schoolId
    ? `(school_id = ? OR TRIM(COALESCE(school_name, '')) = ? OR TRIM(COALESCE(school, '')) = ?)`
    : `(TRIM(COALESCE(school_name, '')) = ? OR TRIM(COALESCE(school, '')) = ?)`;
  const studentParams = hasStudentSchoolId && schoolId
    ? [schoolId, schoolScope, schoolScope]
    : [schoolScope, schoolScope];

  const [studentRows, leadRows, loginRows, paymentRows] = await Promise.all([
    pool.query<RowDataPacket[]>(
      `SELECT id, name, email, phone, class_level, class_name, school_name, school, signup_source, created_at
       FROM students
       WHERE ${studentWhereClause}
       ORDER BY created_at DESC
       LIMIT 200`,
      studentParams
    ),
    pool.query<RowDataPacket[]>(
      `SELECT id, type, name, email, phone, school, city, message, interest, created_at
       FROM leads
       WHERE TRIM(COALESCE(school, '')) = ?
       ORDER BY created_at DESC
       LIMIT 100`,
      [schoolScope]
    ),
    pool.query<RowDataPacket[]>(
      `SELECT id, email, status, created_at
       FROM login_events
       WHERE email IN (
         SELECT email FROM students
         WHERE ${studentWhereClause}
       )
       ORDER BY created_at DESC
       LIMIT 100`,
      studentParams
    ),
    pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS count
       FROM payments
       WHERE user_email IN (
         SELECT email FROM students
         WHERE ${studentWhereClause}
       )`,
      studentParams
    )
  ]);

  const students = studentRows[0].map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    classLevel: row.class_level ?? row.class_name,
    schoolName: row.school_name ?? row.school,
    signupSource: row.signup_source,
    createdAt: dateValue(row.created_at)
  }));
  const leads = leadRows[0].map((row) => ({
    id: row.id,
    type: row.type,
    name: row.name,
    email: row.email,
    phone: row.phone,
    school: row.school,
    city: row.city,
    message: row.message,
    interest: row.interest,
    createdAt: dateValue(row.created_at)
  }));
  const logins = loginRows[0].map((row) => ({
    id: row.id,
    email: row.email,
    status: row.status,
    createdAt: dateValue(row.created_at)
  }));

  return {
    principal: {
      id: principal.id,
      name: principal.principalName,
      email: principal.email,
      schoolId: principal.schoolId,
      schoolName: principal.schoolName,
      phone: principal.phone,
      lastLoginAt: principal.lastLoginAt
    },
    stats: {
      students: students.length,
      leads: leads.length,
      activeLogins: logins.filter((login) => login.status === "success" || login.status === "signup").length,
      payments: Number(paymentRows[0][0]?.count ?? 0)
    },
    students,
    leads,
    logins
  };
}

export async function findTeacherByEmail(email: string) {
  const pool = await connectDb();
  if (!pool) return null;

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM teachers WHERE email = ? LIMIT 1", [email]);
  return rows[0] ? mapTeacher(rows[0]) : null;
}

export async function upsertTeacher(data: {
  id?: string;
  schoolId: string;
  schoolName: string;
  teacherName: string;
  email: string;
  passwordHash: string;
  staffKeyHash: string;
  subject?: string | null;
  phone?: string | null;
  assignedClasses?: string[];
  status?: "active" | "paused";
}) {
  const pool = await connectDb();
  if (!pool) return null;

  const teacherId = data.id ?? id("teacher");
  await pool.query(
    `INSERT INTO teachers (id, school_id, school_name, teacher_name, email, password_hash, staff_key_hash, subject, phone, assigned_classes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       school_id = VALUES(school_id),
       school_name = VALUES(school_name),
       teacher_name = VALUES(teacher_name),
       password_hash = VALUES(password_hash),
       staff_key_hash = VALUES(staff_key_hash),
       subject = VALUES(subject),
       phone = VALUES(phone),
       assigned_classes = VALUES(assigned_classes),
       status = VALUES(status)`,
    [
      teacherId,
      data.schoolId,
      data.schoolName,
      data.teacherName,
      data.email,
      data.passwordHash,
      data.staffKeyHash,
      data.subject ?? null,
      data.phone ?? null,
      JSON.stringify(data.assignedClasses ?? []),
      data.status ?? "active"
    ]
  );

  return findTeacherByEmail(data.email);
}

export async function recordTeacherLoginEvent(data: {
  teacher?: Pick<TeacherRecord, "id" | "email" | "schoolId"> | null;
  email: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  status?: string;
}) {
  const pool = await connectDb();
  if (!pool) return null;

  await pool.query(
    `INSERT INTO teacher_login_events (id, teacher_id, email, school_id, ip_address, user_agent, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id("teacher_login"),
      data.teacher?.id ?? null,
      data.email,
      data.teacher?.schoolId ?? null,
      data.ipAddress ?? null,
      data.userAgent ?? null,
      data.status ?? "success"
    ]
  );

  if (data.teacher?.id && data.status !== "failed") {
    await pool.query("UPDATE teachers SET last_login_at = NOW() WHERE id = ?", [data.teacher.id]);
  }
}

export async function getTeacherDashboard(teacherId: string) {
  const pool = await connectDb();
  if (!pool) return null;

  const [teacherRows] = await pool.query<RowDataPacket[]>("SELECT * FROM teachers WHERE id = ? LIMIT 1", [teacherId]);
  const teacher = teacherRows[0] ? mapTeacher(teacherRows[0]) : null;
  if (!teacher) return null;

  const schoolScope = teacher.schoolName.trim();
  const schoolId = teacher.schoolId;
  const classFilters = teacher.assignedClasses;
  const classClause = classFilters.length
    ? ` AND (class_level IN (${classFilters.map(() => "?").join(", ")}) OR class_name IN (${classFilters.map(() => "?").join(", ")}))`
    : "";
  const classParams = classFilters.length ? [...classFilters, ...classFilters] : [];

  // Use school_id for precise matching when available, fallback to school_name text match
  const hasStudentSchoolId = await hasColumn(pool, "students", "school_id");
  const schoolWhereClause = hasStudentSchoolId && schoolId
    ? `(school_id = ? OR TRIM(COALESCE(school_name, '')) = ? OR TRIM(COALESCE(school, '')) = ?)`
    : `(TRIM(COALESCE(school_name, '')) = ? OR TRIM(COALESCE(school, '')) = ?)`;
  const schoolParams = hasStudentSchoolId && schoolId
    ? [schoolId, schoolScope, schoolScope]
    : [schoolScope, schoolScope];

  const [studentRows, loginRows, sessionRows, certificateRows] = await Promise.all([
    pool.query<RowDataPacket[]>(
      `SELECT id, name, email, phone, class_level, class_name, school_name, school, signup_source, status, created_at
       FROM students
       WHERE ${schoolWhereClause}
       ${classClause}
       ORDER BY class_level ASC, name ASC
       LIMIT 300`,
      [...schoolParams, ...classParams]
    ),
    pool.query<RowDataPacket[]>(
      `SELECT id, email, status, created_at
       FROM login_events
       WHERE email IN (
         SELECT email FROM students
         WHERE ${schoolWhereClause}
         ${classClause}
       )
       ORDER BY created_at DESC
       LIMIT 100`,
      [...schoolParams, ...classParams]
    ),
    pool.query<RowDataPacket[]>(
      `SELECT id, title, class_level, subject, start_time, end_time, room, mode, status
       FROM teacher_class_sessions
       WHERE teacher_id = ?
       ORDER BY start_time ASC
       LIMIT 80`,
      [teacher.id]
    ),
    pool.query<RowDataPacket[]>(
      `SELECT credential_id, student_name, user_email, course, issued_at, status
       FROM certificates
       WHERE user_email IN (
         SELECT email FROM students
         WHERE ${schoolWhereClause}
         ${classClause}
       )
       ORDER BY created_at DESC
       LIMIT 100`,
      [...schoolParams, ...classParams]
    )
  ]);

  const students = studentRows[0].map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    classLevel: row.class_level ?? row.class_name,
    schoolName: row.school_name ?? row.school,
    signupSource: row.signup_source,
    status: row.status,
    createdAt: dateValue(row.created_at)
  }));

  const logins = loginRows[0].map((row) => ({
    id: row.id,
    email: row.email,
    status: row.status,
    createdAt: dateValue(row.created_at)
  }));

  const schedule = sessionRows[0].map((row) => ({
    id: row.id,
    title: row.title,
    classLevel: row.class_level,
    subject: row.subject,
    startTime: dateValue(row.start_time),
    endTime: dateValue(row.end_time),
    room: row.room,
    mode: row.mode,
    status: row.status
  }));

  const certificates = certificateRows[0].map((row) => ({
    credentialId: row.credential_id,
    studentName: row.student_name,
    userEmail: row.user_email,
    course: row.course,
    issuedAt: dateValue(row.issued_at),
    status: row.status
  }));

  const classBreakdown = students.reduce<Record<string, number>>((result, student) => {
    const className = String(student.classLevel || "Not assigned");
    result[className] = (result[className] ?? 0) + 1;
    return result;
  }, {});
  const classBreakdownRows = teacher.assignedClasses.length
    ? teacher.assignedClasses.map((classLevel) => ({ classLevel, total: classBreakdown[classLevel] ?? 0 }))
    : Object.entries(classBreakdown).map(([classLevel, total]) => ({ classLevel, total }));

  const now = Date.now();
  const upcomingClasses = schedule.filter((item) => {
    const time = new Date(String(item.startTime)).getTime();
    return Number.isNaN(time) ? true : time >= now;
  });

  return {
    teacher: {
      id: teacher.id,
      name: teacher.teacherName,
      email: teacher.email,
      schoolId: teacher.schoolId,
      schoolName: teacher.schoolName,
      subject: teacher.subject,
      phone: teacher.phone,
      assignedClasses: teacher.assignedClasses,
      lastLoginAt: teacher.lastLoginAt
    },
    stats: {
      students: students.length,
      classes: classBreakdownRows.length,
      upcomingClasses: upcomingClasses.length,
      certificates: certificates.length,
      activeLogins: logins.filter((login) => login.status === "success" || login.status === "signup").length
    },
    classBreakdown: classBreakdownRows,
    students,
    schedule,
    logins,
    certificates
  };
}

export async function createOtp(data: { email: string; code: string; expiresAt: Date }) {
  const pool = await connectDb();
  if (!pool) return null;

  const otp = { id: id("otp"), ...data };
  await pool.query("INSERT INTO otps (id, email, code, expires_at) VALUES (?, ?, ?, ?)", [
    otp.id,
    otp.email,
    otp.code,
    otp.expiresAt
  ]);
  return otp;
}

export async function createLead(data: LeadRecord) {
  const pool = await connectDb();
  if (!pool) return null;

  const lead = { id: id("lead"), ...data, createdAt: new Date().toISOString() };
  await pool.query(
    `INSERT INTO leads (id, type, name, email, phone, school, city, message, class_level, class_name, interest)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      lead.id,
      data.type,
      data.name ?? null,
      data.email,
      data.phone ?? null,
      data.school ?? null,
      data.city ?? null,
      data.message ?? null,
      data.classLevel ?? null,
      data.classLevel ?? null,
      data.interest ?? null
    ]
  );
  return lead;
}

export async function createPayment(data: PaymentRecord) {
  const pool = await connectDb();
  if (!pool) return null;

  const paymentId = String(data.id ?? id("payment"));
  await pool.query(
    `INSERT INTO payments (id, user_email, plan, amount, currency, razorpay_order_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      paymentId,
      data.userEmail,
      data.plan,
      data.amount,
      data.currency ?? "INR",
      data.razorpayOrderId,
      data.status ?? "created"
    ]
  );
  return paymentId;
}

export async function markPaymentPaid(data: {
  orderId: string;
  userEmail: string;
  plan: string;
  paymentId: string;
  receiptUrl: string;
}) {
  const pool = await connectDb();
  if (!pool) return;

  await pool.query(
    `UPDATE payments
     SET status = 'paid', razorpay_payment_id = ?, receipt_url = ?
     WHERE razorpay_order_id = ?`,
    [data.paymentId, data.receiptUrl, data.orderId]
  );

  const [paymentRows] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM payments WHERE razorpay_order_id = ? LIMIT 1",
    [data.orderId]
  );
  await pool.query(
    `INSERT INTO enrollments (id, user_email, course_title, payment_id, status, enrolled_at)
     VALUES (?, ?, ?, ?, 'active', NOW())`,
    [id("enrollment"), data.userEmail, data.plan, paymentRows[0]?.id ?? null]
  );

  const user = await findUserByEmail(data.userEmail);
  if (!user) return;

  const courses = [...new Set([...(user.unlockedCourses ?? []), data.plan])];
  await pool.query("UPDATE users SET unlocked_courses = ? WHERE email = ?", [JSON.stringify(courses), data.userEmail]);
}

export async function createCertificate(data: CertificateRecord) {
  const pool = await connectDb();
  if (!pool) return null;

  await pool.query(
    `INSERT INTO certificates (credential_id, student_name, user_email, course, qr_code, issued_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.credentialId,
      data.studentName,
      data.userEmail,
      data.course,
      data.qrCode,
      data.issuedAt,
      data.status ?? "active"
    ]
  );
}

export async function getCertificateById(credentialId: string) {
  const pool = await connectDb();
  if (!pool) return null;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT credential_id, student_name, user_email, course, qr_code, issued_at, status, created_at
     FROM certificates
     WHERE credential_id = ?
     LIMIT 1`,
    [credentialId]
  );

  const row = rows[0];
  if (!row) return null;

  return {
    credentialId: row.credential_id,
    studentName: row.student_name,
    userEmail: row.user_email,
    course: row.course,
    qrCode: row.qr_code,
    issuedAt: dateValue(row.issued_at),
    status: row.status,
    createdAt: dateValue(row.created_at)
  };
}

export async function getStudentDashboardData(email?: string) {
  const pool = await connectDb();

  if (!pool) {
    return {
      dashboard: createEmptyDashboardData(),
      mode: "dev"
    };
  }

  const user = email ? await findUserByEmail(email) : null;
  const dashboard = await buildLiveStudentDashboard(pool, user);

  return {
    dashboard,
    mode: "mysql"
  };
}

async function buildLiveStudentDashboard(pool: Pool, user: UserRecord | null): Promise<DashboardData> {
  const [studentCountRows] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS count FROM users WHERE role = 'student'"
  );

  const totalStudents = Number(studentCountRows[0]?.count ?? 0);
  const dashboard = createEmptyDashboardData({
    name: user?.name ?? "Student",
    class: user?.classLevel || "Not assigned",
    avatar: user?.name ? initials(user.name) : "S",
    totalStudents,
  });

  dashboard.studentData.aiInsight = "No learning activity has been recorded yet.";
  dashboard.metricCards = dashboard.metricCards.map((card) =>
    card.id === "rank" ? { ...card, value: totalStudents > 0 ? "-" : "0" } : card
  );

  if (!user?.email) return dashboard;

  const [enrollmentRows, certificateRows, loginRows, paidPaymentRows] = await Promise.all([
    pool.query<RowDataPacket[]>(
      `SELECT id, course_title, status, enrolled_at, created_at
       FROM enrollments
       WHERE user_email = ?
       ORDER BY enrolled_at DESC, created_at DESC`,
      [user.email]
    ),
    pool.query<RowDataPacket[]>(
      `SELECT credential_id, course, issued_at, status, created_at
       FROM certificates
       WHERE user_email = ?
       ORDER BY created_at DESC`,
      [user.email]
    ),
    pool.query<RowDataPacket[]>(
      `SELECT created_at
       FROM login_events
       WHERE email = ? AND status IN ('success', 'signup')
       ORDER BY created_at DESC
       LIMIT 30`,
      [user.email]
    ),
    pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS count
       FROM payments
       WHERE user_email = ? AND status = 'paid'`,
      [user.email]
    )
  ]);

  const enrollments = enrollmentRows[0];
  const certificates = certificateRows[0];
  const loginEvents = loginRows[0];
  const paidPayments = Number(paidPaymentRows[0][0]?.count ?? 0);
  const earnedCount = certificates.length;

  dashboard.studentData.rollNumber = user.id;
  dashboard.studentData.aiInsight =
    loginEvents.length > 0
      ? "Your activity has started. More reports will appear when classes, homework, tests, and attendance are recorded."
      : "No learning activity has been recorded yet.";
  dashboard.weeklyProgress = {
    score: 0,
    consistency: loginEvents.length > 0 ? Math.min(100, loginEvents.length * 10) : 0,
    streak: 0,
    classPercentile: 0,
  };

  dashboard.futureSkills = enrollments.map<FutureSkill>((row, index) => ({
    id: String(row.id ?? `enrollment-${index}`),
    title: String(row.course_title ?? "Course"),
    progress: 0,
    level: String(row.status ?? "active"),
    badges: certificates.filter((certificate) => certificate.course === row.course_title).length,
    nextMilestone: "Start learning activity",
    color: ["blue", "purple", "emerald", "orange"][index % 4],
    icon: "book-open",
  }));

  dashboard.achievements = certificates.map<Achievement>((row, index) => ({
    id: String(row.credential_id ?? `certificate-${index}`),
    title: String(row.course ?? "Certificate"),
    description: "Certificate issued from ADYAPAN records.",
    icon: "trophy",
    color: "yellow",
    earned: true,
    date: dateValue(row.issued_at ?? row.created_at) as string,
  }));

  dashboard.quickAccessCards = dashboard.quickAccessCards.map((card) => {
    if (card.id === "skills") {
      return { ...card, stat: earnedCount > 0 ? `${earnedCount}` : "0", statLabel: "Certificates" };
    }

    if (card.id === "gamified") {
      return { ...card, stat: String(paidPayments), statLabel: "Paid Plans" };
    }

    return card;
  });

  return dashboard;
}

export async function getAdminOverview() {
  const pool = await connectDb();
  if (!pool) return null;

  const [
    studentRows,
    leadRows,
    paymentRows,
    certificateRows,
    loginRows,
    dashboardRows,
    schoolRows,
    principalRows,
    teacherRows,
    teacherLoginRows,
    teacherSessionRows,
    principalLoginRows
  ] = await Promise.all([
    pool.query<RowDataPacket[]>("SELECT * FROM users WHERE role = 'student' ORDER BY created_at DESC LIMIT 250"),
    pool.query<RowDataPacket[]>("SELECT * FROM leads ORDER BY created_at DESC LIMIT 250"),
    pool.query<RowDataPacket[]>("SELECT * FROM payments ORDER BY created_at DESC LIMIT 250"),
    pool.query<RowDataPacket[]>(
      "SELECT credential_id, student_name, user_email, course, issued_at, status, created_at FROM certificates ORDER BY created_at DESC LIMIT 250"
    ),
    pool.query<RowDataPacket[]>("SELECT * FROM login_events ORDER BY created_at DESC LIMIT 250"),
    pool.query<RowDataPacket[]>(
      "SELECT id, user_email, source, created_at, updated_at FROM dashboard_snapshots ORDER BY updated_at DESC LIMIT 100"
    ),
    pool.query<RowDataPacket[]>("SELECT * FROM schools ORDER BY updated_at DESC, created_at DESC LIMIT 250"),
    pool.query<RowDataPacket[]>(
      `SELECT id, email, school_id, school_name, principal_name, phone, status, last_login_at, created_at, updated_at
       FROM principals
       ORDER BY updated_at DESC, created_at DESC
       LIMIT 250`
    ),
    pool.query<RowDataPacket[]>(
      `SELECT id, email, school_id, school_name, teacher_name, subject, phone, assigned_classes, status, last_login_at, created_at, updated_at
       FROM teachers
       ORDER BY updated_at DESC, created_at DESC
       LIMIT 250`
    ),
    pool.query<RowDataPacket[]>(
      `SELECT id, teacher_id, email, school_id, status, created_at
       FROM teacher_login_events
       ORDER BY created_at DESC
       LIMIT 500`
    ),
    pool.query<RowDataPacket[]>(
      `SELECT id, teacher_id, title, class_level, subject, start_time, end_time, room, mode, status
       FROM teacher_class_sessions
       ORDER BY start_time DESC
       LIMIT 500`
    ),
    pool.query<RowDataPacket[]>(
      `SELECT id, principal_id, email, school_id, status, created_at
       FROM principal_login_events
       ORDER BY created_at DESC
       LIMIT 250`
    )
  ]);

  const students = studentRows[0].map(mapUser);
  const leads = leadRows[0].map((row) => ({
    id: row.id,
    type: row.type,
    name: row.name,
    email: row.email,
    phone: row.phone,
    school: row.school,
    city: row.city,
    message: row.message,
    classLevel: row.class_level,
    interest: row.interest,
    createdAt: dateValue(row.created_at)
  }));
  const payments = paymentRows[0].map((row) => ({
    id: row.id,
    userEmail: row.user_email,
    plan: row.plan,
    amount: Number(row.amount),
    currency: row.currency,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    status: row.status,
    receiptUrl: row.receipt_url,
    createdAt: dateValue(row.created_at)
  }));
  const certificates = certificateRows[0].map((row) => ({
    credentialId: row.credential_id,
    studentName: row.student_name,
    userEmail: row.user_email,
    course: row.course,
    issuedAt: dateValue(row.issued_at),
    status: row.status,
    createdAt: dateValue(row.created_at)
  }));
  const loginEvents = loginRows[0].map((row) => ({
    id: row.id,
    userId: row.user_id,
    email: row.email,
    name: row.name,
    role: row.role,
    source: row.source ?? "web",
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    status: row.status,
    createdAt: dateValue(row.created_at)
  }));
  const dashboardSnapshots = dashboardRows[0].map((row) => ({
    id: row.id,
    userEmail: row.user_email,
    source: row.source,
    createdAt: dateValue(row.created_at),
    updatedAt: dateValue(row.updated_at)
  }));
  const schoolLeads = leads.filter((lead) => lead.type === "school" || lead.school);
  const registeredSchools = schoolRows[0].map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    address: row.address,
    contactPerson: row.contact_person,
    status: row.status,
    createdAt: dateValue(row.created_at),
    updatedAt: dateValue(row.updated_at)
  }));
  const schoolNames = new Set<string>();
  for (const school of registeredSchools) {
    if (school.name) schoolNames.add(String(school.name));
  }
  for (const student of students) {
    if (student.schoolName) schoolNames.add(String(student.schoolName));
  }
  for (const lead of schoolLeads) {
    if (lead.school) schoolNames.add(String(lead.school));
  }
  for (const row of principalRows[0]) {
    if (row.school_name) schoolNames.add(String(row.school_name));
  }
  for (const row of teacherRows[0]) {
    if (row.school_name) schoolNames.add(String(row.school_name));
  }

  const principals = principalRows[0].map((row) => ({
    id: row.id,
    email: row.email,
    schoolId: row.school_id,
    schoolName: row.school_name,
    name: row.principal_name,
    phone: row.phone,
    status: row.status,
    lastLoginAt: dateValue(row.last_login_at),
    createdAt: dateValue(row.created_at),
    updatedAt: dateValue(row.updated_at)
  }));

  const teachers = teacherRows[0].map((row) => ({
    id: row.id,
    email: row.email,
    schoolId: row.school_id,
    schoolName: row.school_name,
    name: row.teacher_name,
    subject: row.subject,
    phone: row.phone,
    assignedClasses: parseAssignedClasses(row.assigned_classes),
    status: row.status,
    lastLoginAt: dateValue(row.last_login_at),
    createdAt: dateValue(row.created_at),
    updatedAt: dateValue(row.updated_at)
  }));

  const teacherLoginEvents = teacherLoginRows[0].map((row) => ({
    id: row.id,
    teacherId: row.teacher_id,
    email: row.email,
    schoolId: row.school_id,
    status: row.status,
    createdAt: dateValue(row.created_at)
  }));
  const teacherSessions = teacherSessionRows[0].map((row) => ({
    id: row.id,
    teacherId: row.teacher_id,
    title: row.title,
    classLevel: row.class_level,
    subject: row.subject,
    startTime: dateValue(row.start_time),
    endTime: dateValue(row.end_time),
    room: row.room,
    mode: row.mode,
    status: row.status
  }));
  const principalLoginEvents = principalLoginRows[0].map((row) => ({
    id: row.id,
    principalId: row.principal_id,
    email: row.email,
    schoolId: row.school_id,
    status: row.status,
    createdAt: dateValue(row.created_at)
  }));

  const schools = Array.from(schoolNames).map((name) => {
    const registered = registeredSchools.find((school) => school.name === name);
    const schoolStudents = students.filter((student) => student.schoolName === name);
    const schoolTeachers = teachers.filter((teacher) => teacher.schoolName === name);
    const schoolPrincipals = principals.filter((principal) => principal.schoolName === name);
    const schoolPayments = payments.filter((payment) =>
      schoolStudents.some((student) => student.email === payment.userEmail)
    );
    const schoolCertificates = certificates.filter((certificate) =>
      schoolStudents.some((student) => student.email === certificate.userEmail)
    );
    const schoolLeadCount = schoolLeads.filter((lead) => lead.school === name).length;

    return {
      id: registered?.id ?? name,
      name,
      city: registered?.city ?? null,
      email: registered?.email ?? null,
      phone: registered?.phone ?? null,
      contactPerson: registered?.contactPerson ?? null,
      status: registered?.status ?? (schoolStudents.length || schoolTeachers.length || schoolPrincipals.length ? "active" : "lead"),
      students: schoolStudents.length,
      teachers: schoolTeachers.length,
      principals: schoolPrincipals.length,
      leads: schoolLeadCount,
      payments: schoolPayments.length,
      certificates: schoolCertificates.length,
      revenue: schoolPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      updatedAt: registered?.updatedAt ?? registered?.createdAt ?? null
    };
  }).sort((first, second) => Number(second.students) - Number(first.students));

  const teacherPerformance = teachers.map((teacher) => {
    const assignedStudents = students.filter((student) => {
      if (student.schoolName !== teacher.schoolName) return false;
      if (!teacher.assignedClasses.length) return true;
      return teacher.assignedClasses.includes(String(student.classLevel || ""));
    });
    const sessions = teacherSessions.filter((session) => session.teacherId === teacher.id);
    const successfulLogins = teacherLoginEvents.filter((event) => event.teacherId === teacher.id && event.status === "success").length;
    const certificatesIssued = certificates.filter((certificate) =>
      assignedStudents.some((student) => student.email === certificate.userEmail)
    ).length;

    return {
      teacherId: teacher.id,
      name: teacher.name,
      email: teacher.email,
      schoolName: teacher.schoolName,
      subject: teacher.subject,
      assignedClasses: teacher.assignedClasses,
      students: assignedStudents.length,
      sessions: sessions.length,
      successfulLogins,
      certificates: certificatesIssued,
      lastLoginAt: teacher.lastLoginAt,
      status: teacher.status,
      score: Math.min(100, sessions.length * 12 + successfulLogins * 8 + certificatesIssued * 5 + assignedStudents.length)
    };
  }).sort((first, second) => Number(second.score) - Number(first.score));

  const paidPayments = payments.filter((payment) => payment.status === "paid");
  const revenue = paidPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const activeStudents = new Set(loginEvents.filter((event) => event.status === "success").map((event) => event.email)).size;

  return {
    totals: {
      connections: schools.length + students.length + teachers.length + principals.length,
      schools: schools.length,
      students: students.length,
      teachers: teachers.length,
      principals: principals.length,
      leads: leads.length,
      payments: payments.length,
      paidPayments: paidPayments.length,
      certificates: certificates.length,
      revenue,
      activeStudents,
      teacherSessions: teacherSessions.length,
      teacherLogins: teacherLoginEvents.filter((event) => event.status === "success").length,
      principalLogins: principalLoginEvents.filter((event) => event.status === "success").length
    },
    schools,
    principals,
    teachers,
    teacherPerformance,
    teacherSessions,
    teacherLoginEvents,
    principalLoginEvents,
    students,
    leads,
    payments,
    certificates,
    loginEvents,
    dashboardSnapshots,
    tables: [
      { name: "schools", label: "Schools", rows: schools },
      { name: "principals", label: "Principals", rows: principals },
      { name: "teachers", label: "Teachers", rows: teachers },
      { name: "teacher_performance", label: "Teacher Performance", rows: teacherPerformance },
      { name: "students", label: "Students", rows: students },
      { name: "leads", label: "Leads", rows: leads },
      { name: "payments", label: "Payments", rows: payments },
      { name: "certificates", label: "Certificates", rows: certificates },
      { name: "login_events", label: "Login Events", rows: loginEvents },
      { name: "teacher_login_events", label: "Teacher Login Events", rows: teacherLoginEvents },
      { name: "principal_login_events", label: "Principal Login Events", rows: principalLoginEvents },
      { name: "dashboard_snapshots", label: "Dashboard Snapshots", rows: dashboardSnapshots }
    ]
  };
}
