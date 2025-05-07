Here’s a high-level gap analysis against the Sprint 1 requirements and a prioritized TODO list for both packages.

Authentication & Authorization
• √ Social logins (Google/Apple) are not yet wired into NextAuth.
• √ Frontend route protection (server-side and client-side) is missing (e.g. no getServerSideProps guards or App-Router middleware).
• √ No explicit RBAC gating in the UI (e.g. “/admin” page or admin-only menu items).
• √ We rely on NextAuth’s JWT in-memory storage; consider HttpOnly cookies for API calls.

User Service (FastAPI)
• √ Migrations: verify that Alembic versions define the users table with the required constraints and indexes (email, role, language).
• √ Schemas/validation: confirm all input models (UserUpdate, RoleUpdate) have field validation (length, formats).
• √ AuditLogRepository: review implementation to ensure every CRUD event is logged.
• √ Middleware for JWT validation: verify get_current_user/get_current_admin actually decodes and validates tokens against Keycloak (JWKS).
• Swagger/OpenAPI: generate and publish docs (e.g. via FastAPI’s docs endpoint).
• Add paginated “list users” endpoint for admin (optional but common).

Frontend (Next.js + TS)
• Pages missing:
– /login (redirect to NextAuth sign-in)
– /dashboard (post-login landing)
– /profile (user-editable profile page)
– /admin (admin dashboard)
• Onboarding flow: ensure you POST to /users/register-metadata once per new user after login.
• HTTP client: introduce a shared fetcher (e.g. with React Query or SWR) for calling the User Service API and reuse validation schemas (Zod/TypeScript types).
• Navbar: surface user’s name/role and show/hide links based on role.
• i18n: wire next-i18next provider around your app and mark strings for translation.
• Protect routes in App-Router (middleware.ts) or via getServerSideProps.

Testing & Best Practices
• Backend tests:
– Validate error cases (401/403) for each protected endpoint.
– Test that audit logs are created.
– Confirm schema validations reject bad input.
• Frontend tests:
– Add Jest/SWC tests for the new pages (login, dashboard, profile, admin).
– Mock NextAuth session and role permutations.
• Linters/formatters:
– Ensure Black/Flake8 runs in CI for user-service.
– ESLint/Prettier CI enforcement in frontend.
• CI/CD: add GitHub Actions or other pipeline steps to run tests, lint, build both services.