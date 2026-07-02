# SarafuPay AI Collection Agent

> An AI agent that helps collection owners monitor payments, detect pending mobile-money issues, answer contributor questions, and suggest next support actions.

SarafuPay AI Collection Agent is a hackathon project being built as an AI support layer on top of the existing SarafuPay collection and payment platform. The repository contains a working Qwen Cloud integration for collection progress summaries, plus the documentation needed to guide the Alibaba Cloud deployment. The scope is intentionally limited to the AI agent and Qwen Cloud integration for Track 4 (Autopilot Agent) — this is not a full rebuild of the SarafuPay platform.

## The Problem

Collection owners often have to piece together payment status, pending mobile-money confirmations, contributor questions, and support follow-up across multiple screens and provider responses. This makes it difficult to quickly understand what happened and decide what to do next.

## The Solution

The project adds an AI support assistant for collection owners. It is designed to receive privacy-filtered collection and payment context, summarize the issue, answer support questions, and recommend a next action. Sensitive or consequential actions remain subject to human review.

## Main Features

- Collection progress summaries
- Pending payment issue analysis
- Contributor support question handling
- Suggested next support actions
- Privacy-aware AI prompts
- Human review before sensitive action

## Hackathon

- **Event:** Global AI Hackathon Series with Qwen Cloud
- **Track:** Track 4 - Autopilot Agent
- **Project:** SarafuPay AI Collection Agent

## Current Status

This repository is an honest implementation status:

