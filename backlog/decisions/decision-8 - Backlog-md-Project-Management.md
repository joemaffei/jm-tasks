---
id: decision-8
title: Backlog.md for Project Management
date: '2026-01-13'
status: accepted
---

## Context

We need a project management system to track tasks, decisions, and collaborate between humans and AI agents.
Requirements:

- Task management
- Decision documentation (ADR format)
- Works in git repository
- Markdown-based (fits well with documentation)
- AI-friendly (can be used with AI assistants)
- Lightweight and simple
- No external service dependencies

Considered options: GitHub Issues, Linear, Jira, custom markdown files, backlog.md.

## Decision

Use **backlog.md** for project management.

backlog.md provides:

- Task management with markdown files
- Decision records (ADR format)
- Git-integrated (all files in repository)
- Markdown-based format
- CLI tools for managing tasks
- MCP (Model Context Protocol) integration for AI tools
- Web UI available
- No external service dependencies
- Lightweight and simple

## Consequences

### Positive

- All project management in git repository (version controlled)
- Markdown format is human-readable and AI-friendly
- No external service dependencies
- CLI tools for task management
- MCP integration works well with AI assistants
- Decision records in ADR format
- Simple and lightweight
- Can be installed as dev dependency (not global)

### Negative

- Less feature-rich than specialized project management tools
- Requires CLI usage (but web UI available)
- Learning curve for team members (but minimal)

### Implementation Notes

- Installed as dev dependency: `backlog.md@^1.28.1`
- Initialized with MCP integration
- Tasks stored in `backlog/tasks/` directory
- Decisions stored in `backlog/decisions/` directory
- Use `npx backlog` commands to manage tasks
