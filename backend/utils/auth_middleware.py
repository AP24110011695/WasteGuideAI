"""
WasteGuide AI - Firebase Auth Middleware
Provides a ``firebase_auth_required`` decorator that verifies Firebase ID
tokens from the ``Authorization: Bearer <token>`` header.  On success the
decoded token claims are attached to ``request.user``.
"""

import logging
from functools import wraps

from flask import request, jsonify

from config.firebase_config import verify_id_token, is_firebase_initialized

logger = logging.getLogger(__name__)


def firebase_auth_required(f):
    """Decorator that enforces Firebase authentication on a route.

    Usage::

        @app.route("/protected")
        @firebase_auth_required
        def protected_route():
            uid = request.user["uid"]
            ...

    The decorator:
        1. Checks that Firebase is initialised.
        2. Extracts the ``Bearer`` token from the ``Authorization`` header.
        3. Verifies the token via ``firebase_admin.auth.verify_id_token``.
        4. Attaches the decoded claims dict to ``request.user``.

    Returns a 401 or 503 JSON error if any step fails.
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not is_firebase_initialized():
            logger.warning("Auth check skipped — Firebase not initialised.")
            return jsonify({
                "success": False,
                "error": {
                    "message": "Authentication service is unavailable.",
                    "status_code": 503,
                },
            }), 503

        auth_header = request.headers.get("Authorization", "")

        if not auth_header:
            logger.warning("Missing Authorization header.")
            return jsonify({
                "success": False,
                "error": {
                    "message": "Authorization header is required.",
                    "status_code": 401,
                },
            }), 401

        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0].lower() != "bearer":
            logger.warning("Malformed Authorization header.")
            return jsonify({
                "success": False,
                "error": {
                    "message": "Authorization header must be 'Bearer <token>'.",
                    "status_code": 401,
                },
            }), 401

        id_token = parts[1]

        try:
            decoded_token = verify_id_token(id_token)
            request.user = decoded_token
            logger.debug(
                "Authenticated user: uid=%s, email=%s",
                decoded_token.get("uid"),
                decoded_token.get("email", "N/A"),
            )
        except ValueError as exc:
            logger.warning("Token verification failed: %s", str(exc))
            return jsonify({
                "success": False,
                "error": {
                    "message": "Invalid or expired authentication token.",
                    "status_code": 401,
                },
            }), 401
        except Exception as exc:
            logger.error("Unexpected auth error: %s", str(exc), exc_info=True)
            return jsonify({
                "success": False,
                "error": {
                    "message": "Authentication failed.",
                    "status_code": 401,
                },
            }), 401

        return f(*args, **kwargs)

    return decorated_function
