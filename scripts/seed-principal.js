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

async function ensurePrincipalTables(pool) {
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
}

async function main() {
  const config = dbConfig();
  const pool =
    typeof config === "string"
      ? await mysql.createPool(config)
      : await mysql.createPool({ ...config, waitForConnections: true, connectionLimit: 5 });
  await ensurePrincipalTables(pool);

  const principal = {
    id: process.env.PRINCIPAL_ID || id("principal"),
    schoolId: process.env.PRINCIPAL_SCHOOL_ID || "ADM",
    schoolName: process.env.PRINCIPAL_SCHOOL_NAME || "ADM",
    principalName: process.env.PRINCIPAL_NAME || "Rupesh Rupak",
    email: process.env.PRINCIPAL_EMAIL || "rupeshrupak609@gmail.com",
    phone: process.env.PRINCIPAL_PHONE || null,
    password: process.env.PRINCIPAL_PASSWORD || "Principal@609!2026",
    schoolKey: process.env.PRINCIPAL_SCHOOL_KEY || "ADM-PRINCIPAL-609"
  };

  const passwordHash = await bcrypt.hash(principal.password, 12);
  const accessKeyHash = await bcrypt.hash(principal.schoolKey, 12);

  await pool.query(
    `INSERT INTO principals (id, school_id, school_name, principal_name, email, password_hash, access_key_hash, phone, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
     ON DUPLICATE KEY UPDATE
       school_id = VALUES(school_id),
       school_name = VALUES(school_name),
       principal_name = VALUES(principal_name),
       password_hash = VALUES(password_hash),
       access_key_hash = VALUES(access_key_hash),
       phone = VALUES(phone),
       status = 'active'`,
    [
      principal.id,
      principal.schoolId,
      principal.schoolName,
      principal.principalName,
      principal.email,
      passwordHash,
      accessKeyHash,
      principal.phone
    ]
  );

  await pool.end();

  console.log("Principal account ready");
  console.log(`Email: ${principal.email}`);
  console.log(`Password: ${principal.password}`);
  console.log(`School key: ${principal.schoolKey}`);
  console.log(`School: ${principal.schoolName}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
