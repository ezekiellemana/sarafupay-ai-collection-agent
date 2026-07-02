import OpenAI from "openai";

const DEFAULT_QWEN_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
const DEFAULT_QWEN_MODEL = "qwen3.7-plus";

export const QWEN_BASE_URL = process.env.QWEN_BASE_URL ?? DEFAULT_QWEN_BASE_URL;
export const QWEN_MODEL = process.env.QWEN_MODEL ?? DEFAULT_QWEN_MODEL;

let cachedClient: OpenAI | null = null;

export function getQwenClient(): OpenAI {
  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) {
    throw new Error("QWEN_API_KEY is not configured");
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({
      apiKey,
      baseURL: QWEN_BASE_URL,
    });
  }

  return cachedClient;
}

export function isQwenApiKeyConfigured(): boolean {
  return Boolean(process.env.QWEN_API_KEY);
}

export function getQwenBaseUrlHost(): string {
  try {
    return new URL(QWEN_BASE_URL).host;
  } catch {
    return "invalid-base-url";
  }
}

/** Summarizes a Qwen API failure for server logs only — never includes the API key. */
export function describeQwenError(error: unknown): Record<string, unknown> {
  const details: Record<string, unknown> = {
    model: QWEN_MODEL,
    baseUrlHost: getQwenBaseUrlHost(),
    apiKeyConfigured: isQwenApiKeyConfigured(),
  };

  if (error instanceof Error) {
    details.name = error.name;
    details.message = error.message;
  }

  if (error && typeof error === "object") {
    const candidate = error as Record<string, unknown>;
    if ("status" in candidate) details.status = candidate.status;
    if ("code" in candidate) details.code = candidate.code;
    if ("type" in candidate) details.type = candidate.type;
  }

  return details;
}
