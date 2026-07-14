"""
WasteGuide AI - Extensions Module
Centralized initialization of Flask extensions.
Extensions are instantiated here without binding to an app, then initialized
in the application factory via init_extensions(app).
This pattern allows extensions to be imported anywhere without circular imports.
"""

from flask_cors import CORS
from config.firebase_config import init_firebase, is_firebase_initialized

cors = CORS()


def init_extensions(app):
    """Initialize all Flask extensions with the application instance.

    Args:
        app: The Flask application instance.
    """
    cors_origins = app.config.get("CORS_ORIGINS", "*")
    if isinstance(cors_origins, str) and "," in cors_origins:
        cors_origins = [origin.strip() for origin in cors_origins.split(",")]

    cors.init_app(
        app,
        resources={r"/api/*": {"origins": cors_origins}},
        supports_credentials=app.config.get("CORS_SUPPORTS_CREDENTIALS", True),
    )

    # Firebase Admin SDK
    init_firebase(app)
    if is_firebase_initialized():
        app.logger.info("Firebase extension initialised successfully.")
    else:
        app.logger.warning(
            "Firebase extension not initialised — "
            "history and dashboard features will be unavailable."
        )
