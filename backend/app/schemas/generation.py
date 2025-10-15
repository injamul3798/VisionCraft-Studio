from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional
from app.models.generation import GenerationStatus


class GenerationBase(BaseModel):
    html_content: Optional[str] = None
    status: GenerationStatus = GenerationStatus.GENERATING
    version: int = 1


class GenerationCreate(BaseModel):
    project_id: UUID
    user_prompt: str = Field(..., min_length=1)


class GenerationResponse(GenerationBase):
    id: UUID
    project_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}


class GenerationListResponse(BaseModel):
    id: UUID
    project_id: UUID
    status: GenerationStatus
    version: int
    created_at: datetime
    preview: Optional[str] = None  # First 200 chars of HTML

    model_config = {"from_attributes": True}
