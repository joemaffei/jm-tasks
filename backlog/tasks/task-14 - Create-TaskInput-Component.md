---
id: task-14
title: Create TaskInput Component
status: Done
assignee: []
created_date: '2026-01-15'
labels:
  - component
  - ui
  - form
dependencies:
  - task-3
  - task-10
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create a reusable TaskInput component for inline editing of task titles. The component should support auto-focus, save on blur/Enter, and cancel on Esc.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [x] `src/components/TaskInput.vue` created
- [x] Component accepts `modelValue` prop (v-model support)
- [x] Component emits `update:modelValue` event
- [x] Auto-focus on mount when `autoFocus` prop is true
- [x] Saves on blur event
- [x] Saves on Enter key press
- [x] Cancels on Esc key press (reverts to original value)
- [x] Component tests created and passing
- [x] Styled with Tailwind CSS
- [x] Accessible (keyboard navigation, focus management)

## Technical Implementation

**Create `src/components/TaskInput.vue`:**

1. Component structure:
   - Use Vue 3 Composition API with `<script setup>`
   - Accept props:
     - `modelValue: string` - Current value (for v-model)
     - `autoFocus: boolean` - Whether to auto-focus on mount (default: false)
     - `placeholder: string` - Placeholder text (optional)
   - Emit events:
     - `update:modelValue` - Value changed
     - `save` - Explicit save event (on Enter or blur)
     - `cancel` - Cancel event (on Esc)

2. Template:
   - Single `<input>` element
   - Type: "text"
   - Bind to local reactive value
   - Handle keydown events (Enter, Esc)
   - Handle blur event

3. Script logic:
   - Create local `inputValue` ref initialized from `modelValue`
   - Watch `modelValue` to sync with parent
   - `handleKeydown(event)`:
     - Enter: emit save, blur input
     - Esc: revert value, emit cancel, blur input
   - `handleBlur()`: emit save
   - `handleFocus()`: select all text (optional, for better UX)
   - Auto-focus logic: use `onMounted` and template ref

4. Styling:
   - Use Tailwind CSS classes
   - Style input to look clean and minimal
   - Add focus states for accessibility
   - Match design system (if established)

**Testing:**

- Create `src/components/TaskInput.test.js` or `.ts`
- Test v-model binding
- Test auto-focus behavior
- Test Enter key saves
- Test Esc key cancels
- Test blur saves
- Test value updates from parent
- Test placeholder display

## Dependencies

- Task 3 (Vue 3 project initialized)
- Task 10 (Tailwind CSS setup)
- Node.js 22 LTS
- npm 10+
- Vitest (from task-5)

## Deliverables

1. `src/components/TaskInput.vue` component
2. Component tests
3. Component styled with Tailwind CSS
4. Component ready for use in TaskItem

## Testing

- All component tests pass
- Test v-model two-way binding
- Test keyboard interactions (Enter, Esc)
- Test blur behavior
- Test auto-focus functionality
- Test accessibility (keyboard navigation)
- Visual test in browser

## Notes

- Keep component simple and focused on input editing
- No business logic in component (just UI)
- Consider debouncing if needed for performance
- Ensure good UX (select all on focus, clear on cancel)
- Component will be used in TaskItem for inline editing

**Estimated Effort:** 45-60 minutes
**Priority:** Medium (needed for task editing)
**Labels:** component, ui, form
