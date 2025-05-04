# X-University Frontend

This is the Next.js (React) frontend for X-University. It provides authentication, onboarding, dashboards, and profile management for students, teachers, and admins.

## Features
- **OAuth2/OIDC Authentication** via Keycloak (self-hosted, social login support)
- **Role-based dashboards** (student, teacher, admin)
- **User onboarding** and profile management
- **Protected routes** with secure token handling (HttpOnly cookies)
- **Integration with user-service** for user data
- **Responsive, accessible UI** (Tailwind CSS)
- **i18n-ready** (internationalization support)
- **Automated tests** (Jest, React Testing Library)

## Prerequisites
- Node.js 18+
- npm 9+
- [ngrok](https://ngrok.com/) (for HTTPS tunneling in local dev)
- Running Keycloak and PostgreSQL containers (see root `docker-compose.yml`)
- The [user-service](../user-service/) running locally

## Setup Instructions

1. **Clone the repository**
   ```sh
   git clone <repo-url>
   cd frontend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.local.example` to `.env.local` and fill in your Keycloak and user-service values.
   - Example:
     ```
     NEXTAUTH_URL=https://<your-ngrok-subdomain>.ngrok-free.app
     NEXTAUTH_SECRET=your-random-secret
     KEYCLOAK_ID=your-keycloak-client-id
     KEYCLOAK_SECRET=your-keycloak-client-secret
     KEYCLOAK_ISSUER=https://localhost:8080/realms/x-university
     USER_SERVICE_URL=http://localhost:8000
     ```
   - Generate `NEXTAUTH_SECRET` with:  
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

4. **Start ngrok (for HTTPS)**
   ```sh
   npx ngrok http 3000
   ```
   - Use the HTTPS URL from ngrok in your `.env.local` and Keycloak client settings.

5. **Configure Keycloak Application**
   - Set callback/logout URLs in Keycloak to match your ngrok HTTPS URL.

6. **Start the frontend**
   ```sh
   npm run dev
   ```
   - App will be available at `http://localhost:3000` and via your ngrok HTTPS URL.

7. **Run tests**
   ```sh
   npm test
   ```

## Functionality Achieved
- Secure login/logout with Keycloak (OAuth2, OIDC, social login)
- Role-based dashboards and protected routes
- User onboarding and profile management
- Integration with user-service for user info and updates
- Automated frontend tests

## Project Structure
- `src/app/` — Next.js App Router pages and layouts
- `src/components/` — Reusable React components
- `src/lib/` — Auth logic and custom hooks
- `middleware.ts` — Route protection and JWT validation

## Notes
- Keep your ngrok tunnel running during local development.
- Restart the dev server after changing `.env.local`.
- For production, use your deployed HTTPS domain in all Keycloak and environment settings.

---

For more details, see the [Sprint 1 documentation](../Documentation/sprint-1-auth-user-ui.md).
