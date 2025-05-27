import os
import time
import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from src.db.base import Base
from dotenv import load_dotenv

load_dotenv()  # ← pick up project-root .env with your Postgres URL

# Ensure all models are imported so Base.metadata.create_all() works
from src.db import models

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        db_url = "postgresql://xuniv_user:xuniv_pass@localhost:5432/xuniversity"
    print(f"[pytest] Using DATABASE_URL: {db_url}")

    # Safety check: fail if still SQLite
    if db_url.startswith("sqlite"):
        print(f"[pytest] FATAL: Running tests with SQLite! Current DATABASE_URL: {db_url}")
        print("To fix: set DATABASE_URL in project-root .env to your Postgres URI")
        import sys; sys.exit(1)

    engine = create_engine(db_url, echo=True)
    # wait for container
    for i in range(10):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            break
        except OperationalError:
            time.sleep(2)
    else:
        raise RuntimeError(f"Cannot connect to DB at {db_url}")

    # clean slate
    with engine.begin() as conn:
        Base.metadata.drop_all(bind=conn)
        Base.metadata.create_all(bind=conn)

    yield

    # teardown
    with engine.begin() as conn:
        Base.metadata.drop_all(bind=conn)
