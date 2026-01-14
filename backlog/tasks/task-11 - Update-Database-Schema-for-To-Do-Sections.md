---
id: task-11
title: Update Database Schema for To-Do Sections
status: To Do
assignee: []
created_date: '2026-01-15'
labels:
  - database
  - storage
  - schema
dependencies:
  - task-8
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Update the Task schema in IndexedDB to support the 4-section to-do list structure. Add fields for section assignment, ordering within sections, and tracking original section for done/reopen functionality. Create database migration from version 1 to version 2.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [ ] Task schema updated with `section`, `order`, and `originalSection` fields
- [ ] Database version incremented to 2
- [ ] Migration function created to handle version upgrade
- [ ] Indexes added on `section` and `order` fields for efficient queries
- [ ] Zod schema validation updated to match new fields
- [ ] Migration tested with existing data
- [ ] Database opens successfully after migration
- [ ] Existing tasks handled gracefully (default values assigned)

## Technical Implementation

**Update Task Schema in `src/storage/db.ts`:**

1. Add new fields to `taskSchema`:
   - `section`: `z.enum(["today", "this-week", "soon", "someday"])` - Required field for section assignment
   - `order`: `z.number()` - Required field for sorting within sections
   - `originalSection`: `z.string().optional()` - Optional field to track section before marking done

2. Update database version:
   - Increment version from 1 to 2
   - Create migration function to handle existing data:
     - Set default `section` to "today" for existing tasks
     - Set default `order` based on creation date or assign sequential numbers
     - Leave `originalSection` as undefined for existing tasks

3. Update indexes:
   - Add `section` to indexed fields
   - Add `order` to indexed fields
   - Ensure composite queries on `section` and `order` are efficient

4. Update TypeScript types:
   - Type inference from Zod schema should automatically update
   - Verify Task type includes new fields

**Migration Strategy:**

- Use Dexie's version upgrade mechanism
- In version 2 upgrade function:
  - Query all existing tasks
  - Assign default section "today" to all existing tasks
  - Assign order values (0, 1, 2, ...) based on creation date or id
  - Save updated tasks back to database

**Testing:**

- Test migration with empty database
- Test migration with existing tasks
- Verify new tasks can be created with all required fields
- Verify queries by section work efficiently

## Dependencies

- Task 8 (IndexedDB Dexie Database Schema setup)
- Node.js 22 LTS
- npm 10+

## Deliverables

1. Updated `src/storage/db.ts` with new schema fields
2. Database migration from version 1 to version 2
3. Updated Zod schema validation
4. Indexes on `section` and `order` fields
5. Migration tested and verified

## Testing

- Verify database migration runs successfully
- Test creating new tasks with section and order fields
- Test querying tasks by section
- Test sorting tasks by order within section
- Verify existing tasks are migrated correctly
- Test database opens without errors after migration
- Update `src/storage/db.test.ts` to cover new schema

## Notes

- Default section for new tasks will be "today" (handled in TaskService)
- Order values should be sequential integers starting from 0
- Migration must be backward-compatible (handle missing fields gracefully)
- Consider future migrations when adding fields
- Test migration thoroughly before proceeding to next tasks

**Estimated Effort:** 45-60 minutes
**Priority:** High (foundation for all to-do list features)
**Labels:** database, storage, schema
