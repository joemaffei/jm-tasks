---
id: task-24
title: Set up Cloudflare Workers Backend
status: To Do
assignee: []
created_date: '2026-01-13'
labels:
  - backend
  - cloudflare
  - infrastructure
  - sync
dependencies:
  - task-23
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Set up a Cloudflare Workers backend for the Cloudflare-only sync layer. This includes Workers for sync API endpoints, Durable Objects as the authoritative store, and integration with the frontend sync service.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [ ] Cloudflare Workers project created
- [ ] Workers development environment set up
- [ ] Sync API endpoints created
- [ ] Durable Objects storage configured
- [ ] Workers deployed to Cloudflare
- [ ] API endpoints accessible and tested
- [ ] Integration with frontend sync service working
- [ ] Error handling and logging implemented
- [ ] Environment variables configured
- [ ] CORS configured correctly

## Technical Implementation

**Cloudflare Workers Setup:**

1. Install Wrangler CLI:
   - `npm install -D wrangler`
   - Configure wrangler.toml for project settings

2. Create Workers Project:
   - Set up Workers project structure
   - Create `workers/` directory in project root
   - Configure build and deployment settings

**Sync API Endpoints:**

1. Create sync endpoints:
   - `POST /sync/push` - Receive local changes from client
   - `GET /sync/pull` - Send remote changes to client
   - `POST /sync/conflict` - Handle conflict resolution
   - Authentication middleware for endpoints

2. Endpoint Implementation:
   - Validate incoming requests
   - Process sync data
   - Handle conflict resolution
   - Return sync responses

**Storage Setup:**

1. Durable Objects:
   - Create Durable Object class for sync state
   - Configure Durable Object bindings
   - Implement sync state management
   - Handle concurrent sync operations

2. Cloudflare KV (alternative):
   - Configure KV namespace
   - Store sync data in KV
   - Handle eventual consistency considerations

**Authentication Integration:**

- Integrate with auth service (task-23)
- Validate tokens on API requests
- User-specific data isolation
- Secure API endpoints

**Deployment:**

1. Configure Wrangler:
   - Set up wrangler.toml
   - Configure environment variables
   - Set up secrets management
   - Configure routes and domains

2. Deploy Workers:
   - Deploy to Cloudflare
   - Configure custom domain (if needed)
   - Set up environment-specific deployments
   - Verify deployment successful

**Integration with Frontend:**

- Update Dexie Cloud configuration to use custom endpoints
- Configure API base URL
- Handle CORS if needed
- Test end-to-end sync flow

## Dependencies

- Task 23 (Authentication - for API security)
- Cloudflare account with Workers access
- Node.js 22 LTS
- npm 10+

## Deliverables

1. Cloudflare Workers project set up
2. Sync API endpoints created
3. Durable Objects configured for storage
4. Workers deployed to Cloudflare
5. API endpoints tested and working
6. Integration with frontend sync service verified
7. Documentation of backend setup

## Testing

- Test sync API endpoints
- Test push/pull sync operations
- Test conflict resolution endpoint
- Test authentication on API requests
- Test error handling
- Test with multiple concurrent clients
- Test storage operations (Durable Objects/KV)
- Test deployment and rollback
- Test CORS configuration
- End-to-end sync testing with frontend

## Notes

- Keep backend simple for Phase 1 (single user)
- Design with Phase 2 (multi-user) in mind
- Document any Cloudflare-specific configuration
- Consider costs of Durable Objects vs KV
- Use environment variables for all configuration
- Implement proper error logging and monitoring

**Estimated Effort:** 4-6 hours (if needed)
**Priority:** Low (only if custom backend required)
**Labels:** backend, cloudflare, infrastructure, sync
