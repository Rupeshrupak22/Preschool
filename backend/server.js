const fs = require("fs");
const http = require("http");
const path = require("path");
const mysql = require("mysql2/promise");

const PORT = Number(process.env.PORT || 4000);
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

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "preschool",
  ssl: mysqlSslConfig(),
  waitForConnections: true,
  connectionLimit: 5
});

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function id(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function errorMessage(error) {
  if (error && typeof error.message === "string" && error.message) return error.message;
  if (Array.isArray(error?.errors)) {
    return error.errors.map((item) => item.message || item.code).filter(Boolean).join("; ");
  }
  return "Unknown error";
}

const routes = {
  "/api/health": async () => {
    try {
      await pool.query("SELECT 1");
      return {
        ok: true,
        service: "ADYAPAN backend",
        status: "running",
        database: "mysql"
      };
    } catch (error) {
      return {
        ok: false,
        service: "ADYAPAN backend",
        status: "running",
        database: "unreachable",
        error: errorMessage(error)
      };
    }
  },
  "/api/modules": async () => ({
    ok: true,
    modules: [
      "auth",
      "students",
      "courses",
      "certificates",
      "payments",
      "schools",
      "notifications"
    ]
  }),
  "/api/leads": async (request) => {
    if (request.method !== "POST") {
      return { ok: false, error: "Method not allowed" };
    }

    const body = await readBody(request);
    if (!body.email || !String(body.email).includes("@")) {
      return { ok: false, error: "Valid email required." };
    }

    const lead = {
      id: id("lead"),
      type: body.type || "demo",
      name: body.name || null,
      email: body.email,
      phone: body.phone || null,
      school: body.school || null,
      city: body.city || null,
      message: body.message || null,
      classLevel: body.classLevel || null,
      interest: body.interest || null
    };

    await pool.query(
      `INSERT INTO leads (id, type, name, email, phone, school, city, message, class_level, interest)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lead.id,
        lead.type,
        lead.name,
        lead.email,
        lead.phone,
        lead.school,
        lead.city,
        lead.message,
        lead.classLevel,
        lead.interest
      ]
    );

    return { ok: true, lead, mode: "mysql" };
  }
};

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization"
  });
  response.end(JSON.stringify(body));
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  const handler = routes[url.pathname];

  if (!handler) {
    sendJson(response, 404, {
      error: "Route not found",
      path: url.pathname
    });
    return;
  }

  try {
    const body = await handler(request);
    sendJson(response, url.pathname === "/api/health" ? 200 : body.ok === false ? 400 : 200, body);
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      error: errorMessage(error)
    });
  }
});

server.listen(PORT, () => {
  console.log(`ADYAPAN backend running on http://localhost:${PORT}`);
});
