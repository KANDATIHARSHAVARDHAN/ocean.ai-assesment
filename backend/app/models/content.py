from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.database.connection import Base


class Content(Base):
    __tablename__ = "content_blocks"

    id = Column(Integer, primary_key=True, index=True)
    structure_id = Column(Integer, ForeignKey("document_structure.id", ondelete="CASCADE"), nullable=False)
    generated_content = Column(Text, default="", nullable=False)
    refinement_prompt = Column(Text, default="")
    likes_count = Column(Integer, default=0)
    dislikes_count = Column(Integer, default=0)
    comments = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    structure = relationship("DocumentStructure", back_populates="content")
    history = relationship(
        "RefinementHistory",
        back_populates="content",
        cascade="all, delete-orphan",
        order_by="RefinementHistory.created_at",
    )


class RefinementHistory(Base):
    __tablename__ = "refinement_history"

    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("content_blocks.id", ondelete="CASCADE"), nullable=False)
    old_content = Column(Text, nullable=True)
    new_content = Column(Text, nullable=False)
    refinement_prompt = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    content = relationship("Content", back_populates="history")


