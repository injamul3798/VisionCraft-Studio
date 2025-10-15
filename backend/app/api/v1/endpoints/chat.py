from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

from app.db.database import get_db
from app.schemas import ChatMessageCreate, ChatMessageResponse, ChatHistoryResponse
from app.services import ChatService
from app.models import MessageRole

router = APIRouter()


@router.post(
    "/",
    response_model=ChatMessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a chat message"
)
async def create_message(
    message_data: ChatMessageCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new chat message"""
    message = await ChatService.create_message(
        db,
        project_id=message_data.project_id,
        role=MessageRole.USER,
        content=message_data.content,
        generation_id=message_data.generation_id
    )
    return message


@router.get(
    "/projects/{project_id}",
    response_model=ChatHistoryResponse,
    summary="Get chat history for a project"
)
async def get_chat_history(
    project_id: UUID,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Get all chat messages for a specific project"""
    messages = await ChatService.list_messages(db, project_id, skip, limit)
    return {
        "messages": messages,
        "total": len(messages)
    }


@router.delete(
    "/{message_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a chat message"
)
async def delete_message(
    message_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a chat message"""
    await ChatService.delete_message(db, message_id)
    return None
