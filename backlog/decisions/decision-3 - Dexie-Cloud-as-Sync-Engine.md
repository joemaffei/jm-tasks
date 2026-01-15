---
id: decision-3
title: Cloudflare-Only Sync Layer
date: '2026-01-14'
status: accepted
---

## Context

After deciding on local-first architecture with IndexedDB, we needed to choose a sync engine solution to handle
bidirectional synchronization between local IndexedDB storage and remote server.

Requirements:

- Work with IndexedDB (not SQLite)
- Handle change tracking automatically
- Provide conflict resolution
- Support multi-device synchronization
- Well-maintained and popular
- Vue-friendly integration
- Handle offline queue management

Considered options:

- **Cloudflare-only sync**: Workers + Durable Objects
- **Dexie Cloud**: SaaS built on Dexie.js, designed for IndexedDB
- **PowerSync**: Uses SQLite, would require architecture changes
- **Replicache**: More complex, may be overkill for single-user
- **ElectricSQL**: Real-time sync with PostgreSQL, more setup required
- **Custom implementation**: High development overhead

## Decision

Use a **Cloudflare-only** sync layer implemented with **Cloudflare Workers** and **Durable Objects**.

This keeps the sync backend fully within the Cloudflare ecosystem while preserving a local-first UX.

## Consequences

### Positive

- No dependency on third-party SaaS for sync
- Full control over data and sync protocol
- Keeps infrastructure within Cloudflare stack
- Easier compliance and long-term portability

### Negative

- Requires building and maintaining sync logic
- More development time up front
- Higher risk of bugs in sync/conflict logic

### Alternatives Considered

- **Dexie Cloud**: SaaS dependency not desired
- **PowerSync**: Uses SQLite, would require abandoning IndexedDB architecture
- **Replicache**: More complex than needed for single-user initially
- **ElectricSQL**: Requires PostgreSQL backend, more setup complexity
- **Custom sync implementation outside Cloudflare**: Avoided to keep infra Cloudflare-only

### Implementation Notes

- Use Dexie.js for IndexedDB operations
- Implement sync endpoints in Cloudflare Workers
- Use Durable Objects as the authoritative remote store
- Add conflict resolution strategy (initially last-write-wins)
- Sync runs in background with offline queueing
