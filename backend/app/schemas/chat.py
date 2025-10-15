from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional
from app.models.chat_message import MessageRole


class ChatMessageBase(BaseModel):
    role: MessageRole
    content: str = Field(..., min_length=1)


class ChatMessageCreate(BaseModel):
    project_id: UUID
    content: str = Field(..., min_length=1)
    generation_id: Optional[UUID] = None


class ChatMessageResponse(ChatMessageBase):
    id: UUID
    project_id: UUID
    generation_id: Optional[UUID] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatHistoryResponse(BaseModel):
    messages: list[ChatMessageResponse]
    total: int
