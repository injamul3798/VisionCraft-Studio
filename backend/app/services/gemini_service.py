import google.generativeai as genai
from typing import AsyncGenerator
import asyncio
from app.core.config import settings
from app.core.exceptions import GeminiAPIException
from app.utils.prompts import SYSTEM_PROMPT, build_correction_prompt
import logging

logger = logging.getLogger(__name__)

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)


class GeminiService:
    """Service for interacting with Google Gemini API"""

    def __init__(self):
        self.model = genai.GenerativeModel(
            model_name=settings.GEMINI_MODEL,
            system_instruction=SYSTEM_PROMPT
        )

    async def generate_html_stream(
        self,
        user_prompt: str,
        chat_history: list[dict] = None
    ) -> AsyncGenerator[str, None]:
        """
        Generate HTML from user prompt with streaming support

        Args:
            user_prompt: User's description of what to build
            chat_history: Optional chat history for context (corrections)

        Yields:
            Chunks of HTML content as they are generated
        """
        try:
            # Build the prompt
            if chat_history and len(chat_history) > 0:
                # This is a correction request
                history_str = self._format_chat_history(chat_history)
                full_prompt = build_correction_prompt(history_str, user_prompt)
            else:
                # This is a new generation
                full_prompt = user_prompt

            logger.info(f"Starting generation with prompt: {user_prompt[:100]}...")

            # Generate content with streaming
            response = await asyncio.to_thread(
                self.model.generate_content,
                full_prompt,
                stream=True
            )

            # Stream the response chunks
            for chunk in response:
                if chunk.text:
                    yield chunk.text
                    # Small delay to prevent overwhelming the client
                    await asyncio.sleep(0.01)

            logger.info("Generation completed successfully")

        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise GeminiAPIException(f"Failed to generate HTML: {str(e)}")

    async def generate_html(
        self,
        user_prompt: str,
        chat_history: list[dict] = None
    ) -> str:
        """
        Generate HTML from user prompt (non-streaming version)

        Args:
            user_prompt: User's description of what to build
            chat_history: Optional chat history for context (corrections)

        Returns:
            Complete HTML content
        """
        try:
            # Build the prompt
            if chat_history and len(chat_history) > 0:
                history_str = self._format_chat_history(chat_history)
                full_prompt = build_correction_prompt(history_str, user_prompt)
            else:
                full_prompt = user_prompt

            logger.info(f"Starting non-streaming generation: {user_prompt[:100]}...")

            # Generate content without streaming
            response = await asyncio.to_thread(
                self.model.generate_content,
                full_prompt
            )

            html_content = response.text
            logger.info(f"Generation completed. Length: {len(html_content)} chars")

            return html_content

        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise GeminiAPIException(f"Failed to generate HTML: {str(e)}")

    def _format_chat_history(self, chat_history: list[dict]) -> str:
        """Format chat history for context"""
        formatted = []
        for msg in chat_history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            formatted.append(f"{role.upper()}: {content}")
        return "\n\n".join(formatted)


# Create a singleton instance
gemini_service = GeminiService()
