---
id: decision-4
title: Cloudflare for Hosting and Infrastructure
date: '2026-01-13'
status: accepted
---

## Context

We need to choose hosting and infrastructure for the jm-tasks PWA application. Requirements:

- Host static frontend application
- Provide CDN for fast global delivery
- Support PWA features
- Provide backend infrastructure for sync (if needed)
- Cost-effective for personal project
- Easy deployment
- SSL/HTTPS support
- Custom domain support (tasks.joemaffei.dev)

Considered options: Vercel, Netlify, Cloudflare Pages, AWS, traditional hosting.

## Decision

Use **Cloudflare** ecosystem for hosting and infrastructure:

- **Cloudflare Pages**: Static site hosting for Vue.js frontend
- **Cloudflare CDN**: Global content delivery network
- **Cloudflare Workers**: Serverless functions for API endpoints (if needed)
- **Cloudflare Durable Objects**: Remote storage for sync (if Dexie Cloud doesn't provide backend)
- **Cloudflare KV**: Alternative storage option (eventually consistent)

## Consequences

### Positive

- Integrated ecosystem - all services work together
- Excellent performance with global CDN
- Cost-effective for personal projects
- Easy deployment workflow
- Automatic SSL/HTTPS
- Custom domain support
- Serverless architecture - no server management
- Good free tier for getting started
- Durable Objects provide strong consistency for sync operations

### Negative

- Vendor lock-in to Cloudflare ecosystem (but can migrate if needed)
- Learning curve for Cloudflare-specific services
- Durable Objects may have cost implications at scale (but fine for personal use)

### Implementation Notes

- Frontend deployed to Cloudflare Pages
- Static assets served via Cloudflare CDN
- If custom backend needed: Cloudflare Workers + Durable Objects
- Domain: tasks.joemaffei.dev
- SSL: Automatic via Cloudflare
