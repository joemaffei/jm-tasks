---
id: task-12
title: Install and Configure vue-draggable
status: Done
assignee: []
created_date: '2026-01-13'
labels:
  - setup
  - dependencies
  - ui
dependencies:
  - task-3
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Install the vuedraggable package to enable drag-and-drop functionality for reordering tasks within sections and moving tasks between sections.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [x] `vuedraggable` package installed
- [x] Package added to `package.json` dependencies
- [x] TypeScript types available (verify no type errors)
- [x] Package can be imported in Vue components
- [x] Basic import test passes

## Technical Implementation

**Install Dependency:**

- `vuedraggable` (latest stable version)
- Run: `npm install vuedraggable`

**Verify Installation:**

1. Check `package.json` includes vuedraggable in dependencies
2. Verify TypeScript types are available (package should include types)
3. Test import in a component:

   ```typescript
   import draggable from 'vuedraggable'
   ```

4. Verify no TypeScript errors

**Documentation:**

- Note the package version in task notes
- Document any configuration needed for Vue 3 compatibility

## Dependencies

- Task 3 (Vue 3 project initialized)
- Node.js 22 LTS
- npm 10+

## Deliverables

1. vuedraggable package installed
2. Package.json updated
3. Installation verified
4. Ready for use in components

## Testing

- Verify package installs without errors
- Test import statement works
- Check TypeScript types are available
- Verify package version is compatible with Vue 3

## Notes

- vuedraggable is the Vue 3 compatible version of SortableJS
- Should work out of the box with Vue 3 Composition API
- No additional configuration needed at this stage
- Actual drag-and-drop implementation comes in Task 17

**Estimated Effort:** 5-10 minutes
**Priority:** Medium (needed for drag-and-drop feature)
**Labels:** setup, dependencies, ui
