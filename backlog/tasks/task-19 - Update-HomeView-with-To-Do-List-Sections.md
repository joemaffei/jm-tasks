---
id: task-19
title: Update HomeView with To-Do List Sections
status: To Do
assignee: []
created_date: '2026-01-15'
labels:
  - view
  - integration
  - ui
dependencies:
  - task-16
  - task-17
  - task-18
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Update HomeView to display the four to-do list sections (Today, This Week, Soon, Someday) stacked vertically. Implement reactive task state management and connect all components together.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [ ] HomeView displays 4 TaskListSection components
- [ ] Sections stacked vertically (flex column layout)
- [ ] Section order: Today (top), This Week, Soon, Someday (bottom)
- [ ] Reactive task state management implemented
- [ ] Tasks load from database on mount
- [ ] Task operations (create, update, delete, toggle done) work
- [ ] Drag and drop works between sections
- [ ] All features integrated and working together
- [ ] Styled with Tailwind CSS
- [ ] Integration tests pass

## Technical Implementation

**Update `src/views/HomeView.vue`:**

1. Component structure:
   - Use Vue 3 Composition API with `<script setup>`
   - Import TaskListSection component
   - Import TaskService
   - Import Task type

2. Reactive state management:
   - Create `tasks` ref: `const tasks = ref<Task[]>([])`
   - Create computed properties for each section:
     - `todayTasks = computed(() => tasks.value.filter(t => t.section === 'today'))`
     - `thisWeekTasks = computed(() => tasks.value.filter(t => t.section === 'this-week'))`
     - `soonTasks = computed(() => tasks.value.filter(t => t.section === 'soon'))`
     - `somedayTasks = computed(() => tasks.value.filter(t => t.section === 'someday'))`

3. Load tasks on mount:
   - `onMounted()` hook:
     - Load all tasks from database
     - Use TaskService methods or direct database query
     - Populate `tasks` ref

4. Event handlers:
   - `handleCreateTask(section, title)`:
     - Call TaskService.createTask()
     - Refresh tasks list
   - `handleUpdateTask(taskId, updates)`:
     - Call TaskService.updateTask()
     - Update task in tasks array
   - `handleToggleDone(taskId)`:
     - Call TaskService.toggleTaskDone()
     - Refresh tasks list (section may have changed)
   - `handleDeleteTask(taskId)`:
     - Call TaskService.deleteTask()
     - Remove from tasks array

5. Template:
   - Container div with flex column layout
   - Four TaskListSection components:
     - `<TaskListSection section="today" :tasks="todayTasks" @create-task="..." @update-task="..." />`
     - `<TaskListSection section="this-week" :tasks="thisWeekTasks" ... />`
     - `<TaskListSection section="soon" :tasks="soonTasks" ... />`
     - `<TaskListSection section="someday" :tasks="somedayTasks" ... />`
   - Pass appropriate event handlers to each section

6. Styling:
   - Use Tailwind CSS classes
   - Container: `flex flex-col gap-8` (or similar spacing)
   - Max width container for readability
   - Padding and margins
   - Responsive design (if needed, though sections always stack)

**State Management Approach:**

- Use Vue reactive refs and computed properties
- Tasks array is single source of truth
- Computed properties filter by section
- Update tasks array when operations occur
- Re-fetch from database after mutations (or update in place)

**Integration:**

- Connect TaskService to components
- Ensure all events flow correctly
- Test full user flows:
  - Create task
  - Edit task
  - Mark done
  - Reopen
  - Drag between sections
  - Reorder within section

**Testing:**

- Create integration tests
- Test task loading
- Test task creation in each section
- Test task updates
- Test done/reopen
- Test drag and drop
- Test full user workflows
- Manual browser testing

## Dependencies

- Task 16 (TaskListSection component)
- Task 17 (Drag and drop functionality)
- Task 18 (Done/reopen functionality)
- Task 13 (TaskService)
- Task 10 (Tailwind CSS)
- Node.js 22 LTS
- npm 10+
- Vitest (from task-5)

## Deliverables

1. Updated HomeView with 4 sections
2. Reactive task state management
3. All event handlers connected
4. Integration tests
5. Full feature working in browser

## Testing

- All integration tests pass
- Test task operations in each section
- Test drag and drop between sections
- Test done/reopen functionality
- Test full user workflows
- Visual test in browser
- Test with empty database
- Test with many tasks

## Notes

- This is the integration task that brings everything together
- Focus on making all features work together smoothly
- Ensure good UX (loading states, error handling, etc.)
- Consider adding loading indicators if needed
- Test thoroughly with various scenarios
- This completes the core to-do list feature

**Estimated Effort:** 2-3 hours
**Priority:** High (final integration task)
**Labels:** view, integration, ui
