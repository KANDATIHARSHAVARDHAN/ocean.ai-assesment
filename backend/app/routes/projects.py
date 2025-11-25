from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database.connection import get_db
from app.services import auth_service, database_service

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=list[schemas.ProjectOut])
def list_projects(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_service.get_current_user),
):
    return (
        db.query(models.Project)
        .filter(models.Project.user_id == current_user.id)
        .order_by(models.Project.updated_at.desc())
        .all()
    )


@router.post("/", response_model=schemas.ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_service.get_current_user),
):
    project = models.Project(
        user_id=current_user.id,
        project_name=payload.project_name,
        document_type=payload.document_type,
        main_topic=payload.main_topic,
    )
    db.add(project)
    db.flush()

    for structure in payload.structures:
        doc_structure = models.DocumentStructure(
            project_id=project.id,
            element_type=structure.element_type,
            title=structure.title,
            order_index=structure.order_index,
        )
        db.add(doc_structure)
        db.flush()
        db.add(models.Content(structure_id=doc_structure.id))

    db.commit()
    db.refresh(project)
    return project


@router.get("/{project_id}", response_model=schemas.ProjectOut)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_service.get_current_user),
):
    return database_service.get_project_for_user(db, project_id, current_user.id)


@router.put("/{project_id}", response_model=schemas.ProjectOut)
def update_project(
    project_id: int,
    payload: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_service.get_current_user),
):
    project = database_service.get_project_for_user(db, project_id, current_user.id)
    project.project_name = payload.project_name
    project.document_type = payload.document_type
    project.main_topic = payload.main_topic

    db.query(models.DocumentStructure).filter(models.DocumentStructure.project_id == project.id).delete()
    db.flush()

    for structure in payload.structures:
        doc_structure = models.DocumentStructure(
            project_id=project.id,
            element_type=structure.element_type,
            title=structure.title,
            order_index=structure.order_index,
        )
        db.add(doc_structure)
        db.flush()
        db.add(models.Content(structure_id=doc_structure.id))

    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_service.get_current_user),
):
    project = database_service.get_project_for_user(db, project_id, current_user.id)
    db.delete(project)
    db.commit()


