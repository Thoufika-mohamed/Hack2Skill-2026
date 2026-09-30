from fastapi import APIRouter

from backend.models.ai_model import (
    AIAnalysisRequest,
    AIAnalysisResponse
)

from backend.services.ai_service import analyze_report_with_ai


router = APIRouter()


@router.post(
    "/analyze-report",
    response_model=AIAnalysisResponse
)
def analyze_report(request: AIAnalysisRequest):

    return analyze_report_with_ai(
        location=request.location,
        report_text=request.report_text,
        timestamp=request.timestamp,

        pm25=request.pm25,
        pm10=request.pm10,
        no2=request.no2,

        citizen_reports_count=request.citizen_reports_count,
        trend=request.trend,

        image_path=request.image_path
    )