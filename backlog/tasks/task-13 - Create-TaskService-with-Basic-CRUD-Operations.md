---
id: task-13
title: Create TaskService with Basic CRUD Operations
status: Done
assignee: []
created_date: '2026-01-15'
labels:
  - service
  - crud
  - database
dependencies:
  - task-11
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create a TaskService module that provides business logic and data access methods for task operations. Implement basic CRUD operations (Create, Read, Update, Delete) and section-based queries.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [x] `src/services/taskService.ts` created
- [x] `createTask()` method implemented
- [x] `updateTask()` method implemented
- [x] `deleteTask()` method implemented
- [x] `getTasksBySection()` method implemented
- [x] All methods handle IndexedDB operations correctly
- [x] Error handling implemented for all operations
- [x] Unit tests created for all service methods
- [x] Tests pass successfully

## Technical Implementation

**Create `src/services/taskService.ts`:**

1. Import dependencies:
   - Import `db` from `../storage/db`
   - Import `Task` type from `../storage/db`
   - Import `taskSchema` for validation

2. Implement `createTask(section: string, title: string): Promise<Task>`:
   - Validate inputs
   - Get current max order for the section
   - Create new task object with:
     - `title`: provided title
     - `section`: provided section
     - `order`: max order + 1 (or 0 if first task)
     - `status`: "todo"
     - `createdAt`: current date
     - `updatedAt`: current date
   - Validate task object with Zod schema
   - Add to database using `db.tasks.add()`
   - Return created task

3. Implement `updateTask(id: number, updates: Partial<Task>): Promise<Task>`:
   - Validate task exists
   - Update `updatedAt` timestamp
   - Validate updated task object with Zod schema
   - Update database using `db.tasks.update(id, updates)`
   - Return updated task

4. Implement `deleteTask(id: number): Promise<void>`:
   - Validate task exists
   - Delete from database using `db.tasks.delete(id)`
   - Handle errors gracefully

5. Implement `getTasksBySection(section: string): Promise<Task[]>`:
   - Query database for tasks matching section
   - Sort by `order` field (ascending)
   - Return array of tasks

**Error Handling:**

- Wrap all database operations in try-catch blocks
- Provide meaningful error messages
- Log errors for debugging
- Throw errors that can be caught by calling code

**Testing:**

- Create `src/services/taskService.test.ts`
- Test each method with various scenarios:
  - Create task with valid data
  - Create task with invalid data (should fail validation)
  - Update existing task
  - Update non-existent task (should handle gracefully)
  - Delete existing task
  - Delete non-existent task (should handle gracefully)
  - Get tasks by section (empty section, section with tasks)
- Test error handling
- Test order calculation for new tasks

## Dependencies

- Task 11 (Database schema updated)
- Node.js 22 LTS
- npm 10+
- Vitest (from task-5)

## Deliverables

1. `src/services/taskService.ts` with all CRUD methods
2. Comprehensive unit tests
3. Error handling implemented
4. Service ready for use in components

## Testing

- All unit tests pass
- Test create, read, update, delete operations
- Test section-based queries
- Test error scenarios
- Test order calculation logic
- Verify database operations work correctly

## Notes

- Keep service methods pure and focused on data operations
- No UI logic in service layer
- Use async/await for all database operations
- Validate all inputs before database operations
- Consider transaction support if needed for complex operations
- Service will be extended in later tasks (reorder, move, toggle done)

**Estimated Effort:** 1-2 hours
**Priority:** High (foundation for all task operations)
**Labels:** service, crud, database
