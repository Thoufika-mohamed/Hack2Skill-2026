import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()
load_dotenv("backend/.env")

cred = None

# 1. Check if raw JSON string is provided in environment variables (Ideal for Render / Railway / Cloud)
service_account_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
if service_account_json:
    try:
        service_account_dict = json.loads(service_account_json)
        cred = credentials.Certificate(service_account_dict)
    except Exception as e:
        print(f"Warning: Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON environment variable: {e}")

# 2. Check if a custom file path is provided via environment variables
if not cred:
    cred_path = os.environ.get("FIREBASE_CREDENTIALS") or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)

# 3. Fallback to standard local file paths
if not cred:
    candidate_paths = [
        "backend/firebase-service-account.json",
        "firebase-service-account.json",
        os.path.join(os.path.dirname(__file__), "firebase-service-account.json"),
    ]
    for path in candidate_paths:
        if os.path.exists(path):
            cred = credentials.Certificate(path)
            break

if not cred:
    raise RuntimeError(
        "Firebase credentials not found. Please set FIREBASE_SERVICE_ACCOUNT_JSON env variable (raw JSON string) or ensure backend/firebase-service-account.json exists."
    )

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()