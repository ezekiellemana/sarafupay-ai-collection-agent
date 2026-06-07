import "dotenv/config";

import { createServer, type ServerResponse } from "node:http";

const DEFAULT_PORT = 3000;
const parsedPort = Number.parseInt(process.env.PORT ?? "", 10);
const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : DEFAULT_PORT;

function sendJson(
  response: ServerResponse,
  statusCode: number,
  payload: Record<string, unknown>,
): void {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

const server = createServer((request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, {
      status: "ok",
      service: "sarafupay-ai-collection-agent",
    });
    return;
  }

  if (request.method === "GET" && request.url === "/api/agent/status") {
    sendJson(response, 200, {
      service: "sarafupay-ai-collection-agent",
      qwenCloudIntegration: "planned",
      alibabaCloudDeployment: "planned",
      humanReviewRequired: true,
    });
    return;
  }

  sendJson(response, 404, {
    error: "Not found",
  });
});

server.listen(port, () => {
  console.log(`SarafuPay AI Collection Agent starter listening on port ${port}.`);
});
