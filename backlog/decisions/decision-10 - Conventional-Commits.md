---
id: decision-10
title: Conventional Commits for Git Workflow
date: '2026-01-13'
status: accepted
---

## Context

We need to establish commit message standards and git workflow. Options:

- Free-form commit messages
- Conventional Commits specification
- Other commit message formats

Requirements:

- Consistent commit message format
- Easy to understand commit history
- Support for automated tooling (changelog generation, etc.)
- Good for AI-assisted development (clear patterns)

## Decision

Use **Conventional Commits** specification for all git commits.

Implemented via:

- `@commitlint/cli` and `@commitlint/config-conventional` for validation
- `commitizen` and `cz-conventional-changelog` for interactive commits
- Husky git hooks to enforce commit message format
- Commit message format: `<type>(<scope>): <subject>`

Commit types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Other changes
- `revert`: Revert a previous commit

## Consequences

### Positive

- Consistent, readable commit history
- Easy to generate changelogs automatically
- Clear patterns for AI assistants to follow
- Better code review (clear commit purposes)
- Supports semantic versioning
- Industry-standard approach

### Negative

- Requires discipline to follow format
- Slightly more verbose commit messages
- Learning curve for team members (but minimal)

### Implementation Notes

- Use `npm run commit` for interactive commits (Commitizen)
- Git hooks validate commit messages automatically
- Pre-commit hook runs lint-staged for markdown files
- Commit-msg hook validates commit message format
- All commits should follow the format even if hooks are bypassed
