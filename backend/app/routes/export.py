from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app import models
from app.database.connection import get_db
from app.services import auth_service, database_service, document_service

router = APIRouter(prefix="/export", tags=["export"])


@router.get("/{project_id}")
def export_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_service.get_current_user),
):
    project = database_service.get_project_for_user(db, project_id, current_user.id)
    structures = project.structures
    if project.document_type == "docx":
        payload = document_service.export_docx(project, structures)
        filename = f"{project.project_name}.docx"
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    else:
        payload = document_service.export_pptx(project, structures)
        filename = f"{project.project_name}.pptx"
        media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"

    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
    return Response(content=payload, media_type=media_type, headers=headers)


