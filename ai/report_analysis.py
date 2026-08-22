import os
from google import genai
from google.genai import types
from pydantic import BaseModel


class ReportAnalysisSchema(BaseModel):
    pollution_type: str
    severity: str
    possible_source: str
    confidence: int


def analyze_citizen_report(
    report_text: str,
    location: str,
    time: str,
    image_path: str = None
) -> str:

    client = genai.Client()

    contents = [
        f"""
Location: {location}
Time: {time}

Citizen Report:
{report_text}
"""
    ]

    # Optional image
    if image_path and os.path.exists(image_path):
        with open(image_path, "rb") as f:
            image_bytes = f.read()

        contents.append(
            types.Part.from_bytes(
                data=image_bytes,
                mime_type="image/jpeg"
            )
        )

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=contents,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ReportAnalysisSchema,
            system_instruction="""
You are an expert environmental pollution analyst.

Analyze the citizen's pollution report and identify:

1. Pollution type
2. Severity
3. Possible source
4. Confidence percentage

Do not invent information.
Base the analysis only on the available report,
location, time, and image if provided.
"""
        )
    )

    return response.text