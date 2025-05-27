"""Business logic"""
from src.db.repositories import UserRepository, AuditLogRepository
from src.core.schemas import UserUpdate
from src.core.exceptions import PermissionDeniedError, NotFoundError

class UserService:
    def __init__(self, repo: UserRepository, settings):
        self.repo = repo
        self.audit_repo = AuditLogRepository(repo.db)

    def fetch_user(self, user_id: str, current_user: dict = None):
        # first: disallow anybody except self or an admin
        if current_user and current_user["sub"] != user_id and current_user["role"] != "admin":
            raise PermissionDeniedError()
        # now look up the user (404 if not found)
        self.audit_repo.log(current_user["sub"], f"fetched user {user_id}")
        user = self.repo.get_by_id(user_id)
        self.audit_repo.log(current_user["sub"], f"fetched user {user_id}")
        return user

    def register_metadata(self, user_id: str, email: str, role: str, metadata: UserUpdate):
        try:
            self.repo.get_by_id(user_id)
        except NotFoundError:
            self.repo.create(user_id, email, role)
        return self.update_profile(user_id, metadata)

    def update_profile(self, user_id: str, metadata: UserUpdate):
        user = self.repo.get_by_id(user_id)
        # Exclude fields with None values
        update_data = {k: v for k, v in metadata.model_dump(exclude_unset=True).items() if v is not None}
        # Debug log to verify update_data
        print(f"[DEBUG] update_data before update: {update_data}")
        updated = self.repo.update(user, **update_data)
        self.audit_repo.log(user_id, "updated profile")
        return updated

    def update_role(self, current_user: dict, user_id: str, new_role: str):
        if current_user["role"] != "admin":
            raise PermissionDeniedError()
        user = self.repo.get_by_id(user_id)
        updated = self.repo.update(user, role=new_role)
        self.audit_repo.log(current_user["sub"], f"role changed for {user_id} to {new_role}")
        return updated
