"""SQLAlchemy models"""
from sqlalchemy import Column, String, Enum, DateTime, func, Index
from src.db.base import Base
import enum

class UserRole(str, enum.Enum):
    student = "student"
    teacher = "teacher"
    admin = "admin"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    role = Column(Enum(UserRole), nullable=False, index=True)
    language = Column(String, nullable=True, index=True)
    name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False, index=True)
    action = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
