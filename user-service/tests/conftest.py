import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os, sys
sys.path.append(os.path.abspath('src'))
from src.main import app
from src.db.base import Base, get_db
import src.core.auth
import tempfile
from pathlib import Path
import uuid

@pytest.fixture(scope='session')
def engine():
    db_file = Path(tempfile.gettempdir()) / f"xuniversity_test_{uuid.uuid4().hex}.db"
    if db_file.exists():
        print("[DEBUG] Removing old test DB file:", db_file)
        db_file.unlink()
    print("[DEBUG] Test DB file:", db_file)
    eng = create_engine(f'sqlite:///{db_file}', connect_args={'check_same_thread': False})
    # Explicitly import all models to ensure table creation
    from src.db.models import User, AuditLog  # Add all models you need
    Base.metadata.create_all(eng)
    # Print tables after creation
    with eng.connect() as conn:
        tables = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table';")).fetchall()
        print("[DEBUG] Tables in test DB after create_all:", tables)
    return eng

@pytest.fixture(scope='session')
def SessionLocal(engine):
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope='function')
def db_session(SessionLocal):
    session = SessionLocal()
    yield session
    session.rollback()
    session.close()

@pytest.fixture(autouse=True)
def override_get_db(db_session):
    def _get_db():
        print("[DEBUG] override_get_db yields db_session:", db_session)
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = _get_db

@pytest.fixture(autouse=True)
def override_auth():
    from fastapi import Request, HTTPException
    def fake_get_current_user(request: Request):
        print("[DEBUG] fake_get_current_user called")
        token = None
        auth = request.headers.get("authorization")
        print(f"[DEBUG] Authorization header: {auth}")
        if auth and auth.startswith("Bearer "):
            token = auth.split(" ", 1)[1]
        print(f"[DEBUG] Token: {token}")
        # Simulate 401 for known-bad or expired tokens
        if token == "invalid.token.here":
            print("[DEBUG] Invalid token detected")
            raise HTTPException(status_code=401, detail="Invalid token")
        from jose import jwt
        import time
        try:
            payload = jwt.get_unverified_claims(token)
            print(f"[DEBUG] Decoded payload: {payload}")
            exp = payload.get("exp")
            print(f"[DEBUG] Token exp: {exp}, now: {time.time()}")
            if exp is not None and float(exp) < time.time():
                print("[DEBUG] Token expired")
                raise HTTPException(status_code=401, detail="Token expired")
        except HTTPException:
            print("[DEBUG] HTTPException raised, propagating...")
            raise
        except Exception as e:
            print(f"[DEBUG] Exception decoding token: {e}")
            pass
        print("[DEBUG] Returning fake user")
        return {"sub": "u1", "email": "u1@example.com", "role": "student"}
    app.dependency_overrides[src.core.auth.get_current_user] = fake_get_current_user

    def fake_get_current_admin(request: Request):
        return {"sub": "admin", "email": "admin@example.com", "role": "admin"}
    app.dependency_overrides[src.core.auth.get_current_admin] = fake_get_current_admin
    yield
    app.dependency_overrides = {}

@pytest.fixture
def client():
    return TestClient(app)
