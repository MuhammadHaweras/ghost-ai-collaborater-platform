# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor home and project management UI

## Current Goal

- Signed-in users can create, rename, and delete mock projects in the editor. Changes last until the editor page is reloaded or unmounted.

## Completed

- Defined the project palette and shadcn color tokens in `resources/css/globals.css`. The Inertia root layout selects dark mode on the first render.
- Installed Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea with the shadcn CLI. Shared UI also has Lucide React and `@/lib/utils` for Tailwind class merging.
- Added the Inertia editor shell at `/editor` with a fixed-height navbar and a Projects sidebar that slides over the canvas region. The sidebar starts closed, shows empty states in My Projects and Shared, and reserves a New Project button for project creation.
- Added reusable editor dialog content with a title, description, optional body, and footer actions styled with the existing color tokens.
- Connected Inertia sign-in, registration, and password recovery pages to Fortify. Sign-in resumes the intended workspace URL, registration opens the editor, and sign-out returns to login.
- Protected the editor and profile settings with the web session guard. The editor account menu opens settings and submits sign-out. Settings support name, email, and password changes with separate validation feedback.
- Auth and profile fields use the theme's light primary text for entered and autofilled values. Each password field starts masked and has an independent show/hide button.

- Added Google and GitHub sign-in and registration through Socialite. Members can connect a matching provider account from profile settings. Linked accounts continue to work after an email change.
- Added profile success and error toasts and a hand cursor for clickable buttons. Profile settings saves email changes directly.
- Added the Feature 04 editor home and Create Project dialog. Both New Project buttons open the same form with a live slug preview.
- Added owner-only rename and delete actions to the Projects sidebar. Rename starts with the current name and supports Enter. Delete requires confirmation. On mobile, tapping the backdrop dismisses the sidebar.
- The Create Project and Rename Project name fields use the theme's light primary text for entered and autofilled values.

## In Progress

- None.

## Next Up

- Connect the project UI to persisted project data and Laravel ownership policies when the backend feature is specified.

## Open Questions

- None for feature 04.

## Architecture Decisions

- Inertia pages share UI primitives through `@/components/ui`. Backend feature routes and domain logic stay in their owning `internachi/modular` packages.

## Session Notes

- Strict TypeScript checking, the production build, and both Inertia homepage tests passed. Chrome rendered all seven primitives with a light system preference and verified the dark page, card, dialog portal, and Tailwind class merging.
- Feature 02 passed strict TypeScript checking, the production build, Pint, and both Inertia homepage tests. Chrome verified that the sidebar leaves the canvas in place, that the tabs and dismissal work by keyboard, and that the slide respects reduced motion on a narrow viewport.
- A temporary Chrome fixture verified dialog title and description associations, footer actions, token-based styling, and backdrop blur.
- Feature 03 passed 14 PHPUnit feature tests (166 assertions), Pint, strict TypeScript checking, and the production build. Tests followed the generated reset link, submitted the new password, rejected token reuse, and signed in with the replacement password.
- Chrome checked sign-in and registration at 390px and 1440px. Using a temporary SQLite database, it registered an account, opened profile settings and signed out by keyboard, checked that password errors appeared on the submitted form, and confirmed the editor redirected to login after sign-out.
- The account updates passed the full PHPUnit suite (31 tests, 358 assertions), TypeScript, and the production build. Both configured OAuth redirects included state and the expected callback. Socialite fakes exercised provider callbacks and account linking.
- Chrome verified social buttons on both guest pages, the hand cursor, profile success and error toasts, the resend countdown, and an email change using a code captured from an isolated test mail transport. The two new tables were migrated on local PostgreSQL.
- Removed the email-change dialog, verification endpoints, and notification. The previously applied database migration remains in the migration history.
- Feature 04 passed strict TypeScript checking, the production build, standalone Oxlint on the changed frontend files, and the authenticated editor route test (17 assertions). Chrome verified both create entry points, live slug updates, keyboard rename, delete confirmation and cancellation, shared rows without actions, mobile backdrop dismissal, and mock data reset on reload.
