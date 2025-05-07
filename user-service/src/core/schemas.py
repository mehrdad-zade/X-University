from pydantic import BaseModel, ConfigDict, constr
from typing import Optional
from enum import Enum

class Role(str, Enum):
    student = 'student'
    teacher = 'teacher'
    admin = 'admin'

class UserOut(BaseModel):
    sub: str
    email: str
    role: Role
    language: Optional[str] = None
    age_group: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    language: Optional[constr(min_length=2, max_length=8, pattern=r'^[a-zA-Z-]+$')] = None  # e.g. 'en', 'en-US'
    age_group: Optional[constr(min_length=2, max_length=16, pattern=r'^[a-zA-Z0-9_-]+$')] = None  # e.g. 'adult', '18-25'

class RoleUpdate(BaseModel):
    role: Role
