---
id: task-22
title: Implement Cloudflare-Only Sync Layer
status: To Do
assignee: []
created_date: '2026-01-13'
labels:
  - sync
  - database
  - cloud
  - infrastructure
dependencies:
  - task-8
  - task-11
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement a Cloudflare-only sync layer to enable bidirectional synchronization between local IndexedDB storage and a Cloudflare-hosted backend. This enables multi-device sync, background sync, and conflict resolution while keeping infrastructure within the Cloudflare ecosystem.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [ ] Cloudflare sync endpoints implemented (Workers)
- [ ] Durable Objects configured as remote source of truth
- [ ] Database schema updated for sync metadata (if needed)
- [ ] Sync service created in `src/sync/` directory
- [ ] Background synchronization working
- [ ] Multi-device sync tested and working
- [ ] Conflict resolution configured (last-write-wins initially)
- [ ] Offline queue management working
- [ ] Sync status visible in UI (optional but recommended)
- [ ] Sync tested with multiple devices/browsers

## Technical Implementation

**Update Database Schema:**

1. Update `src/storage/db.ts`:
   - Add required fields for sync metadata (timestamps, device ID)
   - Ensure stable IDs for sync operations
   - Configure conflict strategy (last-write-wins for Phase 1)

2. Database Configuration:
   - Keep Dexie.js for local storage
   - Add sync metadata to tracked entities as needed

**Create Sync Service:**

1. Create `src/sync/syncService.ts`:
   - Send local changes to Workers sync endpoints
   - Pull remote changes from Workers
   - Handle sync events (started, completed, failed)
   - Expose sync status to application
   - Handle sync errors gracefully
   - Provide manual sync trigger (if needed)

2. Sync Integration:
   - Integrate sync service into main application
   - Initialize sync on app startup
   - Handle offline/online state changes
   - Queue sync operations when offline

**Backend Setup:**

- Implement Cloudflare Workers endpoints (see task-24)
- Use Durable Objects as authoritative remote store
- Secure endpoints with authentication (see task-23)

**UI Integration (optional but recommended):**

- Add sync status indicator to UI
- Show sync status (syncing, synced, error)
- Display last sync time
- Show offline/online status
- Error messages for sync failures

**Testing:**

1. Local Testing:
   - Test sync with local changes
   - Verify changes sync to remote
   - Test conflict resolution
   - Test offline queue

2. Multi-Device Testing:
   - Open app in multiple browsers/devices
   - Make changes on one device
   - Verify changes appear on other devices
   - Test concurrent edits and conflict resolution
   - Test offline changes sync when back online

## Dependencies

- Task 8 (IndexedDB Dexie Database Schema)
- Task 11 (Database Schema for To-Do Sections)
- Task 24 (Cloudflare Workers Backend)
- Task 23 (Authentication - for API security)
- Cloudflare account with Workers access
- Node.js 22 LTS
- npm 10+

## Deliverables

1. Cloudflare Workers sync endpoints implemented
2. Durable Objects configured for remote storage
3. Database schema updated for sync
4. Sync service created and integrated
5. Background synchronization working
6. Multi-device sync tested and verified
7. Conflict resolution configured
8. Sync status in UI (optional)
9. Documentation of sync setup and configuration

## Testing

- Test local changes sync to remote
- Test remote changes sync to local
- Test multi-device synchronization
- Test conflict resolution (concurrent edits)
- Test offline queue (make changes offline, verify sync when online)
- Test sync error handling
- Test sync performance with many tasks
- Verify data integrity after sync
- Test sync with database migrations
- Test sync status indicators (if implemented)

## Notes

- This is critical for the local-first architecture
- Start with last-write-wins conflict resolution (simple for Phase 1)
- Can enhance conflict resolution later for Phase 2
- Ensure sync doesn't block UI operations
- Handle sync errors gracefully (don't break app if sync fails)
- Consider rate limiting for sync operations
- Coordinate with task-24 for API shape and storage model

**Estimated Effort:** 4-6 hours
**Priority:** High (core architecture requirement)
**Labels:** sync, database, cloud, infrastructure
