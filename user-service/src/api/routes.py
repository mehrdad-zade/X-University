from fastapi import APIRouter, Depends
from src.core.auth import get_current_user
from src.core.schemas import UserOut

router = APIRouter()

@router.get("/users/me", response_model=UserOut)
def get_me(user: dict = Depends(get_current_user)):
    return user
