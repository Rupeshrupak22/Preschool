import fs from "node:fs";
import mysql, { type Pool, type PoolOptions, type RowDataPacket } from "mysql2/promise";
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
      school_name VARCHAR(190),
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
      school_name VARCHAR(190),
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

  await ensureColumn(pool, "users", "signup_source", "VARCHAR(40) NOT NULL DEFAULT 'web'");
  await ensureColumn(pool, "students", "signup_source", "VARCHAR(40) NOT NULL DEFAULT 'web'");
  await ensureColumn(pool, "login_events", "source", "VARCHAR(40) NOT NULL DEFAULT 'web'");
}

async function ensureColumn(pool: Pool, tableName: string, columnName: string, definition: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );

  if (Number(rows[0]?.count ?? 0) === 0) {
    await pool.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
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

function dateValue(value: unknown) {
  return (value as { toISOString?: () => string })?.toISOString?.() ?? value;
}

function mapUser(row: RowDataPacket): UserRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    passwordHash: String(row.password_hash),
    phone: row.phone,
    classLevel: row.class_level,
    schoolName: row.school_name,
    role: row.role === "admin" ? "admin" : "student",
    signupSource: row.signup_source ?? "web",
    otpVerified: Boolean(row.otp_verified),
    unlockedCourses: parseCourses(row.unlocked_courses),
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

  await pool.query(
    `UPDATE users
     SET name = ?, phone = ?, class_level = ?, school_name = ?
     WHERE email = ?`,
    [data.name, data.phone ?? null, data.classLevel ?? null, data.schoolName ?? null, email]
  );

  await pool.query(
    `UPDATE students
     SET name = ?, phone = ?, class_level = ?, school_name = ?
     WHERE email = ?`,
    [data.name, data.phone ?? null, data.classLevel ?? null, data.schoolName ?? null, email]
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

  await pool.query(
    `INSERT INTO users (id, name, email, password_hash, phone, class_level, school_name, role, signup_source, unlocked_courses)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      user.name,
      user.email,
      user.passwordHash,
      user.phone,
      user.classLevel,
      user.schoolName,
      user.role,
      user.signupSource,
      JSON.stringify(user.unlockedCourses)
    ]
  );

  if (user.role === "student") {
    await pool.query(
      `INSERT INTO students (id, user_id, name, email, phone, class_level, school_name, signup_source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         user_id = VALUES(user_id),
         name = VALUES(name),
         phone = VALUES(phone),
         class_level = VALUES(class_level),
         school_name = VALUES(school_name),
         signup_source = VALUES(signup_source)`,
      [id("student"), user.id, user.name, user.email, user.phone, user.classLevel, user.schoolName, user.signupSource]
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
    `INSERT INTO leads (id, type, name, email, phone, school, city, message, class_level, interest)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

export async function getAdminOverview() {
  const pool = await connectDb();
  if (!pool) return null;

  const [studentRows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE role = 'student' ORDER BY created_at DESC LIMIT 50"
  );
  const [leadRows] = await pool.query<RowDataPacket[]>("SELECT * FROM leads ORDER BY created_at DESC LIMIT 50");
  const [paymentRows] = await pool.query<RowDataPacket[]>("SELECT * FROM payments ORDER BY created_at DESC LIMIT 50");
  const [certificateRows] = await pool.query<RowDataPacket[]>(
    "SELECT credential_id, student_name, user_email, course, issued_at, status, created_at FROM certificates ORDER BY created_at DESC LIMIT 50"
  );
  const [loginRows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM login_events ORDER BY created_at DESC LIMIT 100"
  );

  const students = studentRows.map(mapUser);
  const leads = leadRows.map((row) => ({
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
  const payments = paymentRows.map((row) => ({
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
  const certificates = certificateRows.map((row) => ({
    credentialId: row.credential_id,
    studentName: row.student_name,
    userEmail: row.user_email,
    course: row.course,
    issuedAt: dateValue(row.issued_at),
    status: row.status,
    createdAt: dateValue(row.created_at)
  }));
  const loginEvents = loginRows.map((row) => ({
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

  return {
    students,
    leads,
    payments,
    certificates,
    loginEvents,
    tables: [
      { name: "students", label: "Students", rows: students },
      { name: "leads", label: "Leads", rows: leads },
      { name: "payments", label: "Payments", rows: payments },
      { name: "certificates", label: "Certificates", rows: certificates },
      { name: "login_events", label: "Login Events", rows: loginEvents }
    ]
  };
}
