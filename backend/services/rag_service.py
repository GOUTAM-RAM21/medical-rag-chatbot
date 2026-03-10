import os
from groq import Groq
from .embedding_service import EmbeddingService
from schemas.models import RAGChatResponse


class RagService:
    """Service for RAG pipeline: retrieval + generation."""
    
    def __init__(self):
        """Initialize embedding service and Groq client."""
        self.embedding_service = EmbeddingService()
        self.groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.top_k = int(os.getenv("TOP_K_RESULTS", "3"))
    
    def retrieve_context(self, query: str) -> tuple[str, list[str]]:
        """
        Retrieve relevant context from vector database.
        
        Args:
            query: User's question
            
        Returns:
            Tuple of (context_string, list_of_source_filenames)
        """
        chunks = self.embedding_service.search(query, top_k=self.top_k)
        
        if not chunks:
            return "", []
        
        context_parts = [chunk["content"] for chunk in chunks]
        context_string = "\n\n---\n\n".join(context_parts)
        
        sources = list(set(chunk["source"] for chunk in chunks))
        
        return context_string, sources
    
    def build_prompt(self, query: str, context: str) -> list[dict]:
        """
        Build the messages list for Groq API.
        
        Args:
            query: User's question
            context: Retrieved context from documents
            
        Returns:
            List of message dictionaries for Groq
        """
        system_message = {
            "role": "system",
            "content": (
                "You are a medical AI assistant. A patient has uploaded their medical "
                "reports and is asking questions about them. Use the provided context "
                "from those reports to answer accurately. If the context does not "
                "contain relevant information, say so clearly. Never invent medical "
                "information. Always recommend consulting a qualified doctor for "
                "personal medical decisions."
            )
        }
        
        if context:
            user_message = {
                "role": "user",
                "content": f"Context from medical reports:\n{context}\n\nQuestion: {query}"
            }
        else:
            user_message = {
                "role": "user",
                "content": query
            }
        
        return [system_message, user_message]
    
    def answer(self, query: str, use_rag: bool = True) -> RAGChatResponse:
        """
        Generate answer using RAG pipeline.
        
        Args:
            query: User's question
            use_rag: Whether to use retrieval or direct query
            
        Returns:
            RAGChatResponse with answer, sources, and context_used flag
        """
        context = ""
        sources = []
        context_used = False
        
        if use_rag:
            context, sources = self.retrieve_context(query)
            context_used = bool(context)
        
        messages = self.build_prompt(query, context)
        
        response = self.groq_client.chat.completions.create(
            model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
            messages=messages,
            temperature=0.2
        )
        
        answer = response.choices[0].message.content
        
        return RAGChatResponse(
            answer=answer,
            sources=sources,
            context_used=context_used
        )
