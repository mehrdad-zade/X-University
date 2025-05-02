from pydantic import BaseModel, ConfigDict
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
    language: Optional[str] = None
    age_group: Optional[str] = None

class RoleUpdate(BaseModel):
    role: Role
