"""
WasteGuide AI - Groq Service
Wraps the Groq Python SDK to send chat completion requests to the
llama-3.3-70b-versatile model. Handles client initialisation, request
timeout, API errors, and response extraction.
"""

import os
import logging
import time
from groq import Groq
from groq import (
    APIConnectionError,
    RateLimitError,
    APIStatusError,
    APITimeoutError,
)

from services.prompt_builder import build_prompt
from utils.json_parser import parse_json_response, JSONParseError
from utils.validators import validate_waste_response, ValidationError

logger = logging.getLogger(__name__)

GROQ_REQUEST_TIMEOUT = 30
MAX_RETRIES = 2
RETRY_DELAY_SECONDS = 1


class GroqServiceError(Exception):
    """Raised when the Groq service encounters an unrecoverable error."""

    def __init__(self, message="Groq service error", status_code=500, details=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details


class GroqService:
    """Encapsulates Groq API interactions for waste analysis.

    Attributes:
        client: An initialised ``groq.Groq`` client instance.
        model: The model identifier to use for completions.
    """

    def __init__(self, api_key=None, model=None):
        """Initialise the Groq client.

        Args:
            api_key: Groq API key. Falls back to the ``GROQ_API_KEY``
                     environment variable.
            model: Model identifier. Falls back to ``GROQ_MODEL`` env var
                   or ``llama-3.3-70b-versatile``.

        Raises:
            GroqServiceError: If no API key is available.
        """
        self.api_key = api_key or os.getenv("GROQ_API_KEY", "")
        self.model = model or os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

        if not self.api_key:
            raise GroqServiceError(
                message="GROQ_API_KEY is not configured. Set it in your .env file.",
                status_code=500,
                details="Missing API key",
            )

        self.client = Groq(api_key=self.api_key)
        logger.info("GroqService initialised — model: %s", self.model)

    def analyze_waste(self, waste_description):
        """Analyse a waste item by sending a prompt to the Groq model.

        The method builds a prompt, calls the Groq chat completion API with
        retry logic, parses the JSON from the raw model output, and validates
        the result against the expected schema.

        Args:
            waste_description: Human-readable description of the waste item.

        Returns:
            A validated dict containing the waste analysis result, with all
            required fields guaranteed present plus an ``accepted_at`` timestamp.

        Raises:
            GroqServiceError: On timeout, rate limiting, API failure, or
                              unrecoverable parse/validation errors.
        """
        messages = build_prompt(waste_description)

        raw_response = self._call_groq_api(messages)

        try:
            parsed = parse_json_response(raw_response)
        except JSONParseError as exc:
            logger.error("JSON parse failed: %s | raw: %s", exc.message, exc.raw_text[:200])
            raise GroqServiceError(
                message="Failed to parse AI response. Please try again.",
                status_code=502,
                details=exc.message,
            ) from exc

        try:
            validated = validate_waste_response(parsed)
        except ValidationError as exc:
            logger.error("Validation failed: %s | errors: %s", exc.message, exc.errors)
            raise GroqServiceError(
                message="AI response did not match the expected format. Please try again.",
                status_code=502,
                details=exc.message,
            ) from exc

        logger.info(
            "Waste analysis complete — category: %s, recyclable: %s",
            validated.get("category"),
            validated.get("is_recyclable"),
        )

        return validated

    def _call_groq_api(self, messages):
        """Send the chat completion request with retry logic.

        Retries on transient connection errors and rate limits up to
        ``MAX_RETRIES`` times with exponential back-off.

        Args:
            messages: The list of message dicts for the Groq API.

        Returns:
            The raw content string from the first choice in the completion.

        Raises:
            GroqServiceError: On exhausted retries or non-retryable errors.
        """
        last_exception = None

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                logger.debug("Groq API call attempt %d/%d", attempt, MAX_RETRIES)

                start_time = time.time()
                completion = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.3,
                    max_tokens=2048,
                    top_p=0.9,
                    timeout=GROQ_REQUEST_TIMEOUT,
                )
                elapsed = round(time.time() - start_time, 2)

                if (
                    not completion
                    or not completion.choices
                    or not completion.choices[0].message
                    or not completion.choices[0].message.content
                ):
                    raise GroqServiceError(
                        message="Empty response received from AI model.",
                        status_code=502,
                        details="No content in completion choices.",
                    )

                raw_content = completion.choices[0].message.content
                logger.info(
                    "Groq API responded in %.2fs — %d chars, model: %s",
                    elapsed,
                    len(raw_content),
                    self.model,
                )
                return raw_content

            except APITimeoutError as exc:
                last_exception = exc
                logger.warning(
                    "Groq API timeout on attempt %d/%d: %s",
                    attempt,
                    MAX_RETRIES,
                    str(exc),
                )

            except RateLimitError as exc:
                last_exception = exc
                logger.warning(
                    "Groq rate limit on attempt %d/%d: %s",
                    attempt,
                    MAX_RETRIES,
                    str(exc),
                )

            except APIConnectionError as exc:
                last_exception = exc
                logger.warning(
                    "Groq connection error on attempt %d/%d: %s",
                    attempt,
                    MAX_RETRIES,
                    str(exc),
                )

            except APIStatusError as exc:
                logger.error(
                    "Groq API status error (non-retryable): %d — %s",
                    exc.status_code,
                    str(exc),
                )
                raise GroqServiceError(
                    message="AI service returned an error. Please try again later.",
                    status_code=502,
                    details=f"Groq API {exc.status_code}: {str(exc)}",
                ) from exc

            except GroqServiceError:
                raise

            except Exception as exc:
                logger.error("Unexpected error during Groq API call: %s", str(exc), exc_info=True)
                raise GroqServiceError(
                    message="An unexpected error occurred while contacting the AI service.",
                    status_code=500,
                    details=str(exc),
                ) from exc

            if attempt < MAX_RETRIES:
                delay = RETRY_DELAY_SECONDS * attempt
                logger.info("Retrying in %ds…", delay)
                time.sleep(delay)

        logger.error("All %d Groq API attempts exhausted.", MAX_RETRIES)
        raise GroqServiceError(
            message="AI service is temporarily unavailable. Please try again later.",
            status_code=504,
            details=f"Exhausted {MAX_RETRIES} retries. Last error: {str(last_exception)}",
        )
