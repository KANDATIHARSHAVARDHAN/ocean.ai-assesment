# OCEAN.AI Deployment Guide

This guide covers deploying both the frontend and backend to production-ready platforms.

---

## Frontend Deployment (Vercel)

Vercel is the easiest platform for React apps — it auto-detects and builds Next.js/React projects.

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub account with repo pushed

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your frontend code to GitHub**
   ```powershell
   cd C:\Users\HP\OneDrive\Desktop\OCEAN.AI\frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/OCEAN.AI-frontend.git
   git branch -M main
   git push -u origin main
   ```

2. **Go to https://vercel.com/dashboard**
   - Click "Add New..."
   - Select "Project"
   - Import your GitHub repo
   - Select the `frontend` folder as the Root Directory

3. **Set Environment Variables**
   - In Vercel Dashboard → Project Settings → Environment Variables
   - Add the following:
     ```
     VITE_API_BASE_URL=https://your-backend-domain.com
     VITE_APP_NAME=OCEAN.AI
     VITE_APP_VERSION=1.0.0
     ```
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Vercel will auto-build and deploy
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```powershell
   vercel login
   ```

3. **Deploy from frontend folder**
   ```powershell
   cd C:\Users\HP\OneDrive\Desktop\OCEAN.AI\frontend
   vercel
   ```

4. **Follow the prompts:**
   - Confirm project name
   - Select environment (Production)
   - Set environment variables when prompted

### Frontend Build & Optimization

Before deploying, run a local build check:
```powershell
cd C:\Users\HP\OneDrive\Desktop\OCEAN.AI\frontend
npm run build
npm run preview
```

If build passes, you're ready to deploy!

---

## Backend Deployment (Railway or Render)

Choose one of the two cloud platforms below. **Railway** is faster to set up.

### Option A: Deploy to Railway (Recommended)

Railway is a simple, Python-friendly cloud platform.

#### Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub account with repo pushed

#### Steps

1. **Push backend code to GitHub**
   ```powershell
   cd C:\Users\HP\OneDrive\Desktop\OCEAN.AI\backend
   git init
   git add .
   git commit -m "Backend initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/OCEAN.AI-backend.git
   git branch -M main
   git push -u origin main
   ```

2. **Go to https://railway.app/dashboard**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize and select your backend repo

3. **Configure Environment Variables**
   - Railway will auto-detect Python
   - Go to Variables tab in the Railway project
   - Add the following:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     DATABASE_URL=mysql+pymysql://user:password@host/ai_document_app
     SECRET_KEY=your_secret_key_here
     ALGORITHM=HS256
     ACCESS_TOKEN_EXPIRE_MINUTES=30
     REACT_APP_API_BASE_URL=https://your-railway-backend.railway.app
     REACT_APP_NAME=OCEAN.AI
     REACT_APP_VERSION=1.0.0
     ```

4. **Set Startup Command**
   - In Railway Settings, set Start Command:
     ```
     python run.py
     ```

5. **Deploy**
   - Railway auto-deploys on push
   - Your backend will be live at `https://your-railway-backend.railway.app`

---

### Option B: Deploy to Render

Render is another popular Python hosting platform.

#### Prerequisites
- Render account (sign up at https://render.com)
- GitHub account with repo pushed

#### Steps

1. **Push backend code to GitHub** (same as Railway)

2. **Go to https://dashboard.render.com**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repo
   - Select the backend folder

3. **Configure Service**
   - Name: `ocean-ai-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python run.py`

4. **Add Environment Variables**
   - In Render dashboard, go to Environment
   - Add all variables from the list above

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy
   - Backend URL: `https://ocean-ai-backend.onrender.com`

---

## Environment Variables Reference

### Backend (.env file)

```
# Database
DATABASE_URL=mysql+pymysql://user:password@host:3306/ai_document_app

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret
SECRET_KEY=your_super_secret_key_min_32_chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# React App (frontend integration)
REACT_APP_API_BASE_URL=https://your-backend-url.com
REACT_APP_NAME=OCEAN.AI
REACT_APP_VERSION=1.0.0

# Server
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env file or Vercel Environment Variables)

```
VITE_API_BASE_URL=https://your-backend-url.com
VITE_APP_NAME=OCEAN.AI
VITE_APP_VERSION=1.0.0
```

---

## Database Setup for Production

If using Railway/Render, you need a hosted MySQL database. Options:

### Option 1: PlanetScale (MySQL-compatible, free tier)
1. Sign up at https://planetscale.com
2. Create a new database
3. Get connection string
4. Add to your `.env` and Vercel/Railway/Render environment variables

### Option 2: Amazon RDS
1. AWS account required
2. Create RDS MySQL instance
3. Use connection string in `.env`

### Option 3: Railway + Database
- Railway can provision MySQL for you (add Database plugin in dashboard)

---

## Connecting Frontend to Backend

After both are deployed, update frontend environment variables:

**In Vercel Dashboard:**
- Set `VITE_API_BASE_URL` to your backend URL (e.g., `https://ocean-ai-backend.railway.app`)

Then redeploy frontend.

---

## Quick Deployment Checklist

- [ ] Frontend `.gitignore` excludes `node_modules/`, `.env.local`
- [ ] Backend `.gitignore` excludes `venv/`, `.env`, `__pycache__`
- [ ] `requirements.txt` is up to date: `pip freeze > requirements.txt`
- [ ] `package.json` has build script for Vercel
- [ ] Backend has `run.py` as entry point
- [ ] All environment variables are set in cloud platform dashboard
- [ ] Database is provisioned and accessible
- [ ] Gemini API key is valid
- [ ] Frontend env var points to correct backend URL
- [ ] Local build test passes: `npm run build` (frontend) and `python run.py` (backend)

---

## Troubleshooting

### Frontend Build Fails on Vercel
- Check `npm run build` locally
- Ensure all imports are correct
- Check `.env` variables are set in Vercel dashboard

### Backend 502 Error
- Check logs in Railway/Render dashboard
- Verify `python run.py` works locally
- Ensure database connection string is correct
- Check that all required packages are in `requirements.txt`

### API Connection Fails
- Verify backend URL in frontend `.env`
- Check CORS is enabled on backend
- Test API directly: `curl https://backend-url/projects/`

---

## Next Steps

1. **Test API after deployment:**
   ```bash
   curl https://your-backend-url/docs
   ```
   You should see Swagger API documentation

2. **Test frontend:**
   - Visit `https://your-vercel-app.vercel.app`
   - Try login/register
   - Create a project and generate content

3. **Monitor logs:**
   - Vercel: Dashboard → Deployments → Logs
   - Railway: Dashboard → Logs tab
   - Render: Dashboard → Logs

---

## Support

For issues, check:
- Vercel docs: https://vercel.com/docs
- Railway docs: https://docs.railway.app
- Render docs: https://render.com/docs
