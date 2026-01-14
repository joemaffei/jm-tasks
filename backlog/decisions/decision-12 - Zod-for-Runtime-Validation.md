---
id: decision-12
title: Zod for Runtime Validation
date: '2026-01-13'
status: accepted
---

## Context

We need runtime validation for data at application boundaries, particularly for:

- IndexedDB storage (validating data before storing/retrieving)
- API responses (validating data from external sources)
- User input validation
- Data synchronization (validating data during sync operations)

TypeScript provides compile-time type safety, but does not validate data at runtime. Runtime validation is essential for:

- Ensuring data integrity in IndexedDB
- Catching invalid data before it corrupts the database
- Validating data from external sources (APIs, sync operations)
- Providing type-safe data validation with TypeScript inference

Requirements:

- Runtime validation for application boundaries
- Type inference from validation schemas
- Integration with TypeScript
- Good developer experience
- Well-maintained library
- Small bundle size

## Decision

Use **Zod** for runtime validation at application boundaries.

Zod provides:

- Runtime validation with TypeScript type inference
- Schema-first approach - define schema once, get both runtime validation and types
- Excellent TypeScript integration
- Small bundle size
- Well-maintained and popular
- Clean, readable API
- Good developer experience

## Consequences

### Positive

- Runtime validation ensures data integrity
- Type inference eliminates duplicate type definitions
- Single source of truth for data shape (schema defines both validation and types)
- Catches invalid data before it corrupts the database
- Validates data from external sources (APIs, sync)
- Excellent TypeScript integration
- Well-maintained library with active development
- Good developer experience

### Negative

- Additional dependency (but small bundle size)
- Learning curve (but minimal)
- Schema definition overhead (but benefits outweigh)

### Implementation Notes

- Use Zod for validating data at application boundaries:
  - IndexedDB storage (validate before storing, after retrieving)
  - API responses (validate incoming data)
  - User input (validate form data)
  - Sync operations (validate synced data)
- Infer TypeScript types from Zod schemas using `z.infer<typeof schema>`
- Define schemas in the same module where they're used (or in shared schema modules)
- Use schema validation before storing data in IndexedDB
- Use schema validation when retrieving data from IndexedDB (defensive programming)
- Validate API responses before using data
- Export schemas for reuse across the application
