from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = Field(
        default="mysql+pymysql://username:password@localhost:3306/ai_document_app",
        alias="DATABASE_URL",
    )
    database_name: str = Field(default="ai_document_app", alias="DATABASE_NAME")
    jwt_secret_key: str = Field(default="change-me", alias="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expires_minutes: int = Field(default=30, alias="JWT_EXPIRE_MINUTES")
    gemini_api_key: str = Field(default="", alias="GEMINI_API_KEY")
    secret_key: str = Field(default="super-secret", alias="SECRET_KEY")
    debug: bool = Field(default=True, alias="DEBUG")
    backend_port: int = Field(default=8000, alias="BACKEND_PORT")
    cors_origins: str = Field(default="http://localhost:3000", alias="CORS_ORIGINS")
    react_app_api_base_url: str = Field(default="http://localhost:8000", alias="REACT_APP_API_BASE_URL")
    react_app_name: str = Field(default="AI Document Authoring Platform", alias="REACT_APP_NAME")
    react_app_version: str = Field(default="1.0.0", alias="REACT_APP_VERSION")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        populate_by_name = True
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()


