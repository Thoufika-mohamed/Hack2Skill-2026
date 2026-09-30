from fastapi import APIRouter, Query

from backend.models.pollution_model import PollutionData
from backend.services.pollution_service import get_pollution_data


router = APIRouter()


@router.get("/pollution", response_model=PollutionData)
def get_pollution(
    latitude: float = Query(...),
    longitude: float = Query(...)
):
    return get_pollution_data(
        latitude=latitude,
        longitude=longitude
    )