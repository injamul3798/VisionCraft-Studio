from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

from app.db.database import get_db
from app.schemas import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectWithGenerations,
)
from app.services import ProjectService

router = APIRouter()


@router.post(
    "/",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new project"
)
async def create_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new project"""
    project = await ProjectService.create_project(db, project_data)
    return project


@router.get(
    "/",
    response_model=List[ProjectWithGenerations],
    summary="List all projects"
)
async def list_projects(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """List all projects with generation counts"""
    projects = await ProjectService.list_projects_with_counts(db, skip, limit)
    return projects


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Get a project by ID"
)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific project by ID"""
    project = await ProjectService.get_project_or_404(db, project_id)
    return project


@router.put(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Update a project"
)
async def update_project(
    project_id: UUID,
    project_data: ProjectUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a project"""
    project = await ProjectService.update_project(db, project_id, project_data)
    return project


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a project"
)
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a project"""
    await ProjectService.delete_project(db, project_id)
    return None
