from pydantic import BaseModel

class UserOut(BaseModel):
    sub: str
    email: str
    role: str
