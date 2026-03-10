import os
import fitz
from langchain_text_splitters import RecursiveCharacterTextSplitter


class PdfService:
    """Service for PDF text extraction and chunking."""
    
    def __init__(self):
        self.chunk_size = int(os.getenv("CHUNK_SIZE", "500"))
        self.chunk_overlap = int(os.getenv("CHUNK_OVERLAP", "50"))
    
    def extract_text(self, file_path: str) -> str:
        """
        Extract all text from a PDF using PyMuPDF.
        
        Args:
            file_path: Path to the PDF file
            
        Returns:
            Full text content as a single string
        """
        doc = fitz.open(file_path)
        text_parts = []
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            text_parts.append(page.get_text())
        
        doc.close()
        return "\n\n".join(text_parts)
    
    def chunk_text(self, text: str, filename: str) -> list[dict]:
        """
        Split text into chunks using RecursiveCharacterTextSplitter.
        
        Args:
            text: Full text to chunk
            filename: Source filename for metadata
            
        Returns:
            List of chunk dictionaries with content, source, and chunk_index
        """
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len
        )
        
        chunks = splitter.split_text(text)
        
        return [
            {
                "content": chunk,
                "source": filename,
                "chunk_index": idx
            }
            for idx, chunk in enumerate(chunks)
        ]
    
    def process_pdf(self, file_path: str, filename: str) -> list[dict]:
        """
        Extract and chunk text from a PDF.
        
        Args:
            file_path: Path to the PDF file
            filename: Filename for metadata
            
        Returns:
            List of chunk dictionaries ready for embedding
        """
        text = self.extract_text(file_path)
        return self.chunk_text(text, filename)
