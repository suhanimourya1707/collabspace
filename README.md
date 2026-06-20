# CollabSpace

A real-time collaborative workspace app — create workspaces, invite teammates, manage tasks on a Kanban board, and let AI turn your project notes into a task list.

**Live demo:** [collabspace-g3ii.vercel.app](https://collabspace-g3ii.vercel.app)

## Features

- **Authentication** — JWT-based register/login, with email-based forgot-password flow
- **Workspaces** — create workspaces, invite teammates via shareable invite codes
- **Kanban board** — create, move (To Do → In Progress → Done), and manage tasks
- **AI Task Generator** — paste a project goal or meeting notes, AI (Groq / Llama 3.3) generates actionable tasks you can review and add to the board
- **Real-time** — WebSocket-powered live updates and online user presence

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios
**Backend:** FastAPI, SQLAlchemy, PostgreSQL, WebSockets
**Auth:** JWT (python-jose), bcrypt password hashing
**AI:** Groq API (Llama 3.3 70B)
**Deployment:** Vercel (frontend), Railway (backend + PostgreSQL)

## Project Structure

```
collabspace/
├── frontend/
│   └── src/
│       ├── pages/        # Route-level pages (Login, Dashboard, Kanban, etc.)
│       ├── components/   # Reusable UI components
│       ├── router/       # React Router config
│       ├── api/          # Axios instance
│       └── hooks/        # Custom hooks (e.g. WebSocket)
└── backend/
    └── app/
        ├── api/          # FastAPI route handlers
        ├── services/     # Business logic
        ├── models/       # SQLAlchemy models
        ├── schemas/      # Pydantic request/response schemas
        ├── core/         # JWT/security utilities
        ├── database/     # DB connection/session setup
        ├── websocket/    # Real-time connection handling
        └── utils/        # Shared dependencies, email sending
```

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Create `backend/.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/collabspace
SECRET_KEY=your-secret-key
GROQ_API_KEY=your-groq-api-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> Note: `frontend/src/api/axios.js` currently points at the deployed Railway backend. Point it at `http://127.0.0.1:8000` for local backend development.

## Key API Endpoints

| Method              | Endpoint                | Description                           |
| ------------------- | ----------------------- | ------------------------------------- |
| POST                | `/auth/register`        | Create account                        |
| POST                | `/auth/login`           | Login, returns JWT                    |
| POST                | `/auth/forgot-password` | Send password reset email             |
| POST                | `/auth/reset-password`  | Reset password with token             |
| GET/POST            | `/workspaces/`          | List / create workspaces              |
| POST                | `/workspaces/join`      | Join workspace via invite code        |
| GET/POST/PUT/DELETE | `/tasks/`               | Manage Kanban tasks                   |
| POST                | `/ai/generate-tasks`    | Generate tasks from a prompt via Groq |

## Roadmap

- [ ] Shared documents / notes per workspace
- [ ] Notifications
- [ ] Automated tests

## License

MIT
