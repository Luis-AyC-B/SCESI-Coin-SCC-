from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

    database_url: str = "postgresql+psycopg://scesi:scesi@localhost:5432/scesi_coin"
    jwt_secret: str = "change-me"
    rpc_url: str = "http://localhost:8545"
    wallet_encryption_key: str = "change-me"
    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
