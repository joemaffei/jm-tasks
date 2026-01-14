# Tech Stack

## Frontend Framework

### Vue.js

- **Version**: Vue 3 (recommended)
- **API Style**: Composition API with `<script setup>` syntax
- **Reason**: Modern, progressive framework with excellent developer experience
- **Key Features**:
  - Reactive data binding
  - Component-based architecture
  - Single File Components (SFC)
  - Excellent tooling and ecosystem

### Build Tool

- **Recommended**: Vite
- **Reason**: Fast development server, optimized production builds
- **Alternatives**: Vue CLI (legacy), Nuxt.js (if SSR needed)

### Routing

- **Library**: Vue Router
- **Version**: Compatible with Vue 3
- **Purpose**: Client-side routing for SPA

### State Management

- **Approach**: Local-first with reactive state
- **Local Storage**: IndexedDB via library (e.g., Dexie.js, idb, or custom)
- **State Layer**: Vue reactive system + Pinia (recommended) for sync state
- **Data Flow**: Components → Services → IndexedDB → Sync Engine
- **Reactivity**: Vue components reactively update when IndexedDB changes

## PWA Requirements

### Local Storage

- **Technology**: IndexedDB (browser native)
- **Library**: **Dexie.js** (recommended)
  - Popular, well-maintained npm package
  - Vue-friendly wrapper for IndexedDB
  - Clean, promise-based API
  - TypeScript support
  - Excellent documentation
  - **Package**: `dexie` (npm)
  - **Documentation**: <https://dexie.org/>
- **Alternatives**:
  - **idb**: Lightweight Promise-based wrapper (if minimal API needed)
  - **Custom**: Direct IndexedDB API (not recommended)
- **Purpose**: Primary data storage, local-first architecture
- **Features**:
  - Structured data storage
  - Indexed queries
  - Transaction support
  - Large storage capacity
  - Works seamlessly with Dexie Cloud for sync

### Sync Engine

- **Purpose**: Bidirectional sync between local IndexedDB and remote server
- **Primary Choice**: **Dexie Cloud** (recommended)
  - Built on top of Dexie.js (already recommended for IndexedDB)
  - Well-maintained, popular npm package
  - Seamless integration with IndexedDB
  - Vue-friendly
  - Features:
    - Automatic change tracking
    - Delta sync (only sends changes)
    - Conflict resolution
    - Background sync
    - Multi-device synchronization
    - Real-time updates
  - **Package**: `dexie-cloud` (npm)
  - **Documentation**: <https://dexie.org/cloud/>
