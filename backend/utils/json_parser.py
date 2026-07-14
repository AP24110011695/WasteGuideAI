"""
WasteGuide AI - JSON Parser
Extracts and deserializes JSON from raw AI model output.
Falls back to brace-matching extraction when the full string is not valid JSON.
"""

import json
import re
import logging

from utils.markdown_cleaner import clean_markdown

logger = logging.getLogger(__name__)


class JSONParseError(Exception):
    """Raised when JSON extraction from AI output fails."""

    def __init__(self, message="Failed to parse JSON from AI response", raw_text=""):
        super().__init__(message)
        self.message = message
        self.raw_text = raw_text


def parse_json_response(raw_text):
    """Parse a JSON object from raw AI-generated text.

    Strategy:
        1. Clean markdown formatting artifacts.
        2. Attempt direct ``json.loads`` on the cleaned text.
        3. Fall back to extracting the first ``{ … }`` substring.
        4. Fall back to extracting a JSON array ``[ … ]`` if present.
        5. Raise ``JSONParseError`` if all attempts fail.

    Args:
        raw_text: The raw response string from the AI model.

    Returns:
        A Python dict or list deserialized from the extracted JSON.

    Raises:
        JSONParseError: If no valid JSON can be extracted.
    """
    if not raw_text or not isinstance(raw_text, str):
        raise JSONParseError("Empty or non-string input received.", raw_text=str(raw_text))

    cleaned = clean_markdown(raw_text)

    try:
        parsed = json.loads(cleaned)
        logger.debug("Direct json.loads succeeded.")
        return parsed
    except json.JSONDecodeError:
        logger.debug("Direct json.loads failed; attempting brace extraction.")

    parsed = _extract_by_braces(cleaned, "{", "}")
    if parsed is not None:
        return parsed

    parsed = _extract_by_braces(cleaned, "[", "]")
    if parsed is not None:
        return parsed

    raise JSONParseError(
        "Could not extract valid JSON from AI response.",
        raw_text=cleaned[:500],
    )


def _extract_by_braces(text, open_char, close_char):
    """Extract a JSON structure delimited by matching braces/brackets.

    Uses a simple depth counter to find the outermost balanced pair of
    ``open_char`` / ``close_char``, then attempts ``json.loads`` on the
    extracted substring.

    Args:
        text: The cleaned text to search.
        open_char: The opening delimiter (``{`` or ``[``).
        close_char: The closing delimiter (``}`` or ``]``).

    Returns:
        A parsed Python object if extraction succeeds, otherwise ``None``.
    """
    start_idx = text.find(open_char)
    if start_idx == -1:
        return None

    depth = 0
    in_string = False
    escape_next = False

    for i in range(start_idx, len(text)):
        char = text[i]

        if escape_next:
            escape_next = False
            continue

        if char == "\\":
            escape_next = True
            continue

        if char == '"':
            in_string = not in_string
            continue

        if in_string:
            continue

        if char == open_char:
            depth += 1
        elif char == close_char:
            depth -= 1
            if depth == 0:
                candidate = text[start_idx : i + 1]
                try:
                    parsed = json.loads(candidate)
                    logger.debug(
                        "Brace extraction succeeded (%s…%s) at [%d:%d].",
                        open_char,
                        close_char,
                        start_idx,
                        i + 1,
                    )
                    return parsed
                except json.JSONDecodeError:
                    logger.debug(
                        "Brace extraction found candidate but json.loads failed."
                    )
                    return None

    logger.debug("Brace extraction found no balanced %s…%s pair.", open_char, close_char)
    return None
