import google.generativeai as genai
from typing import AsyncGenerator
import asyncio
import json
import re
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
        # Configure generation settings
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
        }

        self.model = genai.GenerativeModel(
            model_name=settings.GEMINI_MODEL,
            system_instruction=SYSTEM_PROMPT,
            generation_config=generation_config
        )
        logger.info(f"Initialized Gemini model: {settings.GEMINI_MODEL}")

    def _parse_delimiter_format(self, text: str) -> str:
        """Parse delimiter-based format and convert to JSON"""
        try:
            files = {}

            # More flexible regex that handles various spacing
            file_pattern = r'===FILE:\s*([^\s=]+[^\n]*?)\s*===\s*(.*?)\s*===END FILE==='
            matches = re.findall(file_pattern, text, re.DOTALL)

            if not matches:
                # Fallback: treat entire response as single HTML file
                logger.warning("No delimiter format found, treating as single HTML file")
                return text

            for filename, content in matches:
                filename = filename.strip()
                content = content.strip()
                if content:  # Only add non-empty files
                    files[filename] = content
                else:
                    logger.warning(f"Skipping empty file: {filename}")

            if not files:
                # If no valid files parsed, return original text
                logger.warning("No valid files parsed, returning original content")
                return text

            # Convert to JSON format
            result = json.dumps({"files": files})
            logger.info(f"Successfully parsed {len(files)} files from delimiter format")

            return result

        except Exception as e:
            logger.error(f"Failed to parse delimiter format: {e}")
            logger.error(f"Text preview: {text[:500]}")
            # Fallback: return as single HTML file
            return text

    async def generate_html_stream(
        self,
        user_prompt: str,
        chat_history: list[dict] = None
    ) -> AsyncGenerator[str, None]:
        """
        Generate code from user prompt with streaming support

        Args:
            user_prompt: User's description of what to build
            chat_history: Optional chat history for context (corrections)

        Yields:
            Chunks of JSON content as they are generated
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

            # Accumulate response and parse delimiter format
            full_response = ""
            for chunk in response:
                if chunk.text:
                    full_response += chunk.text
                    yield chunk.text
                    # Small delay to prevent overwhelming the client
                    await asyncio.sleep(0.01)

            logger.info("Generation completed successfully")

        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise GeminiAPIException(f"Failed to generate code: {str(e)}")

    async def generate_html(
        self,
        user_prompt: str,
        chat_history: list[dict] = None
    ) -> str:
        """
        Generate code from user prompt (non-streaming version)

        Args:
            user_prompt: User's description of what to build
            chat_history: Optional chat history for context (corrections)

        Returns:
            Complete JSON content with file structure
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

            raw_content = response.text
            logger.info(f"Generation completed. Length: {len(raw_content)} chars")

            # Parse delimiter format to JSON
            parsed_content = self._parse_delimiter_format(raw_content)

            return parsed_content

        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise GeminiAPIException(f"Failed to generate code: {str(e)}")

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
