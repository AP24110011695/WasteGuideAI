"""
WasteGuide AI - Dashboard Service
Aggregates waste scan history from Firestore to power the user dashboard.
Returns metrics such as total scans, category distribution, daily trends,
and recent activity.
"""

import logging
from collections import Counter, defaultdict
from datetime import datetime, timezone, timedelta

from config.firebase_config import require_db

logger = logging.getLogger(__name__)

COLLECTION_NAME = "waste_logs"


class DashboardServiceError(Exception):
    def __init__(self, message, status_code=500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def get_dashboard_data(user_id):
    try:
        db = require_db()
    except RuntimeError as e:
        raise DashboardServiceError(str(e), status_code=503) from e

    try:
        query = (
            db.collection(COLLECTION_NAME)
            .where("user_id", "==", user_id)
            .order_by("created_at", direction="DESCENDING")
        )
        docs = list(query.stream())
    
    
    except Exception as exc:
        print("\n========== FIRESTORE ERROR ==========")
        print(type(exc))
        print(exc)
        print("=====================================\n")
        raise

    total_scans = len(docs)
    recyclable_count = 0
    hazardous_count = 0
    reusable_count = 0
    category_counter = Counter()
    daily_counter = defaultdict(int)
    recent_activity = []

    now = datetime.now(timezone.utc)
    thirty_days_ago = now - timedelta(days=30)

    for doc in docs:
        data = doc.to_dict()

        if data.get("is_recyclable"):
            recyclable_count += 1
        if data.get("is_hazardous"):
            hazardous_count += 1
        if data.get("is_reusable"):
            reusable_count += 1

        category = data.get("category", "Unknown")
        category_counter[category] += 1

        created_at = data.get("created_at")
        if created_at is not None:
            if hasattr(created_at, "date"):
                date_key = created_at.date().isoformat()
                if created_at >= thirty_days_ago:
                    daily_counter[date_key] += 1

        if len(recent_activity) < 10:
            created_iso = ""
            if created_at is not None and hasattr(created_at, "isoformat"):
                created_iso = created_at.isoformat()

            recent_activity.append({
                "id": doc.id,
                "waste_item": data.get("waste_item", ""),
                "category": category,
                "category_icon": data.get("category_icon", ""),
                "is_recyclable": data.get("is_recyclable", False),
                "is_hazardous": data.get("is_hazardous", False),
                "is_reusable": data.get("is_reusable", False),
                "created_at": created_iso,
            })

    daily_scan_trend = []
    for i in range(30):
        day = (now - timedelta(days=29 - i)).date().isoformat()
        daily_scan_trend.append({
            "date": day,
            "count": daily_counter.get(day, 0),
        })

    dashboard = {
        "total_scans": total_scans,
        "recyclable_count": recyclable_count,
        "hazardous_count": hazardous_count,
        "reusable_count": reusable_count,
        "category_distribution": dict(category_counter),
        "daily_scan_trend": daily_scan_trend,
        "recent_activity": recent_activity,
    }

    logger.info("Dashboard data computed for user '%s': %d total scans.", user_id, total_scans)
    return dashboard
