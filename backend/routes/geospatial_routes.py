from fastapi import APIRouter, Query
from backend.models.geospatial_model import GeospatialMapDataResponse
from backend.services.geospatial_service import get_geospatial_data

router = APIRouter()


@router.get("/geospatial/map-data", response_model=GeospatialMapDataResponse)
def get_map_data(
    role: str = Query("public", description="Role requesting map data: 'public' or 'official'")
):
    """
    Returns unified geospatial risk and heatmap data.
    - If role is 'public', returns public-safe, privacy-preserved zones without PII.
    - If role is 'official', returns authorized operational details with AI assessments.
    """
    clean_role = role.lower() if role in ["public", "official"] else "public"
    return get_geospatial_data(role=clean_role)
