from jose import jwt
import time

SECRET = "changeme"  # Use your actual JWT secret if different
ALGO = "HS256"

def create_token(sub, email, role, exp=None):
    payload = {"sub": sub, "email": email, "role": role}
    if exp is None:
        payload["exp"] = time.time() + 60  # Token valid for 60 seconds
    else:
        payload["exp"] = exp
    return jwt.encode(payload, SECRET, algorithm=ALGO)

# Example usage:
token = create_token("u1", "u1@example.com", "student")
print(token)