from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_at: datetime


class TokenData(BaseModel):
    email: Optional[str] = None


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(min_length=8)


class UserOut(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    project_name: str
    document_type: str
    main_topic: str


class DocumentStructureBase(BaseModel):
    element_type: str
    title: str
    order_index: int


class RefinementHistoryOut(BaseModel):
    id: int
    old_content: Optional[str]
    new_content: str
    refinement_prompt: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ContentOut(BaseModel):
    id: int
    generated_content: str
    refinement_prompt: Optional[str]
    likes_count: int
    dislikes_count: int
    comments: str
    history: List[RefinementHistoryOut]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DocumentStructureOut(BaseModel):
    id: int
    element_type: str
    title: str
    order_index: int
    created_at: datetime
    content: Optional[ContentOut]

    class Config:
        from_attributes = True


class ProjectCreate(ProjectBase):
    structures: List[DocumentStructureBase] = []


class ProjectOut(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    structures: List[DocumentStructureOut]

    class Config:
        from_attributes = True


class GenerateRequest(BaseModel):
    prompt: str
    side_heading: Optional[str] = None
    lines_count: Optional[int] = None


class RefineRequest(BaseModel):
    prompt: str
    side_heading: Optional[str] = None
    lines_count: Optional[int] = None


class FeedbackRequest(BaseModel):
    positive: bool


class CommentRequest(BaseModel):
    comment: str


class OutlineRequest(BaseModel):
    document_type: str
    main_topic: str
    desired_sections: int = Field(default=5, ge=1, le=20)

