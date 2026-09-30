from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    slug: str
    description: str
    category: str
    subcategory: Optional[str] = ""
    folderName: Optional[str] = ""
    folderThumbnail: Optional[str] = ""
    photoTitle: Optional[str] = ""
    images: List[str] = []
    video: Optional[str] = ""
    thumbnail: Optional[str] = ""
    tags: List[str] = []
    tools: List[str] = []
    camera: Optional[str] = ""
    lens: Optional[str] = ""
    editingSoftware: Optional[str] = ""
    year: int = 2026
    location: Optional[str] = ""
    featured: bool = False
    published: bool = True
    beforeImage: Optional[str] = ""
    afterImage: Optional[str] = ""
    showThumbnailInDetail: bool = False
    likes: int = 0
    comments: List[Dict[str, Any]] = []

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    folderName: Optional[str] = None
    folderThumbnail: Optional[str] = None
    photoTitle: Optional[str] = None
    images: Optional[List[str]] = None
    video: Optional[str] = None
    thumbnail: Optional[str] = None
    tags: Optional[List[str]] = None
    tools: Optional[List[str]] = None
    camera: Optional[str] = None
    lens: Optional[str] = None
    editingSoftware: Optional[str] = None
    year: Optional[int] = None
    location: Optional[str] = None
    featured: Optional[bool] = None
    published: Optional[bool] = None
    beforeImage: Optional[str] = None
    afterImage: Optional[str] = None
    showThumbnailInDetail: Optional[bool] = None
    likes: Optional[int] = None
    comments: Optional[List[Dict[str, Any]]] = None

class CommentCreate(BaseModel):
    name: Optional[str] = "Creative Guest"
    comment: str

class ProjectResponse(ProjectBase):
    id: str
    views: int = 0
    createdAt: str
    updatedAt: str

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str

class CategoryResponse(CategoryBase):
    id: str

class TestimonialBase(BaseModel):
    name: str
    role: str
    message: str
    image: Optional[str] = ""
    rating: int = 5
    active: bool = True

class TestimonialResponse(TestimonialBase):
    id: str
    createdAt: str

class MessageCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str

class MessageResponse(MessageCreate):
    id: str
    status: str = "unread"
    createdAt: str

class AISearchQuery(BaseModel):
    query: str

class AIChatMessage(BaseModel):
    role: str = "user"  # "user" or "model"
    content: str

class AIChatRequest(BaseModel):
    message: str
    history: List[AIChatMessage] = []
    imageUrl: Optional[str] = None  # URL or base64 of attached image

class AIChatResponse(BaseModel):
    reply: str
    matchedProjects: List[ProjectResponse] = []
    suggestions: List[str] = []
    originalImage: Optional[str] = None
    editedImage: Optional[str] = None
    appliedStyle: Optional[str] = None
    adjustments: Optional[Dict[str, Any]] = None

class AIImageEditRequest(BaseModel):
    image: str  # URL or base64 data URL
    prompt: str  # e.g. "Make this cyberpunk neon", "Teal & Orange film", "B&W dramatic"

class AIImageEditResponse(BaseModel):
    success: bool
    originalImage: str
    editedImage: str
    styleApplied: str
    adjustments: Dict[str, Any]
    explanation: str
    suggestions: List[str] = []



class AISuggestMetadataRequest(BaseModel):
    prompt: Optional[str] = ""
    title: Optional[str] = ""
    description: Optional[str] = ""
    imageUrl: Optional[str] = ""

class AISuggestMetadataResponse(BaseModel):
    title: Optional[str] = ""
    category: str
    subcategory: Optional[str] = ""
    folderName: Optional[str] = ""
    tags: List[str]
    tools: List[str]
    camera: Optional[str] = ""
    lens: Optional[str] = ""
    editingSoftware: Optional[str] = ""
    location: Optional[str] = ""
    visualStyle: str
    description: str

class SiteSettings(BaseModel):
    title: str = "FrameKatha"
    tagline: str = "Every Frame Tells a Story."
    aboutText: str = "FrameKatha is an AI-powered creative portfolio platform showcasing photography, digital art, color grading, and visual storytelling."
    socialLinks: Dict[str, str] = {
        "instagram": "https://instagram.com/framekatha",
        "github": "https://github.com/framekatha",
        "linkedin": "https://linkedin.com/in/framekatha",
        "youtube": "https://youtube.com/@framekatha",
        "email": "hello@framekatha.com"
    }
    maintenanceMode: bool = False
    maintenanceMessage: str = "We're sprinkling some magic on FrameKatha ✨\nOur team is working hard to bring you an even better experience.\nWe'll be back shortly — thank you for your patience! 🚀"
    showcaseVideo: Optional[str] = "https://assets.mixkit.co/videos/preview/mixkit-cinematic-night-aerial-of-city-streets-41865-large.mp4"
    showcaseVideoTitle: Optional[str] = "Cinematic Visual Showreel"
    showcaseVideoSubtitle: Optional[str] = "4K 60FPS Video Production, Visual Effects & Color Grading"
    showcaseVideoEnabled: bool = True
    showcaseVideos: List[Dict[str, Any]] = [
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
    ]
