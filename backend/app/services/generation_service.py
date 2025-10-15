from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from uuid import UUID
from typing import List, Optional

from app.models import Generation, GenerationStatus, ChatMessage, MessageRole
from app.schemas import GenerationCreate
from app.core.exceptions import raise_not_found
from app.services.project_service import ProjectService


class GenerationService:
    """Service for generation-related operations"""

    @staticmethod
    async def create_generation(
        db: AsyncSession,
        project_id: UUID,
        html_content: Optional[str] = None,
        status: GenerationStatus = GenerationStatus.GENERATING
    ) -> Generation:
        """Create a new generation"""
        # Get the current max version for this project
        result = await db.execute(
            select(func.max(Generation.version))
            .where(Generation.project_id == str(project_id))
        )
        max_version = result.scalar() or 0

        generation = Generation(
            project_id=str(project_id),
            html_content=html_content,
            status=status,
            version=max_version + 1
        )
        db.add(generation)
        await db.flush()
        await db.refresh(generation)
        return generation

    @staticmethod
    async def get_generation(
        db: AsyncSession,
        generation_id: UUID
    ) -> Optional[Generation]:
        """Get a generation by ID"""
        result = await db.execute(
            select(Generation).where(Generation.id == str(generation_id))
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_generation_or_404(
        db: AsyncSession,
        generation_id: UUID
    ) -> Generation:
        """Get a generation by ID or raise 404"""
        generation = await GenerationService.get_generation(db, generation_id)
        if not generation:
            raise_not_found("Generation", str(generation_id))
        return generation

    @staticmethod
    async def list_generations(
        db: AsyncSession,
        project_id: UUID,
        skip: int = 0,
        limit: int = 50
    ) -> List[Generation]:
        """List all generations for a project"""
        # Verify project exists
        await ProjectService.get_project_or_404(db, project_id)

        result = await db.execute(
            select(Generation)
            .where(Generation.project_id == str(project_id))
            .order_by(desc(Generation.created_at))
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_latest_generation(
        db: AsyncSession,
        project_id: UUID
    ) -> Optional[Generation]:
        """Get the latest generation for a project"""
        result = await db.execute(
            select(Generation)
            .where(Generation.project_id == str(project_id))
            .order_by(desc(Generation.created_at))
            .limit(1)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def update_generation(
        db: AsyncSession,
        generation_id: UUID,
        html_content: Optional[str] = None,
        status: Optional[GenerationStatus] = None
    ) -> Generation:
        """Update a generation"""
        generation = await GenerationService.get_generation_or_404(db, generation_id)

        if html_content is not None:
            generation.html_content = html_content
        if status is not None:
            generation.status = status

        await db.flush()
        await db.refresh(generation)
        return generation

    @staticmethod
    async def delete_generation(
        db: AsyncSession,
        generation_id: UUID
    ) -> None:
        """Delete a generation"""
        generation = await GenerationService.get_generation_or_404(db, generation_id)
        await db.delete(generation)
        await db.flush()
