from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from uuid import UUID
from typing import List, Optional

from app.models import ChatMessage, MessageRole
from app.core.exceptions import raise_not_found
from app.services.project_service import ProjectService


class ChatService:
    """Service for chat message operations"""

    @staticmethod
    async def create_message(
        db: AsyncSession,
        project_id: UUID,
        role: MessageRole,
        content: str,
        generation_id: Optional[UUID] = None
    ) -> ChatMessage:
        """Create a new chat message"""
        # Verify project exists
        await ProjectService.get_project_or_404(db, project_id)

        message = ChatMessage(
            project_id=str(project_id),
            generation_id=str(generation_id) if generation_id else None,
            role=role,
            content=content
        )
        db.add(message)
        await db.flush()
        await db.refresh(message)
        return message

    @staticmethod
    async def get_message(
        db: AsyncSession,
        message_id: UUID
    ) -> Optional[ChatMessage]:
        """Get a chat message by ID"""
        result = await db.execute(
            select(ChatMessage).where(ChatMessage.id == str(message_id))
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def list_messages(
        db: AsyncSession,
        project_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> List[ChatMessage]:
        """List all chat messages for a project"""
        # Verify project exists
        await ProjectService.get_project_or_404(db, project_id)

        result = await db.execute(
            select(ChatMessage)
            .where(ChatMessage.project_id == str(project_id))
            .order_by(ChatMessage.created_at)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_chat_history_dict(
        db: AsyncSession,
        project_id: UUID,
        limit: int = 20
    ) -> List[dict]:
        """Get chat history as a list of dictionaries for Gemini context"""
        messages = await ChatService.list_messages(db, project_id, limit=limit)
        return [
            {
                "role": msg.role.value,
                "content": msg.content
            }
            for msg in messages
        ]

    @staticmethod
    async def delete_message(
        db: AsyncSession,
        message_id: UUID
    ) -> None:
        """Delete a chat message"""
        message = await ChatService.get_message(db, message_id)
        if not message:
            raise_not_found("Chat message", str(message_id))
        await db.delete(message)
        await db.flush()
