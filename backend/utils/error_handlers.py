"""
WasteGuide AI - Centralized Error Handlers
Registers global error handlers on the Flask application so that all errors
return consistent JSON responses.
"""

from flask import jsonify
import logging

logger = logging.getLogger(__name__)


class APIError(Exception):
    """Custom API error class for raising structured HTTP errors.

    Attributes:
        message: Human-readable error description.
        status_code: HTTP status code.
        payload: Optional dict of additional error details.
    """

    def __init__(self, message, status_code=400, payload=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        """Serialize the error to a dictionary."""
        error_dict = {
            "success": False,
            "error": {
                "message": self.message,
                "status_code": self.status_code,
            },
        }
        if self.payload:
            error_dict["error"]["details"] = self.payload
        return error_dict


def register_error_handlers(app):
    """Register centralized error handlers on the Flask app.

    Args:
        app: The Flask application instance.
    """

    @app.errorhandler(APIError)
    def handle_api_error(error):
        """Handle custom APIError exceptions."""
        logger.warning("APIError %d: %s", error.status_code, error.message)
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    @app.errorhandler(400)
    def handle_bad_request(error):
        """Handle 400 Bad Request errors."""
        logger.warning("Bad Request: %s", error)
        return jsonify({
            "success": False,
            "error": {
                "message": "Bad request.",
                "status_code": 400,
            },
        }), 400

    @app.errorhandler(404)
    def handle_not_found(error):
        """Handle 404 Not Found errors."""
        logger.info("Not Found: %s", error)
        return jsonify({
            "success": False,
            "error": {
                "message": "The requested resource was not found.",
                "status_code": 404,
            },
        }), 404

    @app.errorhandler(405)
    def handle_method_not_allowed(error):
        """Handle 405 Method Not Allowed errors."""
        logger.warning("Method Not Allowed: %s", error)
        return jsonify({
            "success": False,
            "error": {
                "message": "Method not allowed.",
                "status_code": 405,
            },
        }), 405

    @app.errorhandler(422)
    def handle_unprocessable_entity(error):
        """Handle 422 Unprocessable Entity errors."""
        logger.warning("Unprocessable Entity: %s", error)
        return jsonify({
            "success": False,
            "error": {
                "message": "Unprocessable entity.",
                "status_code": 422,
            },
        }), 422

    @app.errorhandler(429)
    def handle_too_many_requests(error):
        """Handle 429 Too Many Requests errors."""
        logger.warning("Rate Limit Exceeded: %s", error)
        return jsonify({
            "success": False,
            "error": {
                "message": "Too many requests. Please try again later.",
                "status_code": 429,
            },
        }), 429

    @app.errorhandler(500)
    def handle_internal_server_error(error):
        """Handle 500 Internal Server Error."""
        logger.error("Internal Server Error: %s", error, exc_info=True)
        return jsonify({
            "success": False,
            "error": {
                "message": "An internal server error occurred.",
                "status_code": 500,
            },
        }), 500

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        """Catch-all handler for unhandled exceptions."""
        logger.critical("Unhandled Exception: %s", error, exc_info=True)
        return jsonify({
            "success": False,
            "error": {
                "message": "An unexpected error occurred.",
                "status_code": 500,
            },
        }), 500

    app.logger.info("Centralized error handlers registered.")
