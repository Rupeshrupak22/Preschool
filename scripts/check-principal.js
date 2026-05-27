const fs = require("fs");
const path = require("path");
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

async function main() {
  const email = process.argv[2] || process.env.PRINCIPAL_EMAIL || "rupeshrupak609@gmail.com";
  const config = dbConfig();
  const connection = await mysql.createConnection(config);

  const [principals] = await connection.query(
    `SELECT id, email, school_id, school_name, principal_name, status, last_login_at, created_at
     FROM principals
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  const [events] = await connection.query(
    `SELECT email, school_id, status, created_at
     FROM principal_login_events
     WHERE email = ?
     ORDER BY created_at DESC
     LIMIT 8`,
    [email]
  );

  await connection.end();
  console.log(JSON.stringify({ principal: principals[0] || null, recentLoginEvents: events }, null, 2));
}

main().catch((error) => {
  console.error(error.code || error.name, error.message);
  process.exit(1);
});
