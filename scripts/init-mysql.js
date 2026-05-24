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

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    multipleStatements: true
  });

  try {
    await connection.query(schema);
    const database = process.env.MYSQL_DATABASE || "preschool";
    const [tables] = await connection.query(`SHOW TABLES FROM \`${database}\``);

    console.log(`MySQL schema initialized for database '${database}'.`);
    for (const row of tables) {
      console.log(`- ${Object.values(row)[0]}`);
    }
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("MySQL initialization failed:");
  console.error(error.message);
  process.exit(1);
});
