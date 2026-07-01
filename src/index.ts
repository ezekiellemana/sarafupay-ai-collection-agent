import "dotenv/config";

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import { generateCollectionSummary, type CollectionSummaryInput } from "./services/collectionAgent.js";
import { QWEN_MODEL } from "./lib/qwen.js";

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

function readJsonBody(request: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
    });
    request.on("end", () => {
      if (!raw.trim()) {
        resolve(undefined);
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function isCollectionSummaryInput(body: unknown): body is CollectionSummaryInput {
  if (typeof body !== "object" || body === null) {
    return false;
  }
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate.collectionName === "string" &&
    typeof candidate.targetAmount === "number" &&
    typeof candidate.collectedAmount === "number" &&
    typeof candidate.currency === "string" &&
    typeof candidate.paymentsCount === "number"
  );
}

async function handleCollectionSummary(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch {
    sendJson(response, 400, { success: false, error: "Request body must be valid JSON." });
    return;
  }

  if (!isCollectionSummaryInput(body)) {
    sendJson(response, 400, {
      success: false,
      error:
        "Request body must include collectionName, targetAmount, collectedAmount, currency, and paymentsCount.",
    });
    return;
  }

  try {
    const summary = await generateCollectionSummary(body);
    sendJson(response, 200, {
      success: true,
      summary,
      model: QWEN_MODEL,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "QWEN_API_KEY is not configured") {
      sendJson(response, 500, { success: false, error: error.message });
      return;
    }
    console.error("Qwen collection summary request failed:", error);
    sendJson(response, 500, {
      success: false,
      error: "Failed to generate collection summary.",
    });
  }
}

const server = createServer((request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, {
      success: true,
      service: "sarafupay-ai-collection-agent",
      status: "ok",
    });
    return;
  }

  if (request.method === "GET" && request.url === "/api/agent/status") {
    sendJson(response, 200, {
      service: "sarafupay-ai-collection-agent",
      qwenCloudIntegration: "implemented",
      alibabaCloudDeployment: "planned",
      humanReviewRequired: true,
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/agent/collection-summary") {
    void handleCollectionSummary(request, response);
    return;
  }

  sendJson(response, 404, {
    error: "Not found",
  });
});

server.listen(port, () => {
  console.log(`SarafuPay AI Collection Agent starter listening on port ${port}.`);
});
