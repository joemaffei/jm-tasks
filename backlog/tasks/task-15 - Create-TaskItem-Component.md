---
id: task-15
title: Create TaskItem Component
status: Done
assignee: []
created_date: '2026-01-13'
labels:
  - component
  - ui
  - task
dependencies:
  - task-14
  - task-13
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create a TaskItem component that displays an individual task with editable title, done/undone checkbox, and visual styling for completed tasks.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [x] `src/components/TaskItem.vue` created
- [x] Component accepts `task` prop (Task object)
- [x] Displays task title using TaskInput component
- [x] Checkbox for done/undone status
- [x] Visual distinction for done tasks (strikethrough, grayed out)
- [x] Emits events for: edit, toggle done, delete
- [x] Component tests created and passing
- [x] Styled with Tailwind CSS
- [x] Accessible (keyboard navigation, ARIA labels)

## Technical Implementation

**Create `src/components/TaskItem.vue`:**

1. Component structure:
   - Use Vue 3 Composition API with `<script setup>`
   - Accept props:
     - `task: Task` - Task object to display
   - Emit events:
     - `update:task` - Task updated (for title changes)
     - `toggle-done` - Done status toggled
     - `delete` - Task deleted

2. Template structure:
   - Container div with flex layout
   - Checkbox input for done status
   - TaskInput component for editable title
   - Optional: delete button (can be added later)
   - Apply conditional classes based on task status

3. Script logic:
   - Import TaskInput component
   - Import Task type
   - `handleTitleUpdate(newTitle)`: emit update:task with new title
   - `handleToggleDone()`: emit toggle-done event
   - `handleDelete()`: emit delete event (if delete button included)
   - Computed property for task is done: `task.status === 'done'`

4. Styling:
   - Use Tailwind CSS classes
   - Layout: flex row with checkbox and input
   - Done task styling:
     - `line-through` for text
     - `text-gray-400` for color
     - `opacity-60` for opacity
   - Hover states for interactive elements
   - Focus states for accessibility
   - Spacing and alignment

**Visual Design:**

- Checkbox on the left
- Task title (TaskInput) on the right, taking remaining space
- When done: apply strikethrough and gray styling
- Smooth transitions for state changes

**Testing:**

- Create `src/components/TaskItem.test.js` or `.ts`
- Test task display
- Test title editing (via TaskInput)
- Test checkbox toggle
- Test done state styling
- Test event emissions
- Test with different task statuses

## Dependencies

- Task 14 (TaskInput component)
- Task 13 (TaskService for type definitions)
- Task 10 (Tailwind CSS)
- Node.js 22 LTS
- npm 10+
- Vitest (from task-5)

## Deliverables

1. `src/components/TaskItem.vue` component
2. Component tests
3. Component styled with Tailwind CSS
4. Component ready for use in TaskListSection

## Testing

- All component tests pass
- Test task rendering
- Test title editing
- Test done/undone toggle
- Test visual states (done vs todo)
- Test event emissions
- Test accessibility
- Visual test in browser

## Notes

- Component is presentational - emits events, doesn't directly modify data
- Parent component (TaskListSection) will handle actual data updates
- Keep component simple and focused
- Delete functionality can be added later if needed
- Component will be used in draggable list in TaskListSection

**Estimated Effort:** 1-1.5 hours
**Priority:** High (core UI component)
**Labels:** component, ui, task
