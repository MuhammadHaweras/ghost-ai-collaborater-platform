# Ghost AI

Ghost AI is a collaborative system design workspace. Start from a template or describe a system in plain English, refine its architecture on a shared canvas, and generate a Markdown technical specification from the resulting graph.

## Target Architecture

| Layer | Technology |
| --- | --- |
| Backend | Laravel 13 modular monolith with `internachi/modular` |
| Frontend | React, Inertia, and TypeScript |
| Canvas | React Flow |
| Authentication and access | Laravel Fortify, Eloquent, and Laravel policies |
| Real-time collaboration | Yjs and Hocuspocus, with Yjs Awareness for presence and cursors |
| Background work | Laravel queues on Redis, monitored by Horizon |
| AI generation | Laravel AI SDK (`laravel/ai`) |
| Data and artifacts | PostgreSQL for relational metadata, private Cloudflare R2 for files |
| Initial deployment | Docker Compose |

Laravel serves the workspace via Inertia and authorizes access to projects. Hocuspocus syncs the shared canvas over WebSocket. Laravel workers generate designs and Markdown in the background. R2 stores canvas snapshots, Markdown specs, and uploaded assets. PostgreSQL stores memberships, run records, and artifact references.

See the [architecture context](context/architecture-context.md) for boundaries and storage conventions. The upstream references cover [InterNACHI Modular](https://github.com/InterNACHI/modular), the [Laravel AI SDK](https://laravel.com/docs/13.x/ai-sdk), and the [R2 S3 API](https://developers.cloudflare.com/r2/get-started/s3/).

## Current Checkout

Laravel and React/Inertia are wired with JSX. Fortify scaffolding and the modular package are present. TypeScript, feature modules, the collaborative canvas, queued AI generation, R2, and Docker Compose are part of the target architecture.

## Local Development

Use PHP 8.3 or newer, Composer, and a Node.js version supported by Vite. The example environment uses SQLite for the local scaffold. Create a local database file at `database/database.sqlite` if needed, or provide settings for an existing PostgreSQL database.

```sh
composer install
npm ci
```

Copy `.env.example` to `.env` if it does not exist, then run the following commands for a new local environment.

```sh
php artisan key:generate
php artisan migrate
composer run dev
```

Run the tests and production frontend build with the following commands.

```sh
composer test
npm run build
```

## Project Context

- [Project overview](context/project-overview.md)
- [Architecture context](context/architecture-context.md)
- [Code standards](context/code-standards.md)
- [Development workflow](context/ai-workflow-rules.md)
- [UI context](context/ui-context.md)
- [Progress tracker](context/progress-tracker.md)
