from pydantic import BaseModel


class AIAnalysisRequest(BaseModel):
    location: str
    report_text: str
    timestamp: str

    pm25: float
    pm10: float
    no2: float

    citizen_reports_count: int
    trend: str

    image_path: str | None = None


class AIAnalysisResponse(BaseModel):
    location: str
    report_analysis: dict
    risk_analysis: dict
    recommendations: dict