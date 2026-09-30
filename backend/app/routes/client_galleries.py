import os
import io
import zipfile
import requests
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Request, Body
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.database.db import db_store

router = APIRouter(prefix="/client-galleries", tags=["client-galleries"])


class ClientGalleryCreate(BaseModel):
    clientName: str
    eventTitle: str
    slug: Optional[str] = ""
    passcode: str
    eventDate: Optional[str] = ""
    location: Optional[str] = ""
    coverImage: Optional[str] = ""
    images: List[str] = []
    instructions: Optional[str] = "Please review the photos and tap the heart icon on your favorite shots for album selection."
    allowDownload: bool = True
    watermarkEnabled: bool = False
    deadline: Optional[str] = ""


class PasscodeVerifyRequest(BaseModel):
    passcode: str


class ToggleSelectRequest(BaseModel):
    imageUrl: str
    selected: bool


class SubmitFeedbackRequest(BaseModel):
    clientNotes: str
    selectedImages: List[str]


@router.get("")
def list_client_galleries():
    """Admin endpoint: Get all client galleries with full details & selections"""
    return db_store.client_galleries


@router.post("")
def create_client_gallery(payload: ClientGalleryCreate):
    """Admin endpoint: Create a new private password-protected client album"""
    slug = (payload.slug or payload.eventTitle.lower().replace(" ", "-")).strip()
    # Clean slug
    clean_slug = "".join(c for c in slug if c.isalnum() or c in "-_")
    if not clean_slug:
        clean_slug = f"client-{uuid.uuid4().hex[:6]}"

    # Check unique slug
    if any(g.get("slug") == clean_slug for g in db_store.client_galleries):
        clean_slug = f"{clean_slug}-{uuid.uuid4().hex[:4]}"

    new_gallery = {
        "id": f"cg-{uuid.uuid4().hex[:8]}",
        "clientName": payload.clientName.strip(),
        "eventTitle": payload.eventTitle.strip(),
        "slug": clean_slug,
        "passcode": payload.passcode.strip(),
        "eventDate": payload.eventDate or datetime.now().strftime("%d %b %Y"),
        "location": payload.location or "",
        "coverImage": payload.coverImage or (payload.images[0] if payload.images else ""),
        "images": payload.images,
        "instructions": payload.instructions,
        "allowDownload": payload.allowDownload,
        "watermarkEnabled": payload.watermarkEnabled,
        "deadline": payload.deadline or "",
        "selectedImages": [],
        "clientNotes": "",
        "isFinalized": False,
        "views": 0,
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "updatedAt": datetime.utcnow().isoformat() + "Z"
    }

    db_store.client_galleries.insert(0, new_gallery)
    db_store.save()
    return new_gallery


@router.put("/{gallery_id}")
def update_client_gallery(gallery_id: str, payload: ClientGalleryCreate):
    """Admin endpoint: Update an existing client album"""
    for g in db_store.client_galleries:
        if g.get("id") == gallery_id:
            g["clientName"] = payload.clientName.strip()
            g["eventTitle"] = payload.eventTitle.strip()
            g["passcode"] = payload.passcode.strip()
            g["eventDate"] = payload.eventDate or g.get("eventDate")
            g["location"] = payload.location or ""
            g["coverImage"] = payload.coverImage or (payload.images[0] if payload.images else "")
            g["images"] = payload.images
            g["instructions"] = payload.instructions
            g["allowDownload"] = payload.allowDownload
            g["watermarkEnabled"] = payload.watermarkEnabled
            g["deadline"] = payload.deadline or ""
            g["updatedAt"] = datetime.utcnow().isoformat() + "Z"
            db_store.save()
            return g
    raise HTTPException(status_code=404, detail="Client gallery not found")


@router.delete("/{gallery_id}")
def delete_client_gallery(gallery_id: str):
    """Admin endpoint: Delete a client album"""
    initial_len = len(db_store.client_galleries)
    db_store.client_galleries = [g for g in db_store.client_galleries if g.get("id") != gallery_id]
    if len(db_store.client_galleries) == initial_len:
        raise HTTPException(status_code=404, detail="Gallery not found")
    db_store.save()
    return {"status": "success", "message": "Gallery deleted"}


