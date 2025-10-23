# VisionCraft Studio
[48d4abfa-e1e8-46a0-abe9-bd88cccf5217.webm](https://github.com/user-attachments/assets/d18ddc11-f8b0-4509-ba6c-9cb4707305c7)

**Turn Ideas Into Interactive Experiences**

VisionCraft Studio is an AI-powered platform that transforms your ideas into fully functional, interactive HTML prototypes using Google's Gemini 2.5 Pro. Simply describe what you want to build, and watch as AI generates beautiful, production-ready prototypes in real-time.

## Features

- **AI-Powered Generation**: Leverage Gemini 2.5 Pro to generate complete HTML prototypes from natural language descriptions
- **Real-Time Streaming**: Watch your prototype being built in real-time with Server-Sent Events
- **Interactive Chat**: Iteratively refine your prototype through conversational corrections
- **Version History**: Track all generations with version control and restore previous versions
- **Live Preview**: See your prototype in action with responsive preview (desktop, tablet, mobile)
- **Project Management**: Organize multiple projects and track your creative journey
- **Export**: Download generated HTML files for use anywhere

## Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **MySQL**: Reliable relational database
- **SQLAlchemy**: Async ORM for database operations
- **Google Gemini 2.5 Pro**: Advanced AI model for code generation
- **Pydantic**: Data validation and settings management

### Frontend
- **React 18**: Modern UI library with concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool
- **TailwindCSS**: Utility-first CSS framework
- **TanStack Query**: Powerful data synchronization
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8.0+
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Easy Setup

**Step 1: MySQL Setup**

The database has been created automatically. If you need to create it manually:
```sql
CREATE DATABASE visioncraft_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Step 2: Backend Setup**

1. Navigate to backend directory and create virtual environment:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `backend/.env` file with your credentials:
```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Root
DB_NAME=visioncraft_db
```

**Step 3: Frontend Setup**

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

**Step 4: Run the Application**

Open two separate command windows:

**Terminal 1 - Backend:**
```bash
run_backend.bat
```

**Terminal 2 - Frontend:**
```bash
run_frontend.bat
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Usage

### Creating Your First Project

1. Open VisionCraft Studio in your browser
2. Click "New Project" and give it a name
3. Describe your idea in the chat interface
4. Watch as AI generates your prototype in real-time
5. Refine with follow-up messages
6. Download the HTML when ready

### Example Prompts

- "Create a modern e-commerce product listing page with filters, search, and shopping cart"
- "Build a task management dashboard with kanban boards and statistics"
- "Design a restaurant menu website with categories and image gallery"
- "Make a personal portfolio page with projects showcase and contact form"

## Project Structure

```
project-ai/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Configuration
│   │   ├── db/          # Database setup
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utilities
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   ├── stores/      # State management
│   │   └── types/       # TypeScript types
│   └── package.json
└── README.md
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Key Endpoints

- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects` - List projects
- `POST /api/v1/generations/generate` - Generate HTML (streaming)
- `GET /api/v1/generations/projects/{id}/generations` - Get generations
- `GET /api/v1/chat/projects/{id}` - Get chat history

## Development

### Backend Development

Run with auto-reload:
```bash
cd backend
uvicorn app.main:app --reload
```

### Frontend Development

Run with HMR:
```bash
cd frontend
npm run dev
```

## Production Deployment

### Backend

1. Build Docker image or deploy to cloud platform
2. Set environment variables
3. Run database migrations
4. Start with Gunicorn/Uvicorn workers

### Frontend

1. Build production bundle:
```bash
npm run build
```

2. Deploy to Vercel, Netlify, or CDN
3. Set VITE_API_URL environment variable

## Architecture Highlights

- **Async Everything**: Full async/await support for optimal performance
- **Streaming**: Real-time generation with Server-Sent Events
- **Type Safety**: TypeScript frontend, Pydantic backend
- **Separation of Concerns**: Clean architecture with services layer
- **Responsive Design**: Mobile-first approach
- **Error Handling**: Comprehensive error handling throughout
- **Version Control**: Built-in version history for generations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Powered by Google Gemini 2.5 Pro
- Built with FastAPI and React
- Inspired by the need for rapid prototyping

---

**VisionCraft Studio** - Professional, creative, aspirational prototyping at the speed of thought.
