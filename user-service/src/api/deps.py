"""Dependency injection for API"""
from typing import Optional
from fastapi import Depends
from src.db.base import get_db
from src.db.repositories import UserRepository
from src.services.user_service import UserService
from core.settings import Settings
from src.core.auth import get_current_user as _get_current_user
from src.core.auth import get_current_admin as _get_current_admin

def get_settings():
    return Settings()

def get_user_repository(db=Depends(get_db)):
    return UserRepository(db)

def get_user_service(repo=Depends(get_user_repository), settings=Depends(get_settings)):
    return UserService(repo, settings)

def get_current_user(credentials=Depends(_get_current_user)):
    return credentials

def get_current_admin(credentials=Depends(_get_current_admin)):
    return credentials
