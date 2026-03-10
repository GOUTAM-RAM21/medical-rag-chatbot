import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from schemas import UploadResponse

router = APIRouter(prefix="/upload", tags=["upload"])

pdf_service = None
embedding_service = None


def get_services():
    global pdf_service, embedding_service
    if pdf_service is None:
        from services import PdfService, EmbeddingService
        pdf_service = PdfService()
        embedding_service = EmbeddingService()
    return pdf_service, embedding_service


@router.post("", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF file, extract text, chunk it, and store in ChromaDB.
    
    Args:
        file: PDF file to upload
        
    Returns:
        UploadResponse with filename, chunks stored, and message
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        pdf_service, embedding_service = get_services()
        reports_dir = os.getenv("REPORTS_DIR", "./reports")
        os.makedirs(reports_dir, exist_ok=True)
        
        file_path = os.path.join(reports_dir, file.filename)
        
        if os.path.exists(file_path):
            print(f"File {file.filename} already exists. Deleting old entries...")
            embedding_service.delete_document(file.filename)
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        print(f"Saved {file.filename} to {file_path}")
        
        chunks = pdf_service.process_pdf(file_path, file.filename)
        
        if not chunks:
            raise HTTPException(status_code=400, detail="No text could be extracted from PDF")
        
        chunks_stored = embedding_service.store_chunks(chunks)
        
        return UploadResponse(
            filename=file.filename,
            chunks_stored=chunks_stored,
            message=f"Successfully processed {file.filename}"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing upload: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@router.get("/documents")
async def list_documents():
    """
    List all uploaded PDF files.
    
    Returns:
        List of documents with filename, size, and upload time
    """
    try:
        reports_dir = os.getenv("REPORTS_DIR", "./reports")
        
        if not os.path.exists(reports_dir):
            return []
        
        documents = []
        for filename in os.listdir(reports_dir):
            if filename.endswith(".pdf"):
                file_path = os.path.join(reports_dir, filename)
                file_size = os.path.getsize(file_path)
                upload_time = os.path.getmtime(file_path)
                
                documents.append({
                    "filename": filename,
                    "file_size_kb": round(file_size / 1024, 2),
                    "upload_time": upload_time
                })
        
        return documents
    
    except Exception as e:
        print(f"Error listing documents: {e}")
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")


@router.delete("/documents/{filename}")
async def delete_document(filename: str):
    """
    Delete a PDF file and its ChromaDB entries.
    
    Args:
        filename: Name of the file to delete
        
    Returns:
        Success message
    """
    try:
        _, embedding_service = get_services()
        reports_dir = os.getenv("REPORTS_DIR", "./reports")
        file_path = os.path.join(reports_dir, filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        os.remove(file_path)
        print(f"Deleted file {filename}")
        
        embedding_service.delete_document(filename)
        
        return {"message": f"Successfully deleted {filename}"}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting document: {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")
