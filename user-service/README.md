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
      POSTGRES_USER: usr
      POSTGRES_PASSWORD: pss
      POSTGRES_DB: xuniversity
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
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

MIT License © 2025 X-University
