import os
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
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


# 🔥 BACKGROUND PROCESS FUNCTION
def process_pdf_background(file_path: str, filename: str):
    try:
        from services import PdfService, EmbeddingService

        pdf_service = PdfService()
        embedding_service = EmbeddingService()

        print(f"[START] Processing {filename}")

        chunks = pdf_service.process_pdf(file_path, filename)

        if not chunks:
            print(f"[WARNING] No text extracted from {filename}")
            return

        embedding_service.store_chunks(chunks)

        print(f"[DONE] Processing completed for {filename}")

    except Exception as e:
        print(f"[ERROR] Background processing failed: {e}")


# 🚀 MAIN UPLOAD API (ASYNC FIX)
@router.post("", response_model=UploadResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
):
    """
    Upload PDF and process in background (non-blocking).
    """

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        pdf_service, embedding_service = get_services()

        reports_dir = os.getenv("REPORTS_DIR", "./reports")
        os.makedirs(reports_dir, exist_ok=True)

        file_path = os.path.join(reports_dir, file.filename)

        # delete old version
        if os.path.exists(file_path):
            print(f"Deleting old file: {file.filename}")
            embedding_service.delete_document(file.filename)

        # save file
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        print(f"[UPLOAD] Saved {file.filename}")

        # 🔥 BACKGROUND PROCESSING
        background_tasks.add_task(process_pdf_background, file_path, file.filename)

        return UploadResponse(
            filename=file.filename,
            chunks_stored=0,
            message="Upload successful. Processing in background..."
        )

    except Exception as e:
        print(f"[ERROR] Upload failed: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


# 📄 LIST DOCUMENTS
@router.get("/documents")
async def list_documents():
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
        print(f"[ERROR] Listing documents failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# 🗑 DELETE DOCUMENT
@router.delete("/documents/{filename}")
async def delete_document(filename: str):
    try:
        _, embedding_service = get_services()

        reports_dir = os.getenv("REPORTS_DIR", "./reports")
        file_path = os.path.join(reports_dir, filename)

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")

        os.remove(file_path)
        print(f"[DELETE] Removed file {filename}")

        embedding_service.delete_document(filename)

        return {"message": f"Successfully deleted {filename}"}

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Delete failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
