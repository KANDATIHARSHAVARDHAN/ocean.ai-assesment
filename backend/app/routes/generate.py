from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database.connection import get_db
from app.services import auth_service, database_service, gemini_service

router = APIRouter(prefix="/generate", tags=["generation"])


@router.post("/{structure_id}", response_model=schemas.DocumentStructureOut)
def generate_section(
    structure_id: int,
    payload: schemas.GenerateRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_service.get_current_user),
):
    structure = database_service.get_structure_for_user(db, structure_id, current_user.id)
    project = structure.project
    heading = structure.title
    # Use heading as prompt for generation
    generated = gemini_service.generate_content(
        heading,
        document_type=project.document_type,
        side_heading=payload.side_heading,
        lines_count=payload.lines_count,
    )
    if structure.content:
        structure.content.generated_content = generated
        structure.content.refinement_prompt = payload.prompt
    else:
        structure.content = models.Content(
            generated_content=generated,
            refinement_prompt=payload.prompt,
        )
    db.commit()
    db.refresh(structure)
    return structure


@router.post("/{structure_id}/refine", response_model=schemas.DocumentStructureOut)
def refine_content(
    structure_id: int,
    payload: schemas.RefineRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_service.get_current_user),
):
    structure = database_service.get_structure_for_user(db, structure_id, current_user.id)
    if not structure.content:
        raise HTTPException(status_code=400, detail="Content not generated yet")
    original = structure.content.generated_content
    revised = gemini_service.generate_content(
        payload.prompt,
        context=original,
        document_type=structure.project.document_type,
        side_heading=payload.side_heading,
        lines_count=payload.lines_count,
    )
    history_entry = models.RefinementHistory(
        content_id=structure.content.id,
        old_content=original,
        new_content=revised,
        refinement_prompt=payload.prompt,
    )
    structure.content.generated_content = revised
    structure.content.refinement_prompt = payload.prompt
    db.add(history_entry)
    db.commit()
    db.refresh(structure)
    return structure


@router.post("/{structure_id}/feedback", response_model=schemas.DocumentStructureOut)
def submit_feedback(
    structure_id: int,
    payload: schemas.FeedbackRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_service.get_current_user),
):
    structure = database_service.get_structure_for_user(db, structure_id, current_user.id)
    if not structure.content:
        raise HTTPException(status_code=400, detail="Content not generated yet")
    if payload.positive:
        structure.content.likes_count += 1
    else:
        structure.content.dislikes_count += 1
    db.commit()
    db.refresh(structure)
    return structure


@router.post("/{structure_id}/comment", response_model=schemas.DocumentStructureOut)
def add_comment(
    structure_id: int,
    payload: schemas.CommentRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_service.get_current_user),
):
    structure = database_service.get_structure_for_user(db, structure_id, current_user.id)
    if not structure.content:
        raise HTTPException(status_code=400, detail="Content not generated yet")
    structure.content.comments = payload.comment
    db.commit()
    db.refresh(structure)
    return structure


