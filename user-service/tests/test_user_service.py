import pytest
from src.services.user_service import UserService
from src.db.repositories import UserRepository
from src.core.schemas import UserUpdate
from src.core.exceptions import NotFoundError, PermissionDeniedError

def test_register_and_update(db_session):
    repo = UserRepository(db_session)
    service = UserService(repo, None)
    metadata = UserUpdate(language='en', age_group='adult')
    user = service.register_metadata('u1', 'u@example.com', 'student', metadata)
    assert user.language == 'en'
    metadata2 = UserUpdate(language='fr')
    updated = service.update_profile('u1', metadata2)
    assert updated.language == 'fr'

def test_permissions(db_session):
    repo = UserRepository(db_session)
    service = UserService(repo, None)
    repo.create('admin', 'a@example.com', 'admin')
    repo.create('stu', 's@example.com', 'student')
    admin = {'sub':'admin','role':'admin'}
    user = service.fetch_user('stu', admin)
    assert user.id == 'stu'
    student = {'sub':'stu','role':'student'}
    with pytest.raises(PermissionDeniedError):
        service.fetch_user('admin', student)
