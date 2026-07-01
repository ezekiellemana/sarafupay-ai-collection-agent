import { getQwenClient, QWEN_MODEL } from "../lib/qwen.js";

export interface RecentPayment {
  payerName: string;
  amount: number;
  status: string;
}

export interface CollectionSummaryInput {
  collectionName: string;
  targetAmount: number;
  collectedAmount: number;
  currency: string;
  paymentsCount: number;
  recentPayments?: RecentPayment[];
}

function buildPrompt(input: CollectionSummaryInput): string {
  const progressPercent =
    input.targetAmount > 0
      ? ((input.collectedAmount / input.targetAmount) * 100).toFixed(1)
      : "0.0";

  const recentPaymentsText =
    input.recentPayments && input.recentPayments.length > 0
      ? input.recentPayments
          .map((payment) => `- ${payment.payerName}: ${payment.amount} ${input.currency} (${payment.status})`)
          .join("\n")
      : "No recent payment activity provided.";

  return `You are a fintech collection monitoring agent for SarafuPay, supporting collection owners in Tanzania.

Collection: ${input.collectionName}
Target amount: ${input.targetAmount} ${input.currency}
Collected so far: ${input.collectedAmount} ${input.currency} (${progressPercent}% of target)
Payments received: ${input.paymentsCount}

Recent payment activity:
${recentPaymentsText}

Write a short summary in clear business English covering:
1. Collection progress
2. Payment activity
3. Any possible concerns
4. One simple next action for the collection owner

Keep it concise (under 150 words).`;
}

export async function generateCollectionSummary(input: CollectionSummaryInput): Promise<string> {
  const client = getQwenClient();

  const completion = await client.chat.completions.create({
    model: QWEN_MODEL,
    messages: [{ role: "user", content: buildPrompt(input) }],
  });

  return completion.choices[0]?.message?.content?.trim() ?? "";
}
