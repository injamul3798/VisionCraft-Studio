from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List
import json

from app.db.database import get_db
from app.schemas import GenerationCreate, GenerationResponse, GenerationListResponse
from app.services import (
    GenerationService,
    ChatService,
    gemini_service,
    ProjectService,
)
from app.models import GenerationStatus, MessageRole

router = APIRouter()


@router.post(
    "/generate",
    summary="Generate HTML from user prompt (streaming)"
)
async def generate_html_stream(
    generation_data: GenerationCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Generate HTML from user prompt with Server-Sent Events streaming

    This endpoint streams the generation progress in real-time using SSE format.
    Each event contains a chunk of the generated HTML.
    """
    # Verify project exists
    await ProjectService.get_project_or_404(db, generation_data.project_id)

    # Save user message
    await ChatService.create_message(
        db,
        project_id=generation_data.project_id,
        role=MessageRole.USER,
        content=generation_data.user_prompt
    )
    await db.commit()

    # Get chat history for context
    chat_history = await ChatService.get_chat_history_dict(
        db,
        project_id=generation_data.project_id,
        limit=10
    )

    # Create a new generation record
    generation = await GenerationService.create_generation(
        db,
        project_id=generation_data.project_id,
        status=GenerationStatus.GENERATING
    )
    await db.commit()

    async def event_generator():
        """Generate Server-Sent Events"""
        try:
            # Send generation ID
            yield f"data: {json.dumps({'type': 'generation_id', 'id': str(generation.id)})}\n\n"

            html_chunks = []

            # Stream HTML chunks from Gemini
            async for chunk in gemini_service.generate_html_stream(
                generation_data.user_prompt,
                chat_history
            ):
                html_chunks.append(chunk)
                # Send chunk to client
                yield f"data: {json.dumps({'type': 'chunk', 'content': chunk})}\n\n"

            # Combine all chunks
            full_html = "".join(html_chunks)

            # Update generation with complete HTML
            await GenerationService.update_generation(
                db,
                generation.id,
                html_content=full_html,
                status=GenerationStatus.COMPLETED
            )

            # Save assistant message
            await ChatService.create_message(
                db,
                project_id=generation_data.project_id,
                role=MessageRole.ASSISTANT,
                content="HTML generated successfully",
                generation_id=generation.id
            )
            await db.commit()

            # Send completion event
            yield f"data: {json.dumps({'type': 'complete', 'generation_id': str(generation.id)})}\n\n"

        except Exception as e:
            # Update generation status to failed
            await GenerationService.update_generation(
                db,
                generation.id,
                status=GenerationStatus.FAILED
            )
            await db.commit()

            # Send error event
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@router.get(
    "/projects/{project_id}/generations",
    response_model=List[GenerationListResponse],
    summary="List all generations for a project"
)
async def list_generations(
    project_id: UUID,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """List all generations for a specific project"""
    generations = await GenerationService.list_generations(db, project_id, skip, limit)

    # Add preview (first 200 chars)
    result = []
    for gen in generations:
        preview = gen.html_content[:200] if gen.html_content else None
        result.append({
            "id": gen.id,
            "project_id": gen.project_id,
            "status": gen.status,
            "version": gen.version,
            "created_at": gen.created_at,
            "preview": preview
        })

    return result


@router.get(
    "/{generation_id}",
    response_model=GenerationResponse,
    summary="Get a generation by ID"
)
async def get_generation(
    generation_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific generation by ID"""
    generation = await GenerationService.get_generation_or_404(db, generation_id)
    return generation


@router.delete(
    "/{generation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a generation"
)
async def delete_generation(
    generation_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a generation"""
    await GenerationService.delete_generation(db, generation_id)
    return None
