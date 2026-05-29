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

async function ensureAdminTables(pool) {
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
}

async function hasColumn(pool, tableName, columnName) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );

  return Number(rows[0]?.count ?? 0) > 0;
}

async function main() {
  const config = dbConfig();
  const pool =
    typeof config === "string"
      ? await mysql.createPool(config)
      : await mysql.createPool({ ...config, waitForConnections: true, connectionLimit: 5 });
  await ensureAdminTables(pool);

  const admin = {
    id: process.env.ADMIN_ID || "admin_adyapan_ops",
    name: process.env.ADMIN_NAME || "ADYAPAN Admin",
    email: process.env.ADMIN_EMAIL || "admin@adyapan.com",
    phone: process.env.ADMIN_PHONE || null,
    password: process.env.ADMIN_PASSWORD || "Admin@609!2026"
  };
  const passwordHash = await bcrypt.hash(admin.password, 12);
  const hasLegacyPasswordColumn = await hasColumn(pool, "users", "password");
  const columns = [
    "id",
    "name",
    "email",
    "password_hash",
    ...(hasLegacyPasswordColumn ? ["password"] : []),
    "phone",
    "role",
    "signup_source",
    "otp_verified"
  ];
  const values = [
    admin.id,
    admin.name,
    admin.email,
    passwordHash,
    ...(hasLegacyPasswordColumn ? [passwordHash] : []),
    admin.phone,
    "admin",
    "seed",
    true
  ];

  await pool.query(
    `INSERT INTO users (${columns.join(", ")})
     VALUES (${columns.map(() => "?").join(", ")})
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       password_hash = VALUES(password_hash),
       ${hasLegacyPasswordColumn ? "password = VALUES(password)," : ""}
       phone = VALUES(phone),
       role = 'admin',
       otp_verified = TRUE`,
    values
  );

  await pool.end();

  console.log("Admin account ready");
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${admin.password}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
