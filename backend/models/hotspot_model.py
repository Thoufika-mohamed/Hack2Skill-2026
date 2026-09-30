from pydantic import BaseModel, Field


class Hotspot(BaseModel):
    id: int
    location: str
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    risk: str
    report_count: int = Field(ge=0)