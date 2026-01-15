# Development Guidelines

## Project Structure

The project follows a standard Vue.js application structure with clear separation of concerns:

```text
jm-tasks/
├── src/
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── components/      # Reusable Vue components
│   ├── views/           # Page-level components
│   ├── router/          # Vue Router configuration
│   ├── services/        # Business logic and data access
│   ├── sync/            # Sync engine implementation
│   ├── storage/         # IndexedDB wrapper/abstraction
│   ├── store/           # State management (reactive to local storage)
│   ├── utils/           # Utility functions (pure functions for easy testing)
│   ├── styles/          # Global styles
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
├── public/              # Public assets
├── docs/                # Documentation
└── .ai/                 # AI context files
```

## Documentation Standards

### Diagrams and Charts

- **Always use Mermaid** for any charts, diagrams, or flowcharts in markdown files
- Mermaid diagrams render properly in most markdown viewers and provide better maintainability than ASCII art
- Use appropriate Mermaid diagram types:
  - `graph` or `flowchart` for architecture diagrams
  - `sequenceDiagram` for interaction flows
  - `stateDiagram` for state machines
  - `classDiagram` for class relationships
  - `erDiagram` for database schemas

## Coding Conventions

### Vue Components

- Use Composition API (Vue 3) for new components
- Single File Components (SFC) with `<script setup>` syntax
- Component names in PascalCase
- File names match component names (PascalCase)

### JavaScript/TypeScript

- Use modern ES6+ syntax
- Prefer const over let, avoid var
- Use async/await for asynchronous operations
- Consistent indentation (2 spaces)
- Semicolons optional but consistent within file

### Naming Conventions

- **Components**: PascalCase (e.g., `TaskList.vue`)
- **Files**: Match component names or kebab-case for utilities
- **Variables/Functions**: camelCase (e.g., `getTaskById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **CSS Classes**: kebab-case (e.g., `task-item`)

### Code Organization

- Keep components focused and single-purpose
- Extract reusable logic into composables
- **Extract pure functions from components**: Pure functions should live in separate modules
  (`utils/`, `services/`) so they can be tested in isolation
- Separate data access into service modules
- Use clear, descriptive names for functions and variables
- Add comments for complex logic, not obvious code
- **Keep components small**: Smaller components require less setup for testing and are easier to understand and maintain

### Local-First Development Patterns

- **Always read from local storage first**: Never block UI waiting for network
- **Write optimistically**: Update local storage immediately, sync in background
- **Use reactive state**: Vue components should react to local storage changes
- **Service layer pattern**: Components → Services → IndexedDB (not direct API calls)
- **Sync engine abstraction**: Components don't need to know about sync details
- **Error handling**: Handle sync failures gracefully, show sync status to user
- **Conflict resolution**: Implement at sync layer, not in components

## Git Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches

### Atomic Commits

This project uses **atomic commits** following the
[Conventional Commits](https://www.conventionalcommits.org/) specification. Each commit should represent a single,
logical change.

**Principles:**

- One logical change per commit
- Commit should be complete and working
- Easy to understand what changed and why
- Easy to revert if needed

**Making Commits:**

```bash
# Interactive commit (recommended - uses Commitizen)
npm run commit

# Or use git commit with conventional format
git commit -m "feat: add task creation functionality"
```

### Commit Message Format

Follow the Conventional Commits specification:

```text
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, whitespace, etc.)
- `refactor`: Code refactoring without changing functionality
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Changes to build system or dependencies
- `ci`: Changes to CI configuration
- `chore`: Other changes (maintenance, tooling, etc.)
- `revert`: Revert a previous commit

**Scope (optional):** Component, module, or area affected

**Subject:** Brief description (imperative mood, lowercase, no period)

**Body (optional):** Detailed explanation of what and why

**Footer (optional):** Breaking changes, issue references

### Example Commit Messages

```text
feat: add task creation form component
fix(sync): resolve conflict resolution bug
docs: update architecture diagram with Mermaid
refactor(storage): extract IndexedDB wrapper to separate module
perf: optimize task list rendering with virtual scrolling
test: add unit tests for sync engine
build: update Vue to 3.4.0
chore: update dependencies
```

### Git Hooks

**Pre-commit Hook:**

- Automatically runs `lint-staged` on staged files
- Currently configured to lint markdown files
- Prevents committing code with linting errors

**Commit-msg Hook:**

- Validates commit message format using Commitlint
- Ensures commits follow Conventional Commits specification
- Prevents commits with invalid message format

**Bypassing Hooks (Not Recommended):**

```bash
git commit --no-verify -m "message"
```

Only use `--no-verify` in exceptional circumstances and document why.

## Development Workflow

