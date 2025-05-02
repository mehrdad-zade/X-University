"""SQLAlchemy models"""
from sqlalchemy import Column, String, TIMESTAMP, func
from src.db.base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    role = Column(String, nullable=False, index=True)
    language = Column(String, nullable=True, index=True)
    age_group = Column(String, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    @property
    def sub(self):
        return self.id

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)
    action = Column(String, nullable=False)
    timestamp = Column(TIMESTAMP(timezone=True), server_default=func.now())
