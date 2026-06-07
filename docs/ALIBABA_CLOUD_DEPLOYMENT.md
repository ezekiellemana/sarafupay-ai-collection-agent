# Alibaba Cloud Deployment

> Alibaba Cloud deployment is planned/in progress. This file will be updated with deployment service, region, endpoint, screenshots, and verification steps once deployment is complete.

This document is an honest deployment-proof template. Empty fields must not be presented as evidence of a completed deployment.

## Deployment Service

- **Service:** To be selected
- **Runtime:** Node.js 20 or later
- **Status:** Planned/in progress

## Region

- **Alibaba Cloud region:** To be recorded after deployment
- **Reason for region selection:** To be documented

## Backend Endpoint

- **Public endpoint:** To be added
- **TLS enabled:** To be verified

## Health Check URL

- **Expected path:** `/health`
- **Full URL:** To be added
- **Expected response:**

```json
{
  "status": "ok",
  "service": "sarafupay-ai-collection-agent"
}
```

## Environment Variables

Configure secrets through the selected Alibaba Cloud service. Do not commit values to Git.

```env
QWEN_API_KEY=
QWEN_BASE_URL=
MONGODB_URI=
NEXT_PUBLIC_APP_URL=
ALIBABA_CLOUD_REGION=
PORT=
```

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
