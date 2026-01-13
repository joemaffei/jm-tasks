# jm-tasks

A task management Progressive Web Application (PWA) built with Vue.js, designed for personal productivity and
hosted on Cloudflare.

## Overview

jm-tasks is a personal task management application that will be accessible at
[tasks.joemaffei.com](https://tasks.joemaffei.com). The application is currently in early development, starting
with a minimal single-user setup and designed to scale to support multiple users with robust authentication in the
future.

## Tech Stack

- **Frontend Framework**: Vue.js
- **Data Architecture**: Local-first with IndexedDB and sync engine
- **Deployment**: Cloudflare Pages
- **Remote Storage**: Cloudflare Durable Objects (for sync)
- **Domain**: tasks.joemaffei.com
- **Type**: Progressive Web Application (PWA)

## Development Setup

### Prerequisites

- **Node.js**: Version 22 LTS (required)
- **nvm**: Node Version Manager (recommended)

### Getting Started

1. **Install/Use Node.js 22 LTS**:

   ```bash
   # If using nvm (recommended)
   nvm use

   # Or install Node.js 22 LTS manually
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run markdown linting**:

   ```bash
   npm run lint:md        # Check for issues
   npm run lint:md:fix    # Auto-fix issues
   ```

### Auto-Fix on Save

The project is configured to automatically fix markdown linting issues on save when using VS Code:

- Markdown files are automatically formatted and linted on save
- Uses markdownlint with default rules (see `.markdownlint.json` for configuration)

### Node.js Version Management

The project uses `.nvmrc` to specify the required Node.js version (22 LTS). If you're using nvm, running `nvm use`
in the project directory will automatically switch to the correct version.

The `package.json` includes an `engines` field that enforces Node.js 22+ and will warn during `npm install` if
an incompatible version is detected.

### Atomic Commits

This project uses **atomic commits** with the
[Conventional Commits](https://www.conventionalcommits.org/) specification to make changes easier to track and
understand.

**Making commits:**

```bash
# Interactive commit (recommended)
npm run commit

# Or use git commit with conventional format
git commit -m "feat: add task creation functionality"
```

**Commit message format:**

```text
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Other changes (dependencies, etc.)
- `revert`: Revert a previous commit

**Examples:**

- `feat: add task creation form`
- `fix: resolve sync conflict resolution bug`
- `docs: update architecture diagram`
- `refactor: extract sync engine to separate module`

**Git Hooks:**

- **Pre-commit**: Automatically runs markdown linting on staged files
- **Commit-msg**: Validates commit message format

To bypass hooks (not recommended):

```bash
git commit --no-verify -m "message"
```

## Current Status

The project is in the initial setup phase. The repository structure and AI-assisted development context are being
established before application development begins.

## Documentation

- [Architecture](docs/ARCHITECTURE.md) - System architecture and technical design
- [Development Guidelines](docs/DEVELOPMENT.md) - Coding conventions and project structure
- [Authentication](docs/AUTHENTICATION.md) - Authentication strategy and security considerations
- [Deployment](docs/DEPLOYMENT.md) - Deployment setup and CI/CD configuration

## AI-Assisted Development

This repository includes context files in the `.ai/` directory to help AI assistants understand the project
structure, conventions, and technical decisions. These files are platform-agnostic and can be used with any AI
development tool.

## Future Plans

- Multi-user support with Google and Apple authentication
- Migration to a more robust cloud-hosted database if needed
- Enhanced features for collaborative task management

## License

Private project - All rights reserved.
