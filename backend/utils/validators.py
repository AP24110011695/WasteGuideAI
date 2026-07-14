"""
WasteGuide AI - Response Validation Layer
Validates the parsed AI response against the expected schema and applies
safe defaults so downstream consumers always receive a complete, well-typed
response object.
"""

import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

REQUIRED_FIELDS = {
    "category": str,
    "category_icon": str,
    "is_recyclable": bool,
    "is_hazardous": bool,
    "is_reusable": bool,
    "disposal_instructions": list,
    "recycling_steps": list,
    "hazard_warning": str,
    "eco_suggestions": list,
    "accepted_facilities": list,
}

DEFAULT_RESPONSE = {
    "category": "General Waste",
    "category_icon": "🗑️",
    "is_recyclable": False,
    "is_hazardous": False,
    "is_reusable": False,
    "disposal_instructions": [
        "Dispose of this item in your general waste bin.",
        "Check local council guidelines for specific instructions.",
    ],
    "recycling_steps": [],
    "hazard_warning": "",
    "eco_suggestions": [
        "Consider reusing items when possible to reduce landfill waste.",
    ],
    "accepted_facilities": [
        "Local municipal waste collection",
    ],
}


class ValidationError(Exception):
    """Raised when the AI response fails critical validation checks."""

    def __init__(self, message="Validation failed", errors=None):
        super().__init__(message)
        self.message = message
        self.errors = errors or []


def validate_waste_response(data):
    """Validate and normalise a parsed waste-analysis response.

    Steps:
        1. Verify ``data`` is a dict.
        2. For each expected field, check presence and type.
        3. Apply safe defaults for missing or mistyped fields.
        4. Coerce scalar values stored as single-item strings into lists
           where the schema expects a list.
        5. Strip empty strings from list fields.
        6. Append ``accepted_at`` ISO-8601 timestamp.

    Args:
        data: The dict produced by ``json_parser.parse_json_response``.

    Returns:
        A validated dict with all required fields guaranteed present
        and correctly typed, plus an ``accepted_at`` timestamp.

    Raises:
        ValidationError: If ``data`` is not a dict.
    """
    if not isinstance(data, dict):
        raise ValidationError(
            "AI response is not a JSON object.",
            errors=["Expected dict, received " + type(data).__name__],
        )

    validated = {}
    warnings = []

    for field, expected_type in REQUIRED_FIELDS.items():
        value = data.get(field)

        if value is None:
            validated[field] = DEFAULT_RESPONSE[field]
            warnings.append(f"Missing field '{field}'; applied default.")
            continue

        if expected_type is bool:
            validated[field] = _coerce_bool(value, field, warnings)
            continue

        if expected_type is list:
            validated[field] = _coerce_list(value, field, warnings)
            continue

        if expected_type is str:
            validated[field] = _coerce_str(value, field, warnings)
            continue

        validated[field] = value

    validated["accepted_at"] = datetime.now(timezone.utc).isoformat()

    if warnings:
        logger.info(
            "Validation applied %d correction(s): %s",
            len(warnings),
            "; ".join(warnings),
        )

    return validated


def _coerce_bool(value, field, warnings):
    """Coerce a value to bool.

    Accepts actual booleans, the strings "true"/"false"/"yes"/"no", and
    integers 0/1. Anything else falls back to the schema default.

    Args:
        value: The value to coerce.
        field: The field name (for logging).
        warnings: Mutable list to append warning messages.

    Returns:
        A boolean value.
    """
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        if value.lower() in ("true", "yes", "1"):
            return True
        if value.lower() in ("false", "no", "0"):
            return False
    if isinstance(value, (int, float)):
        return bool(value)
    warnings.append(f"Non-boolean value for '{field}'; applied default.")
    return DEFAULT_RESPONSE[field]


def _coerce_list(value, field, warnings):
    """Coerce a value to a list of non-empty strings.

    If ``value`` is a string, it is wrapped in a single-element list.
    Non-string elements within a list are cast to ``str``.
    Empty strings are removed.

    Args:
        value: The value to coerce.
        field: The field name (for logging).
        warnings: Mutable list to append warning messages.

    Returns:
        A list of strings.
    """
    if isinstance(value, str):
        value = [value] if value.strip() else []
        warnings.append(f"Converted string to list for '{field}'.")

    if isinstance(value, list):
        cleaned = []
        for item in value:
            if isinstance(item, str):
                stripped = item.strip()
                if stripped:
                    cleaned.append(stripped)
            elif item is not None:
                cleaned.append(str(item).strip())
        return cleaned

    warnings.append(f"Unexpected type for '{field}'; applied default list.")
    return DEFAULT_RESPONSE[field]


def _coerce_str(value, field, warnings):
    """Coerce a value to a trimmed string.

    Args:
        value: The value to coerce.
        field: The field name (for logging).
        warnings: Mutable list to append warning messages.

    Returns:
        A stripped string.
    """
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, (int, float, bool)):
        warnings.append(f"Cast {type(value).__name__} to str for '{field}'.")
        return str(value)
    warnings.append(f"Unexpected type for '{field}'; applied default string.")
    return DEFAULT_RESPONSE[field]
