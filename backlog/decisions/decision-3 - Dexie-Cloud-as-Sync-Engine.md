---
id: decision-3
title: Dexie Cloud as Sync Engine
date: '2026-01-13'
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

- **Dexie Cloud**: Built on Dexie.js, designed for IndexedDB
- **PowerSync**: Uses SQLite, would require architecture changes
- **Replicache**: More complex, may be overkill for single-user
- **ElectricSQL**: Real-time sync with PostgreSQL, more setup required
- **Custom implementation**: High development overhead

## Decision

Use **Dexie Cloud** as the sync engine for bidirectional synchronization.

Dexie Cloud provides:

- Built on Dexie.js (IndexedDB wrapper we're already using)
- Seamless integration with IndexedDB
- Automatic change tracking
- Background synchronization
- Conflict resolution (configurable strategies)
- Delta sync (only sends changes, not full datasets)
- Optimistic updates
- Offline queue management
- Multi-device synchronization
- Real-time updates when online

## Consequences

### Positive

- No custom sync implementation needed - saves significant development time
- Well-maintained npm package with active development
- Designed specifically for IndexedDB (perfect fit)
- Handles all sync complexity out of the box
- Good documentation and community support
- Vue-friendly integration
- Reduces risk of bugs in sync logic

### Negative

- Dependency on external library (but well-maintained)
- May need to adapt to Dexie Cloud's API patterns
- Potential vendor lock-in (but can migrate if needed)

### Alternatives Considered

- **Custom sync implementation**: Too much development overhead for a personal project
- **PowerSync**: Uses SQLite, would require abandoning IndexedDB architecture
- **Replicache**: More complex than needed for single-user initially
- **ElectricSQL**: Requires PostgreSQL backend, more setup complexity

### Implementation Notes

- Use Dexie.js for IndexedDB operations
- Use Dexie Cloud for sync layer
- Remote storage: Dexie Cloud backend or Cloudflare Durable Objects if custom backend needed
- Sync happens transparently in background
