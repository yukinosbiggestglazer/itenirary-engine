from fastapi import APIRouter
from backend.models import PipelineRequest
from backend.services.poi_formatter import get_pois

router = APIRouter()


@router.post("/pois")
def fetch_pois(request: PipelineRequest):
    return get_pois(request.cities)