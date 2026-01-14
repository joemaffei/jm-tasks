---
id: decision-9
title: Testing Approach - Real Implementations Over Mocks
date: '2026-01-13'
status: accepted
---

## Context

We need to establish testing principles and approaches for the project. Key considerations:

- Test coverage requirements
- Mocking strategy
- Test organization
- Testing utilities vs real implementations
- Component testing vs unit testing
- Testing framework selection

Common approaches vary from heavy mocking to minimal mocking with real implementations.

For component testing, we considered:

- Vue Test Utils: Official Vue testing utilities, lower-level API
- Testing Library (@testing-library/vue): Higher-level queries focused on user-facing behavior, encourages testing from user perspective

## Decision

Adopt a testing approach that emphasizes **real implementations over mocks**.

Core principles:

1. **All code must have tests** - This is a core requirement
2. **Extract pure functions** - Extract logic from components to `utils/` or `services/` modules for isolated testing
3. **Keep components small** - Minimize test setup by keeping components focused
4. **Test actual production code** - Import and test real modules, not mocks of the code being tested
5. **Avoid mocking whenever possible** - Prefer real implementations; only mock external dependencies (APIs, file
   system, etc.)

## Consequences

### Positive

- Tests are more reliable and catch real bugs
- Tests document actual behavior (not mocked behavior)
- Less maintenance overhead (no mock maintenance)
- Tests serve as better documentation
- Forces better code organization (pure functions, small components)
- Easier to refactor (tests test behavior, not implementation details)

### Negative

- May require more setup for integration-style tests
- Tests may be slower (but still acceptable for unit tests)
- Requires discipline to extract pure functions from components

### Implementation Notes

- **Testing Frameworks**: Use both @vue/test-utils and @testing-library/vue
  - @vue/test-utils: Official Vue testing utilities for lower-level component testing
  - @testing-library/vue: Preferred for component tests as it encourages testing behavior from user perspective
  - Both frameworks complement each other; use the most appropriate for each test case
- Extract business logic to `utils/` or `services/` directories
- Keep Vue components focused on presentation logic
- Test pure functions with real implementations
- Only mock external dependencies (APIs, IndexedDB operations for isolated unit tests, etc.)
- Use real IndexedDB for integration tests when testing data flow
- Keep components small to minimize test setup complexity
