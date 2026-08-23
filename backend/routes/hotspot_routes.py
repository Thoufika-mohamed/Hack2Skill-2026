from fastapi import APIRouter

from backend.models.hotspot_model import Hotspot
from backend.services.hotspot_service import get_hotspots


router = APIRouter()


@router.get("/hotspots", response_model=list[Hotspot])
def hotspots():
    return get_hotspots()