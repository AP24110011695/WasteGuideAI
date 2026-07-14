"""
WasteGuide AI - Configuration Module
Environment-aware configuration loader with development, testing, and production profiles.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class BaseConfig:
    """Base configuration shared across all environments."""

    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-secret-key-change-in-production")
    PORT = int(os.getenv("FLASK_PORT", 5000))
    HOST = os.getenv("FLASK_HOST", "0.0.0.0")

    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "")
    FIREBASE_PRIVATE_KEY = os.getenv("FIREBASE_PRIVATE_KEY", "")
    FIREBASE_CLIENT_EMAIL = os.getenv("FIREBASE_CLIENT_EMAIL", "")
    FIREBASE_SERVICE_ACCOUNT_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "")

    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")
    CORS_SUPPORTS_CREDENTIALS = True

    JSON_SORT_KEYS = False

    APP_NAME = "WasteGuide AI"
    APP_VERSION = "1.0.0"


class DevelopmentConfig(BaseConfig):
    """Development environment configuration."""

    DEBUG = True
    TESTING = False
    LOG_LEVEL = "DEBUG"


class TestingConfig(BaseConfig):
    """Testing environment configuration."""

    DEBUG = False
    TESTING = True
    LOG_LEVEL = "DEBUG"


class ProductionConfig(BaseConfig):
    """Production environment configuration."""

    DEBUG = False
    TESTING = False
    LOG_LEVEL = os.getenv("LOG_LEVEL", "WARNING")


CONFIG_MAP = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}


def get_config():
    """Return the configuration class based on the FLASK_ENV environment variable."""
    env = os.getenv("FLASK_ENV", "development").lower()
    return CONFIG_MAP.get(env, DevelopmentConfig)
