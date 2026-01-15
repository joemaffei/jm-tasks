---
id: task-18
title: Implement Done/Reopen Functionality
status: Done
assignee: []
created_date: '2026-01-13'
labels:
  - feature
  - ui
  - task
dependencies:
  - task-15
  - task-13
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement functionality to mark tasks as done and reopen completed tasks. When marking done, store the original section. When reopening, restore the task to its original section.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [x] `toggleTaskDone()` method implemented in TaskService
- [x] When marking done: store current section in `originalSection` field
- [x] When marking done: set status to "done"
- [x] When reopening: restore section from `originalSection` field
- [x] When reopening: set status to "todo"
- [x] TaskItem checkbox toggles done status
- [x] Visual styling applied to done tasks
- [x] Done/reopen functionality tested

## Technical Implementation

**Update `src/services/taskService.ts`:**

1. Add `toggleTaskDone(id: number): Promise<Task>`:
   - Get task from database
   - Check current status:
     - If status is "todo" or "in-progress":
       - Store current section in `originalSection` field
       - Set status to "done"
     - If status is "done":
       - Restore section from `originalSection` field (or default to "today" if missing)
       - Set status to "todo"
   - Update `updatedAt` timestamp
   - Save to database
   - Return updated task

2. Handle edge cases:
   - If `originalSection` is missing when reopening, default to "today"
   - Ensure section is valid enum value
   - Handle tasks that were created before `originalSection` field existed

**Update `src/components/TaskItem.vue`:**

1. Checkbox binding:
   - Bind checkbox `checked` to `task.status === 'done'`
   - On change, emit `toggle-done` event with task id

2. Visual styling:
   - Apply conditional classes when `task.status === 'done'`:
     - `line-through` for text decoration
     - `text-gray-400` for color
     - `opacity-60` for opacity
   - Ensure styling doesn't interfere with editing

**Update `src/components/TaskListSection.vue`:**

1. Handle toggle-done event:
   - Receive `toggle-done` event from TaskItem
   - Call TaskService.toggleTaskDone()
   - Refresh task list or update task in place
   - Task will appear in correct section after toggle

**Testing:**

- Create tests for toggleTaskDone method
- Test marking task as done (stores originalSection)
- Test reopening task (restores originalSection)
- Test edge case: missing originalSection
- Test visual styling of done tasks
- Test task appears in correct section after toggle
- Integration test: full done/reopen flow

## Dependencies

- Task 15 (TaskItem component)
- Task 13 (TaskService)
- Task 11 (Database schema with originalSection field)
- Node.js 22 LTS
- npm 10+
- Vitest (from task-5)

## Deliverables

1. Updated TaskService with toggleTaskDone method
2. Updated TaskItem with done checkbox functionality
3. Visual styling for done tasks
4. Tests for done/reopen functionality
5. Done/reopen working in browser

## Testing

- All tests pass
- Test marking task as done
- Test reopening task
- Test originalSection storage and restoration
- Test edge cases (missing originalSection)
- Test visual styling
- Test task section changes after toggle
- Manual browser testing

## Notes

- Done tasks stay in their current section (visually distinct)
- Original section is tracked for reopening
- Default to "today" if originalSection is missing (backward compatibility)
- Visual styling should be clear but not intrusive
- Consider future enhancements (archive done tasks, etc.)

**Estimated Effort:** 1-1.5 hours
**Priority:** High (core feature functionality)
**Labels:** feature, ui, task
