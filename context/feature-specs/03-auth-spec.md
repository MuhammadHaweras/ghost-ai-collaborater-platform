# Feature 03 — Workspace authentication

Use Laravel Fortify and the existing `web` session guard to sign users into Ghost AI. Laravel controls access to the editor. React and Inertia render the forms and the signed-in account menu.

## Starting point

Fortify is installed. `App\Providers\FortifyServiceProvider` already registers the user actions and rate limiters. Fortify's form routes are registered, but the app has no Inertia auth pages yet. In `routes/web.php`, `/` serves `Welcome` and `/editor` is public. The editor navbar has an empty right-hand section reserved for the account menu.

## Routes and redirects

| Request | Required behavior |
| --- | --- |
| `GET /` | Send guests to the named `login` route and signed-in users to the named `editor` route. |
| `GET /editor` | Apply Laravel's `auth` middleware. A guest goes to login and returns to the editor after signing in. |
| `GET /login` and `GET /register` | Render the appropriate form for guests. Redirect signed-in users to the editor. |
| `POST /login` and `POST /register` | Submit to Fortify. After login, honor Laravel's intended destination with `/editor` as the fallback. A new user lands in the editor after registration. |
| `POST /logout` | End the session through Fortify and return the user to login. Subsequent visits to the editor require a new sign-in. |

Set `home` in `config/fortify.php` to `/editor` and align Laravel's authenticated-guest redirect with the named editor route. Group workspace pages behind `auth`. Project ownership and collaborator access belong to project policies.

## Authentication pages

Register the Inertia view callbacks in the existing Fortify service provider. Place the React TypeScript pages under `resources/js/pages/` and submit through Inertia to Fortify's existing routes. Keep Laravel's session, CSRF protection, server-side validation, and login throttling in the request flow.

- **Sign in** with email and password. Link to registration and password recovery.
- **Register** with name, email, password, and password confirmation. Link back to sign-in.
- **Recover a password** through `/forgot-password`. Show the returned status. The emailed link opens `/reset-password/{token}`; submit the token, email, password, and confirmation to `POST /reset-password`.
- Give each field a visible label, display validation errors beside the affected fields, and disable repeat submissions while a request is pending.

On wide screens, pair a compact Ghost AI logo, tagline, and short text-only feature list with a centered form. On small screens, show only the form. Keep both layouts compact, with flat surfaces and no gradients, oversized hero, or feature cards. Reuse the existing input and button components, Geist typography, and dark color tokens from `resources/css/globals.css`.

## Editor account menu

Share the signed-in user's name and email through an explicit `auth.user` Inertia prop in `HandleInertiaRequests`. Guests receive `null`. In the right section of `resources/js/components/editor/editor-navbar.tsx`, add a keyboard-accessible account menu with **Profile settings** and **Sign out**.

Profile settings must be accessible only to signed-in users. Let users edit their name and email through `PUT /user/profile-information` and change their password through `PUT /user/password` using their current password and a confirmed new password. Show Fortify's validation feedback for the form submitted. Sign out submits a POST from the menu.

Two-factor and passkey routes are enabled in the current configuration. Their enrollment and management screens are outside this feature. Email verification is disabled. The forms and menu in this feature use the installed dependencies.

## Acceptance checks

- Replace the existing `Welcome` homepage assertions with feature tests for both root redirects. Cover a direct guest visit to the editor, a successful sign-in that resumes that visit, and an authenticated editor visit.
- Verify successful registration, failed login, invalid registration, and the password reset link flow. Failed submissions show the relevant errors and keep the editor protected.
- Verify that profile edits persist, password changes require the current password, and signing out prevents a subsequent editor visit.
- Check the sign-in and registration layouts at desktop and mobile widths. Open the account menu and reach both actions with the keyboard.
- Run the focused authentication feature tests, `npm run typecheck`, and `npm run build` after implementation.
