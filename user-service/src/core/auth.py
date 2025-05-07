from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
from core.settings import Settings
import requests
from jose import jwk
from jose.utils import base64url_decode

# load secrets from config
settings = Settings()
# Keycloak config
KEYCLOAK_ISSUER = settings.oidc_issuer  # e.g. 'https://keycloak.example.com/realms/myrealm'
JWKS_URL = f"{KEYCLOAK_ISSUER}/protocol/openid-connect/certs"
ALGORITHM = "RS256"
security = HTTPBearer()

# Cache JWKS keys
_jwks = None

def get_jwks():
    global _jwks
    if _jwks is None:
        resp = requests.get(JWKS_URL)
        resp.raise_for_status()
        _jwks = resp.json()["keys"]
    return _jwks

def decode_jwt_rs256(token: str):
    jwks = get_jwks()
    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header["kid"]
    key = next((k for k in jwks if k["kid"] == kid), None)
    if not key:
        raise HTTPException(status_code=401, detail="Invalid token: unknown kid")
    public_key = jwk.construct(key)
    message, encoded_sig = str(token).rsplit(".", 1)
    decoded_sig = base64url_decode(encoded_sig.encode())
    if not public_key.verify(message.encode(), decoded_sig):
        raise HTTPException(status_code=401, detail="Invalid token signature")
    payload = jwt.get_unverified_claims(token)
    return payload

def get_current_user(token=Depends(security)):
    try:
        payload = decode_jwt_rs256(token.credentials)
        return {
            "sub": payload.get("sub"),
            "email": payload.get("email"),
            "role": payload.get("role")
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user
