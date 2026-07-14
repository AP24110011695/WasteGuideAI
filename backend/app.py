"""
WasteGuide AI - Application Entry Point
Flask application factory with blueprint registration, extension initialization,
logging configuration, and centralized error handling.
"""

from flask import Flask
from config.settings import get_config
from extensions import init_extensions
from utils.logger import configure_logging
from utils.error_handlers import register_error_handlers
from routes.health import health_bp
from routes.waste import waste_bp
from routes.history import history_bp
from routes.dashboard import dashboard_bp


def create_app(config_class=None):
    """Application factory for the Flask app.

    Args:
        config_class: Optional configuration class override.
                      Defaults to the class selected by FLASK_ENV.

    Returns:
        Configured Flask application instance.
    """
    app = Flask(__name__)

    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)

    configure_logging(app)

    init_extensions(app)

    register_error_handlers(app)

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(waste_bp, url_prefix="/api")
    app.register_blueprint(history_bp, url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api")

    @app.route("/")
    def index():
        """Root endpoint — confirms the API is reachable."""
        return {
            "success": True,
            "data": {
                "message": "Welcome to WasteGuide AI API",
                "version": app.config.get("APP_VERSION", "1.0.0"),
            },
        }, 200

    app.logger.info(
        "%s v%s started — env=%s, debug=%s",
        app.config.get("APP_NAME"),
        app.config.get("APP_VERSION"),
        "development" if app.config.get("DEBUG") else "production",
        app.config.get("DEBUG"),
    )

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(
        host=application.config.get("HOST", "0.0.0.0"),
        port=application.config.get("PORT", 5000),
        debug=application.config.get("DEBUG", True),
    )