- The TypeScript service and health endpoint are available.
- Qwen Cloud API integration is implemented and verified working both locally and on the live deployment.
- The backend is deployed and verified on Alibaba Cloud ECS at `http://47.87.133.172:3000` (see [Alibaba Cloud Deployment](#alibaba-cloud-deployment) below). Screenshot proof is still pending.
- The existing SarafuPay payment platform remains the source of collection and payment data.

## Qwen Cloud Usage

The backend sends a structured, privacy-filtered prompt to Qwen Cloud through the OpenAI-compatible endpoint (`src/lib/qwen.ts`, `src/services/collectionAgent.ts`). Qwen is used to:

1. Summarize collection progress.
2. Interpret payment activity from the provided context.
3. Flag possible concerns (e.g. slowing momentum).
4. Recommend one simple next action for the collection owner.

The agent only receives the privacy-filtered collection/payment fields shown in the test request below — no raw provider payloads, full credentials, or unnecessary personally identifiable information.

## Alibaba Cloud Deployment

The backend is deployed and verified on Alibaba Cloud ECS:

- **Region:** Germany (Frankfurt)
- **Instance:** `ecs.n4.small` (1 vCPU, 2 GiB RAM), Ubuntu 24.04 (64-bit)
- **Process manager:** PM2, app name `sarafupay-ai-agent`
- **Public endpoint:** `http://47.87.133.172:3000`
- **Health check:** `http://47.87.133.172:3000/health` → verified `success: true`
- **Qwen integration status:** `http://47.87.133.172:3000/api/agent/status` → verified `qwenCloudIntegration: "implemented"`, `qwenApiKeyConfigured: true` (no key value exposed)
- **Collection summary:** `POST http://47.87.133.172:3000/api/agent/collection-summary` → verified `success: true` with a live `qwen3.7-plus` response

`QWEN_API_KEY` is stored only in the ECS instance's `.env` file and is never committed to this repository. Full setup commands, security group rules, and the verification checklist are recorded in [docs/ALIBABA_CLOUD_DEPLOYMENT.md](./docs/ALIBABA_CLOUD_DEPLOYMENT.md). Screenshot proof of the deployment is still pending capture.

## Architecture

```text
Collection Owner
      |
Web Dashboard
      |
Backend API ---- MongoDB / payment data
      |
AI Agent Orchestrator
      |
Qwen Cloud
      |
Support guidance output -> Human review
```

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the planned architecture and safety controls.

The final architecture diagram should be exported and uploaded to Devpost separately. No local image placeholder is embedded in this repository.

## Local Setup

### Requirements

- Node.js 20 or later
- npm 10 or later

### Install and run

```bash
git clone https://github.com/ezekiellemana/sarafupay-ai-collection-agent.git
cd sarafupay-ai-collection-agent
npm install
copy .env.example .env
npm run dev
```

On macOS or Linux, replace `copy` with:

```bash
cp .env.example .env
```

The Qwen Cloud integration uses the official `openai` package against Qwen's OpenAI-compatible endpoint. If it is not already installed, run:

```bash
npm install openai
```

The service defaults to `http://localhost:3000`.

Available endpoints:

- `GET /health` - service health response, used for deployment verification (see below)
- `GET /api/agent/status` - honest Qwen integration status
- `POST /api/agent/collection-summary` - AI-generated collection progress summary via Qwen Cloud

`GET /health` response:

```json
{
  "success": true,
  "service": "sarafupay-ai-collection-agent",
  "status": "ok"
}
```

### Checks

```bash
npm run typecheck
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and add local values only. Never commit real credentials.

```env
QWEN_API_KEY=
QWEN_BASE_URL=
QWEN_MODEL=
MONGODB_URI=
NEXT_PUBLIC_APP_URL=
ALIBABA_CLOUD_REGION=
PORT=
```

- `QWEN_API_KEY` - your Qwen Cloud (DashScope) API key. Required for `/api/agent/collection-summary`.
- `QWEN_BASE_URL` - OpenAI-compatible Qwen Cloud endpoint. Defaults to `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` if unset.
- `QWEN_MODEL` - Qwen model name. Defaults to `qwen3.7-plus` if unset.
- `PORT` - local port for the HTTP server. Defaults to `3000` if unset.

`MONGODB_URI`, `NEXT_PUBLIC_APP_URL`, and `ALIBABA_CLOUD_REGION` remain reserved for other planned integrations and are not yet used by the starter service.

## Testing the Collection Summary Endpoint

Start the server with `npm run dev`, then send a request with your collection and payment context.

### curl

```bash
curl -X POST http://localhost:3000/api/agent/collection-summary \
  -H "Content-Type: application/json" \
  -d '{
    "collectionName": "Church Building Fund",
    "targetAmount": 5000000,
    "collectedAmount": 2450000,
    "currency": "TZS",
    "paymentsCount": 38,
    "recentPayments": [
      { "payerName": "John", "amount": 50000, "status": "paid" },
      { "payerName": "Mary", "amount": 25000, "status": "paid" }
    ]
  }'
```

### PowerShell

```powershell
$body = @{
  collectionName  = "Church Building Fund"
  targetAmount    = 5000000
  collectedAmount = 2450000
  currency        = "TZS"
  paymentsCount   = 38
  recentPayments  = @(
    @{ payerName = "John"; amount = 50000; status = "paid" },
    @{ payerName = "Mary"; amount = 25000; status = "paid" }
  )
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/agent/collection-summary `
  -ContentType "application/json" -Body $body
```

Expected response:

```json
{
  "success": true,
  "summary": "...",
  "model": "qwen3.7-plus"
}
```

If `QWEN_API_KEY` is not set, the endpoint returns HTTP 500 with `{"error": "QWEN_API_KEY is not configured"}`. If the request body is missing required fields, it returns HTTP 400 with a descriptive message. Qwen API failures are caught and returned as HTTP 500 without crashing the server.

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [AI agent design](./docs/AI_AGENT_DESIGN.md)
- [Alibaba Cloud deployment record](./docs/ALIBABA_CLOUD_DEPLOYMENT.md)
- [Devpost submission draft](./docs/DEVPOST_SUBMISSION.md)

## Devpost Submission Checklist

- [x] Public-submission-friendly repository structure
- [x] Project overview and local setup
- [x] AI agent workflow and safety design
- [x] Alibaba Cloud deployment proof template
- [x] Working Qwen Cloud API integration
- [x] Alibaba Cloud ECS deployment live and verified
- [ ] Alibaba Cloud deployment screenshot proof
- [ ] Architecture diagram uploaded separately to Devpost
- [ ] Demo video
- [ ] Final Devpost review and submission

## License

This project is licensed under the [MIT License](./LICENSE).
