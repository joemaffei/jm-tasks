---
id: decision-7
title: Node.js 22 LTS for Development
date: '2026-01-13'
status: accepted
---

## Context

We need to choose the Node.js version for development environment. Current LTS options (as of January 2026):

- Node.js 20 LTS
- Node.js 22 LTS

Considerations:

- LTS (Long Term Support) preferred for stability
- Latest features and performance improvements
- Compatibility with development tools
- Team/CI environment requirements

## Decision

Use **Node.js 22 LTS** as the required Node.js version for the project.

Enforced via:

- `.nvmrc` file specifying Node.js 22
- `package.json` engines field: `node: >=22.0.0, npm: >=10.0.0`
- `postinstall` script to warn on incompatible versions

## Consequences

### Positive

- Latest LTS version with improved performance
- Access to latest JavaScript features
- Better compatibility with modern tooling
- Future-proof choice
- nvm integration for easy version management

### Negative

- Requires developers to have Node.js 22 installed (but nvm makes this easy)
- May not work on older systems (but fine for development machines)

### Implementation Notes

- Use `.nvmrc` file for nvm integration
- Document Node.js version requirement in README
- Use `nvm use` command to switch to correct version
- Enforce via package.json engines field
