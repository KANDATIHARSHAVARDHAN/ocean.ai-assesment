from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import DocumentStructure, Project


def get_project_for_user(db: Session, project_id: int, user_id: int) -> Project:
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == user_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


def get_structure_for_user(db: Session, structure_id: int, user_id: int) -> DocumentStructure:
    structure = (
        db.query(DocumentStructure)
        .join(Project, Project.id == DocumentStructure.project_id)
        .filter(DocumentStructure.id == structure_id, Project.user_id == user_id)
        .first()
    )
    if not structure:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Structure not found")
    return structure


