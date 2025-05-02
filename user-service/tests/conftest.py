import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os, sys
sys.path.append(os.path.abspath('src'))
from src.main import app
from src.db.base import Base, get_db

@pytest.fixture(scope='session')
def engine(tmp_path_factory):
    db_file = tmp_path_factory.mktemp('data') / 'test.db'
    eng = create_engine(f'sqlite:///{db_file}', connect_args={'check_same_thread': False})
    Base.metadata.create_all(eng)
    return eng

@pytest.fixture(scope='function')
def db_session(engine):
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    yield session
    session.rollback()
    session.close()

@pytest.fixture(autouse=True)
def override_get_db(db_session):
    def _get_db():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = _get_db

@pytest.fixture
def client():
    return TestClient(app)
