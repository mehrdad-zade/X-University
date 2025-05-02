# X-University Frontend

This is the Next.js (React) frontend for the X-University platform. It provides the user interface for authentication, dashboards, profile management, onboarding, and role-based access for students, teachers, and admins.

## Features
- **OAuth2 Authentication** via Auth0 (with social login support)
- **Role-based dashboards** (student, teacher, admin)
- **User profile management** and onboarding
- **Protected routes** and secure token handling
- **Integration with user-service** for user data
- **Responsive, accessible UI** (Tailwind CSS)
- **i18n-ready** (internationalization support)
- **Automated tests** (Jest, React Testing Library)

## Prerequisites
- Node.js 18+
- npm 9+
- [ngrok](https://ngrok.com/) (for HTTPS tunneling in local dev)
- Auth0 account and application (free tier is sufficient)
- The [user-service](../user-service/) running locally (see its README)

## Setup Instructions

### 1. Clone the repository
```
git clone <repo-url>
cd frontend
```

### 2. Install dependencies
```
npm install
```

### 3. Configure environment variables
Copy `.env.local.example` to `.env.local` and fill in your Auth0 and user-service values:
```
cp .env.local.example .env.local
```
Edit `.env.local`:
```
AUTH0_SECRET=your-randomly-generated-secret
AUTH0_BASE_URL=https://<your-ngrok-subdomain>.ngrok-free.app
AUTH0_ISSUER_BASE_URL=https://<your-auth0-domain>
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
USER_SERVICE_URL=http://localhost:8000
```
- Generate `AUTH0_SECRET` with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Use [ngrok](https://ngrok.com/) to expose your local app over HTTPS for Auth0 integration.

### 4. Start ngrok (for HTTPS)
```
npx ngrok http 3000
```
- Use the HTTPS URL from ngrok in your `.env.local` and Auth0 dashboard settings.

### 5. Configure Auth0 Application
- **Allowed Callback URLs:** `https://<ngrok-subdomain>.ngrok-free.app/auth/callback`
- **Allowed Logout URLs:** `https://<ngrok-subdomain>.ngrok-free.app`
- **Allowed Web Origins:** `https://<ngrok-subdomain>.ngrok-free.app`
- **Initiate Login URI:** `https://<ngrok-subdomain>.ngrok-free.app/auth/login`

### 6. Start the frontend
```
npm run dev
```
- App will be available at `http://localhost:3000` and via your ngrok HTTPS URL.

### 7. Run tests
```
npm test
```

## Functionality Achieved
- **Secure login/logout** with Auth0 (OAuth2, OIDC, social login)
- **Role-based dashboards** for students, teachers, and admins
- **User onboarding** (collect language, age group, etc. after first login)
- **Profile management** (edit display name, language, age group)
- **Protected routes** (redirect unauthenticated users to login)
- **Integration with user-service** for user info and profile updates
- **Automated frontend tests** for components and flows

## Project Structure
- `src/app/` — Next.js App Router pages and layouts
- `src/components/` — Reusable React components (Navbar, etc.)
- `src/lib/` — Auth0 client and custom hooks
- `middleware.ts` — Auth0 v4+ middleware for authentication endpoints

## Notes
- Make sure to keep your ngrok tunnel running while developing locally with Auth0.
- If you change `.env.local`, restart the dev server.
- For production, use your deployed HTTPS domain in all Auth0 settings and `.env.local`.

---
For more details, see the [Sprint 1 documentation](../Documentation/sprint-1-auth-user-ui.md).
