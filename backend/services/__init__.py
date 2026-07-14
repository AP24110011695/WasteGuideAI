"""
WasteGuide AI - Services Package
Exports service classes for use in route handlers and other modules.
"""

from services.groq_service import GroqService, GroqServiceError
from services.prompt_builder import build_prompt
from services.history_service import (
    save_history,
    get_history,
    delete_history,
    get_user_history,
    HistoryServiceError,
)
from services.dashboard_service import get_dashboard_data, DashboardServiceError
