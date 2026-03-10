# Deployment Guide - MedExplain

## 🚀 Quick Start (Local Development)

### Backend Setup

```bash
cd healthcare-backend

# Install dependencies
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run backend
uvicorn main:app --reload
```

Backend will run at `http://localhost:8000`

### Frontend Setup

```bash
cd medical-explainer-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# REACT_APP_API_URL should be http://localhost:8000

# Run frontend
npm start
```

Frontend will open at `http://localhost:3000`

## 🌐 Production Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Deploy Backend to Railway

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `healthcare-backend` folder
4. Add environment variables:
   ```
   GROQ_API_KEY=your_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   EMBEDDING_MODEL=all-MiniLM-L6-v2
   CHROMA_DB_PATH=./chroma_db
   REPORTS_DIR=./reports
   CHUNK_SIZE=500
   CHUNK_OVERLAP=50
   TOP_K_RESULTS=3
   ```
5. Railway will auto-detect Python and deploy
6. Copy your Railway URL (e.g., `https://your-app.railway.app`)

#### Deploy Frontend to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import project
3. Select `medical-explainer-frontend` folder
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-app.railway.app
   ```
5. Deploy!

### Option 2: Render (Backend) + Netlify (Frontend)

#### Deploy Backend to Render

1. Create account at [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo, select `healthcare-backend`
4. Settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as Railway)
6. Deploy and copy URL

#### Deploy Frontend to Netlify

1. Build locally: `npm run build`
2. Drag `build/` folder to [netlify.com](https://netlify.com)
3. Or connect GitHub repo for auto-deploy
4. Add environment variable in Netlify dashboard:
   ```
   REACT_APP_API_URL=https://your-app.onrender.com
   ```

### Option 3: AWS (Full Stack)

#### Backend on AWS EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Python and dependencies
sudo apt update
sudo apt install python3-pip python3-venv nginx

# Clone repo
git clone your-repo-url
cd healthcare-backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
nano .env
# Add your environment variables

# Run with gunicorn
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Frontend on AWS S3 + CloudFront

```bash
# Build frontend
cd medical-explainer-frontend
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name --acl public-read

# Create CloudFront distribution pointing to S3 bucket
# Add environment variable in build process:
REACT_APP_API_URL=http://your-ec2-ip:8000 npm run build
```

## 🔒 Security Checklist

- [ ] Change default GROQ_API_KEY
- [ ] Enable HTTPS (use Let's Encrypt or cloud provider SSL)
- [ ] Set proper CORS origins (not `*` in production)
- [ ] Add rate limiting to backend
- [ ] Enable authentication if needed
- [ ] Set up monitoring and logging

## 📊 Monitoring

### Backend Health Check

```bash
curl https://your-backend-url/health
```

Should return: `{"status": "ok"}`

### Frontend Health Check

Open browser to your frontend URL and check:
- [ ] Homepage loads
- [ ] Upload page works
- [ ] Chat page loads
- [ ] API calls succeed

## 🐛 Troubleshooting

### Backend Issues

**Error: "GROQ_API_KEY not found"**
- Check .env file exists
- Verify GROQ_API_KEY is set correctly

**Error: "ChromaDB initialization failed"**
- Ensure write permissions for `chroma_db/` folder
- Check disk space

**Error: "Module not found"**
- Run `pip install -r requirements.txt` again
- Check Python version (3.10+)

### Frontend Issues

**Error: "Network Error"**
- Check REACT_APP_API_URL is correct
- Verify backend is running
- Check CORS settings

**Blank page after deployment**
- Check browser console for errors
- Verify build completed successfully
- Check environment variables

**Upload not working**
- Check file size (max 10MB)
- Verify file type (PDF, JPG, PNG)
- Check backend logs

## 📈 Scaling

### Backend Scaling

- Use load balancer (AWS ALB, Nginx)
- Run multiple instances with PM2 or Docker
- Use Redis for session storage
- Consider PostgreSQL for document metadata

### Frontend Scaling

- Use CDN (CloudFront, Cloudflare)
- Enable gzip compression
- Optimize images
- Code splitting (already done with React)

## 💰 Cost Estimates

### Free Tier (Development)

- Backend: Railway/Render free tier
- Frontend: Vercel/Netlify free tier
- Groq API: Free tier (limited requests)
- **Total: $0/month**

### Production (Small Scale)

- Backend: Railway Hobby ($5/month)
- Frontend: Vercel Pro ($20/month)
- Groq API: Pay-as-you-go (~$10-50/month)
- **Total: ~$35-75/month**

### Production (Medium Scale)

- Backend: AWS EC2 t3.medium ($30/month)
- Frontend: CloudFront + S3 ($5/month)
- Groq API: Pay-as-you-go (~$100-500/month)
- **Total: ~$135-535/month**

## 🔄 CI/CD Setup

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Railway CLI commands here

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and Deploy
        run: |
          cd medical-explainer-frontend
          npm install
          npm run build
          # Deploy to Vercel/Netlify
```

## 📞 Support

For issues:
1. Check logs (backend and frontend)
2. Review this guide
3. Check GitHub issues
4. Contact support

---

Happy deploying! 🚀
