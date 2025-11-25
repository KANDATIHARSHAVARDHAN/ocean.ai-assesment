# OCEAN.AI - Setup & Run Guide

## Prerequisites

- Python 3.8+ installed
- Node.js & npm installed
- MySQL Server running locally
- All requirements installed

## Initial Setup (First Time Only)

### 1. Create `.env` file

Copy the `.env.example` file to `.env` in the project root:

```powershell
Copy-Item .env.example .env
```

**Important Settings to Verify:**

- `DATABASE_URL`: MySQL connection string (default: `mysql+pymysql://root:Harshavardhan1$@localhost:3306/ai_document_app`)
- `GEMINI_API_KEY`: Your Google Gemini API key
- `JWT_SECRET_KEY`: Already set (secure key)
- `SECRET_KEY`: Already set (secure key)
- `BACKEND_PORT`: 8000 (or your preferred port)
- `CORS_ORIGINS`: http://localhost:3000 (for frontend)

### 2. Install Backend Dependencies

```powershell
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Initialize Database

This creates the MySQL database and tables:

```powershell
cd backend
python init_db.py
cd ..
```

**Expected Output:**
```
Initializing database...
Checking database...
✓ Database 'ai_document_app' ready
✓ All tables created successfully
✓ Database initialization complete
```

If you get errors, make sure:
- MySQL server is running
- Your database credentials in `.env` are correct
- The `ai_document_app` database doesn't already exist (or delete it first)

### 4. Install Frontend Dependencies

```powershell
cd frontend
npm install
cd ..
```

## Starting the Project

### Terminal 1 - Backend Server

```powershell
cd backend
python run.py
```

**Expected Output:**
```
Checking database...
✓ Database 'ai_document_app' ready
✓ All tables created successfully
INFO:     Will watch for changes in these directories: ['C:\...\backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [...] using WatchFiles
```

### Terminal 2 - Frontend Development Server

```powershell
cd frontend
npm start
```

**Expected Output:**
```
npm notice It looks like you are trying to set the BROWSER environment variable to a value other than 'none'.
> frontend@0.0.0 start
> react-scripts start
[34mℹ️  On Your Network: http://xxx.xxx.x.xxx:3000[39m
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://xxx.xxx.x.xxx:3000
```

## Access the Application

Open your browser and go to: **http://localhost:3000**

## Common Issues

### Database Connection Error
```
pymysql.err.OperationalError: (1049, "Unknown database 'ai_document_app'")
```
**Solution:** Run `python init_db.py` in the backend folder

### CORS Error
If you get CORS errors, make sure:
- Backend is running on port 8000
- Frontend is running on port 3000
- `CORS_ORIGINS=http://localhost:3000` is set in `.env`

### Gemini API Key Error
If generation features don't work:
- Get your API key from Google Cloud Console
- Add it to `GEMINI_API_KEY` in `.env`
- Restart the backend

### Port Already in Use
```
Address already in use
```
Either:
1. Kill the process using the port
2. Change the port in `.env` (e.g., `BACKEND_PORT=8001`)

## Database Reset

If you need to reset everything:

```powershell
# Stop the backend server (Ctrl+C)

# Delete the database
cd backend
# Edit init_db.py or manually delete the database in MySQL

# Reinitialize
python init_db.py
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Projects
- `GET /projects/` - List user's projects
- `POST /projects/` - Create new project
- `GET /projects/{project_id}` - Get project details
- `PUT /projects/{project_id}` - Update project
- `DELETE /projects/{project_id}` - Delete project

### Content Generation
- `POST /generate/{structure_id}` - Generate section content
- `POST /generate/{structure_id}/refine` - Refine content
- `POST /generate/{structure_id}/feedback` - Submit feedback
- `POST /generate/{structure_id}/comment` - Add comment

### Outline Suggestions
- `POST /outline/suggest` - Get outline suggestions

### Export
- `GET /export/{project_id}` - Export project (docx/pptx)

### Health Check
- `GET /health` - API health status

## File Structure

```
OCEAN.AI/
├── .env                      # Configuration (create from .env.example)
├── .env.example             # Configuration template
├── backend/
│   ├── run.py               # Main entry point
│   ├── init_db.py           # Database initialization
│   ├── requirements.txt     # Python dependencies
│   └── app/
│       ├── main.py          # FastAPI app setup
│       ├── config/          # Configuration
│       ├── database/        # Database connection
│       ├── models/          # SQLAlchemy models
│       ├── routes/          # API endpoints
│       ├── services/        # Business logic
│       ├── middleware/      # Authentication middleware
│       └── utils/           # Utilities
├── frontend/
│   ├── package.json         # NPM dependencies
│   ├── tsconfig.json        # TypeScript config
│   └── src/
│       ├── index.tsx        # Entry point
│       ├── App.tsx          # Root component
│       ├── pages/           # Page components
│       ├── components/      # Reusable components
│       ├── services/        # API services
│       ├── context/         # React context
│       ├── types.ts         # TypeScript types
│       └── styles/          # CSS styles
└── README.md                # Project documentation
```

## Notes

- Backend runs with auto-reload in debug mode (changes reload automatically)
- Frontend uses React development server with hot reload
- JWT tokens expire after 30 minutes (configurable)
- All database operations are ORM-based using SQLAlchemy
- API documentation available at http://localhost:8000/docs (Swagger UI)
