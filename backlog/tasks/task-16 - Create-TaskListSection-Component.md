---
id: task-16
title: Create TaskListSection Component
status: Done
assignee: []
created_date: '2026-01-15'
labels:
  - component
  - ui
  - section
dependencies:
  - task-15
  - task-12
  - task-13
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create a TaskListSection component that displays one of the four to-do sections (Today, This Week, Soon, Someday) with a section title, "New Task" button, and a list of TaskItem components.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [x] `src/components/TaskListSection.vue` created
- [x] Component accepts `section` prop (section identifier)
- [x] Displays section title
- [x] "New Task" button at top
- [x] Renders list of TaskItem components for tasks in section
- [x] Filters tasks by section
- [x] Handles task creation when "New Task" clicked
- [x] Handles task updates from TaskItem events
- [x] Component tests created and passing
- [x] Styled with Tailwind CSS

## Technical Implementation

**Create `src/components/TaskListSection.vue`:**

1. Component structure:
   - Use Vue 3 Composition API with `<script setup>`
   - Accept props:
     - `section: string` - Section identifier ("today", "this-week", "soon", "someday")
     - `tasks: Task[]` - Array of all tasks (parent will filter, or component filters)
   - Emit events:
     - `create-task` - New task creation requested
     - `update-task` - Task updated
     - `toggle-done` - Task done status toggled
     - `delete-task` - Task deletion requested

2. Template structure:
   - Section container div
   - Section title (h2 or h3) - display friendly name based on section prop
   - "New Task" button
   - List container (div or ul)
   - Map over filtered tasks, render TaskItem for each
   - Empty state message (optional, if no tasks)

3. Script logic:
   - Import TaskItem component
   - Import TaskService (for creating tasks)
   - Import Task type
   - Section title mapping: computed property to convert section ID to display name
   - Filter tasks: computed property to filter tasks by section prop
   - Sort tasks: computed property to sort filtered tasks by order field
   - `handleNewTask()`:
     - Call TaskService.createTask() with section and empty title
     - Emit create-task event (or handle directly)
   - `handleTaskUpdate(taskId, updates)`: emit update-task event
   - `handleToggleDone(taskId)`: emit toggle-done event
   - `handleDelete(taskId)`: emit delete-task event

4. Styling:
   - Use Tailwind CSS classes
   - Section container with padding and spacing
   - Section title styling (typography)
   - Button styling for "New Task"
   - List styling with proper spacing
   - Empty state styling (if implemented)

**Section Title Mapping:**

- "today" → "Today"
- "this-week" → "This Week"
- "soon" → "Soon"
- "someday" → "Someday"

**Task Filtering:**

- Filter tasks array by `task.section === section` prop
- Sort filtered tasks by `task.order` (ascending)
- Display done tasks visually distinct but still in list

**Testing:**

- Create `src/components/TaskListSection.test.js` or `.ts`
- Test section title display
- Test task filtering by section
- Test task sorting by order
- Test "New Task" button creates task
- Test task update events
- Test with empty task list
- Test with tasks in different states

## Dependencies

- Task 15 (TaskItem component)
- Task 12 (vue-draggable installed, not used yet)
- Task 13 (TaskService)
- Task 10 (Tailwind CSS)
- Node.js 22 LTS
- npm 10+
- Vitest (from task-5)

## Deliverables

1. `src/components/TaskListSection.vue` component
2. Component tests
3. Component styled with Tailwind CSS
4. Component ready for use in HomeView

## Testing

- All component tests pass
- Test section title rendering
- Test task filtering and sorting
- Test "New Task" button
- Test task event handling
- Test empty state
- Visual test in browser

## Notes

- Component handles one section at a time
- Parent (HomeView) will manage overall task state
- Drag-and-drop will be added in Task 17
- Keep component focused on section display and basic interactions
- Component will be used 4 times in HomeView (one per section)

**Estimated Effort:** 1-1.5 hours
**Priority:** High (core UI component)
**Labels:** component, ui, section
