# BizGenie Deployment Guide

## Step 1 — Push to GitHub
1. Go to github.com → New repository → name it "bizgenie" → Create
2. Open terminal in your BIZGENIE folder:
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOURUSERNAME/bizgenie.git
   git push -u origin main

## Step 2 — Deploy Backend on Render (free)
1. Go to render.com → Sign up with GitHub
2. Click "New" → "Web Service"
3. Connect your bizgenie GitHub repo
4. Set these:
   - Root Directory: backend
   - Build Command: npm install && npx prisma generate && npx prisma db push
   - Start Command: node src/server.js
5. Add environment variables:
   - NODE_ENV = production
   - JWT_SECRET = (run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   - JWT_REFRESH_SECRET = (run above command again, different value)
   - FRONTEND_URL = https://your-app.vercel.app (update after Vercel deploy)

## Step 3 — Create free PostgreSQL on Render
1. In Render → "New" → "PostgreSQL"
2. Name: bizgenie-db → Plan: Free → Create
3. Copy "Internal Database URL"
4. Go back to your web service → Environment → add:
   - DATABASE_URL = (paste the URL you copied)
5. Redeploy the service

## Step 4 — Deploy Frontend on Vercel (free)
1. Go to vercel.com → Sign up with GitHub
2. Click "New Project" → Import your bizgenie repo
3. Set:
   - Framework: Vite
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist
4. Add environment variable:
   - VITE_API_URL = https://your-render-backend-url.onrender.com/api
5. Deploy!

## Step 5 — Update CORS
Go back to Render → your backend service → Environment:
- Update FRONTEND_URL = https://your-actual-vercel-url.vercel.app
- Click "Save Changes" (auto redeploys)

## Done!
Your game is now live at your Vercel URL 🎉
