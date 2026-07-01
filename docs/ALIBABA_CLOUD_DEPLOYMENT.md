# Alibaba Cloud Deployment

> Alibaba Cloud deployment is planned/in progress. This file will be updated with deployment service, region, endpoint, screenshots, and verification steps once deployment is complete.

This document is an honest deployment-proof template. Empty fields must not be presented as evidence of a completed deployment.

## Deployment Service

- **Recommended option:** Alibaba Cloud ECS (Elastic Compute Service) or Function Compute
  - **ECS** — simplest fit for this always-on Node.js HTTP server; run it as a long-lived process (e.g. via `pm2` or a systemd unit) behind the instance's security group.
  - **Function Compute** — viable alternative if the team prefers a serverless/pay-per-request model; would require wrapping the existing `createServer` handler in a Function Compute HTTP trigger.
- **Selected service:** To be decided at deployment time
- **Runtime:** Node.js 20 or later
- **Status:** Planned/in progress — not yet deployed

## Region

- **Alibaba Cloud region:** To be recorded after deployment
- **Reason for region selection:** To be documented

## Backend Endpoint

- **Public endpoint:** To be added
- **TLS enabled:** To be verified

## Build and Start Commands

```bash
npm install
npm run build
npm start
```

`npm start` runs `node dist/index.js`, which reads `PORT` from the environment and listens on it (defaults to `3000` if unset).

## Health Check URL

- **Expected path:** `/health`
- **Full URL:** To be added
- **Expected response:**

```json
{
  "success": true,
  "service": "sarafupay-ai-collection-agent",
  "status": "ok"
}
```

## Environment Variables

Configure secrets through the selected Alibaba Cloud service's secret/environment configuration, not by committing values to Git.

```env
QWEN_API_KEY=
QWEN_BASE_URL=
QWEN_MODEL=
PORT=
```

- `QWEN_API_KEY` — Qwen Cloud (DashScope) API key. Required for `/api/agent/collection-summary`.
- `QWEN_BASE_URL` — OpenAI-compatible Qwen Cloud endpoint. Defaults to `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` if unset.
- `QWEN_MODEL` — Qwen model name. Defaults to `qwen3.7-plus` if unset.
- `PORT` — port the server listens on. Defaults to `3000` if unset.

Required controls:

- Store real values in the deployment service's secret or environment configuration.
- Restrict access using least privilege.
- Rotate any credential that is accidentally exposed.
- Keep production and local credentials separate.

## Verification Steps

Complete and record these steps after deployment:

1. Confirm the service reports a successful deployment.
2. Open the public health check URL over HTTPS.
3. Verify the `/health` response identifies the correct service.
4. Verify the Qwen integration status without exposing credentials.
5. Send a privacy-filtered test support request after integration is complete.
6. Confirm logs contain no API keys, tokens, phone numbers, or raw payment payloads.
7. Record the deployment timestamp and commit hash.

## Screenshots and Proof Links

> Deployment proof (URL and screenshots below) must only be captured after the backend is actually running on Alibaba Cloud. Do not fill these in from a local run or before the deployment is live.

- **Public deployed URL:** Not yet available — to be added after deployment
- **Alibaba Cloud service overview screenshot:** To be added
- **Deployment success screenshot:** To be added
- **Health check screenshot:** To be added
- **Public endpoint:** To be added
- **Optional monitoring/log screenshot:** To be added after sensitive values are redacted

## Deployment Record

- **Deployment date:** Not deployed
- **Git commit:** To be added
- **Verified by:** To be added
- **Notes:** No completed Alibaba Cloud deployment is currently claimed.
