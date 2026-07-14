"""
WasteGuide AI - Dashboard Routes
Provides the endpoint for retrieving aggregated dashboard data.
"""

import logging
from flask import Blueprint, request, jsonify

from utils.auth_middleware import firebase_auth_required
from utils.error_handlers import APIError
from services.dashboard_service import get_dashboard_data, DashboardServiceError

logger = logging.getLogger(__name__)

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard-data", methods=["GET"])
@firebase_auth_required
def dashboard_data_route():
    user_id = request.user["uid"]

    try:
        data = get_dashboard_data(user_id)
        return jsonify({"success": True, "data": data}), 200
    except DashboardServiceError as exc:
        logger.error("DashboardServiceError: %s", exc.message)
        raise APIError(exc.message, exc.status_code)
    except Exception as exc:
        logger.critical("Unexpected error in dashboard: %s", str(exc), exc_info=True)
        raise APIError("An unexpected error occurred while fetching dashboard data.", 500)
