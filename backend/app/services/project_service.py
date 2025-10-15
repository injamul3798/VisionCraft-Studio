from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from uuid import UUID
from typing import List, Optional

from app.models import Project, Generation
from app.schemas import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectWithGenerations
from app.core.exceptions import raise_not_found


class ProjectService:
    """Service for project-related operations"""

    @staticmethod
    async def create_project(
        db: AsyncSession,
        project_data: ProjectCreate
    ) -> Project:
        """Create a new project"""
        project = Project(
            name=project_data.name,
            description=project_data.description
        )
        db.add(project)
        await db.flush()
        await db.refresh(project)
        return project

    @staticmethod
    async def get_project(
        db: AsyncSession,
        project_id: UUID
    ) -> Optional[Project]:
        """Get a project by ID"""
        result = await db.execute(
            select(Project).where(Project.id == str(project_id))
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_project_or_404(
        db: AsyncSession,
        project_id: UUID
    ) -> Project:
        """Get a project by ID or raise 404"""
        project = await ProjectService.get_project(db, project_id)
        if not project:
            raise_not_found("Project", str(project_id))
        return project

    @staticmethod
    async def list_projects(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100
    ) -> List[Project]:
        """List all projects with pagination"""
        result = await db.execute(
            select(Project)
            .order_by(desc(Project.updated_at))
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    @staticmethod
    async def list_projects_with_counts(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100
    ) -> List[dict]:
        """List projects with generation counts"""
        result = await db.execute(
            select(
                Project,
                func.count(Generation.id).label("generation_count")
            )
            .outerjoin(Generation)
            .group_by(Project.id)
            .order_by(desc(Project.updated_at))
            .offset(skip)
            .limit(limit)
        )

        projects_with_counts = []
        for row in result:
            project = row[0]
            count = row[1]
            projects_with_counts.append({
                "id": project.id,
                "name": project.name,
                "description": project.description,
                "created_at": project.created_at,
                "updated_at": project.updated_at,
                "generation_count": count
            })

        return projects_with_counts

    @staticmethod
    async def update_project(
        db: AsyncSession,
        project_id: UUID,
        project_data: ProjectUpdate
    ) -> Project:
        """Update a project"""
        project = await ProjectService.get_project_or_404(db, project_id)

        update_data = project_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(project, field, value)

        await db.flush()
        await db.refresh(project)
        return project

    @staticmethod
    async def delete_project(
        db: AsyncSession,
        project_id: UUID
    ) -> None:
        """Delete a project"""
        project = await ProjectService.get_project_or_404(db, project_id)
        await db.delete(project)
        await db.flush()
