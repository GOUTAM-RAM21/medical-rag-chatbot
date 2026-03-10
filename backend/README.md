# Healthcare AI Backend - Medical RAG System

A FastAPI backend with PDF upload capabilities and RAG (Retrieval-Augmented Generation) for medical document Q&A using Groq LLM.

## Features

- 📄 PDF upload and text extraction
- 🔍 Semantic search with ChromaDB
- 🤖 RAG-powered medical chatbot using Groq
- 💾 Local storage (no cloud services)
- 🆓 100% free and open-source stack

## Tech Stack

- **FastAPI** - Web framework
- **Groq** - LLM API (llama3-70b-8192)
- **ChromaDB** - Local vector database
- **sentence-transformers** - Local embeddings (all-MiniLM-L6-v2)
- **PyMuPDF** - PDF text extraction
- **LangChain** - Text splitting

## Project Structure

```
healthcare-backend/
├── main.py                    # FastAPI app entry point
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
├── .env.example              # Environment template
├── reports/                  # Uploaded PDFs (created on startup)
├── chroma_db/                # ChromaDB persistence (auto-created)
├── routers/
│   ├── __init__.py
│   ├── chat.py               # Chat endpoints (original + RAG)
│   ├── upload.py             # PDF upload endpoints
│   └── rag.py                # RAG query endpoints
├── services/
│   ├── __init__.py
│   ├── pdf_service.py        # PDF extraction and chunking
│   ├── embedding_service.py  # ChromaDB management
│   └── rag_service.py        # RAG pipeline
└── schemas/
    ├── __init__.py
    └── models.py             # Pydantic models
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Install PyTorch CPU version first
pip install torch --index-url https://download.pytorch.org/whl/cpu

# Install other dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your Groq API key
# Get free API key from: https://console.groq.com
```

### 3. Run the Server

```bash
uvicorn main:app --reload
```

Server will start at `http://localhost:8000`

## API Endpoints

### Health Check
```bash
GET /health
```

### Upload PDF
```bash
POST /upload
Content-Type: multipart/form-data

curl -X POST http://localhost:8000/upload \
  -F "file=@medical_report.pdf"
```

### List Documents
```bash
GET /upload/documents
```

### Delete Document
```bash
DELETE /upload/documents/{filename}
```

### Chat (Original - No RAG)
```bash
POST /chat
Content-Type: application/json

{
  "message": "What is diabetes?"
}
```

### Chat with RAG
```bash
POST /chat/rag
Content-Type: application/json

{
  "message": "What does my blood test show?"
}
```

### RAG Chat (Full Control)
```bash
POST /rag/chat
Content-Type: application/json

{
  "message": "Explain my cholesterol levels",
  "use_rag": true
}
```

### Search Documents
```bash
GET /rag/search?q=blood%20pressure
```

### Get Stats
```bash
GET /rag/stats
```

## API Documentation

Interactive API docs available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GROQ_API_KEY` | - | Groq API key (required) |
| `EMBEDDING_MODEL` | all-MiniLM-L6-v2 | Sentence-transformers model |
| `CHROMA_DB_PATH` | ./chroma_db | ChromaDB storage path |
| `REPORTS_DIR` | ./reports | PDF upload directory |
| `CHUNK_SIZE` | 500 | Text chunk size |
| `CHUNK_OVERLAP` | 50 | Chunk overlap |
| `TOP_K_RESULTS` | 3 | Number of chunks to retrieve |

## How It Works

1. **Upload**: User uploads a medical PDF
2. **Extract**: PyMuPDF extracts text from PDF
3. **Chunk**: Text is split into 500-character chunks with 50-char overlap
4. **Embed**: sentence-transformers generates embeddings locally
5. **Store**: ChromaDB stores embeddings with metadata
6. **Query**: User asks a question
7. **Retrieve**: ChromaDB finds top 3 most relevant chunks
8. **Generate**: Groq LLM generates answer using retrieved context

## Example Usage

```python
import requests

# Upload a PDF
with open("blood_test.pdf", "rb") as f:
    response = requests.post(
        "http://localhost:8000/upload",
        files={"file": f}
    )
print(response.json())

# Ask a question
response = requests.post(
    "http://localhost:8000/chat/rag",
    json={"message": "What is my hemoglobin level?"}
)
print(response.json())
```

## Notes

- All processing happens locally (except Groq API calls)
- No database required
- ChromaDB persists automatically to disk
- PDFs stored in `reports/` folder
- First run downloads the embedding model (~80MB)

## License

MIT
