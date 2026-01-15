---
id: task-22
title: Integrate Dexie Cloud Sync Engine
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
Integrate Dexie Cloud sync engine to enable bidirectional synchronization between local IndexedDB storage and remote server. This enables multi-device synchronization, background sync, and conflict resolution as specified in the local-first architecture.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [ ] dexie-cloud package installed
- [ ] Dexie Cloud configured and initialized
- [ ] Database schema updated to work with Dexie Cloud
- [ ] Sync service created in `src/sync/` directory
- [ ] Background synchronization working
- [ ] Multi-device sync tested and working
- [ ] Conflict resolution configured (last-write-wins initially)
- [ ] Offline queue management working
- [ ] Sync status visible in UI (optional but recommended)
- [ ] Sync tested with multiple devices/browsers

## Technical Implementation

**Install Dependencies:**

- `dexie-cloud@^1.x.x` (check latest stable version)
- May need additional dependencies based on Dexie Cloud requirements

**Update Database Schema:**

1. Update `src/storage/db.ts`:
   - Import Dexie Cloud
   - Configure database with Dexie Cloud
   - Add required fields for sync (if needed):
     - `realmId` or similar for multi-user support
     - Sync metadata fields
   - Configure sync options:
     - Conflict resolution strategy (last-write-wins for Phase 1)
     - Sync frequency
     - Background sync settings

2. Database Configuration:
   - Set up Dexie Cloud client
   - Configure sync endpoint (Dexie Cloud backend or custom)
   - Set up authentication (if required by Dexie Cloud)

**Create Sync Service:**

1. Create `src/sync/syncService.ts`:
   - Initialize Dexie Cloud sync
   - Handle sync events (sync started, completed, failed)
   - Expose sync status to application
   - Handle sync errors gracefully
   - Provide manual sync trigger (if needed)

2. Sync Integration:
   - Integrate sync service into main application
   - Initialize sync on app startup
   - Handle offline/online state changes
   - Queue sync operations when offline

**Backend Setup (if needed):**

- If Dexie Cloud requires custom backend:
  - Set up Cloudflare Workers endpoint (see task-24)
  - Configure Durable Objects or KV storage
  - Set up sync API endpoints
- If using Dexie Cloud's hosted backend:
  - Sign up for Dexie Cloud service
  - Configure database connection
  - Set up authentication

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
- Dexie Cloud account (if using hosted service) or Cloudflare Workers setup
- Node.js 22 LTS
- npm 10+

## Deliverables

1. Dexie Cloud installed and configured
2. Database schema updated for sync
3. Sync service created and integrated
4. Background synchronization working
5. Multi-device sync tested and verified
6. Conflict resolution configured
7. Sync status in UI (optional)
8. Documentation of sync setup and configuration

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
- Document any Dexie Cloud configuration needed
- May need to coordinate with task-24 if custom backend required

**Estimated Effort:** 4-6 hours
**Priority:** High (core architecture requirement)
**Labels:** sync, database, cloud, infrastructure
