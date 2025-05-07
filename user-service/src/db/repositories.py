"""Data access layer"""
import uuid
from sqlalchemy.orm import Session
from src.db.models import User, AuditLog
from src.core.exceptions import NotFoundError

class AuditLogRepository:
    def __init__(self, db: Session):
        self.db = db

    def log(self, user_id: str, action: str):
        entry = AuditLog(id=str(uuid.uuid4()), user_id=user_id, action=action)
        self.db.add(entry)
        self.db.commit()

class UserRepository:
    def __init__(self, db: Session):
        self.db = db
        self.audit_log_repo = AuditLogRepository(db)

    def get_by_id(self, user_id: str):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise NotFoundError(f"User {user_id} not found") 
        self.audit_log_repo.log(user_id, "read")
        return user

    def create(self, user_id: str, email: str, role: str):
        user = User(id=user_id, email=email, role=role)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        self.audit_log_repo.log(user.id, "create")
        return user

    def update(self, user: User, **kwargs):
        for k, v in kwargs.items():
            setattr(user, k, v)
        self.db.commit()
        self.db.refresh(user)
        self.audit_log_repo.log(user.id, "update")
        return user

    def delete(self, user: User):
        self.db.delete(user)
        self.db.commit()
        self.audit_log_repo.log(user.id, "delete")
