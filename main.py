from fastapi import FastAPI
from pydantic import BaseModel

from test_gemini import analyze_complete_report


app = FastAPI()


class CitizenReport(BaseModel):
    location: str
    report_text: str
    timestamp: str

    pm25: float
    pm10: float
    no2: float

    citizen_reports_count: int
    trend: str


@app.post("/analyze-report")
def analyze_report(report: CitizenReport):

    result = analyze_complete_report(
        location=report.location,
        report_text=report.report_text,
        timestamp=report.timestamp,

        pm25=report.pm25,
        pm10=report.pm10,
        no2=report.no2,

        citizen_reports_count=report.citizen_reports_count,
        trend=report.trend
    )

    return result