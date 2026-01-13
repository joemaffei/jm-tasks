# Project Management

This project uses [backlog.md](https://github.com/MrLesk/Backlog.md) for task management, decision tracking, and
collaboration between humans and AI agents.

## Overview

backlog.md is a git-integrated project management tool that stores tasks and decisions as markdown files in the
repository. All project management data is version-controlled alongside the code.

## Installation

backlog.md is installed as a dev dependency. After running `npm install`, you can use it via `npx backlog` commands.

## Directory Structure

- `backlog/tasks/` - Active tasks
- `backlog/drafts/` - Draft tasks
- `backlog/completed/` - Completed tasks
- `backlog/decisions/` - Architecture Decision Records (ADRs)
- `backlog/docs/` - Project documentation
- `backlog/config.yml` - Backlog.md configuration

## Common Commands

### Task Management

```bash
# List all tasks
npx backlog task list

# Create a new task
npx backlog task create "Task title" --description "Task description"

# View a task
npx backlog task view task-1

# Edit a task
npx backlog task edit task-1 --status "In Progress"

# View tasks in Kanban board
npx backlog board
```

### Decision Records

```bash
# Create a decision record
npx backlog decision create "Decision title"

# View decisions (files in backlog/decisions/)
```

### Web UI

```bash
# Open web interface for task management
npx backlog browser
```

### Search

```bash
# Search tasks, decisions, and documents
npx backlog search "search query"
```

## Workflow Integration

- All tasks and decisions are stored as markdown files in the `backlog/` directory
- Tasks can reference each other using dependencies
- Decisions follow the ADR (Architecture Decision Record) format
- Changes to tasks/decisions are tracked in git history
- MCP (Model Context Protocol) integration enables AI assistants to work with backlog.md

## Configuration

Configuration is stored in `backlog/config.yml`. The project is configured with:

- MCP integration enabled for AI tool connectivity
- Git hooks enabled (commit messages must follow Conventional Commits)
- Statuses: To Do, In Progress, Done

## Best Practices

- Use clear, descriptive task titles
- Include acceptance criteria in tasks
- Document decisions as ADRs when making architectural or technical choices
- Keep tasks updated with current status
- Use labels to categorize tasks
- Reference related tasks using dependencies

For more information, see the [backlog.md documentation](https://github.com/MrLesk/Backlog.md).
