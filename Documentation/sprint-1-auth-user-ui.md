# 🚧 Sprint 1 – Auth, User Service, UI Scaffold

## 🧠 Objective
Implement user authentication using OAuth2 (via Auth0 or Keycloak), build the core User Service backend, and scaffold the frontend using Next.js with protected routes and token handling.

---

## 🔐 Authentication & Authorization

### 🎯 Goal
Integrate secure OAuth2 login for students, teachers, and admins with support for role-based access control using OpenID Connect and JWTs.

### ✅ Requirements
- Use **Auth0** or **Keycloak** (self-hosted) as the Identity Provider.
- Configure **OAuth2 + OpenID Connect**.
- Support roles: `student`, `teacher`, `admin`.
- Support social logins (Google, optionally Apple).
- Enforce **RBAC** (Role-based Access Control).
- Use **JWTs** for API authentication.

### 🔧 Implementation Instructions
```plaintext
1. Configure Auth0/Keycloak with:
   - Allowed callback/logout URLs
   - Roles/permissions mapped to users
   - Access token lifetime ~15 mins, refresh token enabled

2. Set up a middleware (Node.js or Python) that:
   - Validates JWT on every API request
   - Extracts `sub`, `roles`, and `scopes` from token
   - Rejects invalid/expired tokens
   - Optionally decodes token to attach `user` object to request

3. Implement a `/me` endpoint that returns user info from the token

4. Do NOT store passwords or user credentials yourself
```

---

## 👤 User Service (Backend Microservice)

### 🎯 Goal
Manage all user data and support registration metadata, profile management, and role enforcement.

### ✅ Requirements
- Use **PostgreSQL** with indexed fields: `user_id`, `email`, `role`
- Must be a **stateless REST API**
- Validate and sanitize all inputs
- Integrate audit logging for all updates

### 🔧 Implementation Instructions
```plaintext
1. Technologies:
   - Language: Python (FastAPI) or Node.js (Express)
   - DB: PostgreSQL
   - Auth: Middleware to parse/verify JWT from header

2. Endpoints:
   - `GET /users/me` – return authenticated user info
   - `POST /users/register-metadata` – add age, language, etc. after OAuth login
   - `PUT /users/profile` – update display name, language, etc.
   - `GET /users/:id` – admin-only, view other user profiles

3. Use PostgreSQL schema:
   users (
     id UUID PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     role TEXT CHECK(role IN ('student', 'teacher', 'admin')),
     language TEXT,
     age_group TEXT,
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ DEFAULT now()
   )

4. Add DB index on: email, role, language

5. Use Alembic (Python) or Knex.js (Node) for migrations

6. Use granular try/except or try/catch blocks with centralized error logging
```

---

## 🖥️ Frontend – Next.js (React)

### 🎯 Goal
Create a scaffolded SPA with login, logout, protected routes, role-based dashboards.

### ✅ Requirements
- Use **Next.js** with **TypeScript**
- Use **Auth0 SDK** or OIDC client
- Responsive, accessible design
- Localized (i18n-ready)
- Token storage: HttpOnly cookies (via API route) or secure memory

### 🔧 Implementation Instructions
```plaintext
1. Pages:
   - `/login` – redirect to Auth0
   - `/dashboard` – show after login
   - `/profile` – editable user profile
   - `/admin` – only for admin users

2. Auth Context:
   - Store token in React context or secured cookie
   - Add `useAuth()` hook to get user, role, isAuthenticated
   - Use `getServerSideProps` to protect server-rendered pages

3. Call `/api/users/me` to get user info on login
4. Call `/api/users/register-metadata` after first login (onboarding)
5. Use React Query / SWR for fetching with caching

6. Add navbar, logout button, role display
7. Minimal CSS using Tailwind or Chakra UI
```

---

## 🧪 Testing & Best Practices

### ✅ Requirements
- Unit tests (Jest, Pytest) for backend logic
- Integration tests for auth/token flow
- Linting (ESLint, Black/Flake8)
- OpenAPI or Swagger doc generation for APIs
- Reuse HTTP client and validation schemas

---

## 📦 Deliverables for Sprint 1
- Secure login with role-based access
- Working User Service with JWT validation
- Frontend scaffold with protected pages and auth context
- User metadata registration flow
- Automated tests and docs for APIs

---

