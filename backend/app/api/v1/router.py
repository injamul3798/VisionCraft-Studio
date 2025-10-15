from fastapi import APIRouter
from app.api.v1.endpoints import projects, generations, chat

api_router = APIRouter()

api_router.include_router(
    projects.router,
    prefix="/projects",
    tags=["projects"]
)

api_router.include_router(
    generations.router,
    prefix="/generations",
    tags=["generations"]
)

api_router.include_router(
    chat.router,
    prefix="/chat",
    tags=["chat"]
)
