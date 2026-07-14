"""
WasteGuide AI - Waste Analysis Route
Provides the POST /api/analyze-waste endpoint.
Accepts a waste item description, delegates to the GroqService for AI-powered
classification, and returns a structured JSON response.
"""

import logging
from flask import Blueprint, request, jsonify, current_app
from services.groq_service import GroqService, GroqServiceError
from utils.auth_middleware import firebase_auth_required
from utils.error_handlers import APIError
import html

logger = logging.getLogger(__name__)

waste_bp = Blueprint("waste", __name__)

_groq_service_instance = None


def _get_groq_service():
    """Lazy-initialise and cache a GroqService singleton."""
    global _groq_service_instance
    if _groq_service_instance is None:
        api_key = current_app.config.get("GROQ_API_KEY", "")
        model = current_app.config.get("GROQ_MODEL", "llama-3.3-70b-versatile")
        _groq_service_instance = GroqService(api_key=api_key, model=model)
    return _groq_service_instance


@waste_bp.route("/analyze-waste", methods=["POST"])
@firebase_auth_required
def analyze_waste():
    if not request.is_json:
        logger.warning("Non-JSON content type received: %s", request.content_type)
        raise APIError("Content-Type must be application/json.", 415)

    body = request.get_json(silent=True)
    if body is None:
        logger.warning("Malformed JSON body received.")
        raise APIError("Invalid JSON in request body.", 400)

    waste_item = body.get("waste_item", "")
    
    if not isinstance(waste_item, str):
        logger.warning("waste_item is not a string.")
        raise APIError("The 'waste_item' field must be a string.", 400)

    waste_item = waste_item.strip()
    
    # Sanitize input
    waste_item = html.escape(waste_item)

    if not waste_item:
        logger.warning("Missing or empty 'waste_item' field.")
        raise APIError("The 'waste_item' field is required and must be a non-empty string.", 400)

    if len(waste_item) > 500:
        logger.warning("waste_item exceeds 500 chars: %d", len(waste_item))
        raise APIError("The 'waste_item' field must not exceed 500 characters.", 400)

    try:
        groq_service = _get_groq_service()
        result = groq_service.analyze_waste(waste_item)
    except GroqServiceError as exc:
        logger.error("GroqServiceError: %s (status=%d)", exc.message, exc.status_code)
        raise APIError(f"AI Service Error: {exc.message}", 502)
    except Exception as exc:
        logger.critical("Unexpected error in analyze_waste: %s", str(exc), exc_info=True)
        raise APIError("An unexpected error occurred during analysis. Please try again.", 500)

    logger.info("Successfully analyzed waste item: '%s'", waste_item[:80])
    return jsonify({
        "success": True,
        "data": result,
    }), 200
