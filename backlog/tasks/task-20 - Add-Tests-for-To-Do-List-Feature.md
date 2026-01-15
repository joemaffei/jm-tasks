---
id: task-20
title: Add Tests for To-Do List Feature
status: Done
assignee: []
created_date: '2026-01-13'
labels:
  - testing
  - quality
dependencies:
  - task-19
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add comprehensive integration tests for the to-do list feature to ensure all functionality works correctly together and all acceptance criteria are covered.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [x] Integration tests for task creation flow
- [x] Integration tests for drag and drop (within section and cross-section)
- [x] Integration tests for done/reopen functionality
- [x] Integration tests for section moves
- [x] Database migration tests
- [x] All acceptance criteria from previous tasks covered by tests
- [x] Test coverage meets project standards
- [x] All tests pass

## Technical Implementation

**Create Integration Tests:**

1. `src/views/HomeView.test.ts` or similar:
   - Test task loading on mount
   - Test task creation in each section
   - Test task updates
   - Test task deletion
   - Test done/reopen flow
   - Test section filtering
   - Test task sorting by order

2. `src/components/TaskListSection.test.ts`:
   - Test section rendering
   - Test task filtering
   - Test task sorting
   - Test "New Task" button
   - Test event emissions

3. `src/components/TaskItem.test.ts`:
   - Test task display
   - Test title editing
   - Test done/undone toggle
   - Test visual states
   - Test event emissions

4. `src/components/TaskInput.test.ts`:
   - Test v-model binding
   - Test keyboard interactions
   - Test blur behavior
   - Test auto-focus

5. `src/services/taskService.test.ts` (extend existing):
   - Test all CRUD operations
   - Test section-based queries
   - Test reorder operations
   - Test move operations
   - Test toggle done operations
   - Test error handling

6. `src/storage/db.test.ts` (extend existing):
   - Test database migration
   - Test schema validation
   - Test indexes

**Test Scenarios:**

1. Task Creation:
   - Create task in each section
   - Verify task appears in correct section
   - Verify order is set correctly
   - Verify default values

2. Drag and Drop:
   - Reorder tasks within section
   - Move task between sections
   - Verify order updates in database
   - Verify section updates in database
   - Test edge cases (empty sections, single task)

3. Done/Reopen:
   - Mark task as done (verify originalSection stored)
   - Reopen task (verify section restored)
   - Test with missing originalSection
   - Verify visual styling

4. Section Moves:
   - Move task via drag and drop
   - Verify task appears in new section
   - Verify order in new section
   - Verify removed from old section

5. Database Migration:
   - Test migration from version 1 to 2
   - Test with existing tasks
   - Test with empty database
   - Verify all fields populated correctly

**Test Coverage:**

- Aim for high coverage of critical paths
- Test happy paths and error cases
- Test edge cases
- Test user workflows end-to-end
- Ensure all acceptance criteria have test coverage

## Dependencies

- Task 19 (HomeView integration complete)
- Task 5 (Vitest testing framework)
- Node.js 22 LTS
- npm 10+
- Vitest

## Deliverables

1. Comprehensive integration tests
2. Extended unit tests for services
3. Database migration tests
4. Test coverage report
5. All tests passing

## Testing

- All tests pass
- Test coverage meets standards
- All acceptance criteria covered
- Tests run in CI (if configured)
- Manual verification of test scenarios

## Notes

- Focus on integration tests that test features working together
- Unit tests should already exist from previous tasks
- Ensure tests are maintainable and readable
- Use real database operations (not mocks) where possible
- Test actual user workflows, not just individual functions
- Consider performance of tests with many tasks

**Estimated Effort:** 2-3 hours
**Priority:** Medium (important for quality but not blocking)
**Labels:** testing, quality
