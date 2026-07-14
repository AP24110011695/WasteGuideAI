"""
WasteGuide AI - History Routes
Provides endpoints for saving, retrieving, and deleting waste scan history.
"""

import logging
import html
from flask import Blueprint, request, jsonify

from utils.auth_middleware import firebase_auth_required
from utils.error_handlers import APIError
from services.history_service import (
    save_history,
    get_history,
    delete_history,
    get_user_history,
    HistoryServiceError,
)

logger = logging.getLogger(__name__)

history_bp = Blueprint("history", __name__)


@history_bp.route("/save-history", methods=["POST"])
@firebase_auth_required
def save_history_route():
    if not request.is_json:
        raise APIError("Content-Type must be application/json.", 415)

    body = request.get_json(silent=True)
    if body is None:
        raise APIError("Invalid JSON in request body.", 400)

    waste_item = body.get("waste_item", "")
    analysis_result = body.get("analysis_result", {})

    if not isinstance(waste_item, str) or not waste_item.strip():
        raise APIError("The 'waste_item' field is required and must be a non-empty string.", 400)

    # Sanitize input
    waste_item = html.escape(waste_item.strip())
    
    if len(waste_item) > 500:
        raise APIError("The 'waste_item' field must not exceed 500 characters.", 400)

    if not analysis_result or not isinstance(analysis_result, dict):
        raise APIError("The 'analysis_result' field is required and must be an object.", 400)

    user_id = request.user["uid"]

    try:
        result = save_history(user_id, waste_item, analysis_result)
        logger.info("History saved for user '%s'.", user_id)
        return jsonify({"success": True, "data": result}), 201
    except HistoryServiceError as exc:
        logger.error("HistoryServiceError: %s", exc.message)
        raise APIError(exc.message, exc.status_code)
    except Exception as exc:
        logger.critical("Unexpected error saving history: %s", str(exc), exc_info=True)
        raise APIError("An unexpected error occurred while saving history.", 500)


@history_bp.route("/get-history", methods=["GET"])
@firebase_auth_required
def get_history_route():
    user_id = request.user["uid"]
    
    try:
        limit = request.args.get("limit", 50, type=int)
        if limit is None:
            limit = 50
    except ValueError:
        raise APIError("Limit must be an integer.", 400)
        
    limit = min(max(limit, 1), 200)

    try:
        records = get_user_history(user_id, limit=limit)
        return jsonify({"success": True, "data": records}), 200
    except HistoryServiceError as exc:
        logger.error("HistoryServiceError: %s", exc.message)
        raise APIError(exc.message, exc.status_code)
    except Exception as exc:
        logger.critical("Unexpected error getting history: %s", str(exc), exc_info=True)
        raise APIError("An unexpected error occurred while fetching history.", 500)


@history_bp.route("/delete-history/<string:history_id>", methods=["DELETE"])
@firebase_auth_required
def delete_history_route(history_id):
    user_id = request.user["uid"]

    if not history_id or not isinstance(history_id, str) or not history_id.strip():
        raise APIError("History ID is required and must be a valid string.", 400)
        
    history_id = html.escape(history_id.strip())

    try:
        result = delete_history(history_id, user_id)
        logger.info("History '%s' deleted by user '%s'.", history_id, user_id)
        return jsonify({"success": True, "data": result}), 200
    except HistoryServiceError as exc:
        logger.error("HistoryServiceError: %s", exc.message)
        raise APIError(exc.message, exc.status_code)
    except Exception as exc:
        logger.critical("Unexpected error deleting history: %s", str(exc), exc_info=True)
        raise APIError("An unexpected error occurred while deleting history.", 500)
