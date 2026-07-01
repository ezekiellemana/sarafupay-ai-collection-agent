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
