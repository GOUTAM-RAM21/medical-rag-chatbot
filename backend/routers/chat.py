import os
from fastapi import APIRouter, HTTPException
from groq import Groq
from schemas import ChatRequest

router = APIRouter(prefix="/chat", tags=["chat"])

client = None
rag_service = None


def get_client():
    global client
    if client is None:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    return client


def get_rag_service():
    global rag_service
    if rag_service is None:
        from services import RagService
        rag_service = RagService()
    return rag_service


@router.post("")
async def chat(req: ChatRequest):
    """
    Original chat endpoint without RAG.
    
    Args:
        req: ChatRequest with message
        
    Returns:
        Dictionary with reply
    """
    try:
        client = get_client()
        response = client.chat.completions.create(
            model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
            messages=[{"role": "user", "content": req.message}]
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        print(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


@router.post("/rag")
async def chat_rag(req: ChatRequest):
    """
    RAG-enabled chat endpoint.
    
    Args:
        req: ChatRequest with message
        
    Returns:
        Dictionary with reply, sources, and context_used
    """
    try:
        rag_service = get_rag_service()
        response = rag_service.answer(req.message, use_rag=True)
        return {
            "reply": response.answer,
            "sources": response.sources,
            "context_used": response.context_used
        }
    except Exception as e:
        print(f"Error in RAG chat: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")
