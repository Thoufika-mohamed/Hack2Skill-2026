from backend.models.report_model import PollutionReport


reports = []
next_report_id = 1


def process_report(report: PollutionReport):
    global next_report_id

    saved_report = {
        "id": next_report_id,
        "location": report.location,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "pollution_type": report.pollution_type,
        "description": report.description,
        "timestamp": report.timestamp,
        "photo_url": report.photo_url,
        "status": "Under Review"
    }

    reports.append(saved_report)
    next_report_id += 1

    return saved_report


def get_all_reports():
    return reports


def get_report_by_id(report_id: int):
    for report in reports:
        if report["id"] == report_id:
            return report

    return None