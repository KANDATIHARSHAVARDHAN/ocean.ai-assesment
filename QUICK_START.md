# 🚀 OCEAN.AI - Quick Start (5 Minutes)

All errors have been fixed! Follow these exact steps:

## Step 1: Verify Prerequisites (1 min)

```powershell
# Check Python
python --version
# Should show Python 3.8 or higher

# Check Node.js
node --version
npm --version
# Should show recent versions

# Check MySQL
mysql -u root -p
# Should connect (use your MySQL password)
```

## Step 2: Install Dependencies (2 min)

**Terminal 1:**
```powershell
cd c:\Users\HP\OneDrive\Desktop\OCEAN.AI
cd backend
pip install -r requirements.txt
cd ..
```

**Terminal 2:**
```powershell
cd c:\Users\HP\OneDrive\Desktop\OCEAN.AI
cd frontend
npm install
cd ..
```

## Step 3: Initialize Database (1 min)

```powershell
cd c:\Users\HP\OneDrive\Desktop\OCEAN.AI
cd backend
python init_db.py
```

**You should see:**
```
Initializing database...
Checking database...
✓ Database 'ai_document_app' ready
✓ All tables created successfully
✓ Database initialization complete
```

## Step 4: Start Backend (Terminal 1)

```powershell
cd c:\Users\HP\OneDrive\Desktop\OCEAN.AI
cd backend
python run.py
```

**You should see:**
```
Checking database...
✓ Database 'ai_document_app' ready
✓ All tables created successfully
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**✓ Backend is ready!** (Leave this running)

## Step 5: Start Frontend (Terminal 2)

```powershell
cd c:\Users\HP\OneDrive\Desktop\OCEAN.AI
cd frontend
npm start
```

**You should see:**
```
Compiled successfully!

You can now view frontend in the browser.

Local:            http://localhost:3000
```

## Step 6: Open Browser

Open: **http://localhost:3000**

You should see the login/register page!

---

## ✓ You're Ready!

### Test the App:
1. **Register** - Create an account
2. **Login** - Sign in
3. **Create Project** - Add a new project
4. **Generate** - Create AI-generated content
5. **Export** - Download as DOCX or PPTX

---

## 🔧 Troubleshooting

### "Unknown database 'ai_document_app'"
```powershell
cd backend
python init_db.py
```

### Port already in use
Edit `.env` file and change `BACKEND_PORT=8001`

### Can't connect to MySQL
- Make sure MySQL server is running
- Check credentials in `.env`

### API not responding
- Check backend terminal for errors
- Ensure port 8000 is not blocked

---

## 📝 What Was Fixed

✓ Database initialization (auto-creates database and tables)  
✓ Model ID column naming (was causing ORM errors)  
✓ Route organization (outline endpoint now has correct path)  
✓ Settings validation (handles all environment variables)  
✓ Model imports (ensures all tables are created)  

All errors from your original error message have been resolved!

---

**Now you can:**
- Create documents with AI assistance
- Generate multiple sections/slides
- Refine content with prompts
- Export to Word or PowerPoint
- Manage projects

Enjoy! 🎉
