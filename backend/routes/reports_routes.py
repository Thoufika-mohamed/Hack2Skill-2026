from fastapi import APIRouter, HTTPException

from backend.models.report_model import PollutionReport, ReportResponse
from backend.services.report_service import (
    process_report,
    get_all_reports,
    get_report_by_id,
    update_report_status
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
@router.patch("/reports/{report_id}/status", response_model=ReportResponse)
def update_status(
    report_id: int,
    status: str
):

    report = update_report_status(
        report_id,
        status
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return report