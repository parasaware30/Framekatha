import os
import uuid
import shutil
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.config.settings import settings

router = APIRouter(tags=["upload"])

# Directory where uploaded media files are saved
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".bmp",
    ".heic", ".heif", ".tiff", ".tif", ".avif", ".cr2", ".arw",
    ".nef", ".dng", ".raw", ".jfif", ".ico"
}
ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv", ".m4v"}
ALLOWED_EXTENSIONS = ALLOWED_IMAGE_EXTENSIONS.union(ALLOWED_VIDEO_EXTENSIONS)

@router.post("/upload")
async def upload_single_file(file: UploadFile = File(...)):
    """
    Upload a single image or video file directly from local computer / device storage.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    ext = os.path.splitext(file.filename)[1].lower()
    if not ext:
        ext = ".jpg"
    if ext not in ALLOWED_EXTENSIONS:
        ext = ".jpg"  # fallback default
    
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer, length=1024*1024)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    file_url = f"/uploads/{unique_filename}"
    return {
        "success": True,
        "filename": unique_filename,
        "original_name": file.filename,
        "url": file_url
    }

@router.post("/upload-multiple")
async def upload_multiple_files(files: List[UploadFile] = File(...)):
    """
    Upload multiple files at once from folder / Gallery / This PC.
    """
    uploaded_urls = []
    
    for file in files:
        if not file.filename:
            continue
        
        # Skip system files
        base_name = os.path.basename(file.filename)
        if base_name.startswith(".") or base_name.lower() in ("thumbs.db", "desktop.ini"):
            continue

        ext = os.path.splitext(file.filename)[1].lower()
        if not ext or ext not in ALLOWED_EXTENSIONS:
            ext = ".jpg"
        
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer, length=1024*1024)
            uploaded_urls.append(f"/uploads/{unique_filename}")
        except Exception as e:
            print(f"Error saving {file.filename}: {e}")
            continue
            
    return {
        "success": True,
        "count": len(uploaded_urls),
        "urls": uploaded_urls
    }

