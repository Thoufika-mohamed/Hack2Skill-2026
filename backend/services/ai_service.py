import json


def analyze_report_with_ai(
    location: str,
    report_text: str,
    timestamp: str,
    pm25: float,
    pm10: float,
    no2: float,
    citizen_reports_count: int,
    trend: str,
    image_path: str | None = None
):

    # Import AI functions only when this function is called.
    # This allows the backend to start even before
    # the AI teammate's files are merged into the project.
    from ai.report_analysis import analyze_citizen_report
    from ai.risk_engine import calculate_pollution_risk
    from ai.recommendations import generate_authority_recommendations

    # STEP 1: Analyze citizen report
    report_analysis_raw = analyze_citizen_report(
        report_text=report_text,
        location=location,
        time=timestamp,
        image_path=image_path
    )

    report_analysis = json.loads(report_analysis_raw)

    # STEP 2: Calculate pollution risk
    risk_analysis = calculate_pollution_risk(
        pm25=pm25,
        pm10=pm10,
        no2=no2,
        citizen_reports_count=citizen_reports_count,
        trend=trend
    )

    # STEP 3: Generate authority recommendations
    recommendations_raw = generate_authority_recommendations(
        pollution_analysis=report_analysis_raw,
        risk_data=risk_analysis,
        location=location
    )

    recommendations = json.loads(recommendations_raw)

    # STEP 4: Return one combined result
    return {
        "location": location,
        "report_analysis": report_analysis,
        "risk_analysis": risk_analysis,
        "recommendations": recommendations
    }