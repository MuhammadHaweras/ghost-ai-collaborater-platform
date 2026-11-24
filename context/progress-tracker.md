# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Workspace authentication (feature 03 complete)

## Current Goal

- The editor now requires a signed-in account. Project data and creation are next once specified.

## Completed

- Defined the project palette and shadcn color tokens in `resources/css/globals.css`. The Inertia root layout selects dark mode on the first render.
- Installed Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea with the shadcn CLI. Shared UI also has Lucide React and `@/lib/utils` for Tailwind class merging.
- Added the Inertia editor shell at `/editor` with a fixed-height navbar and a Projects sidebar that slides over the canvas region. The sidebar starts closed, shows empty states in My Projects and Shared, and reserves a New Project button for project creation.
- Added reusable editor dialog content with a title, description, optional body, and footer actions styled with the existing color tokens.
- Connected Inertia sign-in, registration, and password recovery pages to Fortify. Sign-in resumes the intended workspace URL, registration opens the editor, and sign-out returns to login.
- Protected the editor and profile settings with the web session guard. The editor account menu opens settings and submits sign-out. Settings support name, email, and password changes with separate validation feedback.
- Auth and profile fields use the theme's light primary text for entered and autofilled values. Each password field starts masked and has an independent show/hide button.

## In Progress

- None.

## Next Up

- Connect project data and the New Project action when those features are specified.

## Open Questions

- None for feature 03.

## Architecture Decisions

- Inertia pages share UI primitives through `@/components/ui`. Backend feature routes and domain logic stay in their owning `internachi/modular` packages.

## Session Notes

- Strict TypeScript checking, the production build, and both Inertia homepage tests passed. Chrome rendered all seven primitives with a light system preference and verified the dark page, card, dialog portal, and Tailwind class merging.
- Feature 02 passed strict TypeScript checking, the production build, Pint, and both Inertia homepage tests. Chrome verified that the sidebar leaves the canvas in place, that the tabs and dismissal work by keyboard, and that the slide respects reduced motion on a narrow viewport.
- A temporary Chrome fixture verified dialog title and description associations, footer actions, token-based styling, and backdrop blur.
- Feature 03 passed 14 PHPUnit feature tests (166 assertions), Pint, strict TypeScript checking, and the production build. Tests followed the generated reset link, submitted the new password, rejected token reuse, and signed in with the replacement password.
- Chrome checked sign-in and registration at 390px and 1440px. Using a temporary SQLite database, it registered an account, opened profile settings and signed out by keyboard, checked that password errors appeared on the submitted form, and confirmed the editor redirected to login after sign-out.
