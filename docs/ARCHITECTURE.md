# Architecture

## Overview

SarafuPay AI Collection Agent is designed as a support layer on top of the existing SarafuPay collection and payment platform. It does not replace payment processing or act as the source of truth for payment status.

```text
Collection Owner
      |
Web Dashboard
      |
Backend API -------- MongoDB / payment data
      |
AI Agent Orchestrator
      |
Qwen Cloud
      |
Support guidance output
      |
Human review before sensitive action
```

## Components

### Collection Owner

The owner asks a question, reviews a collection summary, or requests help with a pending payment issue.

### Web Dashboard

The existing SarafuPay dashboard will provide the user interface for agent questions and guidance. It should clearly distinguish AI-generated guidance from verified payment facts.

### Backend API

The backend authenticates the owner, confirms access to the requested collection, fetches only the required context, and applies privacy controls before any AI request.

### MongoDB and Payment Data

SarafuPay remains the source of truth. The agent should use normalized fields such as amount, currency, status, timestamps, and safe error categories. Raw mobile-money provider payloads should not be sent to the model.

### AI Agent Orchestrator

The planned orchestrator will:

1. Classify the owner's support request.
2. Fetch the minimum required collection and payment context.
3. Mask or remove sensitive values.
4. Build a structured prompt.
5. Call Qwen Cloud.
6. Validate and format the response.
7. Flag sensitive recommendations for human review.

### Qwen Cloud

Qwen Cloud integration is planned. It will generate summaries, support answers, and recommended next actions from privacy-filtered context. It will not confirm payments independently or execute refunds, withdrawals, or contributor communications.

### Support Guidance Output

The output should separate:

- Verified facts from SarafuPay data
- AI-generated interpretation
- Recommended next action
- Confidence or uncertainty
- Required human review

## Privacy and Safety Controls

- Mask names, phone numbers, email addresses, provider references, and account identifiers unless a specific field is necessary.
- Never expose API keys, tokens, passwords, webhook secrets, or raw provider payloads to Qwen Cloud.
- Enforce collection-level authorization before retrieving payment context.
- Minimize prompts to only the fields required for the question.
- Treat payment state from SarafuPay and verified provider callbacks as authoritative.
- Require human review before refunds, withdrawals, account changes, or outbound contributor messages.
- Log safe request metadata and decisions without storing full sensitive prompts.
- Reject instructions that ask the agent to bypass authorization, reveal secrets, or invent payment confirmation.

## Why This Fits Track 4 - Autopilot Agent

The project goes beyond a general chat interface by coordinating a multi-step operational workflow: understanding an owner's question, retrieving relevant payment context, applying privacy controls, asking Qwen for structured analysis, and proposing the next support action.

The agent is designed to reduce repetitive collection-support work while keeping high-impact financial actions under human control. That combination of autonomous analysis, contextual recommendations, and governed handoff aligns with the Autopilot Agent track.

## Current Implementation Boundary

The repository currently provides a TypeScript starter service and documentation. Qwen Cloud integration, SarafuPay data access, dashboard UI, and Alibaba Cloud deployment remain planned work.
