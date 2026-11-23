# Code Standards

## General

- Organize backend features as focused `internachi/modular` modules.
- Fix root causes and reuse existing module contracts.
- Do not mix unrelated concerns in one component or route.
- Respect the system boundaries defined in `architecture-context.md`.

## TypeScript

- Strict mode is required throughout the project.
- Use explicit interfaces or narrowly scoped types in place of `any`.
- Validate unknown external input at system boundaries before trusting it.
- Use `interface` for object contracts.

## Laravel and Inertia

- Return Inertia pages with explicit props from Laravel routes or controllers.
- Keep React components focused on UI and use React Flow for graph interaction.
- Apply shared graph edits through Yjs. Use Awareness for cursors and presence.
- Dispatch long-running Laravel AI SDK calls to Redis-backed jobs monitored by Horizon.

## Styling

- Use CSS custom property tokens from the shared stylesheet for colors.
- Reference tokens through Tailwind utilities such as `bg-base`, `text-copy-primary`, and `text-brand`.
- Use `rounded-xl` for small elements, `rounded-2xl` for cards, and `rounded-3xl` for modals.

## Request Boundaries

- Validate request input before running domain logic.
- Use Fortify for authentication and policies for owner and collaborator access.
- Return consistent, predictable response shapes.
- Keep controllers thin and delegate to the owning module or queue.

## Data and Storage

- Use Eloquent and PostgreSQL for project relationships, artifact references, and run records.
- Store snapshots, Markdown specs, and uploads in private R2 via Laravel Filesystem.
- Store object keys and metadata in PostgreSQL. Issue temporary access after policy checks.
- Use Yjs for the live canvas and keep presence out of durable storage.

## File Organization

- Place domain actions, jobs, routes, and tests in the owning `app-modules/<module>/` package.
- Keep application bootstrap and shared framework configuration at the root.
- Put Inertia pages in `resources/js/pages/` and shared UI in `resources/js/components/`.
- Keep domain decisions in backend modules and component state in the frontend.
- Name files after their responsibility.
