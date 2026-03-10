from pydantic import BaseModel


class RAGChatRequest(BaseModel):
    """Request model for RAG chatbot queries."""
    message: str
    use_rag: bool = True


class RAGChatResponse(BaseModel):
    """Response model from RAG chatbot."""
    answer: str
    sources: list[str]
    context_used: bool


class UploadResponse(BaseModel):
    """Response model for PDF upload."""
    filename: str
    chunks_stored: int
    message: str


class RetrievedChunk(BaseModel):
    """Single document chunk from retrieval."""
    content: str
    source: str
    chunk_index: int


class ChatRequest(BaseModel):
    """Request model for basic chat."""
    message: str
