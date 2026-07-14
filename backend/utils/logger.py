"""
WasteGuide AI - Logging Configuration
Structured logging setup with console and rotating file handlers.
"""

import os
import logging
from logging.handlers import RotatingFileHandler


def configure_logging(app):
    """Configure application-wide logging with console and file handlers.

    Args:
        app: The Flask application instance.
    """
    log_level_name = app.config.get("LOG_LEVEL", "DEBUG")
    log_level = getattr(logging, log_level_name.upper(), logging.DEBUG)

    log_format = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(module)s:%(lineno)d | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    app.logger.setLevel(log_level)

    for handler in app.logger.handlers[:]:
        app.logger.removeHandler(handler)

    console_handler = logging.StreamHandler()
    console_handler.setLevel(log_level)
    console_handler.setFormatter(log_format)
    app.logger.addHandler(console_handler)

    log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
    os.makedirs(log_dir, exist_ok=True)

    file_handler = RotatingFileHandler(
        filename=os.path.join(log_dir, "wasteguide.log"),
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setLevel(log_level)
    file_handler.setFormatter(log_format)
    app.logger.addHandler(file_handler)

    logging.getLogger("werkzeug").setLevel(logging.WARNING)

    app.logger.info("Logging configured — level: %s", log_level_name.upper())
