# Project Context

## Purpose

jm-tasks is a personal task management Progressive Web Application (PWA) designed to help Joe Maffei organize and
manage tasks efficiently. The application will be accessible at tasks.joemaffei.com and is built with Vue.js,
deployed on Cloudflare.

## Current State

The project is in the initial setup phase. The repository structure and AI-assisted development context are being
established. No application code has been written yet. The focus is on creating a solid foundation for AI-assisted
development.

## Project Goals

### Immediate Goals (Phase 1)

- Build a functional task management PWA
- Single-user authentication (minimal setup for Joe Maffei)
- Core task management features (create, read, update, delete tasks)
- Offline functionality via PWA capabilities
- Deployment to tasks.joemaffei.com via Cloudflare

### Future Goals (Phase 2)

- Multi-user support
- OAuth authentication (Google, Apple)
- Enhanced collaboration features
- Migration to more robust database if Cloudflare storage proves insufficient
- Advanced task management features

## Key Decisions

### Technology Choices

- **Vue.js**: Chosen for its progressive framework approach and developer experience
- **Cloudflare**: Selected for hosting, CDN, and initial data storage
- **PWA**: Enables offline functionality and app-like experience
- **Single-user initially**: Simplifies development and deployment

### Architecture Decisions

- **Local-First Data Architecture**: Data stored in IndexedDB, synced to remote
- **Sync Engine**: **Dexie Cloud** - well-maintained npm package for bidirectional synchronization
  - Uses Dexie.js (IndexedDB wrapper) + Dexie Cloud (sync layer)
  - No custom sync implementation needed
  - Handles change tracking, conflict resolution, and multi-device sync
- **Client-side rendering** with Vue.js
- **Cloudflare Workers** for sync API endpoints (if Dexie Cloud requires custom backend)
- **Cloudflare Durable Objects** as remote source of truth (or Dexie Cloud's backend)
- **Progressive enhancement** approach
- **Offline-first**: Full functionality without internet connection

## Constraints

### Current Constraints

- Single user (Joe Maffei) only
- Minimal authentication requirements
- Cloudflare ecosystem for hosting and storage
- Personal project scope

### Future Considerations

- Scalability for multiple users
- More robust authentication requirements
- Potential need for dedicated database
- Enhanced security for multi-user environment

## Project Structure

The project follows a standard Vue.js application structure:

- `src/` - Source code
- `docs/` - Documentation
- `.ai/` - AI context files
- `public/` - Public assets

## Development Approach

- AI-assisted development using platform-agnostic context files
- Iterative development starting with core features
- Documentation-driven development
- Clear separation of concerns

## Domain and Hosting

- **Domain**: tasks.joemaffei.com
- **Hosting**: Cloudflare Pages
- **CDN**: Cloudflare global network
- **SSL**: Automatic via Cloudflare

## User Context

- **Primary User**: Joe Maffei
- **Use Case**: Personal task management
- **Access**: Web browser, mobile browser (PWA)
- **Offline Support**: Full offline functionality via local-first architecture
  - All data stored locally in IndexedDB
  - Changes sync in background when online
  - Multi-device synchronization

## Success Criteria

### Phase 1

- Application is accessible at tasks.joemaffei.com
- User can create, view, update, and delete tasks
- **Local-first**: All operations work offline, instant UI updates
- **Sync**: Changes sync across devices when online
- Data persists locally across sessions
- Fast load times (no network dependency for reads)
- Background synchronization works reliably

### Phase 2

- Multiple users can use the application
- OAuth authentication works seamlessly
- User data is properly isolated
- Application scales to support multiple concurrent users

## Important Notes for AI Assistants

- **CRITICAL: Always run `nvm use` first** - The project requires Node.js 22 LTS. Before running any npm commands, terminal commands, or development tasks, ALWAYS run `nvm use` to ensure the correct Node.js version is active. The project uses `.nvmrc` to specify Node.js 22.
- This is a personal project, not a commercial product
- Focus on simplicity and maintainability
- Code should be well-documented
- Follow Vue.js best practices
- **Local-first architecture**: All data operations should work against local storage first
- Sync engine handles remote synchronization transparently
- Consider PWA requirements in all implementations
- Keep Cloudflare deployment constraints in mind
- Plan for future scalability but don't over-engineer
- Optimize for offline experience - network is enhancement, not requirement
- **Documentation**: Always use Mermaid for any charts, diagrams, or flowcharts in markdown files (never ASCII art)
- **Testing Requirements**:
  - All code must have tests
  - Extract pure functions from components to `utils/` or `services/` modules for isolated testing
  - Keep components small to minimize test setup
  - Tests must import and test actual production code (not mocks of the code being tested)
  - Avoid mocking whenever possible - prefer real implementations
  - Only mock external dependencies when necessary (APIs, file system, etc.)

## Related Documentation

- [Architecture](docs/ARCHITECTURE.md) - Technical architecture details
- [Development Guidelines](docs/DEVELOPMENT.md) - Coding conventions
- [Authentication](docs/AUTHENTICATION.md) - Auth strategy
- [Deployment](docs/DEPLOYMENT.md) - Deployment setup
- [Tech Stack](.ai/TECH_STACK.md) - Detailed technology information
