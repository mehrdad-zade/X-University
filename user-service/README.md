# 📦 User Service

FastAPI-based microservice for user management in **X-University**.

---

## 🐍 Environment

- **Python**: 3.9.7‍
- **Virtualenv**: `python3.9 -m venv venv`
- **Docker**: for PostgreSQL (`docker compose`)
- **PostgreSQL**: 15

---

## 🚀 Features

- OAuth2 / OIDC authentication via JWT (Auth0/Keycloak)
- Role-based access control (student, teacher, admin)
- User metadata registration and profile update
- PostgreSQL persistence with SQLAlchemy & Alembic migrations
- Pydantic models, centralized logging, and audit trails
- API docs via Swagger UI (`/docs`)
- Unit tests with pytest

---

## 📁 Project Structure

```
user-service/
├── src/
│   ├── main.py
│   ├── api/
│   │   └── routes.py
│   ├── core/
│   │   ├── auth.py
│   │   ├── schemas.py
│   │   └── logger.py
│   └── db/
│       ├── base.py
│       └── models.py
├── alembic/
│   ├── env.py
│   └── versions/
├── tests/
│   └── test_me.py
├── config/
│   └── config.yaml
├── deploy/
│   └── k8s-deployment.yaml
├── .env.example
├── alembic.ini
├── pytest.ini
├── conftest.py
├── requirements.txt
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## 🔧 Prerequisites

- Git
- Python 3.9.7
- Docker & Docker Compose

---

## ⚙️ Local Setup

1. **Clone & enter directory**  
   ```bash
   git clone https://github.com/your-org/x-university.git
   cd x-university/user-service
   ```

2. **Copy example env and edit**  
   ```bash
   cp .env.example .env
   # In .env set:
   # JWT_SECRET=your_secret_key
   # DATABASE_URL=postgresql://xuniv_user:xuniv_pass@localhost:5432/xuniversity
   ```

3. **Start PostgreSQL via Docker Compose**  
   ```bash
   docker compose up -d db
   ```

4. **Create & activate virtualenv**  
   ```bash
   python3.9 -m venv venv
   source venv/bin/activate
   ```

5. **Install dependencies**  
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

---

## 🗄️ Database Initialization

1. **Run Alembic migrations**  
   ```bash
   alembic upgrade head
   ```
2. **Verify tables**  
   ```bash
   docker compose exec db psql -U xuniv_user -d xuniversity -c "\dt"
   ```

---

## ▶️ Running the Service

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

- Swagger UI: http://localhost:8000/docs
- Health: GET http://localhost:8000/users/me (requires JWT)

---

## 🔐 Authentication

- **Issuer/Audience** configured in `config/config.yaml`.
- **JWT_SECRET** in `.env`.
- **Routes** under `/users` require:
  ```
  Authorization: Bearer <ACCESS_TOKEN>
  ```

---

## 🧪 Testing

- Ensure `src/` has `__init__.py` and `pytest.ini`/`conftest.py` exist.
- **Make sure the PostgreSQL database is running before running tests.**
  - If you see errors about failing to connect to the database, start it with:
    ```bash
    docker compose up -d db
    ```
  - If you still get connection errors, check that your `.env` and `DATABASE_URL` are correct and that the container is healthy:
    ```bash
    docker compose ps
    docker compose logs db
    ```
- Run:
  ```bash
  pytest --disable-warnings --maxfail=1
  ```
- Sample test covers unauthorized `/users/me`.

---

## 🐳 Docker Compose

`docker-compose.yml` at project root:

```yaml
services:
  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=xuniv_user
      - POSTGRES_PASSWORD=xuniv_pass
      - POSTGRES_DB=xuniversity
    ports:
      - "5432:5432"
    volumes:
      - pgcomposevol:/var/lib/postgresql/data
volumes:
  pgcomposevol:
```

**Troubleshooting:**  
- If you see `role "xuniv_user" does not exist`, the Docker volume may be stale, or Compose may not be parsing environment variables correctly.
- Always run:
  ```bash
  docker compose down -v
  docker volume prune -f
  docker compose up -d db
  docker compose logs db
  docker compose exec db \
  psql -U xuniv_user -d xuniversity -c "\l"
  ```
- If you see output listing the `xuniversity` database and `xuniv_user` as owner, your setup is correct and ready for tests.
- **If the problem persists, use the list syntax for environment variables as shown above.**
- If you still have issues, try running the container manually (see below) to verify your Docker setup.

```bash
# keycloak
chmod +x scripts/keycloak-entrypoint.sh
docker compose stop keycloak
docker compose rm -f keycloak
docker volume prune --filter label=com.docker.compose.service=keycloak --force
docker compose up -d keycloak
docker compose logs -f keycloak
```

---

## 📝 Scripts

- **Migrations**: `alembic revision --autogenerate -m "msg"`, `alembic upgrade head`
- **Lint**: `flake8 src tests`
- **Format**: `black src tests`

---

## 📬 Contribution

Please follow code style, add tests, and open PRs against `main`.

---

# Running Postgres for Local Development with Docker

To run a local Postgres database for the user-service, you have two options:

## Option 1: Using Docker Compose (Recommended)

1. **Ensure Docker Desktop is running.**

2. **Start the database with Docker Compose:**

   ```bash
   docker compose up -d db
   ```

   This will start a Postgres 16 container with:
   - Database: `xuniversity`
   - User: `xuniv_user`
   - Password: `xuniv_pass`
   - Port: 5432 (localhost)

3. **Connect to the database:**

   - As the app user:
     ```bash
     psql -h localhost -U xuniv_user -d xuniversity -p 5432
     # Password: xuniv_pass
     ```
   - As the superuser:
     ```bash
     psql -h localhost -U postgres -p 5432
     # Password: xuniv_pass
     ```

4. **Reset the database (if needed):**
   If you need a fresh database (e.g., to fix initialization issues), run:
   ```bash
   docker compose down -v
   docker volume prune -f
   docker compose up -d db
   ```

5. **Troubleshooting:**
   - Make sure there is no local directory named `db_data2` in your project root.
   - The Docker Compose file uses a Docker-managed volume (`db_data2`).
   - If you change environment variables, always remove the volume and restart.

6. **Environment variables are set in `docker-compose.yml` for the `db` service:**
   ```yaml
   environment:
     - POSTGRES_USER=xuniv_user
     - POSTGRES_PASSWORD=xuniv_pass
     - POSTGRES_DB=xuniversity
   ```

---

## Option 2: Manual Docker Run (if Compose does not work)

If you encounter issues with Docker Compose, you can manually start Postgres with:

```bash
docker volume create pgtestdata3
docker run --rm \
  -e POSTGRES_USER=xuniv_user \
  -e POSTGRES_PASSWORD=xuniv_pass \
  -e POSTGRES_DB=xuniversity \
  -v pgtestdata3:/var/lib/postgresql/data \
  -p 55432:5432 \
  postgres:16
```

- This will start Postgres on port 55432.
- Connect with:
  ```bash
  psql -h localhost -U xuniv_user -d xuniversity -p 55432
  # Password: xuniv_pass
  ```

- If you need to reset, remove the volume:
  ```bash
  docker volume rm pgtestdata3
  ```

---

For more details, see the official [Postgres Docker image documentation](https://hub.docker.com/_/postgres).

---

MIT License © 2025 X-University
