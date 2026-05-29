const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const rootDir = path.resolve(__dirname, "..");
const envFiles = [path.join(rootDir, ".env"), path.join(rootDir, "frontend", ".env.local")];

for (const file of envFiles) {
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

async function main() {
  const sqlPath = path.join(rootDir, "scripts", "mysql-schema.sql");
  const schema = fs.readFileSync(sqlPath, "utf8");
  const caPath = process.env.MYSQL_SSL_CA_PATH;
  const ca =
    process.env.MYSQL_SSL_CA ||
    (caPath && fs.existsSync(caPath) ? fs.readFileSync(caPath, "utf8") : undefined);
  const sslEnabled =
    process.env.MYSQL_SSL === "true" ||
    Boolean(ca) ||
    String(process.env.MYSQL_HOST || "").includes("tidbcloud.com");

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    ssl: sslEnabled
      ? ca
        ? { ca, minVersion: "TLSv1.2", rejectUnauthorized: true }
        : { minVersion: "TLSv1.2", rejectUnauthorized: true }
      : undefined,
    multipleStatements: true
  });

  try {
    await connection.query(schema);
    const database = process.env.MYSQL_DATABASE || "preschool";
    await ensureColumn(connection, database, "users", "class_name", "VARCHAR(80)");
    await ensureColumn(connection, database, "users", "school", "VARCHAR(190)");
    await ensureColumn(connection, database, "students", "class_name", "VARCHAR(80)");
    await ensureColumn(connection, database, "students", "school", "VARCHAR(190)");
    await ensureColumn(connection, database, "leads", "class_name", "VARCHAR(80)");
    await ensureColumn(connection, database, "principals", "last_login_at", "DATETIME");
    await ensureColumn(connection, database, "teachers", "subject", "VARCHAR(120)");
    await ensureColumn(connection, database, "teachers", "phone", "VARCHAR(30)");
    await ensureColumn(connection, database, "teachers", "assigned_classes", "JSON");
    await ensureColumn(connection, database, "teachers", "last_login_at", "DATETIME");
    const [tables] = await connection.query(`SHOW TABLES FROM \`${database}\``);

    console.log(`MySQL schema initialized for database '${database}'.`);
    for (const row of tables) {
      console.log(`- ${Object.values(row)[0]}`);
    }
  } finally {
    await connection.end();
  }
}

async function ensureColumn(connection, database, tableName, columnName, definition) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ?
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [database, tableName, columnName]
  );

  if (Number(rows[0]?.count ?? 0) === 0) {
    await connection.query(`ALTER TABLE \`${database}\`.\`${tableName}\` ADD COLUMN \`${columnName}\` ${definition}`);
  }
}

main().catch((error) => {
  console.error("MySQL initialization failed:");
  console.error(error.message);
  process.exit(1);
});
