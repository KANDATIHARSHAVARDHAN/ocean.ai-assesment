from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database.connection import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    project_name = Column(String(255), nullable=False)
    document_type = Column(Enum("docx", "pptx", name="document_type_enum"), nullable=False)
    main_topic = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    owner = relationship("User", back_populates="projects")
    structures = relationship(
        "DocumentStructure",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="DocumentStructure.order_index",
    )


class DocumentStructure(Base):
    __tablename__ = "document_structure"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    element_type = Column(Enum("section", "slide", name="element_enum"), nullable=False)
    title = Column(String(500), nullable=False)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    project = relationship("Project", back_populates="structures")
    content = relationship(
        "Content",
        back_populates="structure",
        cascade="all, delete-orphan",
        uselist=False,
    )


