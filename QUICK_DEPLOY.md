# Quick Deployment Commands

Copy and paste these commands based on your choice of platform.

---

## Frontend: Deploy to Vercel

### Via CLI (Quick)
```powershell
cd C:\Users\HP\OneDrive\Desktop\OCEAN.AI\frontend
npm install -g vercel
vercel login
vercel
```

### Via GitHub (Recommended)
```powershell
# 1. Push to GitHub
cd C:\Users\HP\OneDrive\Desktop\OCEAN.AI\frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/OCEAN.AI-frontend.git
git branch -M main
git push -u origin main

# 2. Go to https://vercel.com/dashboard
#    - Click "Add New..." → "Project"
#    - Import your frontend GitHub repo
#    - Set environment variables:
#      VITE_API_BASE_URL=https://your-backend-url.com
#    - Click "Deploy"
```

---

## Backend: Deploy to Railway

### Quick Setup
```powershell
# 1. Push to GitHub
cd C:\Users\HP\OneDrive\Desktop\OCEAN.AI\backend
git init
git add .
git commit -m "Backend initial commit"
git remote add origin https://github.com/YOUR_USERNAME/OCEAN.AI-backend.git
git branch -M main
git push -u origin main

# 2. Go to https://railway.app/dashboard
#    - Click "New Project"
#    - Select "Deploy from GitHub"
#    - Select your backend repo
#    - Set Start Command: python run.py
#    - Add environment variables (see below)
#    - Deploy!
```

### Required Environment Variables for Railway
```
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=mysql+pymysql://user:password@host/ai_document_app
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REACT_APP_API_BASE_URL=https://your-backend-url.railway.app
REACT_APP_NAME=OCEAN.AI
REACT_APP_VERSION=1.0.0
```

---

## Backend: Deploy to Render

### Quick Setup
```powershell
# 1. Push to GitHub (same as Railway above)

# 2. Go to https://render.com
#    - Click "New +" → "Web Service"
#    - Connect GitHub repo
#    - Name: ocean-ai-backend
#    - Environment: Python 3
#    - Build Command: pip install -r requirements.txt
#    - Start Command: python run.py
#    - Add environment variables (same as Railway)
#    - Click "Create"
```

---

## Update Frontend with Backend URL

After backend is deployed:

1. **Get your backend URL**
   - Railway: Check dashboard → Deployments
   - Render: Check dashboard

2. **Update Vercel**
   ```
   Vercel Dashboard → Your Project → Settings → Environment Variables
   VITE_API_BASE_URL=https://your-backend-url.com
   ```

3. **Redeploy frontend**
   - Go to Vercel → Deployments → Click "Redeploy"

---

## Verify Deployment

### Test Backend API
```powershell
# Should return Swagger API docs
curl https://your-backend-url.com/docs
```

### Test Frontend
- Visit `https://your-frontend.vercel.app`
- Try login/register
- Create a project and generate content

---

## Troubleshooting

**Frontend won't build:**
```powershell
cd frontend
npm run build
```
Check for errors locally first.

**Backend won't start:**
```powershell
cd backend
python run.py
```
Check logs locally.

**Frontend can't reach backend:**
- Verify `VITE_API_BASE_URL` is set correctly in Vercel
- Check backend is running and accessible
- Test: `curl https://backend-url/docs`

---

For detailed setup, see `DEPLOYMENT.md`
