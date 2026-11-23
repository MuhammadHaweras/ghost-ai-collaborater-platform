# Development Workflow

## Approach

Build the Laravel modular monolith incrementally using a spec-driven workflow. Read the context files for feature scope, module boundaries, and progress. Use the dependency manifests and application code to confirm what is already wired.

## Scoping Rules

- Work in one feature module or subsystem at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step.

## When To Split Work

Split an implementation step when it combines unrelated work, such as the following.

- Inertia UI changes and Redis-backed AI job changes
- Yjs collaboration changes and PostgreSQL or R2 persistence changes
- Unrelated Laravel routes or feature modules
- Behavior that is not clearly defined in the context files

Split steps further when they cannot be verified independently.

## Handling Missing Requirements

- Do not invent product behavior that is not defined in the context files.
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.
- Record unresolved implementation questions in `progress-tracker.md` when tracker updates are in scope.

## Protected Foundation Components

Do not modify generated third-party foundation components unless explicitly instructed.

This includes the following.

- Shared shadcn/ui primitives under `resources/js/components/ui/` when present
- Third-party package internals

These should remain default and reusable.

Project-specific styling, layout changes, and feature logic must be implemented in app-level components instead of modifying foundation components.

Only modify these files when a task explicitly requires it.

## Keeping Docs In Sync

Update the relevant context file when implementation changes any of the following.

- Module boundaries or cross-module contracts
- PostgreSQL metadata or private R2 artifact storage
- Inertia, collaboration, or queued Laravel AI SDK conventions
- Feature scope

Record verified implementation progress separately from target architecture decisions.

## Before Moving To The Next Unit

1. The current unit works end to end within its defined scope.
2. No invariant defined in `architecture-context.md` was violated.
3. `progress-tracker.md` reflects the completed work when tracker updates are in scope.
