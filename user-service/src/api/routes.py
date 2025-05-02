from fastapi import APIRouter, Depends, HTTPException
from src.core.auth import get_current_user, get_current_admin
from src.core.schemas import UserOut, UserUpdate, RoleUpdate
from src.api.deps import get_user_service
from src.services.user_service import UserService

router = APIRouter()

@router.get("/users/me", response_model=UserOut)
def get_me(user: dict = Depends(get_current_user)):
    return user

@router.post("/users/register-metadata", response_model=UserOut)
def register_metadata(
    metadata: UserUpdate,
    service: UserService = Depends(get_user_service),
    user: dict = Depends(get_current_user)
):
    return service.register_metadata(user["sub"], user["email"], user["role"], metadata)

@router.put("/users/profile", response_model=UserOut)
def update_profile(
    metadata: UserUpdate,
    service: UserService = Depends(get_user_service),
    user: dict = Depends(get_current_user)
):
    return service.update_profile(user["sub"], metadata)

@router.get("/users/{user_id}", response_model=UserOut)
def get_user_by_id(
    user_id: str,
    service: UserService = Depends(get_user_service),
    admin: dict = Depends(get_current_admin)
):
    return service.fetch_user(user_id, admin)

@router.put("/users/{user_id}/role", response_model=UserOut)
def update_user_role(
    user_id: str,
    role_update: RoleUpdate,
    service: UserService = Depends(get_user_service),
    admin: dict = Depends(get_current_admin)
):
    return service.update_role(admin, user_id, role_update.role.value)