- **Alternative Options** (if Dexie Cloud doesn't fit):
  - **PowerSync** (`@powersync/web`): Uses SQLite instead of IndexedDB, may require architecture changes
  - **Replicache**: Local-first sync library, may be overkill for single-user initially
  - **ElectricSQL**: Real-time sync with PostgreSQL, more complex setup
- **Features Required**:
  - Change tracking (what changed locally)
  - Delta sync (only send changes)
  - Conflict detection and resolution
  - Background sync queue
  - Optimistic updates
  - Multi-device synchronization

### Service Worker

- **Purpose**: Background sync, caching, offline support
- **Implementation**: Workbox (recommended) or manual service worker
- **Features**:
  - Cache static assets
  - Background Sync API integration with sync engine
  - Offline queue for sync operations
  - Push notifications (future)

### Web App Manifest

- **Purpose**: Make app installable, define app metadata
- **Required Fields**:
  - name, short_name
  - icons (multiple sizes)
  - start_url
  - display (standalone or fullscreen)
  - theme_color, background_color

### PWA Checklist

- Service worker registered
- Web app manifest configured
- HTTPS enabled (automatic via Cloudflare)
- Responsive design
- Offline functionality
- App-like experience

## Cloudflare Services

### Cloudflare Pages

- **Purpose**: Static site hosting and deployment
- **Features**:
  - Automatic HTTPS
  - Global CDN
  - Git-based deployments
  - Preview deployments
  - Custom domains

### Cloudflare Workers

- **Purpose**: Serverless functions for API endpoints
- **Runtime**: V8 isolates
- **Use Cases**:
  - API endpoints for CRUD operations
  - Authentication handling
  - Data validation
  - Business logic

### Cloudflare KV

- **Purpose**: Key-value storage
- **Characteristics**:
  - Eventually consistent
  - Global distribution
  - Simple key-value interface
  - Good for simple data structures

### Cloudflare Durable Objects

- **Purpose**: Strongly consistent storage
- **Characteristics**:
  - Strong consistency
  - Stateful objects
  - Good for complex data relationships
  - More complex than KV

### Cloudflare R2

- **Purpose**: Object storage (S3-compatible)
- **Characteristics**:
  - S3-compatible API
  - No egress fees
  - Good for large files or backups

### Storage Architecture

- **Local (Primary)**: IndexedDB via Dexie.js
  - All reads/writes happen locally first
  - Fast, offline-capable, no network latency
  - Managed by Dexie.js library
- **Remote (Sync Target)**: Dexie Cloud backend or Cloudflare Durable Objects
  - **Dexie Cloud**: May provide its own backend service (check documentation)
  - **Cloudflare Durable Objects**: Custom backend if needed
    - Strong consistency for sync operations
    - Source of truth for multi-device sync
    - Better than KV for sync due to consistency guarantees
- **Alternative**: Cloudflare KV (if consistency requirements are lower)
- **Migration Path**: Dexie Cloud backend → Cloudflare Durable Objects → External database if needed

## Development Tools

### Package Manager

- **Recommended**: npm or pnpm
- **pnpm Benefits**: Faster, disk-efficient

### Code Quality

- **Linter**: ESLint
- **Formatter**: Prettier
- **Type Checking**: Consider TypeScript or JSDoc for type safety

### Version Control

- **Git**: Standard version control
- **Hosting**: GitHub, GitLab, or similar
- **Workflow**: Feature branches, pull requests

## Testing

### Testing Requirements

- **All code must have tests** - This is a core requirement
- Extract pure functions from components to enable isolated testing
- Keep components small to minimize test setup
- Test actual production code, not mocks of the code being tested
- Avoid mocking whenever possible - prefer real implementations

### Unit Testing

- **Framework**: Vitest (Vite-native, recommended) or Jest
- **Purpose**: Test utilities, services, and pure functions in isolation
- **Approach**:
  - Import actual functions/modules from production code
  - Use real IndexedDB instances for testing (test databases)
  - Only mock external dependencies when necessary

### Component Testing

- **Framework**: @testing-library/vue (preferred) and @vue/test-utils
- **Purpose**: Test Vue component behavior and interactions
- **Approach**:
  - Test small, focused components
  - Minimal setup required due to component size
  - Test component behavior, not implementation details
  - Use real composables and services where possible
  - @testing-library/vue encourages testing from user perspective with queries like `getByRole`, `getByText`
  - Both frameworks are available; choose the most appropriate for each test case

### E2E Testing

- **Framework**: Playwright (recommended) or Cypress
- **Purpose**: End-to-end user flow testing
- **Approach**: Test complete workflows with real dependencies

## Styling

### CSS Approach

- **Options**:
  - Scoped CSS in Vue components
  - CSS Modules
  - Utility-first (Tailwind CSS)
  - CSS-in-JS (less common in Vue)
- **Recommendation**: Start with scoped CSS, add Tailwind if needed

## API Communication

### HTTP Client

- **Library**: Native fetch (preferred for simplicity)
- **Alternative**: Axios if interceptors needed
- **Usage**: Primarily for sync operations, not direct data access

### Sync API Structure

- **Endpoint**: `/api/sync` or similar
- **Method**: POST for bidirectional sync
- **Request Format**:

  ```json
  {
    "clientId": "device-id",
    "lastSyncTimestamp": "2024-01-01T00:00:00Z",
    "changes": [
      { "type": "create|update|delete", "entity": "task", "data": {...} }
    ]
  }
  ```

- **Response Format**:

  ```json
  {
    "serverTimestamp": "2024-01-01T00:00:00Z",
    "changes": [...],
    "conflicts": [...]
  }
  ```

- **Error Handling**: Retry logic, exponential backoff
- **Authentication**: Bearer token in headers

## Environment Configuration

### Environment Variables

- Development, staging, production configs
- API endpoints
- Feature flags
- Cloudflare configuration

### Build Configuration

- Environment-specific builds
- Source maps for debugging
- Production optimizations

## Browser Support

### Target Browsers

- Modern browsers (last 2 versions)
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

### Progressive Enhancement

- Core functionality works without JavaScript
- Enhanced experience with JavaScript
- Graceful degradation

## Performance Tools

### Build Analysis

- Bundle analyzer
- Performance budgets
- Code splitting analysis

### Runtime Monitoring

- Web Vitals
- Performance API
- Error tracking

## Deployment Tools

### CI/CD

- Cloudflare Pages automatic deployments
- Git-based workflow
- Preview deployments for PRs

### Monitoring

- Cloudflare Analytics
- Error tracking (future)
- Performance monitoring (future)

## Documentation Tools

### Diagramming

- **Mermaid**: Always use Mermaid for charts, diagrams, and flowcharts in markdown files
- **Reason**: Better maintainability, proper rendering in markdown viewers, version control friendly
- **Supported Types**: flowcharts, sequence diagrams, state diagrams, class diagrams, ER diagrams
- **Never Use**: ASCII art diagrams (use Mermaid instead)

## Future Considerations

### Potential Additions

- TypeScript for type safety
- Component library (if UI components needed)
- Internationalization (i18n) if multi-language needed
- Analytics integration
- Error tracking service (Sentry, etc.)

### Migration Paths

- **Sync Engine**: Dexie Cloud (primary) → Alternative (PowerSync/Replicache) if requirements change
- **Conflict Resolution**: Dexie Cloud's default → Custom strategies if needed → Operational Transformation for multi-user
- **Remote Storage**: Dexie Cloud backend → Cloudflare Durable Objects → External DB if needed
- **Authentication**: Simple → OAuth providers
- **State Management**: Reactive → Pinia for sync state management
