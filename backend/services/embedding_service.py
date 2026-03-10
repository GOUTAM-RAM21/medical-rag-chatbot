import os
import chromadb
from chromadb.utils import embedding_functions


class EmbeddingService:
    """Service for managing embeddings and ChromaDB vector storage."""
    
    def __init__(self):
        """Initialize ChromaDB client and collection with sentence-transformers."""
        self.model_name = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
        self.chroma_path = os.getenv("CHROMA_DB_PATH", "./chroma_db")
        
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=self.model_name
        )
        
        self.client = chromadb.PersistentClient(path=self.chroma_path)
        
        self.collection = self.client.get_or_create_collection(
            name="medical_documents",
            embedding_function=self.embedding_function
        )
        
        print(f"ChromaDB initialized at {self.chroma_path}")
        print(f"Collection 'medical_documents' ready with {self.collection.count()} chunks")
    
    def store_chunks(self, chunks: list[dict]) -> int:
        """
        Store document chunks in ChromaDB.
        
        Args:
            chunks: List of chunk dictionaries with content, source, and chunk_index
            
        Returns:
            Number of chunks stored
        """
        if not chunks:
            return 0
        
        documents = [chunk["content"] for chunk in chunks]
        metadatas = [
            {
                "source": chunk["source"],
                "chunk_index": chunk["chunk_index"]
            }
            for chunk in chunks
        ]
        ids = [f"{chunk['source']}_{chunk['chunk_index']}" for chunk in chunks]
        
        try:
            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            print(f"Stored {len(chunks)} chunks in ChromaDB")
            return len(chunks)
        except Exception as e:
            print(f"Error storing chunks: {e}")
            self.collection.upsert(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            print(f"Upserted {len(chunks)} chunks in ChromaDB")
            return len(chunks)
    
    def search(self, query: str, top_k: int = 3) -> list[dict]:
        """
        Search for relevant chunks using semantic similarity.
        
        Args:
            query: User's question
            top_k: Number of results to return
            
        Returns:
            List of relevant chunk dictionaries
        """
        if self.collection.count() == 0:
            return []
        
        results = self.collection.query(
            query_texts=[query],
            n_results=min(top_k, self.collection.count())
        )
        
        if not results["documents"] or not results["documents"][0]:
            return []
        
        chunks = []
        for i in range(len(results["documents"][0])):
            chunks.append({
                "content": results["documents"][0][i],
                "source": results["metadatas"][0][i]["source"],
                "chunk_index": results["metadatas"][0][i]["chunk_index"]
            })
        
        return chunks
    
    def get_collection_stats(self) -> dict:
        """
        Get statistics about the ChromaDB collection.
        
        Returns:
            Dictionary with collection stats
        """
        return {
            "total_chunks": self.collection.count(),
            "collection_name": "medical_documents"
        }
    
    def delete_document(self, filename: str):
        """
        Delete all chunks for a specific document.
        
        Args:
            filename: Source filename to delete
        """
        try:
            self.collection.delete(
                where={"source": filename}
            )
            print(f"Deleted all chunks for {filename}")
        except Exception as e:
            print(f"Error deleting document {filename}: {e}")
