#!/bin/bash
# OCEAN.AI Pre-Deployment Checklist Script
# Run this before deploying to ensure everything is ready

echo "=== OCEAN.AI Deployment Readiness Check ==="
echo ""

# Frontend checks
echo "✓ Frontend Checks..."
cd frontend 2>/dev/null || { echo "❌ frontend/ not found"; exit 1; }

if [ -f package.json ]; then
    echo "  ✓ package.json found"
else
    echo "  ❌ package.json missing"
    exit 1
fi

if grep -q "build" package.json; then
    echo "  ✓ build script exists"
else
    echo "  ⚠ No build script in package.json"
fi

if [ -f .gitignore ] && grep -q "node_modules" .gitignore; then
    echo "  ✓ node_modules in .gitignore"
else
    echo "  ⚠ node_modules may not be in .gitignore"
fi

echo ""
echo "✓ Backend Checks..."
cd ../backend 2>/dev/null || { echo "❌ backend/ not found"; exit 1; }

if [ -f requirements.txt ]; then
    echo "  ✓ requirements.txt found"
else
    echo "  ❌ requirements.txt missing"
    exit 1
fi

if [ -f run.py ]; then
    echo "  ✓ run.py (entry point) found"
else
    echo "  ❌ run.py missing"
    exit 1
fi

if [ -f .gitignore ] && grep -q "venv" .gitignore; then
    echo "  ✓ venv in .gitignore"
else
    echo "  ⚠ venv may not be in .gitignore"
fi

echo ""
echo "=== Pre-Deployment Summary ==="
echo "✓ All critical files present"
echo ""
echo "Next steps:"
echo "1. Push to GitHub:"
echo "   - frontend repo: https://github.com/YOUR_USERNAME/OCEAN.AI-frontend"
echo "   - backend repo: https://github.com/YOUR_USERNAME/OCEAN.AI-backend"
echo ""
echo "2. Deploy frontend to Vercel:"
echo "   vercel"
echo ""
echo "3. Deploy backend to Railway/Render:"
echo "   - Railway: https://railway.app"
echo "   - Render: https://render.com"
echo ""
echo "4. Update VITE_API_BASE_URL in Vercel with backend URL"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."