1. Create a feature branch from `develop`
2. Make changes following coding conventions
   - Write tests alongside code (not as an afterthought)
   - Extract pure functions to enable isolated testing
   - Keep components small for easier testing
3. Run tests locally to ensure everything passes
4. Commit with clear messages (including test commits)
5. Push and create pull request
6. Review and merge to `develop`
7. Deploy from `develop` or `main` as appropriate

## Testing Strategy

### Testing Requirements

**All code must have tests.** This is a core requirement for maintaining code quality and preventing regressions.

### Testing Principles

1. **Test Real Code**: Tests must import and test the actual functions and modules that are
   shipped in production
   - Import from the same modules used by the application
   - Avoid creating test-only versions of code
   - Test the actual implementation, not mocks

2. **Minimize Mocking**: Avoid mocking whenever possible
   - Prefer real implementations over mocks
   - Only mock external dependencies (APIs, file system, etc.) when necessary
   - Use real IndexedDB for testing (with test database instances)
   - Mock only when the real dependency is impractical (network calls, timers, etc.)

3. **Extract Pure Functions**: Keep pure functions outside of components
   - Pure functions should live in `utils/` or `services/` modules
   - This allows testing functions in isolation without component setup
   - Example: Extract validation logic, data transformations, calculations to separate modules

4. **Keep Components Small**: Smaller components are easier to test
   - Minimal setup required for component tests
   - Easier to understand and maintain
   - Focus on testing component behavior, not implementation details

### Testing Structure

**Tests must be colocated with the modules they test.** Component and unit tests should be placed next to the files they test using the `.test.js` or `.test.ts` extension.

- **Unit Tests**: For utilities, services, and pure functions
  - Colocated with the module being tested (e.g., `utils/formatDate.test.ts` next to `utils/formatDate.ts`)
  - Test in isolation without component setup
  - Fast execution
  - High coverage of business logic

- **Component Tests**: For Vue components
  - Colocated with the component (e.g., `TaskItem.test.js` next to `TaskItem.vue`)
  - Test component behavior and user interactions
  - Minimal setup required due to small component size
  - Use @testing-library/vue (preferred) or @vue/test-utils for component testing
  - @testing-library/vue encourages testing from user perspective with queries like `getByRole`, `getByText`, etc.
  - Both frameworks are available; choose the most appropriate for each test case

- **Integration Tests**: For critical user flows
  - May be colocated with relevant modules or placed in a shared location if they span multiple modules
  - Test complete workflows end-to-end
  - Use real dependencies where possible
  - Verify data flows through the application

- **Manual Testing**: For UI/UX validation
  - Visual regression testing
  - Accessibility testing
  - User experience validation

### Testing Examples

#### ✅ Good: Pure Function in Separate Module

```javascript
// utils/taskHelpers.js
export function formatTaskDueDate(date) {
  // Pure function, easily testable
  return new Date(date).toLocaleDateString();
}

// utils/taskHelpers.test.js (colocated)
import { formatTaskDueDate } from './taskHelpers';
// Test the actual function without component setup
```

#### ❌ Bad: Pure Function Inside Component

```javascript
// TaskComponent.vue
<script setup>
function formatTaskDueDate(date) {
  // Hard to test - requires component setup
  return new Date(date).toLocaleDateString();
}
</script>
```

#### ✅ Good: Small Component with Extracted Logic

```javascript
// TaskItem.vue - Small, focused component
<script setup>
import { formatTaskDueDate } from '@/utils/taskHelpers';
// Minimal setup for testing
</script>

// TaskItem.test.js (colocated)
// Test component behavior without complex setup
```

#### ✅ Good: Testing Real Implementation

```javascript
// services/taskService.js
export class TaskService { ... }

// services/taskService.test.js (colocated)
import { TaskService } from './taskService';
import { openDB } from 'idb'; // Real IndexedDB

// Use real IndexedDB with test database
const testDB = await openDB('test-tasks', 1, { ... });
// Test actual service implementation
```

#### ❌ Bad: Excessive Mocking

```javascript
// taskService.test.js
import { TaskService } from './taskService';
jest.mock('./taskService'); // Don't mock what you're testing!
// This tests nothing useful
```

## Code Quality

### Linting

- Use ESLint for JavaScript/TypeScript
- Use stylelint for CSS
- Configure pre-commit hooks for linting

### Formatting

- Use Prettier for code formatting
- Consistent formatting across the codebase
- Auto-format on save (IDE configuration)

## Styling with Tailwind CSS

This project uses **Tailwind CSS** for styling. Tailwind is a utility-first CSS framework that enables rapid UI development with consistent design patterns.

### Configuration

