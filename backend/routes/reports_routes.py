from fastapi import APIRouter, HTTPException

from backend.models.report_model import PollutionReport, ReportResponse
from backend.services.report_service import (
    process_report,
    get_all_reports,
    get_report_by_id
)


router = APIRouter()


@router.post("/reports", response_model=ReportResponse)
def submit_report(report: PollutionReport):
    return process_report(report)


@router.get("/reports", response_model=list[ReportResponse])
def get_reports():
    return get_all_reports()


@router.get("/reports/{report_id}", response_model=ReportResponse)
def get_single_report(report_id: int):

    report = get_report_by_id(report_id)

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return report