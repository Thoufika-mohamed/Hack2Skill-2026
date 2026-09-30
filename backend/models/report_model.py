from pydantic import BaseModel, Field


class PollutionReport(BaseModel):
    location: str = Field(min_length=1)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    pollution_type: str = Field(min_length=1)
    risk: str | None = None
    description: str = Field(min_length=1)
    timestamp: str
    photo_url: str | None = None


class ReportResponse(BaseModel):
    id: int
    location: str
    latitude: float
    longitude: float
    pollution_type: str
    risk: str | None = None
    description: str
    timestamp: str
    photo_url: str | None = None
    status: str