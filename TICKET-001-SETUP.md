# **Ticket Title**

## Setup AI-Assisted Development Context and Development Tooling

---

## **Description**

Set up the repository for AI-assisted development of the jm-tasks Vue PWA task management application. Establish
comprehensive documentation, development tooling, and coding standards to enable efficient development with AI
assistants while maintaining code quality and consistency.

---

## **Acceptance Criteria**

- [x] All documentation files created with platform-agnostic context
- [x] Architecture documented with local-first data architecture using Mermaid diagrams
- [x] Markdown linting configured with auto-fix on save
- [x] Node.js version management (nvm) configured for Node.js 22 LTS
- [x] Atomic commits with Conventional Commits enforced via git hooks
- [x] Testing guidelines established with requirements for all code
- [x] Sync engine library researched and documented (Dexie Cloud)
- [x] Development workflow and coding conventions documented

---

## **Technical Implementation**

### **1. Documentation Structure**

**Files to Create:**

- `README.md` - Project overview with navigation
- `docs/ARCHITECTURE.md` - System architecture with Mermaid diagrams
- `docs/DEVELOPMENT.md` - Coding conventions and workflow
- `docs/AUTHENTICATION.md` - Authentication strategy (Phase 1 & 2)
- `docs/DEPLOYMENT.md` - Cloudflare deployment setup
- `.ai/PROJECT_CONTEXT.md` - Comprehensive project context for AI assistants
- `.ai/TECH_STACK.md` - Detailed technology stack information

**Requirements:**

- Use Mermaid for all diagrams (no ASCII art)
- Platform-agnostic (not tool-specific)
- Clear separation between current state and future plans

### **2. Local-First Architecture Documentation**

**Updates Required:**

- Convert architecture to local-first data flow
- Document IndexedDB as primary storage
- Document sync engine architecture with Dexie Cloud recommendation
- Add data flow diagrams (local-first, sync, offline flows)
- Document conflict resolution strategies

**Diagram Requirements:**

- Use Mermaid flowchart for architecture diagram
- Use Mermaid sequence diagrams for authentication flows

### **3. Markdown Linting Setup**

**Configuration:**

- Install `markdownlint-cli2@^0.20.0`
- Create `.markdownlint.json` with default rules and customizations:
  - Line length: 120 (code blocks and tables excluded)
  - Disable MD033 (allowed HTML) and MD041 (first line heading)
- Add npm scripts: `lint:md` and `lint:md:fix`

**VS Code Integration:**

- Create `.vscode/settings.json` with auto-fix on save for markdown files
- Configure markdownlint settings in VS Code

### **4. Node.js Version Management**

**Setup:**

- Create `.nvmrc` file with Node.js 22 (current LTS as of January 2026)
- Update `package.json` with `engines` field:
  - `node`: `>=22.0.0`
  - `npm`: `>=10.0.0`
- Add `postinstall` script to warn on incompatible Node versions
- Update `README.md` with nvm setup instructions

### **5. Atomic Commits with Conventional Commits**

**Tools to Install:**

- `@commitlint/cli@^20.3.1`
- `@commitlint/config-conventional@^20.3.1`
- `commitizen@^4.3.1`
- `cz-conventional-changelog@^3.3.0`
- `husky@^9.1.7`
- `lint-staged@^16.2.7`

**Configuration Files:**

- `commitlint.config.js` - Conventional Commits rules
- `.husky/pre-commit` - Run lint-staged on staged markdown files
- `.husky/commit-msg` - Validate commit messages with Commitlint

**Package.json Updates:**

- Add `commit` script for interactive commits (`cz`)
- Add `prepare` script for Husky initialization
- Configure Commitizen path
- Configure lint-staged to fix markdown files on commit

**Documentation:**

- Add atomic commits section to `README.md` with examples
- Update `docs/DEVELOPMENT.md` Git workflow section with commit guidelines

### **6. Sync Engine Library Research & Documentation**

**Research:**

- Evaluate npm packages for local-first sync with IndexedDB
- Options: Dexie Cloud, PowerSync, Replicache, ElectricSQL

**Documentation Updates:**

- Update `docs/ARCHITECTURE.md` with Dexie Cloud as recommended sync engine
- Update `.ai/TECH_STACK.md` to recommend Dexie.js + Dexie Cloud
- Update `.ai/PROJECT_CONTEXT.md` with architecture decision
- List alternatives with trade-offs

**Requirements:**

- Must work with IndexedDB (not SQLite)
- Well-maintained and popular
- Vue-friendly integration
- Handles conflict resolution and multi-device sync

### **7. Testing Guidelines**

**Documentation Requirements:**

- Add testing strategy section to `docs/DEVELOPMENT.md`:
  - **Principle 1**: All code must have tests
  - **Principle 2**: Extract pure functions from components to `utils/` or `services/`
  - **Principle 3**: Keep components small for minimal test setup
  - **Principle 4**: Test actual production code (import real modules, not mocks)
  - **Principle 5**: Avoid mocking whenever possible (only mock external dependencies)

**Code Organization Updates:**

- Update code organization section to emphasize extracting pure functions
- Add examples of good vs. bad patterns
- Update project structure to include `tests/` directory

**Context File Updates:**

- Add testing requirements to `.ai/PROJECT_CONTEXT.md` AI notes
- Update `.ai/TECH_STACK.md` testing section with requirements

---

## **Dependencies**

- Node.js 22 LTS
- npm 10+
- Git (for hooks)
- VS Code (for editor settings, optional)

---

## **Deliverables**

1. Complete documentation structure (7 markdown files)
2. Configuration files (8 config files)
3. Git hooks (pre-commit, commit-msg)
4. npm scripts and dependencies (7 dev dependencies)
5. Updated README with setup instructions

---

## **Testing**

- Verify markdown linting works: `npm run lint:md`
- Verify auto-fix works: `npm run lint:md:fix`
- Verify commit hooks work: Attempt an invalid commit message
- Verify interactive commits: `npm run commit`
- Verify nvm integration: `nvm use` should switch to Node 22
- Verify Node version check: Install with Node 18/19 should show warning

---

## **Notes**

- All documentation is platform-agnostic (not Cursor-specific)
- Mermaid diagrams are required for all architecture/flow diagrams
- Testing guidelines emphasize real implementations over mocks
- Dexie Cloud chosen over custom sync implementation for maintainability

---

**Estimated Effort:** 4-6 hours
**Priority:** High (foundational setup)
**Labels:** setup, documentation, tooling, dev-ex
