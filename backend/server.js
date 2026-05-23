const http = require("http");

const PORT = Number(process.env.PORT || 4000);

const routes = {
  "/api/health": () => ({
    ok: true,
    service: "ADYAPAN backend",
    status: "running"
  }),
  "/api/modules": () => ({
    modules: [
      "auth",
      "students",
      "courses",
      "certificates",
      "payments",
      "schools",
      "notifications"
    ]
  })
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

const server = http.createServer((request, response) => {
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

  sendJson(response, 200, handler());
});

server.listen(PORT, () => {
  console.log(`ADYAPAN backend running on http://localhost:${PORT}`);
});
