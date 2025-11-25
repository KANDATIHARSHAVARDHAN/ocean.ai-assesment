# OCEAN.AI - Pre-Launch Checklist

## ✓ All Errors Fixed

### Critical Fixes Applied:
- [x] Database initialization now handles missing database
- [x] All model ID columns fixed for consistency
- [x] Models properly imported in main.py
- [x] Route endpoints organized correctly
- [x] Settings handle all environment variables
- [x] CORS properly configured
- [x] Frontend and backend properly linked

---

## Quick Start Verification

### System Requirements
- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node.js & npm installed (`node --version`, `npm --version`)
- [ ] MySQL Server running (`mysql -u root -p` works)
- [ ] `.env` file exists and readable

### Environment Setup
- [ ] `.env` file created from `.env.example`
- [ ] `DATABASE_URL` points to your MySQL server
- [ ] `GEMINI_API_KEY` is valid and set
- [ ] `BACKEND_PORT=8000` (or your preferred port)
- [ ] `CORS_ORIGINS=http://localhost:3000`

### Dependency Installation
```powershell
# Backend
cd backend
pip install -r requirements.txt

# Frontend  
cd frontend
npm install
```

### Database Initialization
```powershell
cd backend
python init_db.py
```
Should show:
```
Initializing database...
Checking database...
✓ Database 'ai_document_app' ready
✓ All tables created successfully
✓ Database initialization complete
```

---

## Startup Commands

### Terminal 1 (Backend)
```powershell
cd backend
python run.py
```

**Expected first output:**
```
Checking database...
✓ Database 'ai_document_app' ready
✓ All tables created successfully
INFO:     Will watch for changes in these directories: ['.../backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Terminal 2 (Frontend)
```powershell
cd frontend
npm start
```

**Expected first output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
```

---

## Testing the App

### 1. Access Application
- [ ] Open http://localhost:3000 in browser
- [ ] See login/register forms

### 2. Register User
- [ ] Enter email (e.g., test@example.com)
- [ ] Enter password (min 8 characters)
- [ ] Click "Sign up"
- [ ] Should see success message

### 3. Login
- [ ] Enter same credentials
- [ ] Click "Sign in"
- [ ] Should redirect to dashboard

### 4. Create Project
- [ ] Click "Create New Project"
- [ ] Fill project name
- [ ] Select document type (docx or pptx)
- [ ] Enter main topic
- [ ] Click "Create"
- [ ] Project appears in list

### 5. Generate Content
- [ ] Click project to edit
- [ ] Add sections/slides
- [ ] Click "Generate" for a section
- [ ] Wait for AI to generate content
- [ ] Content appears below

### 6. Export Document
- [ ] Go to export page
- [ ] Click "Export as DOCX" or "Export as PPTX"
- [ ] File downloads

---

## API Health Check

### Via curl (if installed):
```powershell
curl http://localhost:8000/health
```

Should return:
```json
{"status":"ok"}
```

### Via browser:
- Open http://localhost:8000/docs (Swagger UI)
- All endpoints should be listed
- Try `/health` endpoint

---

## Common Issues & Solutions

### ❌ "Unknown database 'ai_document_app'"
```powershell
cd backend
python init_db.py
```

### ❌ "Address already in use"
Either kill process or change `BACKEND_PORT` in `.env`

### ❌ "Cannot connect to localhost:8000"
- Ensure backend is running
- Check terminal for errors
- Verify `BACKEND_PORT` in `.env`

### ❌ "Gemini API not working"
- Get key from: https://aistudio.google.com/app/apikeys
- Add to `GEMINI_API_KEY` in `.env`
- Restart backend

### ❌ "CORS error in browser"
- Check frontend is on port 3000
- Check backend is on port 8000
- Verify `CORS_ORIGINS=http://localhost:3000` in `.env`

### ❌ "Frontend blank or shows errors"
- Check browser console (F12)
- Check backend is running
- Verify `REACT_APP_API_BASE_URL=http://localhost:8000` in `.env`

---

## Database Structure

Tables created automatically:
- `users` - Stores user accounts
- `projects` - Stores projects
- `document_structure` - Stores document sections/slides
- `content_blocks` - Stores generated content
- `refinement_history` - Stores content edit history

---

## File Structure After Setup

```
OCEAN.AI/
├── .env                           # ← Your configuration
├── .env.example                   # Template (don't edit)
├── SETUP_GUIDE.md                # Setup instructions
├── CHANGES_SUMMARY.md            # What was fixed
├── backend/
│   ├── run.py                    # Start backend
│   ├── init_db.py               # Initialize database
│   ├── requirements.txt          # Python packages
│   └── app/                      # FastAPI application
├── frontend/
│   ├── package.json              # Node packages
│   ├── tsconfig.json             # TypeScript config
│   └── src/                      # React application
└── README.md                      # Project overview
```

---

## After Successful Startup

You should have:
1. Backend API running on http://localhost:8000
2. Frontend app running on http://localhost:3000
3. Database with 5 tables ready
4. Swagger API docs at http://localhost:8000/docs
5. Ready to register users and create documents

---

## Deployment Notes

Before deploying to production:
1. Set `DEBUG=False` in `.env`
2. Use strong JWT and SECRET keys (currently placeholders)
3. Use production database credentials
4. Set proper `CORS_ORIGINS` for frontend domain
5. Use environment variables, never hardcode secrets
6. Enable HTTPS/SSL
7. Add database backups
8. Monitor API and database performance

---

## Support

If you encounter issues:
1. Check error messages in terminal
2. Review SETUP_GUIDE.md
3. Verify .env configuration
4. Ensure all prerequisites installed
5. Check database connection
6. Review API docs at http://localhost:8000/docs

All critical errors in the codebase have been fixed! ✓
