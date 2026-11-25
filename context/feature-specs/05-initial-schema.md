# Initial Project Schema

Use Laravel migrations and Eloquent models in the projects module to persist project metadata and collaborator emails in PostgreSQL.

## Projects

Create the `projects` table for the `Project` model.

- `id` is the primary key. `owner_id` is a required foreign key to `users.id`.
- `name` is a required string. `description` is nullable text.
- `status` accepts `DRAFT` and `ARCHIVED`. Cast it to a string-backed `ProjectStatus` enum with cases `Draft` and `Archived`.
- `canvas_json_path` is a nullable string holding the private R2 object key `canvas/{projectId}.json` once a snapshot exists.
- Add Eloquent timestamps and a composite index on `(owner_id, created_at)` for listing an owner's projects by creation date.

Define `Project::owner()` as a `BelongsTo` relationship to `App\Models\User` through `owner_id`.

## Project Collaborators

Create the `project_collaborators` table for the `ProjectCollaborator` model.

- `id` is the primary key. `project_id` is a required foreign key to `projects.id` with cascading deletion.
- `email` is the collaborator's email address. Enforce uniqueness on `(project_id, email)`.
- Record `created_at` and set `ProjectCollaborator::UPDATED_AT` to `null`.
- Index `email` for membership lookups and `(project_id, created_at)` for listing a project's collaborators by creation date.

Define `Project::collaborators()` as a `HasMany` relationship and `ProjectCollaborator::project()` as its `BelongsTo` inverse.

## Check When Done

- On a test database, `php artisan migrate --no-interaction` creates both tables. Rollback drops `project_collaborators` before `projects`.
- A saved project resolves its owner and collaborators through Eloquent and reloads its status as a `ProjectStatus` case.
- The database rejects duplicate emails within one project and permits the same email on different projects.
- Deleting a project removes its collaborator rows.
