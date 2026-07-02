# Alibaba Cloud Deployment

> Alibaba Cloud ECS deployment is live and verified. This document records the actual deployment configuration, commands used, and verification results.

This document reports only what has been directly verified. Fields that are not yet available (e.g. screenshots) are marked as pending rather than filled in with placeholders presented as proof.

## Deployment Service

- **Service:** Alibaba Cloud ECS (Elastic Compute Service)
- **Instance type:** `ecs.n4.small` — 1 vCPU, 2 GiB RAM
- **OS:** Ubuntu 24.04 (64-bit)
- **Runtime:** Node.js 22
- **Process manager:** PM2, app name `sarafupay-ai-agent`
- **Status:** Deployed and verified

## Region

- **Alibaba Cloud region:** Germany (Frankfurt)
- **Reason for region selection:** Closest available Alibaba Cloud region providing low-latency access for the hackathon's testing needs during development.

## Backend Endpoint

- **Public IP:** `47.87.133.172`
- **Backend port:** `3000`
- **Public endpoint:** `http://47.87.133.172:3000`
- **TLS enabled:** Not yet — the service is currently served over plain HTTP on port 3000. TLS/HTTPS is not configured on this instance.

## Security Group

Inbound rules currently allow:

- `22` — SSH administration
- `80` — reserved for future HTTP/reverse-proxy use
- `443` — reserved for future HTTPS/reverse-proxy use
- `3000` — backend HTTP server (current public access path)

## Setup Commands Used

Commands actually run on the ECS instance to provision and deploy the service:

```bash
apt update
apt install git curl build-essential

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Get the code
git clone https://github.com/ezekiellemana/sarafupay-ai-collection-agent.git
cd sarafupay-ai-collection-agent

# Install and build
npm install
npm run build

# Configure environment (values entered directly on the instance, never committed)
nano .env

# Run under PM2
npm install -g pm2
pm2 start "npm run dev" --name sarafupay-ai-agent
pm2 save
pm2 status
```

`.env` on the ECS instance is populated with the same variables documented in `.env.example` (see [Environment Variables](#environment-variables) below). It is created directly on the instance and is not committed to Git.

## Health Check URL

- **Expected path:** `/health`
- **Full URL:** `http://47.87.133.172:3000/health`
- **Verified response:** returns `success: true`

```json
{
  "success": true,
  "service": "sarafupay-ai-collection-agent",
  "status": "ok"
}
```

## Qwen Integration Status (Verified on ECS)

`GET http://47.87.133.172:3000/api/agent/status` verified to return:

- `qwenCloudIntegration`: `"implemented"`
- `qwenModel`: `"qwen3.7-plus"`
- `qwenBaseUrlHost`: `"dashscope-intl.aliyuncs.com"`
- `qwenApiKeyConfigured`: `true`

No key value is ever included in this response — only a boolean and the base URL's host.

## Collection Summary Endpoint (Verified on ECS)

`POST http://47.87.133.172:3000/api/agent/collection-summary` verified to return `success: true` with `model: "qwen3.7-plus"` and a generated summary, confirming the live Qwen Cloud call succeeds from the deployed instance.

## Environment Variables

Configure secrets directly on the ECS instance's `.env` file (via `nano .env`), never by committing values to Git.

```env
QWEN_API_KEY=
QWEN_BASE_URL=
QWEN_MODEL=
PORT=
```

- `QWEN_API_KEY` — Qwen Cloud (DashScope) API key. Stored only in the ECS instance's `.env` file.
- `QWEN_BASE_URL` — OpenAI-compatible Qwen Cloud endpoint. Defaults to `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` if unset.
- `QWEN_MODEL` — Qwen model name. Defaults to `qwen3.7-plus` if unset.
- `PORT` — port the server listens on. Set to `3000` on this instance.

Required controls:

- `QWEN_API_KEY` exists only in the ECS `.env` file and is never committed to the repository.
- Restrict SSH access using least privilege.
- Rotate any credential that is accidentally exposed.
- Keep production and local credentials separate.

## Verification Steps

- [x] Confirm the service reports a successful deployment (PM2 status shows the process online).
- [x] Open the public health check URL — `http://47.87.133.172:3000/health` returns `success: true`.
- [x] Verify the `/health` response identifies the correct service.
- [x] Verify the Qwen integration status without exposing credentials — `/api/agent/status` confirms `qwenApiKeyConfigured: true` without printing the key.
- [x] Send a live test request to `/api/agent/collection-summary` and confirm `success: true` with a real Qwen-generated summary.
- [ ] Confirm logs contain no API keys, tokens, phone numbers, or raw payment payloads (spot-check pending; safe logging was added in the diagnostics update, but a full log audit on the live instance has not yet been recorded here).
- [ ] Record the deployment timestamp and commit hash (pending — to be filled in once this documentation commit is deployed).

## Screenshots and Proof Links

> Deployment proof (screenshots) must only be captured after the backend is actually running on Alibaba Cloud, which it now is. These are still pending capture and upload.

- **Public deployed URL:** `http://47.87.133.172:3000` (verified live via curl; see Verification Steps above)
- **Alibaba Cloud ECS console screenshot:** To be added
- **PM2 status screenshot:** To be added
- **Health check screenshot:** To be added
- **Optional monitoring/log screenshot:** To be added after sensitive values are redacted

## Deployment Record

- **Provider:** Alibaba Cloud ECS
- **Region:** Germany (Frankfurt)
- **Instance type:** `ecs.n4.small` (1 vCPU, 2 GiB RAM)
- **OS:** Ubuntu 24.04 (64-bit)
- **Public endpoint:** `http://47.87.133.172:3000`
- **Deployment date:** 2026-07-02
- **Git commit:** To be added once confirmed on the running instance
- **Verified by:** Project owner, via direct curl requests to the public endpoint
- **Notes:** Backend is live and the Qwen Cloud integration is confirmed working from the deployed instance. TLS, screenshot proof, and a full log audit remain outstanding.
