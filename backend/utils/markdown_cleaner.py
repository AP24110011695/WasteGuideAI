"""
WasteGuide AI - Markdown Cleaner
Strips markdown code fences, backticks, and formatting artifacts from raw
AI model output so downstream JSON parsing receives clean input.
"""

import re
import logging

logger = logging.getLogger(__name__)


def clean_markdown(raw_text):
    """Remove markdown formatting artifacts from AI-generated text.

    Handles fenced code blocks (```json ... ```), inline backticks,
    leading/trailing whitespace, and common escape sequences that
    interfere with JSON deserialization.

    Args:
        raw_text: The raw string returned by the AI model.

    Returns:
        A cleaned string with markdown artifacts removed.
    """
    if not raw_text or not isinstance(raw_text, str):
        logger.warning("clean_markdown received empty or non-string input.")
        return ""

    cleaned = raw_text.strip()

    fenced_pattern = re.compile(
        r"```(?:json|JSON|python|text|plaintext)?\s*\n?(.*?)\n?\s*```",
        re.DOTALL,
    )
    fenced_match = fenced_pattern.search(cleaned)
    if fenced_match:
        cleaned = fenced_match.group(1).strip()
        logger.debug("Extracted content from fenced code block.")
    else:
        cleaned = re.sub(r"^`+|`+$", "", cleaned).strip()

    cleaned = cleaned.replace("\\_", "_")
    cleaned = cleaned.replace("\\*", "*")
    cleaned = cleaned.replace("\\#", "#")

    cleaned = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", cleaned)

    logger.debug("Markdown cleaning complete. Output length: %d", len(cleaned))
    return cleaned
