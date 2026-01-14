---
id: task-4
title: Configure ESLint and Prettier
status: Done
assignee: []
created_date: '2026-01-13'
labels:
  - setup
  - tooling
  - code-quality
dependencies:
  - task-3
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Configure ESLint for code linting and Prettier for code formatting. Set up both tools to work together seamlessly with Vue 3 and ensure code quality standards are enforced from the start.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [x] ESLint installed and configured for Vue 3
- [x] Prettier installed and configured
- [x] ESLint and Prettier integrated (no conflicts)
- [x] npm scripts added: `lint`, `lint:fix`, `format`
- [x] Linting works on Vue files
- [x] Formatting works on Vue files
- [x] Configuration files committed to repository

## Technical Implementation

**Install Dependencies:**

- `eslint@^8.57.0`
- `eslint-plugin-vue@^9.27.0`
- `@vue/eslint-config-prettier@^9.0.0`
- `prettier@^3.3.3`

**Create Configuration Files:**

1. `.eslintrc.cjs` or `.eslintrc.js`:
   - Extend Vue 3 recommended rules
   - Add Prettier config to disable conflicting rules
   - Configure for Vue 3 Composition API
   - Set up for `.vue`, `.js`, and `.mjs` files

2. `.prettierrc`:
   - Set line length to 120 (match markdown linting)
   - Configure for Vue files
   - Set consistent formatting rules

3. `.prettierignore`:
   - Ignore `dist/`, `node_modules/`, `coverage/`, etc.

**Update package.json scripts:**

- `lint`: Run ESLint
- `lint:fix`: Run ESLint with auto-fix
- `format`: Run Prettier on all files

**Test Configuration:**

- Create a test Vue file with intentional linting/formatting issues
- Verify `npm run lint` catches issues
- Verify `npm run lint:fix` fixes auto-fixable issues
- Verify `npm run format` formats files correctly

## Dependencies

- Task 3 (Vue 3 project must be initialized)
- Node.js 22 LTS
- npm 10+

## Deliverables

1. ESLint configuration file
2. Prettier configuration file
3. Prettier ignore file
4. Updated package.json with linting/formatting scripts
5. Verified working linting and formatting

## Testing

- Run `npm run lint` and verify it works
- Run `npm run lint:fix` and verify it fixes issues
- Run `npm run format` and verify it formats code
- Verify no conflicts between ESLint and Prettier
- Test on Vue single-file components

## Notes

- Use Vue 3 recommended ESLint rules
- Match Prettier line length to markdown linting (120)
- ESLint should extend Prettier config to avoid conflicts
- Configuration should support `<script setup>` syntax

**Estimated Effort:** 30-45 minutes
**Priority:** High (code quality foundation)
**Labels:** setup, tooling, code-quality
