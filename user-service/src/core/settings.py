from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    jwt_secret: str
    database_url: str
    allowed_origins: List[str] = ["*"]
    oidc_issuer: str  # Read OIDC_ISSUER from .env

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra='ignore'
    )
