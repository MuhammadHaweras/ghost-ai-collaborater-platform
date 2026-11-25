# Architecture Context

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Backend | Laravel 13 + `internachi/modular` | Modular monolith and HTTP endpoints |
| UI | React + Inertia + TypeScript | Workspace pages and shared components |
| Canvas | React Flow | Node and edge editing |
| Identity and access | Fortify, Eloquent, Laravel policies | Session authentication and project permissions |
| Collaboration | Yjs + Hocuspocus | Shared graph via WebSocket, cursors via Yjs Awareness |
| Jobs and monitoring | Laravel queues + Redis + Horizon | Durable jobs, retries, and queue monitoring |
| AI | Laravel AI SDK (`laravel/ai`) | Generate designs and Markdown specs |
| Data | PostgreSQL | Users, projects, memberships, runs, and spec metadata |
| Artifact storage | Cloudflare R2 | Canvas snapshots, Markdown files, and uploaded assets |
| Deployment | Docker Compose initially | Laravel, Horizon, Hocuspocus, PostgreSQL, and Redis |

## System Boundaries

- Laravel serves Inertia pages and owns authentication, authorization, persistence, and job dispatch.
- Feature modules live under `app-modules/` and are loaded through Composer and Laravel package discovery.
- Keep domain logic, routes, and tests with the owning module. Share behavior through explicit module interfaces.
- `resources/js/` contains the Inertia entry point, pages, and shared UI.
- Hocuspocus syncs Yjs documents. The browser uses React Flow to render and edit the graph.
- Horizon runs Laravel queue workers from the same application. AI jobs call the SDK server-side.

## Storage Model

- PostgreSQL stores project ownership, collaborator memberships, AI run status, and artifact metadata.
- Laravel’s S3-compatible filesystem disk writes artifacts to a private Cloudflare R2 bucket.
- Store canvas snapshots under `canvas/{projectId}.json`, specs under `specs/{projectId}/{specId}.md`, and uploads under project-scoped keys.
- Keep stable object keys in PostgreSQL. Authorize access before serving files or issuing temporary URLs.

## Auth and Collaboration Model

- Fortify handles password authentication. Socialite signs users into the same web session through Google and GitHub. Each external identity is keyed by provider and provider account ID. The application stores no provider access or refresh tokens.
- Fortify profile settings save the new email directly and clear the previous email's verification status and reset tokens.
- Each project belongs to one user through `projects.owner_id`. Collaborator membership is keyed by project and email, so an email can belong to more than one project. Deleting a project removes its memberships.
- Eloquent stores ownership and memberships. Policies control project reads, mutations, and artifact access.
- Laravel checks project access before issuing short-lived room credentials. Hocuspocus verifies credentials against the requested document.
- Yjs Awareness carries transient cursor and presence state.

## Starter System Designs

- Prebuilt templates are static canvas snapshots stored in the codebase.
- An import applies the template to the active Yjs document.
- Import can occur on canvas creation or from within the editor at any time.
- Template data follows the same node/edge schema as user-created canvas content.
- Templates do not require a separate database record; they are resolved by template ID at import time.

## AI Generation Model

### Design Generation

- Use the user prompt, project context, and current canvas state as input.
- Queue the job on Redis and use the Laravel AI SDK for structured output.
- Validate the generated nodes and edges before applying them to the shared Yjs document.

### Spec Generation

- Use the current canvas graph and project context as input to a queued Laravel AI SDK job.
- Write the generated Markdown to R2 and link its object key to the project in PostgreSQL.

## Invariants

1. Run long-lived AI work in retryable queues and make artifact writes safe to retry.
2. Keep metadata in PostgreSQL and large artifacts in R2.
3. Enforce project access across HTTP, WebSocket, and artifact requests.
4. Keep provider credentials on the server.
5. The canvas schema must remain consistent between user-created content and imported templates.
