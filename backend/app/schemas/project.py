from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectWithGenerations(ProjectResponse):
    generation_count: int = 0

    model_config = {"from_attributes": True}
