---
id: task-5
title: Set up Vitest Testing Framework
status: Done
assignee: []
created_date: '2026-01-13'
labels:
  - setup
  - testing
  - tooling
dependencies:
  - task-3
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Set up Vitest testing framework with Vue Test Utils and @testing-library/vue for component testing. Configure the test environment to support Vue components and create a basic test to verify the testing infrastructure works. Use @testing-library/vue as the preferred approach for component tests.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [x] Vitest installed and configured
- [x] Vue Test Utils installed and configured
- [x] @testing-library/vue installed and configured
- [x] Test environment configured (jsdom)
- [x] Test configuration file created
- [x] Path aliases configured (match Vite config)
- [x] One passing test created (e.g., test App.vue renders) using @testing-library/vue
- [x] npm scripts added: `test`, `test:ui` (optional)
- [x] Tests can be run successfully

## Technical Implementation

**Install Dependencies:**

- `vitest@^1.6.0`
- `@vue/test-utils@^2.4.6` (lower-level Vue testing utilities)
- `@testing-library/vue@^8.1.0` (preferred for component tests, encourages user-focused testing)
- `@testing-library/user-event@^14.5.2` (for user interaction testing)
- `jsdom@^24.0.0`

**Create Configuration:**

1. `vitest.config.js`:
   - Configure test environment (jsdom)
   - Set up path aliases matching Vite config (`@` for `src/`)
   - Configure Vue plugin for Vitest
   - Set up test file patterns

2. Create `tests/setup.js` (if needed):
   - Global test setup
   - Document both @vue/test-utils and @testing-library/vue usage
   - Vue Test Utils global config (if needed)
   - Test utilities/fixtures

**Create First Test:**

- Test file: `tests/components/App.spec.js` or `tests/App.test.js`
- Test that App.vue component renders using @testing-library/vue
- Use queries like `getByRole`, `getByText` to test from user perspective
- Verify the test passes

**Update package.json scripts:**

- `test`: Run tests
- `test:ui`: Run tests with UI (optional, if @vitest/ui installed)

**Verify Setup:**

- Run `npm test` and verify tests execute
- Verify tests can import Vue components
- Verify path aliases work in tests

## Dependencies

- Task 3 (Vue 3 project must be initialized)
- Node.js 22 LTS
- npm 10+

## Deliverables

1. Vitest configuration file
2. Test setup file (if needed)
3. At least one passing test
4. Updated package.json with test scripts
5. Verified working test infrastructure

## Testing

- Run `npm test` and verify tests run
- Verify test can import and test Vue components
- Verify path aliases work correctly
- Verify test output is clear and helpful

## Notes

- Use Vitest for Vue 3 + Vite projects (native integration)
- Configure to match Vite's path aliases
- Keep test setup minimal initially
- Follow testing principles: test actual code, avoid excessive mocking
- One passing test is sufficient to verify infrastructure

**Estimated Effort:** 45-60 minutes
**Priority:** High (testing foundation)
**Labels:** setup, testing, tooling