- **Config File**: `tailwind.config.js` - Configure content paths, theme, and plugins
- **PostCSS Config**: `postcss.config.js` - Processes Tailwind and Autoprefixer
- **Main CSS**: `src/style.css` - Contains Tailwind directives and custom base styles

### Usage Guidelines

#### Utility Classes

Use Tailwind utility classes directly in Vue component templates:

```vue
<template>
  <div class="p-4 bg-blue-50 rounded-lg">
    <h1 class="text-2xl font-bold text-slate-800">Title</h1>
    <p class="text-slate-600">Content</p>
  </div>
</template>
```

#### Responsive Design

Use Tailwind's responsive prefixes for mobile-first design:

```vue
<div class="text-sm md:text-base lg:text-lg">
  Responsive text sizing
</div>
```

#### Component Extraction

When utility class combinations are repeated, extract them into reusable components:

```vue
<!-- Instead of repeating: -->
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Button
</button>

<!-- Create a Button component -->
```

#### Custom Styles

- **Base Styles**: Add custom base styles in `src/style.css` using `@layer base`
- **Component Styles**: Use `@layer components` for reusable component classes
- **Utilities**: Use `@layer utilities` for custom utility classes

#### VS Code IntelliSense

Install the **Tailwind CSS IntelliSense** extension for VS Code to get:

- Autocomplete for Tailwind classes
- Linting for invalid class names
- Hover previews of generated CSS

**Extension**: [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Best Practices

1. **Prefer Utility Classes**: Use Tailwind utilities over custom CSS when possible
2. **Mobile-First**: Design for mobile first, then enhance for larger screens
3. **Consistent Spacing**: Use Tailwind's spacing scale (p-4, m-2, gap-6, etc.)
4. **Semantic Colors**: Use Tailwind's color palette (slate, blue, green, etc.)
5. **Extract Components**: When utility combinations repeat, create components
6. **Custom Theme**: Extend Tailwind theme in `tailwind.config.js` for project-specific values

### Content Purging

Tailwind automatically purges unused styles in production builds. Ensure all files using Tailwind classes are included in `tailwind.config.js` content paths:

```js
content: [
  "./index.html",
  "./src/**/*.{vue,js,ts,jsx,tsx}",
]
```

### Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS IntelliSense Extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Dependencies

### Adding Dependencies

- Prefer well-maintained, popular packages
- Check bundle size impact
- Consider alternatives for large dependencies
- Document why a dependency is needed

### Updating Dependencies

- Regular security updates
- Test thoroughly after major version updates
- Keep dependencies up to date but stable

## Environment Configuration

- Use environment variables for configuration
- Separate configs for development, staging, production
- Never commit secrets or API keys
- Document required environment variables

### Sync Environment Variables

- `VITE_SYNC_API_BASE_URL`: Base URL for the Cloudflare Workers sync API
  - Example: `https://tasks-sync.joemaffei.dev`
  - If unset, sync is disabled in the UI

## Local-First Development

### Core Principles

- **Local storage is the source of truth** for UI operations
- **Network is an enhancement**, not a requirement
- **Optimistic updates** - update UI immediately, sync later
- **Background synchronization** - never block user operations

### Implementation Guidelines

#### Data Access Pattern

```javascript
// ✅ Good: Read from local storage
const tasks = await taskService.getAllTasks() // Reads from IndexedDB

// ❌ Bad: Direct API calls for reads
const response = await fetch('/api/tasks') // Blocks on network
```

#### Write Pattern

```javascript
// ✅ Good: Write locally, sync in background
await taskService.createTask(newTask) // Writes to IndexedDB, queues sync

// ❌ Bad: Wait for server response
const task = await fetch('/api/tasks', { method: 'POST', ... }) // Blocks UI
```

#### Sync Status

- Show sync status indicator to user
- Handle sync errors gracefully
- Allow manual sync trigger if needed
- Queue failed syncs for retry

#### Sync Workflow

1. Local writes go through `taskService` and update IndexedDB
2. A sync queue entry is created for the task (`upsert` or `delete`)
3. The sync service pushes queued changes to the Workers endpoint
4. The sync service pulls remote changes and merges with last-write-wins

#### Testing Local-First

- Test with network disabled
- Test sync behavior when network restored
- Test conflict resolution scenarios
- Test multi-device synchronization

## Performance Best Practices

- **Local-first benefits**: Instant reads/writes from IndexedDB
- **Efficient sync**: Only sync deltas, not full datasets
- Lazy load routes
- Code split large dependencies
- Optimize images and assets
- Minimize bundle size
- Use efficient data structures
- Implement proper caching strategies

## Accessibility

- Semantic HTML
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## Browser Support

- Modern browsers (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## Project Management

This project uses backlog.md for task and decision management. See
[Project Management](PROJECT_MANAGEMENT.md) for detailed information about using backlog.md.
