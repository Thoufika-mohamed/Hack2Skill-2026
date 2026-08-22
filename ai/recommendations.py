import json
from google import genai
from pydantic import BaseModel
from google.genai import types


class Recommendation(BaseModel):
    action: str
    reason: str
    expected_outcome: str


class RecommendationsSchema(BaseModel):
    recommendations: list[Recommendation]


def generate_authority_recommendations(
    pollution_analysis: str,
    risk_data: dict,
    location: str
) -> str:

    client = genai.Client()

    prompt = f"""
You are an AI assistant supporting local municipal authorities
in managing air pollution.

LOCATION:
{location}

CITIZEN REPORT ANALYSIS:
{pollution_analysis}

POLLUTION RISK ANALYSIS:
{json.dumps(risk_data, indent=2)}

YOUR TASK:

Generate exactly 4 practical recommendations for municipal
authorities.

Recommendations must reflect the current risk level.

LOW risk:
- Monitoring
- Prevention
- Awareness
- Maintaining current conditions

MODERATE risk:
- Targeted inspections
- Source control
- Increased monitoring

HIGH risk:
- Immediate inspection
- Enforcement
- Source reduction
- Emergency pollution-control measures

If the trend is INCREASING:
- Recommend stronger monitoring and intervention.

If the trend is DECREASING:
- Recommend maintaining and reinforcing improvement.

Use only the available information.
Do not invent data.
Do not provide medical advice.

For every recommendation provide:

ACTION:
Specific action the authority should take.

REASON:
Why the action is appropriate based on the available data.

EXPECTED OUTCOME:
What improvement the action should achieve.

Return exactly 4 recommendations.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=RecommendationsSchema
        )
    )

    return response.text