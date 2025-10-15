from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.db.database import Base


class GenerationStatus(str, enum.Enum):
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"


class Generation(Base):
    __tablename__ = "generations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    html_content = Column(Text, nullable=True)
    status = Column(Enum(GenerationStatus), default=GenerationStatus.GENERATING, nullable=False)
    version = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    project = relationship("Project", back_populates="generations")
    chat_messages = relationship("ChatMessage", back_populates="generation", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Generation(id={self.id}, version={self.version}, status={self.status})>"
