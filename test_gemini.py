import warnings
import logging
import os

warnings.filterwarnings("ignore")

logging.getLogger().setLevel(logging.ERROR)
logging.getLogger("google").setLevel(logging.ERROR)
logging.getLogger("google.genai").setLevel(logging.ERROR)
import json
from dotenv import load_dotenv

load_dotenv()

from ai.report_analysis import analyze_citizen_report
from ai.risk_engine import calculate_pollution_risk
from ai.recommendations import generate_authority_recommendations


def analyze_complete_report(
    location: str,
    report_text: str,
    timestamp: str,
    pm25: float,
    pm10: float,
    no2: float,
    citizen_reports_count: int,
    trend: str,
    image_path: str = None
):

    print("\n" + "=" * 60)
    print("1. CITIZEN REPORT ANALYSIS")
    print("=" * 60)

    # STEP 1
    report_analysis_raw = analyze_citizen_report(
        report_text=report_text,
        location=location,
        time=timestamp,
        image_path=image_path
    )

    report_analysis = json.loads(report_analysis_raw)

    print(json.dumps(report_analysis, indent=2))

    print("\n" + "=" * 60)
    print("2. POLLUTION RISK ANALYSIS")
    print("=" * 60)

    # STEP 2
    risk_output = calculate_pollution_risk(
        pm25=pm25,
        pm10=pm10,
        no2=no2,
        citizen_reports_count=citizen_reports_count,
        trend=trend
    )

    print(json.dumps(risk_output, indent=2))

    print("\n" + "=" * 60)
    print("3. AUTHORITY RECOMMENDATIONS")
    print("=" * 60)

    # STEP 3
    recommendations_raw = generate_authority_recommendations(
        pollution_analysis=report_analysis_raw,
        risk_data=risk_output,
        location=location
    )

    recommendations = json.loads(recommendations_raw)

    print(json.dumps(recommendations, indent=2))

    # FINAL RESULT
    return {
        "location": location,
        "report_analysis": report_analysis,
        "risk_analysis": risk_output,
        "recommendations": recommendations
    }


# Temporary testing
# Later these values will come from your backend.
if __name__ == "__main__":

    result = analyze_complete_report(
        location="Neelambur, Coimbatore",
        report_text="Heavy black smoke coming from a nearby factory stack.",
        timestamp="10:30 AM",

        pm25=160.0,
        pm10=210.0,
        no2=85.0,

        citizen_reports_count=5,
        trend="INCREASING"
    )

    print("\n" + "=" * 60)
    print("FINAL COMBINED RESULT")
    print("=" * 60)

    print(json.dumps(result, indent=2))