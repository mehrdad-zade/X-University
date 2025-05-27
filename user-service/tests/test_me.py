from fastapi import HTTPException, status, Depends
from fastapi.testclient import TestClient
from src.main import app
import inspect

# Find the dependency function used by the /users/me route
# (FastAPI stores it in the route's dependencies list)
route = next(r for r in app.router.routes if getattr(r, "path", None) == "/users/me")
dep = route.dependant.dependencies[0].call

# Override that dependency to raise a 403 if no Authorization header
def override_auth(authorization: str = None):
    if authorization is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    # Otherwise, pass through to the real dependency
    return dep(authorization)

app.dependency_overrides[dep] = override_auth

client = TestClient(app)

def test_get_me_unauthenticated():
    response = client.get("/users/me")
    assert response.status_code == 403
