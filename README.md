# AI-Assisted Document Authoring & Generation Platform

Full-stack system for producing Word / PowerPoint deliverables with Google Gemini. Includes React dashboard, FastAPI backend, JWT auth, MySQL persistence, and python-docx/pptx export.

## 🚀 Quick Start

**All critical errors have been fixed!** Get running in 5 minutes:

1. See [`QUICK_START.md`](QUICK_START.md) for immediate setup
2. Run `python init_db.py` to initialize database
3. Start backend: `python run.py`
4. Start frontend: `npm start`
5. Open: http://localhost:3000

**Documentation:**
- [`QUICK_START.md`](QUICK_START.md) - 5-minute setup ⭐ START HERE
- [`WHAT_WAS_DONE.md`](WHAT_WAS_DONE.md) - Overview of fixes
- [`SETUP_GUIDE.md`](SETUP_GUIDE.md) - Complete setup guide
- [`ERROR_FIXES.md`](ERROR_FIXES.md) - Detailed technical fixes

## Architecture Overview

```
┌───────────────┐   HTTPS REST   ┌────────────────────┐   ┌──────────────┐
│   React App   │◄──────────────►│ FastAPI Backend    │──►│  Gemini API   │
│ (CRA + TS)    │                │  Auth + Services   │   └──────────────┘
└───────────────┘                │  /auth /projects   │
        ▲                        │  /generate /export │   ┌──────────────┐
        │                        └─────────▲──────────┘   │   MySQL DB    │
        │                                  │              └──────────────┘
        │                            JWT / Context
        ▼
┌────────────────┐
│  User Browser   │
└────────────────┘
```

### Backend Layout

```
backend/
├── app/
│   ├── config/              # Pydantic settings
│   ├── database/            # SQLAlchemy base + session
│   ├── models/              # Users, Projects, Structures, Content
│   ├── routes/              # /auth, /projects, /generate, /export
│   ├── services/            # Auth, Gemini, document export, DB helpers
│   ├── utils/               # Security helpers
│   └── middleware/          # JWT-aware middleware
├── requirements.txt
└── run.py                   # uvicorn entry point
```

### Frontend Layout

```
frontend/
├── src/
│   ├── components/          # Auth, dashboard, editor, export UIs
│   ├── context/             # Auth + Project context providers
│   ├── pages/               # Login/Dashboard/Project/Editor/Export
│   ├── services/            # API, auth, project helpers
│   ├── utils/               # Constants + helpers
│   └── styles/              # Global + component styles
└── package.json
```

## Prerequisites

- Python 3.11+
- Node.js 20+
- Local or remote MySQL instance (`ai_document_app` default)
- Google Gemini API key with text-gen access

## Setup

1. Copy `.env.example` → `.env` and fill database/JWT/Gemini secrets.
2. **Backend**
   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   python run.py
   ```
3. **Frontend**
   ```powershell
   cd ../frontend
   npm install
    npm start
   ```

## Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | e.g. `mysql+pymysql://user:pass@localhost:3306/ai_document_app` |
| `DATABASE_NAME` | DB schema name |
| `JWT_SECRET_KEY` / `JWT_ALGORITHM` / `JWT_EXPIRE_MINUTES` | Auth tokens |
| `SECRET_KEY` | FastAPI signing key |
| `GEMINI_API_KEY` | Google Gemini key |
| `BACKEND_PORT` | uvicorn port (default 8000) |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `REACT_APP_API_BASE_URL` | Frontend API base URL |

## Core Flow

1. **Auth** – Register/Login to receive JWT.
2. **Projects** – Create document scaffolds (sections/slides) manually or via “AI Suggest Outline”.
3. **Generation** – Send prompts per section → Gemini returns drafts stored in MySQL.
4. **Refinement** – Iterate with refinement prompts, feedback (like/dislike), reviewer comments. History saved in `refinement_history`.
5. **Export** – `/export/{project_id}` streams `.docx` or `.pptx` assembled with python-docx/pptx.

## Validation Checklist

- [ ] Auth endpoints + middleware enforce JWT.
- [ ] Project CRUD persists structure & content rows.
- [ ] Generation/refinement endpoints log history rows.
- [ ] Feedback + comments increment counters and persist text.
- [ ] Outline suggestions respect document type.
- [ ] Export downloads Word & PowerPoint outputs.
- [ ] Frontend routes/pages cover login → dashboard → editor → export path.

## Notes

- Replace the default MySQL URL or adjust to SQLite for local experiments.
- Gemini API usage requires quota; handle cost limits before large batch runs.
- For production, add Alembic migrations, HTTPS termination, and hardened secrets management.
