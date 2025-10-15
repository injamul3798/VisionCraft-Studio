from fastapi import HTTPException, status


class VisionCraftException(Exception):
    """Base exception for VisionCraft Studio"""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class ProjectNotFoundException(VisionCraftException):
    """Raised when a project is not found"""
    pass


class GenerationNotFoundException(VisionCraftException):
    """Raised when a generation is not found"""
    pass


class GeminiAPIException(VisionCraftException):
    """Raised when Gemini API fails"""
    pass


def raise_not_found(entity: str, entity_id: str):
    """Raise 404 HTTPException"""
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"{entity} with id {entity_id} not found"
    )


def raise_bad_request(message: str):
    """Raise 400 HTTPException"""
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=message
    )


def raise_internal_error(message: str):
    """Raise 500 HTTPException"""
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=message
    )
