"""
WasteGuide AI - Health Check Route
Provides system health and readiness information.
"""

import time
from datetime import datetime, timezone
from flask import Blueprint, jsonify, current_app

health_bp = Blueprint("health", __name__)

START_TIME = time.time()


@health_bp.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify the API is running.

    Returns:
        JSON response with status, version, uptime, environment, and server timestamp.
    """
    uptime_seconds = round(time.time() - START_TIME, 2)

    hours, remainder = divmod(int(uptime_seconds), 3600)
    minutes, seconds = divmod(remainder, 60)
    uptime_formatted = f"{hours}h {minutes}m {seconds}s"

    return jsonify({
        "success": True,
        "data": {
            "status": "healthy",
            "app_name": current_app.config.get("APP_NAME", "WasteGuide AI"),
            "version": current_app.config.get("APP_VERSION", "1.0.0"),
            "environment": "development" if current_app.config.get("DEBUG") else "production",
            "uptime": uptime_formatted,
            "uptime_seconds": uptime_seconds,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    }), 200
