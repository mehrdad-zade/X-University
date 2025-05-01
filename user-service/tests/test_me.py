from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_get_me_unauthenticated():
    response = client.get("/users/me")
    assert response.status_code == 403
