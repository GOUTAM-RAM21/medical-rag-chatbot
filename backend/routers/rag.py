import os
from fastapi import APIRouter, HTTPException, Query
from schemas import RAGChatRequest, RAGChatResponse, RetrievedChunk

router = APIRouter(prefix="/rag", tags=["rag"])

rag_service = None
embedding_service = None


def get_services():
    global rag_service, embedding_service
    if rag_service is None:
        from services import RagService, EmbeddingService
        rag_service = RagService()
        embedding_service = EmbeddingService()
    return rag_service, embedding_service


@router.post("/chat", response_model=RAGChatResponse)
async def rag_chat(request: RAGChatRequest):
    """
    Chat with RAG-powered medical assistant.
    
    Args:
        request: RAGChatRequest with message and use_rag flag
        
    Returns:
        RAGChatResponse with answer, sources, and context_used
    """
    try:
        rag_service, _ = get_services()
        response = rag_service.answer(request.message, request.use_rag)
        return response
    except Exception as e:
        print(f"Error in RAG chat: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


@router.get("/search", response_model=list[RetrievedChunk])
async def search_documents(q: str = Query(..., description="Search query")):
    """
    Search for relevant document chunks without generating an answer.
    
    Args:
        q: Search query string
        
    Returns:
        List of retrieved chunks
    """
    try:
        _, embedding_service = get_services()
        top_k = int(os.getenv("TOP_K_RESULTS", "3"))
        chunks = embedding_service.search(q, top_k=top_k)
        
        return [
            RetrievedChunk(
                content=chunk["content"],
                source=chunk["source"],
                chunk_index=chunk["chunk_index"]
            )
            for chunk in chunks
        ]
    except Exception as e:
        print(f"Error searching documents: {e}")
        raise HTTPException(status_code=500, detail=f"Error searching: {str(e)}")


@router.get("/stats")
async def get_stats():
    """
    Get statistics about the RAG system.
    
    Returns:
        Dictionary with collection stats and PDF count
    """
    try:
        _, embedding_service = get_services()
        collection_stats = embedding_service.get_collection_stats()
        
        reports_dir = os.getenv("REPORTS_DIR", "./reports")
        pdf_count = 0
        
        if os.path.exists(reports_dir):
            pdf_count = len([f for f in os.listdir(reports_dir) if f.endswith(".pdf")])
        
        return {
            **collection_stats,
            "pdf_files": pdf_count
        }
    except Exception as e:
        print(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")
