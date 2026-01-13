---
id: decision-6
title: Single-User Initially, Multi-User Later
date: '2026-01-13'
status: accepted
---

## Context

We need to decide on the initial scope for user management and authentication. Options:

- Start with multi-user support and authentication from day one
- Start with single-user (Joe Maffei) and add multi-user support later
- Start with minimal authentication and scale up

Considerations:

- Personal project scope
- Development complexity
- Time to market
- Authentication requirements for single user vs multi-user
- Data isolation requirements

## Decision

Start with **single-user architecture** (Joe Maffei only) with plans to add multi-user support in Phase 2.

Phase 1 (Initial):

- Single user (Joe Maffei)
- Minimal authentication requirements
- Simplified data model (no user isolation needed)
- Faster development and deployment

Phase 2 (Future):

- Multi-user support
- OAuth authentication (Google, Apple)
- User data isolation
- Enhanced security for multi-user environment

## Consequences

### Positive

- Faster initial development - no complex authentication system needed
- Simplified data model - no user isolation logic required
- Lower initial complexity
- Can validate core functionality before adding multi-user complexity
- Easier deployment and testing
- Reduced security surface area initially

### Negative

- Will need to refactor data model when adding multi-user support
- Authentication system needs to be added later (but planned from start)
- Some architecture decisions may need adjustment for multi-user (but local-first architecture supports this well)

### Implementation Notes

- Design data models with future multi-user support in mind
- Document authentication strategy for Phase 2
- Keep architecture flexible for adding user isolation later
- Local-first architecture makes multi-user transition easier (each user has their own local storage)
