# AI Agent Design

## Goal

The agent helps a collection owner understand support issues and decide on the next step. It does not replace SarafuPay's verified payment state and does not perform sensitive financial actions automatically.

## Workflow

1. The owner asks a support question.
2. The backend fetches safe payment and collection context.
3. Sensitive fields are masked.
4. Qwen Cloud receives a structured prompt.
5. The AI returns an issue summary and recommended next action.
6. The owner reviews the guidance before taking action.

## Planned Structured Prompt

```text
SYSTEM
You are the SarafuPay collection support assistant.
Use only the verified facts in CONTEXT.
Do not claim a payment succeeded unless status is "completed".
Do not request or reveal credentials or full personal information.
Return an issue summary, evidence, recommended next action, and whether
human review is required.

OWNER QUESTION
Why is a contributor's mobile-money payment still pending?

CONTEXT
Collection: School supplies campaign
Payment reference: payment_***42
Amount: TZS 25,000
Status: pending
Created: 18 minutes ago
Provider category: confirmation_timeout
Raw provider payload: omitted
Contributor phone: masked
```

## Example Output

```json
{
  "issueSummary": "The payment is still pending because provider confirmation has not arrived.",
  "verifiedFacts": [
    "The payment status in SarafuPay is pending.",
    "The payment was created 18 minutes ago.",
    "The normalized issue category is confirmation_timeout."
  ],
  "recommendedNextAction": "Wait for the configured confirmation window, then refresh verified payment status. If it remains pending, open a support case using the masked payment reference.",
  "humanReviewRequired": true,
  "limitations": "The agent cannot confirm whether funds moved without a verified provider callback."
}
```

## Additional Example Prompt

```text
OWNER QUESTION
Give me a short progress summary for this collection.

CONTEXT
Goal: TZS 2,000,000
Verified collected amount: TZS 1,250,000
Completed payments: 31
Pending payments: 3
Failed payments: 2
Personal contributor fields: omitted
```

## Additional Example Output

```text
The collection has reached 62.5% of its TZS 2,000,000 goal. There are
31 completed payments and 3 pending payments that may need status review.
Check the oldest pending payment first. Human review is required before
contacting contributors or changing any payment record.
```

## Safety Limits

- Never include API keys, access tokens, webhook secrets, passwords, or connection strings in prompts.
- Never send raw mobile-money or card-provider payloads to the model.
- Mask phone numbers, email addresses, names, and provider references unless strictly required.
- Enforce authentication and collection ownership before context retrieval.
- Use verified database status, not model inference, as the source of truth.
- Do not let the model mark payments complete, edit balances, issue refunds, approve withdrawals, or change accounts.
- Require owner review before sending contributor messages or escalating a support case.
- State uncertainty when context is incomplete or contradictory.
- Prevent prompt-injection content from overriding system safety rules or requesting unrelated data.
- Keep audit logs privacy-aware and free of full prompt payloads where sensitive context may appear.

## Planned Response Contract

The orchestrator should validate model output against a strict schema before showing it in the dashboard:

```ts
type SupportGuidance = {
  issueSummary: string;
  verifiedFacts: string[];
  recommendedNextAction: string;
  humanReviewRequired: boolean;
  limitations?: string;
};
```

Invalid or unsafe output should be rejected and replaced with a neutral message asking the owner to use the normal support workflow.
