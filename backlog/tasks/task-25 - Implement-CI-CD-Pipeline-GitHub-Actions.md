---
id: task-25
title: Implement CI/CD Pipeline via GitHub Actions
status: To Do
assignee: []
created_date: '2026-01-14'
labels:
  - ci
  - cd
  - github-actions
  - infrastructure
dependencies:
  - task-3
  - task-4
  - task-5
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create a GitHub Actions pipeline for jm-tasks that runs lint, type-check, and tests on every pull request, builds the app on push to main, and provides clear CI status. Keep the workflow aligned with existing npm scripts and Cloudflare Pages deployment flow.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [ ] GitHub Actions workflow added under `.github/workflows/`
- [ ] CI runs on pull requests and pushes to `main`
- [ ] Lint, format (if applicable), type-check, and tests are executed in CI
- [ ] Build step runs successfully and produces `dist`
- [ ] CI status is visible in PR checks
- [ ] Node.js version aligns with project tooling (`.nvmrc` / package.json)
- [ ] Workflow is documented in `docs/DEPLOYMENT.md` or `docs/DEVELOPMENT.md`

## Technical Implementation

**Workflow Setup:**

1. Create workflow file (e.g., `ci.yml`) with triggers:
   - `pull_request` on all branches
   - `push` on `main`
2. Use `actions/checkout` and `actions/setup-node` (Node 22 LTS).
3. Cache npm dependencies using built-in `cache: 'npm'`.
4. Install dependencies with `npm ci`.

**CI Steps (order):**

1. Lint (ESLint)
2. Type-check (`vue-tsc`)
3. Unit tests (Vitest)
4. Build (`npm run build`)

**Optional Enhancements:**

- Upload `dist` as an artifact on main branch builds
- Add concurrency to cancel redundant runs

## Dependencies

- Task 3 (Vue 3 project initialized)
- Task 4 (ESLint and Prettier configured)
- Task 5 (Vitest testing framework configured)
- GitHub Actions enabled on repository

## Deliverables

1. GitHub Actions CI workflow file committed
2. CI checks visible on PRs
3. Build verification on main branch pushes
4. Documentation updated with CI details

## Testing

- Open a PR to verify CI checks run and pass
- Push to `main` (or simulate in a test branch) to verify build step
- Confirm `dist` builds successfully in CI logs

## Notes

- Cloudflare Pages can continue handling deploys; CI here focuses on validation
- If deployment via GitHub Actions is desired later, extend workflow in a follow-up task

**Estimated Effort:** 1-2 hours
**Priority:** High
**Labels:** ci, cd, github-actions, infrastructure
