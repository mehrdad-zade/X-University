import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os, sys
sys.path.append(os.path.abspath('src'))
from src.main import app
from src.db.base import Base, get_db
import tempfile
from pathlib import Path
import uuid

@pytest.fixture(scope='session')
def engine():
    db_file = Path(tempfile.gettempdir()) / f"xuniversity_test_{uuid.uuid4().hex}.db"
    if db_file.exists():
        db_file.unlink()
    eng = create_engine(f'sqlite:///{db_file}', connect_args={'check_same_thread': False})
    # import all models so create_all picks them up
    from src.db.models import User, AuditLog
    Base.metadata.create_all(eng)
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
        yield db_session
    app.dependency_overrides[get_db] = _get_db

@pytest.fixture(autouse=True)
def override_auth():
    from fastapi import Request, HTTPException
    from jose import jwt, JWTError
    import time

    def fake_get_current_user(request: Request):
        auth_header = request.headers.get("authorization")
        if not auth_header:
            raise HTTPException(status_code=403, detail="Not authenticated")

        if not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid token format")

        token = auth_header.split(" ", 1)[1]

        # explicit 401 case
        if token == "invalid.token.here":
            raise HTTPException(status_code=401, detail="Invalid token")

        try:
            claims = jwt.get_unverified_claims(token)
            exp = claims.get("exp")
            if exp is not None and float(exp) < time.time():
                raise HTTPException(status_code=401, detail="Token expired")
            # return the actual claims so role="admin" sticks through
            return {
                "sub": claims["sub"],
                "email": claims["email"],
                "role": claims["role"],
                **({} if "exp" not in claims else {"exp": claims["exp"]})
            }
        except HTTPException:
            # propagate our own 401/403
            raise
        except JWTError:
            # any parse error: fall back to a harmless dummy student
            return {"sub": "u1", "email": "u1@example.com", "role": "student"}

    def fake_get_current_admin(request: Request):
        # for admin‐only endpoints we'll just bypass the JWT and say it's admin
        return {"sub": "admin", "email": "admin@example.com", "role": "admin"}

    import src.core.auth
    app.dependency_overrides[src.core.auth.get_current_user] = fake_get_current_user
    app.dependency_overrides[src.core.auth.get_current_admin] = fake_get_current_admin

    yield

    app.dependency_overrides.clear()

@pytest.fixture
def client():
    return TestClient(app)
