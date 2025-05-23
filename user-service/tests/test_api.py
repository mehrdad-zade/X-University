import os
import time
import pytest
from fastapi.testclient import TestClient
from jose import jwt
from dotenv import load_dotenv  # <-- add this
from src.main import app
from src.api import deps
import src.core.auth

load_dotenv()  # <-- load .env at the start

SECRET = os.getenv("JWT_SECRET", "changeme")
ALGO = "HS256"

# helper to create tokens
def create_token(sub, email, role, exp=None):
    payload = {"sub": sub, "email": email, "role": role}
    if exp is None:
        payload["exp"] = int(time.time() + 60)
    else:
        payload["exp"] = int(exp)
    return jwt.encode(payload, SECRET, algorithm=ALGO)

# Dependency overrides for all tests in this file
@pytest.fixture(autouse=True, scope="module")
def override_deps():
    def fake_get_current_user(*args, **kwargs):
        return {"sub": "u1", "email": "u1@example.com", "role": "student"}
    app.dependency_overrides[deps.get_current_user] = fake_get_current_user

    def fake_get_current_admin(*args, **kwargs):
        return {"sub": "admin", "email": "admin@example.com", "role": "admin"}
    app.dependency_overrides[deps.get_current_admin] = fake_get_current_admin

    # Patch security dependency to bypass HTTPBearer
    class DummyCreds:
        def __init__(self, token="testtoken"):
            self.credentials = token
    def fake_security():
        return DummyCreds()
    app.dependency_overrides[src.core.auth.security] = fake_security

    yield
    app.dependency_overrides = {}

@pytest.fixture
def client():
    return TestClient(app)

# JWT validation tests
def test_get_me_valid_token(client):
    print("[TEST] Running test_get_me_valid_token...")
    headers = {"Authorization": "Bearer faketoken"}
    res = client.get("/users/me", headers=headers)
    print(f"[TEST] Response status: {res.status_code}")
    print(f"[TEST] Response body: {res.text}")
    assert res.status_code == 200
    data = res.json()
    print(f"[TEST] Response JSON: {data}")
    assert data["sub"] == "u1"
    assert data["email"] == "u1@example.com"
    assert data["role"] == "student"

@pytest.mark.parametrize("token", [
    "invalid.token.here",
    create_token("u2", "u2@example.com", "student", exp=int(time.time() - 10))
])
def test_get_me_invalid_or_expired(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    res = client.get("/users/me", headers=headers)
    assert res.status_code == 401

# Metadata registration and profile update tests
@pytest.mark.order(1)
def test_register_metadata_and_update_profile(client):
    # Register metadata
    token = create_token("m1", "m1@example.com", "student")
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"language": "en", "age_group": "adult"}
    res = client.post("/users/register-metadata", json=payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["language"] == "en"
    assert data["age_group"] == "adult"

    # Partial update
    payload2 = {"language": "fr"}
    res2 = client.put("/users/profile", json=payload2, headers=headers)
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["language"] == "fr"
    assert data2["age_group"] == "adult"

# Admin vs non-admin access tests
@pytest.mark.order(2)
def test_get_user_by_id_admin_and_student(client):
    # admin can fetch
    admin_token = create_token("a1", "a1@example.com", "admin")
    headers_admin = {"Authorization": f"Bearer {admin_token}"}
    # ensure target user exists
    user_token = create_token("t1", "t1@example.com", "teacher")
    headers_user = {"Authorization": f"Bearer {user_token}"}
    # register target metadata so user exists
    client.post("/users/register-metadata", json={"language":"de"}, headers=headers_user)

    res = client.get("/users/t1", headers=headers_admin)
    assert res.status_code == 200
    assert res.json()["sub"] == "t1"

    # non-admin cannot fetch other user
    res2 = client.get("/users/a1", headers=headers_user)
    assert res2.status_code == 403

# Tests for updating user role
@pytest.mark.order(3)
def test_update_user_role_admin_and_nonadmin(client):
    # create target user via metadata registration with teacher role
    teacher_token = create_token("u_role", "u_role@example.com", "teacher")
    headers_teacher = {"Authorization": f"Bearer {teacher_token}"}
    client.post("/users/register-metadata", json={"language": "es"}, headers=headers_teacher)

    # admin updates role to student
    admin_token = create_token("admin1", "admin1@example.com", "admin")
    headers_admin = {"Authorization": f"Bearer {admin_token}"}
    res = client.put(f"/users/u_role/role", json={"role": "student"}, headers=headers_admin)
    assert res.status_code == 200
    assert res.json()["role"] == "student"

    # non-admin cannot update role
    res2 = client.put(f"/users/u_role/role", json={"role": "admin"}, headers=headers_teacher)
    assert res2.status_code == 403
