"""
WasteGuide AI - Firebase Configuration
Initialises the Firebase Admin SDK with Firestore and Authentication.
Uses a service account derived from environment variables or a JSON key file.
Provides a singleton Firestore client accessible across the application.
"""

import os
import json
import logging
import firebase_admin
from firebase_admin import credentials, firestore, auth

logger = logging.getLogger(__name__)

_firestore_client = None
_firebase_initialized = False


def init_firebase(app):
    """Initialise Firebase Admin SDK using application configuration."""
    global _firebase_initialized, _firestore_client

    if _firebase_initialized:
        app.logger.debug("Firebase already initialised — skipping.")
        return

    service_account_path = app.config.get("FIREBASE_SERVICE_ACCOUNT_PATH", "")

    if service_account_path and os.path.isfile(service_account_path):
        cred = credentials.Certificate(service_account_path)
        app.logger.info("Firebase credentials loaded from file: %s", service_account_path)
    else:
        project_id = app.config.get("FIREBASE_PROJECT_ID", "")
        private_key = app.config.get("FIREBASE_PRIVATE_KEY", "")
        client_email = app.config.get("FIREBASE_CLIENT_EMAIL", "")

        if not all([project_id, private_key, client_email]):
            app.logger.warning(
                "Firebase credentials are incomplete. "
                "Firebase services will be unavailable."
            )
            _firebase_initialized = False
            return

        if isinstance(private_key, str):
            private_key = private_key.replace("\\n", "\n")

        service_info = {
            "type": "service_account",
            "project_id": project_id,
            "private_key_id": "env-derived",
            "private_key": private_key,
            "client_email": client_email,
            "client_id": "",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": (
                f"https://www.googleapis.com/robot/v1/metadata/x509/"
                f"{client_email}"
            ),
        }
        cred = credentials.Certificate(service_info)
        app.logger.info(
            "Firebase credentials loaded from environment variables — project: %s",
            project_id,
        )

    try:
        firebase_admin.initialize_app(cred)
        _firestore_client = firestore.client()
        _firebase_initialized = True
        app.logger.info("Firebase Admin SDK initialised successfully.")
    except Exception as exc:
        app.logger.error("Failed to initialise Firebase: %s", str(exc), exc_info=True)
        _firebase_initialized = False
        _firestore_client = None


def get_firestore_client():
    return _firestore_client


def is_firebase_initialized():
    return _firebase_initialized

def require_db():
    """Return the Firestore client or raise if unavailable."""
    if not _firebase_initialized or _firestore_client is None:
        raise RuntimeError("Firebase is not initialized or Firestore client is unavailable.")
    return _firestore_client


def verify_id_token(id_token):
    if not _firebase_initialized:
        raise ValueError("Firebase is not initialised. Cannot verify tokens.")

    decoded_token = auth.verify_id_token(id_token)
    return decoded_token
