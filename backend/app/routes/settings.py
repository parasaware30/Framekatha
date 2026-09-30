from fastapi import APIRouter
from app.models.schemas import SiteSettings
from app.database.db import db_store

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("", response_model=SiteSettings)
def get_site_settings():
    # Back-fill new fields if missing from old stored data
    settings = db_store.settings
    settings.setdefault("maintenanceMode", False)
    settings.setdefault("maintenanceMessage", "We're sprinkling some magic on FrameKatha ✨\nWe'll be back shortly — thank you for your patience! 🚀")
    settings.setdefault("showcaseVideos", [
        {
            "id": "vid-1",
            "url": "https://assets.mixkit.co/videos/preview/mixkit-cinematic-night-aerial-of-city-streets-41865-large.mp4",
            "title": "Neon City Nocturne 4K",
            "subtitle": "Night aerial cinematography with anamorphic lens flares",
            "tag": "Night Aerial"
        },
        {
            "id": "vid-2",
            "url": "https://assets.mixkit.co/videos/preview/mixkit-cinematic-view-of-mountains-and-a-valley-41584-large.mp4",
            "title": "Himalayan Ridge Drone Reel",
            "subtitle": "High-altitude landscape exploration & dynamic natural light",
            "tag": "Drone Landscape"
        },
        {
            "id": "vid-3",
            "url": "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-41585-large.mp4",
            "title": "Cyberpunk Portrait Studio",
            "subtitle": "Editorial fashion lighting with RGB color contrast",
            "tag": "Editorial Fashion"
        }
    ])
    return settings

@router.put("", response_model=SiteSettings)
def update_site_settings(settings_in: SiteSettings):
    db_store.settings = settings_in.dict()
    db_store.save()
    return db_store.settings

@router.get("/maintenance")
def get_maintenance_status():
    """
    Lightweight public endpoint — frontend polls this on every page load.
    Returns maintenance mode flag + message without exposing other settings.
    """
    s = db_store.settings
    return {
        "maintenanceMode": s.get("maintenanceMode", False),
        "maintenanceMessage": s.get("maintenanceMessage", "We'll be back shortly! 🚀")
    }
