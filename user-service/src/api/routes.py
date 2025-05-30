from fastapi import APIRouter, Depends, HTTPException
from src.core.auth import get_current_user, get_current_admin
from src.core.schemas import UserOut, UserUpdate, RoleUpdate
from src.api.deps import get_user_service
from src.services.user_service import UserService

router = APIRouter()

def to_userout(user):
    if isinstance(user, dict):
        return user
    return UserOut(
        sub=user.id,
        email=user.email,
        role=user.role,
        language=getattr(user, 'language', None),
        age_group=getattr(user, 'age_group', None)
    )

@router.get("/users/me", response_model=UserOut)
def get_me(user: dict = Depends(get_current_user)):
    return to_userout(user)

@router.post("/users/register-metadata", response_model=UserOut)
def register_metadata(
    metadata: UserUpdate,
    service: UserService = Depends(get_user_service),
    user: dict = Depends(get_current_user)
):
    result = service.register_metadata(user["sub"], user["email"], user["role"], metadata)
    return to_userout(result)

@router.put("/users/profile", response_model=UserOut)
def update_profile(
    metadata: UserUpdate,
    service: UserService = Depends(get_user_service),
    user: dict = Depends(get_current_user)
):
    result = service.update_profile(user["sub"], metadata)
    return to_userout(result)

@router.get("/users/{user_id}", response_model=UserOut)
def get_user_by_id(
    user_id: str,
    service: UserService = Depends(get_user_service),
    current_user: dict = Depends(get_current_user)
):
    result = service.fetch_user(user_id, current_user)
    return to_userout(result)

@router.put("/users/{user_id}/role", response_model=UserOut)
def update_user_role(
    user_id: str,
    role_update: RoleUpdate,
    service: UserService = Depends(get_user_service),
    current_user: dict = Depends(get_current_user)
):
    result = service.update_role(current_user, user_id, role_update.role.value)
    return to_userout(result)
