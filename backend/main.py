import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import chat_router, upload_router, rag_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    reports_dir = os.getenv("REPORTS_DIR", "./reports")
    os.makedirs(reports_dir, exist_ok=True)
    print(f"Reports directory ready: {reports_dir}")
    
    chroma_dir = os.getenv("CHROMA_DB_PATH", "./chroma_db")
    os.makedirs(chroma_dir, exist_ok=True)
    print(f"ChromaDB directory ready: {chroma_dir}")
    
    yield
    
    print("Shutting down...")


app = FastAPI(
    title="Healthcare AI Backend",
    description="Medical RAG system with PDF upload and Groq-powered chat",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(upload_router)
app.include_router(rag_router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Healthcare AI Backend",
        "docs": "/docs",
        "health": "/health"
    }


# ─── SETUP INSTRUCTIONS ─────────────────────────────────────────────────────
# 1. Install dependencies:
#    pip install torch --index-url https://download.pytorch.org/whl/cpu
#    pip install -r requirements.txt
#
# 2. Create .env file from .env.example and add your GROQ_API_KEY
#
# 3. Run the server:
#    uvicorn main:app --reload
#
# 4. Test the upload:
#    curl -X POST http://localhost:8000/upload -F "file=@your_report.pdf"
#
# 5. Test RAG chat:
#    curl -X POST http://localhost:8000/chat/rag \
#         -H "Content-Type: application/json" \
#         -d '{"message": "What does my blood test show?"}'
#
# 6. View API docs:
#    http://localhost:8000/docs
# ─────────────────────────────────────────────────────────────────────────────
