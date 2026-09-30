from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class HeatmapPoint(BaseModel):
    latitude: float
    longitude: float
    weight: float = Field(ge=0.0, le=10.0, description="Risk and pollution intensity weight")


class PublicSafePollutionZone(BaseModel):
    id: str
    location: str
    latitude: float
    longitude: float
    pollution_type: str
    risk: str  # "LOW", "MODERATE", "HIGH", "CRITICAL"
    classification: str  # "CITIZEN_REPORTED", "MEASURED", "CORROBORATED"
    reports_nearby: int
    last_updated: str
    status: str
    advisory: str
    weight: float


class OfficialPollutionZone(PublicSafePollutionZone):
    exact_latitude: float
    exact_longitude: float
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    no2: Optional[float] = None
    ai_risk_score: float  # 0 to 500
    ai_confidence: int  # 0 to 100%
    ai_priority: str  # "Low", "Medium", "High", "Critical"
    ai_signals: List[str]
    ai_reasoning: str
    suggested_action: str
    report_details: Optional[List[Dict[str, Any]]] = None


class GeospatialMapDataResponse(BaseModel):
    role: str
    zones: List[Dict[str, Any]]
    heatmap_points: List[HeatmapPoint]
    summary: Dict[str, Any]
    timestamp: str
