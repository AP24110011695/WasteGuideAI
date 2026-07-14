"""
WasteGuide AI - History Service
Provides CRUD operations for waste scan history stored in Firestore.
All documents live in the ``waste_logs`` collection.
"""

import logging
from datetime import datetime, timezone

from config.firebase_config import require_db

logger = logging.getLogger(__name__)

COLLECTION_NAME = "waste_logs"


class HistoryServiceError(Exception):
    def __init__(self, message, status_code=500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def save_history(user_id, waste_item, analysis_result):
    try:
        db = require_db()
    except RuntimeError as e:
        raise HistoryServiceError(str(e), status_code=503) from e

    now = datetime.now(timezone.utc)

    doc_data = {
        "user_id": user_id,
        "waste_item": waste_item,
        "category": analysis_result.get("category", "Unknown"),
        "category_icon": analysis_result.get("category_icon", ""),
        "is_recyclable": analysis_result.get("is_recyclable", False),
        "is_hazardous": analysis_result.get("is_hazardous", False),
        "is_reusable": analysis_result.get("is_reusable", False),
        "disposal_instructions": analysis_result.get("disposal_instructions", []),
        "recycling_steps": analysis_result.get("recycling_steps", []),
        "hazard_warning": analysis_result.get("hazard_warning", ""),
        "eco_suggestions": analysis_result.get("eco_suggestions", []),
        "accepted_facilities": analysis_result.get("accepted_facilities", []),
        "created_at": now,
    }

    try:
        _, doc_ref = db.collection(COLLECTION_NAME).add(doc_data)
        logger.info("Saved history doc '%s' for user '%s'.", doc_ref.id, user_id)
        return {
            "id": doc_ref.id,
            "created_at": now.isoformat(),
        }
    except Exception as exc:
        logger.error("Failed to save history: %s", str(exc), exc_info=True)
        raise HistoryServiceError("Failed to save scan history.", status_code=500) from exc


def get_history(doc_id):
    try:
        db = require_db()
    except RuntimeError as e:
        raise HistoryServiceError(str(e), status_code=503) from e

    try:
        doc_ref = db.collection(COLLECTION_NAME).document(doc_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HistoryServiceError(f"History record '{doc_id}' not found.", status_code=404)
        data = doc.to_dict()
        data["id"] = doc.id
        if "created_at" in data and hasattr(data["created_at"], "isoformat"):
            data["created_at"] = data["created_at"].isoformat()
        return data
    except HistoryServiceError:
        raise
    except Exception as exc:
        logger.error("Failed to get history '%s': %s", doc_id, str(exc), exc_info=True)
        raise HistoryServiceError("Failed to retrieve scan history.", status_code=500) from exc


def delete_history(doc_id, user_id):
    try:
        db = require_db()
    except RuntimeError as e:
        raise HistoryServiceError(str(e), status_code=503) from e

    try:
        doc_ref = db.collection(COLLECTION_NAME).document(doc_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HistoryServiceError(f"History record '{doc_id}' not found.", status_code=404)

        doc_data = doc.to_dict()
        if doc_data.get("user_id") != user_id:
            raise HistoryServiceError("You are not authorised to delete this record.", status_code=403)

        doc_ref.delete()
        logger.info("Deleted history doc '%s' for user '%s'.", doc_id, user_id)
        return {"id": doc_id, "deleted": True}
    except HistoryServiceError:
        raise
    except Exception as exc:
        logger.error("Failed to delete history '%s': %s", doc_id, str(exc), exc_info=True)
        raise HistoryServiceError("Failed to delete scan history.", status_code=500) from exc


def get_user_history(user_id, limit=50):
    try:
        db = require_db()
    except RuntimeError as e:
        raise HistoryServiceError(str(e), status_code=503) from e

    try:
        query = (
            db.collection(COLLECTION_NAME)
            .where("user_id", "==", user_id)
            .order_by("created_at", direction="DESCENDING")
            .limit(limit)
        )
        docs = query.stream()

        results = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            if "created_at" in data and hasattr(data["created_at"], "isoformat"):
                data["created_at"] = data["created_at"].isoformat()
            results.append(data)

        logger.info("Retrieved %d history records for user '%s'.", len(results), user_id)
        return results
    except Exception as exc:
        logger.error("Failed to get user history for '%s': %s", user_id, str(exc), exc_info=True)
        raise HistoryServiceError("Failed to retrieve user history.", status_code=500) from exc
