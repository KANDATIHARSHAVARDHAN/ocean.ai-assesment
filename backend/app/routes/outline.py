from fastapi import APIRouter, Depends

from app import models, schemas
from app.services import auth_service, gemini_service

router = APIRouter(prefix="/outline", tags=["outline"])


@router.post("/suggest")
def suggest_outline(
    payload: schemas.OutlineRequest,
    current_user: models.User = Depends(auth_service.get_current_user),
):
    suggestions = gemini_service.suggest_outline(
        payload.document_type,
        payload.main_topic,
        payload.desired_sections,
    )
    return {"suggestions": suggestions}
