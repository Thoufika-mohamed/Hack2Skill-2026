import json
from google import genai
from google.genai import types
from pydantic import BaseModel


class RiskAnalysisSchema(BaseModel):
    risk_score: float
    risk_level: str
    trend: str
    reasoning: str


def calculate_pollution_risk(
    pm25: float,
    pm10: float,
    no2: float,
    citizen_reports_count: int,
    trend: str
) -> dict:

    # Validate inputs
    if pm25 < 0 or pm10 < 0 or no2 < 0:
        raise ValueError("Pollution values cannot be negative")

    if citizen_reports_count < 0:
        raise ValueError(
            "Citizen report count cannot be negative"
        )

    trend = trend.upper()

    client = genai.Client()

    prompt = f"""
You are an environmental pollution risk assessment AI.

Analyze the following pollution information:

PM2.5: {pm25}
PM10: {pm10}
NO2: {no2}

Number of citizen reports:
{citizen_reports_count}

Pollution trend:
{trend}

Determine:

1. Risk score from 0 to 500
2. Risk level: LOW, MODERATE, or HIGH
3. Current trend
4. Short reasoning explaining the risk

Consider:
- Pollution measurements
- Number of citizen reports
- Increasing or decreasing trend

Do not invent measurements.
Do not provide medical advice.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=RiskAnalysisSchema
        )
    )

    result = json.loads(response.text)

    # Validate Gemini output
    result["risk_score"] = max(
        0,
        min(float(result["risk_score"]), 500)
    )

    result["risk_level"] = result["risk_level"].upper()
    result["trend"] = result["trend"].upper()

    result["metrics"] = {
        "pm25": pm25,
        "pm10": pm10,
        "no2": no2
    }

    return result


if __name__ == "__main__":

    result = calculate_pollution_risk(
        pm25=160.0,
        pm10=210.0,
        no2=85.0,
        citizen_reports_count=5,
        trend="INCREASING"
    )

    print("\nRisk Analysis:")
    print(json.dumps(result, indent=2))