@router.get("/info/{slug}")
def get_gallery_public_meta(slug: str):
    """Public info endpoint: Returns event name & client without images for the lock screen"""
    gallery = next((g for g in db_store.client_galleries if g.get("slug") == slug or g.get("id") == slug), None)
    if not gallery:
        raise HTTPException(status_code=404, detail="Private gallery not found")

    return {
        "clientName": gallery.get("clientName"),
        "eventTitle": gallery.get("eventTitle"),
        "slug": gallery.get("slug"),
        "coverImage": gallery.get("coverImage"),
        "eventDate": gallery.get("eventDate"),
        "location": gallery.get("location"),
        "totalPhotos": len(gallery.get("images", [])),
        "deadline": gallery.get("deadline")
    }


@router.post("/access/{slug}")
def verify_and_access_gallery(slug: str, payload: PasscodeVerifyRequest):
    """Client authentication endpoint: Verify passcode and unlock full gallery"""
    gallery = next((g for g in db_store.client_galleries if g.get("slug") == slug or g.get("id") == slug), None)
    if not gallery:
        raise HTTPException(status_code=404, detail="Private gallery not found")

    if gallery.get("passcode") != payload.passcode.strip():
        raise HTTPException(status_code=401, detail="Galat passcode! Kripya sahi PIN dalein.")

    # Increment view count
    gallery["views"] = gallery.get("views", 0) + 1
    db_store.save()

    return gallery


@router.post("/{slug}/toggle-select")
def toggle_image_selection(slug: str, payload: ToggleSelectRequest):
    """Client endpoint: Heart / Select an image for final editing/album"""
    gallery = next((g for g in db_store.client_galleries if g.get("slug") == slug or g.get("id") == slug), None)
    if not gallery:
        raise HTTPException(status_code=404, detail="Gallery not found")

    selected_list = gallery.setdefault("selectedImages", [])
    if payload.selected:
        if payload.imageUrl not in selected_list:
            selected_list.append(payload.imageUrl)
    else:
        if payload.imageUrl in selected_list:
            selected_list.remove(payload.imageUrl)

    gallery["updatedAt"] = datetime.utcnow().isoformat() + "Z"
    db_store.save()
    return {
        "status": "success",
        "totalSelected": len(selected_list),
        "selectedImages": selected_list
    }


@router.post("/{slug}/submit-feedback")
def submit_client_feedback(slug: str, payload: SubmitFeedbackRequest):
    """Client endpoint: Submit final selections & notes to Paras"""
    gallery = next((g for g in db_store.client_galleries if g.get("slug") == slug or g.get("id") == slug), None)
    if not gallery:
        raise HTTPException(status_code=404, detail="Gallery not found")

    gallery["clientNotes"] = payload.clientNotes.strip()
    gallery["selectedImages"] = payload.selectedImages
    gallery["isFinalized"] = True
    gallery["updatedAt"] = datetime.utcnow().isoformat() + "Z"
    db_store.save()
    return {
        "status": "success",
        "message": "Selection & feedback successfully submitted to Paras!",
        "isFinalized": True
    }


@router.get("/{slug}/download-zip")
def download_gallery_zip(slug: str, mode: str = "all", passcode: Optional[str] = None):
    """Stream high-res ZIP of all or selected photos"""
    gallery = next((g for g in db_store.client_galleries if g.get("slug") == slug or g.get("id") == slug), None)
    if not gallery:
        raise HTTPException(status_code=404, detail="Gallery not found")

    if not gallery.get("allowDownload", True):
        raise HTTPException(status_code=403, detail="Downloads are disabled for this proofing gallery")

    images_to_pack = gallery.get("selectedImages", []) if mode == "selected" else gallery.get("images", [])
    if not images_to_pack:
        images_to_pack = gallery.get("images", [])

    zip_buffer = io.BytesIO()
    uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads"))

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for idx, img_url in enumerate(images_to_pack, 1):
            file_name = f"Photo_{idx:03d}.jpg"
            img_bytes = None

            if img_url.startswith("/uploads/"):
                rel_path = img_url.replace("/uploads/", "")
                local_file = os.path.join(uploads_dir, rel_path)
                if os.path.exists(local_file):
                    with open(local_file, "rb") as f:
                        img_bytes = f.read()
            elif img_url.startswith("http://") or img_url.startswith("https://"):
                try:
                    resp = requests.get(img_url, timeout=10)
                    if resp.status_code == 200:
                        img_bytes = resp.content
                except Exception as e:
                    print(f"Error downloading image {img_url}: {e}")

            if img_bytes:
                zip_file.writestr(file_name, img_bytes)

    zip_buffer.seek(0)
    safe_name = "".join(c for c in (gallery.get("clientName") or "gallery") if c.isalnum() or c in " _-").strip()
    zip_filename = f"{safe_name}_{mode}_photos.zip"

    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{zip_filename}"'}
    )
