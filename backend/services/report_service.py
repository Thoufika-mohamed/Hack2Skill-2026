from backend.models.report_model import PollutionReport
from backend.firebase_config import db


COLLECTION_NAME = "reports"


def process_report(report: PollutionReport):
    # Generate a new integer ID based on the number of existing reports
    existing_reports = db.collection(COLLECTION_NAME).stream()
    ids = []

    for document in existing_reports:
        data = document.to_dict()
        if "id" in data:
            ids.append(data["id"])

    new_id = max(ids, default=0) + 1

    saved_report = {
        "id": new_id,
        "location": report.location,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "pollution_type": report.pollution_type,
        "risk": report.risk,
        "description": report.description,
        "timestamp": report.timestamp,
        "photo_url": report.photo_url,
        "status": "Under Review"
    }

    # Use the integer ID as the Firestore document ID
    db.collection(COLLECTION_NAME).document(str(new_id)).set(saved_report)

    return saved_report


def get_all_reports():
    documents = db.collection(COLLECTION_NAME).stream()

    reports = []

    for document in documents:
        reports.append(document.to_dict())

    reports.sort(key=lambda report: report["id"])

    return reports


def get_report_by_id(report_id: int):
    document = (
        db.collection(COLLECTION_NAME)
        .document(str(report_id))
        .get()
    )

    if not document.exists:
        return None

    return document.to_dict()
def update_report_status(report_id: int, status: str):

    document_ref = (
        db.collection(COLLECTION_NAME)
        .document(str(report_id))
    )

    document = document_ref.get()

    if not document.exists:
        return None

    document_ref.update({
        "status": status
    })

    updated_document = document_ref.get()

    return updated_document.to_dict()