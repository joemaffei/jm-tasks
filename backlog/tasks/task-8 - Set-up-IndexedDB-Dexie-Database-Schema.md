---
id: task-8
title: Set up IndexedDB Dexie Database Schema
status: To Do
assignee: []
created_date: '2026-01-13'
labels:
  - setup
  - database
  - storage
dependencies:
  - task-3
  - task-6
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Install Dexie.js and set up the basic database schema for tasks. Create a database instance with a tasks table and verify the database can be created and accessed.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [ ] Dexie.js installed
- [ ] Database instance created
- [ ] Tasks table schema defined with required fields
- [ ] Database can be opened successfully
- [ ] Database initialization test passes (if created)
- [ ] Database file created in browser (verifiable in DevTools)

## Technical Implementation

**Install Dependency:**

- `dexie@^3.2.4`

**Create Database Setup:**

1. `src/storage/db.js`:
   - Import Dexie
   - Create Dexie database instance
   - Define schema for tasks table:
     - `id` - Primary key (string or auto-increment)
     - `title` - String (required)
     - `description` - String (optional)
     - `status` - String (e.g., 'todo', 'in-progress', 'done')
     - `createdAt` - Timestamp
     - `updatedAt` - Timestamp
     - `dueDate` - Date (optional)
   - Add indexes for common queries (e.g., status, createdAt)
   - Export database instance

**Test Database:**

- Create minimal test or manual verification:
  - Open database
  - Verify tables are created
  - Verify can access database instance
  - Check in browser DevTools → Application → IndexedDB

**Verify Setup:**

- Import database in main.js or test file
- Verify database opens without errors
- Verify schema is correct in browser DevTools

## Dependencies

- Task 3 (Vue 3 project initialized)
- Task 6 (storage directory exists)
- Node.js 22 LTS
- npm 10+

## Deliverables

1. Dexie.js installed
2. Database configuration file (`src/storage/db.js`)
3. Tasks table schema defined
4. Database instance exportable
5. Verified working database setup

## Testing

- Verify database can be imported
- Verify database opens without errors
- Check browser DevTools to see database and tables
- Verify schema matches specification
- Test database creation in different scenarios

## Notes

- This is schema setup only - no CRUD operations yet
- Keep schema minimal but extensible
- Dexie Cloud integration will come in a separate task
- Verify database works before adding sync functionality
- Use meaningful field names and types

**Estimated Effort:** 30-45 minutes
**Priority:** High (foundation for local-first architecture)
**Labels:** setup, database, storage
