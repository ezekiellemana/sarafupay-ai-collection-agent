# SarafuPay AI Collection Agent

> An AI agent that helps collection owners monitor payments, detect pending mobile-money issues, answer contributor questions, and suggest next support actions.

SarafuPay AI Collection Agent is a hackathon project being built as an AI support layer on top of the existing SarafuPay collection and payment platform. The repository currently contains a safe TypeScript starter service and the documentation needed to guide the Qwen Cloud and Alibaba Cloud integrations.

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

This repository is an honest starter implementation:

- The TypeScript service and health endpoints are available.
- The AI agent workflow and safety boundaries are documented.
- Qwen Cloud API integration is planned and is not yet implemented.
- Alibaba Cloud deployment is planned/in progress and is not yet claimed as complete.
- The existing SarafuPay payment platform remains the source of collection and payment data.

## Planned Qwen Cloud Usage

The backend will send structured, privacy-filtered prompts to Qwen Cloud. Qwen will be used to:

1. Summarize collection progress.
2. Interpret safe status and error context for pending payments.
3. Draft answers to contributor support questions.
4. Recommend the next support action and explain why.

The agent will not receive raw provider payloads, full credentials, or unnecessary personally identifiable information.

## Planned Alibaba Cloud Deployment

The starter service is intended to be deployed on an appropriate Alibaba Cloud compute service after the Qwen integration is working. Deployment details, the region, endpoint, health check, screenshots, and verification evidence will be recorded in [docs/ALIBABA_CLOUD_DEPLOYMENT.md](./docs/ALIBABA_CLOUD_DEPLOYMENT.md).

No completed Alibaba Cloud deployment is claimed in this repository.

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

The service defaults to `http://localhost:3000`.

Available starter endpoints:

- `GET /health` - service health response
- `GET /api/agent/status` - honest Qwen integration status

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
MONGODB_URI=
NEXT_PUBLIC_APP_URL=
ALIBABA_CLOUD_REGION=
PORT=
```

All values are placeholders. The starter service currently uses only `PORT`; the other variables are reserved for the planned integrations.

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [AI agent design](./docs/AI_AGENT_DESIGN.md)
- [Alibaba Cloud deployment template](./docs/ALIBABA_CLOUD_DEPLOYMENT.md)
- [Devpost submission draft](./docs/DEVPOST_SUBMISSION.md)

## Devpost Submission Checklist

- [x] Public-submission-friendly repository structure
- [x] Project overview and local setup
- [x] AI agent workflow and safety design
- [x] Alibaba Cloud deployment proof template
- [ ] Working Qwen Cloud API integration
- [ ] Alibaba Cloud deployment proof
- [ ] Architecture diagram uploaded separately to Devpost
- [ ] Demo video
- [ ] Final Devpost review and submission

## License

This project is licensed under the [MIT License](./LICENSE).
