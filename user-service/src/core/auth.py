from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
import os

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret")
ALGORITHM = "HS256"
security = HTTPBearer()

def get_current_user(token=Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "sub": payload.get("sub"),
            "email": payload.get("email"),
            "role": payload.get("role")
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
