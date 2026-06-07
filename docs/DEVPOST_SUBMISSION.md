# Devpost Submission Draft

## Project Name

SarafuPay AI Collection Agent

## Elevator Pitch

An AI agent that helps collection owners monitor payments, detect pending mobile-money issues, answer contributor questions, and suggest next support actions.

## About the Project

SarafuPay already helps owners create collections and receive payments. The AI Collection Agent is a new support layer being built for the Global AI Hackathon Series with Qwen Cloud.

Collection owners can face unclear pending mobile-money confirmations, repeated contributor questions, and uncertainty about the best support follow-up. The planned agent will retrieve safe, relevant context from SarafuPay, mask sensitive fields, use Qwen Cloud to generate a structured issue summary, and recommend a next action for the owner to review.

The project is intentionally human-in-the-loop. Verified payment data remains authoritative, and the agent will not independently execute refunds, withdrawals, payment confirmations, or contributor communications.

## Built With

- TypeScript
- Node.js
- SarafuPay collection and payment platform
- MongoDB integration planned for safe collection context
- Qwen Cloud API integration planned
- Alibaba Cloud deployment planned/in progress

## Track Selected

Track 4 - Autopilot Agent

## GitHub Repository

https://github.com/ezekiellemana/sarafupay-ai-collection-agent

## Architecture Diagram

The architecture is described in [ARCHITECTURE.md](./ARCHITECTURE.md). A polished architecture diagram should be created and uploaded to Devpost separately. Do not treat a local placeholder as the final Devpost asset.

## Required Remaining Items

- [ ] Qwen Cloud API integration
- [ ] Alibaba Cloud deployment proof
- [ ] Architecture diagram upload
- [ ] Demo video
- [ ] Final Devpost submit

## Submission Accuracy Notes

- Do not state that Qwen Cloud integration is complete until a real API call and safe end-to-end workflow are verified.
- Do not state that Alibaba Cloud deployment is complete until the endpoint, region, screenshots, and verification steps are recorded.
- Do not include API keys, tokens, real phone numbers, or private payment data in the repository, screenshots, logs, or demo.
