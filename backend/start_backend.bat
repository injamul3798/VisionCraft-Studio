@echo off
echo Starting VisionCraft Studio Backend...
echo.

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Start the backend server
echo Backend server starting on http://127.0.0.1:8000
echo Press CTRL+C to stop
echo.
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
