---
id: task-17
title: Implement Drag and Drop Functionality
status: To Do
assignee: []
created_date: '2026-01-13'
labels:
  - feature
  - ui
  - drag-drop
dependencies:
  - task-16
  - task-12
  - task-13
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement drag-and-drop functionality using vue-draggable to allow users to reorder tasks within sections and move tasks between sections.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [x] TaskListSection wraps TaskItem list in `<draggable>` component
- [x] `group="tasks"` prop configured for cross-section dragging
- [x] Within-section reordering works correctly
- [x] Cross-section moves work correctly
- [x] Task order updated in database after drag
- [x] Task section updated in database after cross-section move
- [x] Visual feedback during drag operations
- [x] Drag and drop tests created and passing

## Technical Implementation

**Update `src/components/TaskListSection.vue`:**

1. Import vue-draggable:
   - Import `draggable` from `vuedraggable`
   - Register component

2. Wrap TaskItem list in draggable:
   - Replace list container with `<draggable>` component
   - Bind `v-model` to sorted tasks array
   - Configure props:
     - `group="tasks"` - Allow dragging between sections
     - `@end="handleDragEnd"` - Handle drag completion
     - `item-key="id"` - Use task id as key
     - `animation="200"` - Smooth animation
     - `ghost-class="opacity-50"` - Visual feedback during drag

3. Implement `handleDragEnd(event)`:
   - Event object contains:
     - `oldIndex` - Original position
     - `newIndex` - New position
     - `from` - Source element (section)
     - `to` - Target element (section)
   - Detect if moved within section or between sections:
     - If `from === to`: within-section reorder
     - If `from !== to`: cross-section move
   - For within-section reorder:
     - Calculate new order values for affected tasks
     - Call TaskService.reorderTask() for each affected task
   - For cross-section move:
     - Get new section from target
     - Call TaskService.moveTaskToSection() with task id and new section

**Update `src/services/taskService.ts`:**

1. Add `reorderTask(id: number, newOrder: number): Promise<Task>`:
   - Update task's order field
   - Update updatedAt timestamp
   - Save to database

2. Add `moveTaskToSection(id: number, newSection: string): Promise<Task>`:
   - Get current max order in target section
   - Update task's section and order
   - Update updatedAt timestamp
   - Save to database

3. Add `reorderTasks(tasks: { id: number, order: number }[]): Promise<void>`:
   - Batch update multiple tasks' order values
   - Use transaction if possible for efficiency

**Visual Feedback:**

- Add CSS classes for drag states:
  - `ghost-class`: opacity-50 (dragged item)
  - `chosen-class`: border highlight (selected item)
  - `drag-class`: cursor styling

**Testing:**

- Create integration tests for drag and drop
- Test within-section reordering
- Test cross-section moves
- Test order calculation
- Test database updates after drag
- Test visual feedback
- Manual testing in browser

## Dependencies

- Task 16 (TaskListSection component)
- Task 12 (vue-draggable installed)
- Task 13 (TaskService)
- Task 10 (Tailwind CSS)
- Node.js 22 LTS
- npm 10+
- Vitest (from task-5)

## Deliverables

1. Updated TaskListSection with drag-and-drop
2. Updated TaskService with reorder and move methods
3. Visual feedback during drag operations
4. Tests for drag-and-drop functionality
5. Drag-and-drop working in browser

## Testing

- All tests pass
- Test within-section reordering
- Test cross-section moves
- Test order persistence in database
- Test section updates in database
- Test visual feedback
- Manual browser testing
- Test edge cases (empty sections, single task, etc.)

## Notes

- vue-draggable handles most of the drag logic
- Focus on handling the @end event correctly
- Ensure order values are recalculated properly
- Consider performance for sections with many tasks
- Test thoroughly with different scenarios
- Visual feedback is important for good UX

**Estimated Effort:** 2-3 hours
**Priority:** High (core feature functionality)
**Labels:** feature, ui, drag-drop
