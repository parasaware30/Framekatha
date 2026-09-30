import json
import os
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.config.settings import settings

DATA_FILE = os.path.join(os.path.dirname(__file__), "database_store.json")

SEED_PROJECTS = [
    {
        "id": "proj-1",
        "title": "Night at Rameshwaram",
        "slug": "night-at-rameshwaram",
        "description": "Long exposure architectural photography capturing the majestic corridors and ancient illuminated pillars of Rameshwaram Temple under starry midnight skies.",
        "category": "Photography",
        "subcategory": "Architecture",
        "images": [
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200",
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200"
        ],
        "video": "",
        "thumbnail": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800",
        "tags": ["Temple", "Architecture", "Night", "India", "Low Light", "Long Exposure"],
        "tools": ["Sony A7IV", "Sony 16-35mm GM", "Adobe Lightroom"],
        "camera": "Sony A7IV",
        "lens": "FE 16-35mm F2.8 GM",
        "editingSoftware": "Adobe Lightroom Classic",
        "year": 2026,
        "location": "Rameshwaram, Tamil Nadu",
        "featured": True,
        "published": True,
        "views": 0,
        "beforeImage": "",
        "afterImage": "",
        "createdAt": "2026-02-10T10:00:00Z",
        "updatedAt": "2026-02-10T10:00:00Z"
    },
    {
        "id": "proj-2",
        "title": "Monsoon Portrait Series",
        "slug": "monsoon-portrait",
        "description": "Cinematic outdoor portraiture in heavy rain with high-contrast moody color grading and natural atmospheric reflections.",
        "category": "Photography",
        "subcategory": "Portraits",
        "images": [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200"
        ],
        "video": "",
        "thumbnail": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
        "tags": ["Portrait", "Monsoon", "Moody", "Rain", "Street", "Atmospheric"],
        "tools": ["Canon R5", "85mm f/1.2", "Photoshop", "Lightroom"],
        "camera": "Canon EOS R5",
        "lens": "RF 85mm F1.2L USM",
        "editingSoftware": "Adobe Photoshop & Lightroom",
        "year": 2026,
        "location": "Mumbai, Maharashtra",
        "featured": True,
        "published": True,
        "views": 0,
        "beforeImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&sat=-50",
        "afterImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
        "createdAt": "2026-03-01T12:00:00Z",
        "updatedAt": "2026-03-01T12:00:00Z"
    },
    {
        "id": "proj-3",
        "title": "Neon Cyberpunk Visual Retouch",
        "slug": "neon-cyberpunk-visual-retouch",
        "description": "Advanced before/after photo editing and color grading turning daytime urban streets into a glowing futuristic cyberpunk metropolis.",
        "category": "Photo Editing",
        "subcategory": "Color Grading",
        "images": [
            "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200"
        ],
        "video": "",
        "thumbnail": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800",
        "tags": ["Cyberpunk", "Color Grading", "Neon", "Retouch", "Photoshop", "Urban"],
        "tools": ["Adobe Photoshop", "Camera Raw", "Lightroom"],
        "camera": "Sony A7S III",
        "lens": "24-70mm F2.8 GM",
        "editingSoftware": "Adobe Photoshop 2026",
        "year": 2026,
        "location": "Tokyo, Japan",
        "featured": True,
        "published": True,
        "views": 0,
        "beforeImage": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800",
        "afterImage": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800",
        "createdAt": "2026-03-12T14:30:00Z",
        "updatedAt": "2026-03-12T14:30:00Z"
    },
    {
        "id": "proj-4",
        "title": "Digital Dreams â€” Surreal Concept Art",
        "slug": "digital-dreams-surreal-concept-art",
        "description": "Fantasy digital illustration exploring floating cosmic islands, ethereal light leaks, and surreal dimensional shifts.",
        "category": "Digital Art",
        "subcategory": "Illustration",
        "images": [
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200"
        ],
        "video": "",
        "thumbnail": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
        "tags": ["Surreal", "Digital Painting", "Fantasy", "Cosmic", "Illustration"],
        "tools": ["Procreate", "Photoshop", "Wacom Intuos"],
        "camera": "",
        "lens": "",
        "editingSoftware": "Procreate & Photoshop",
        "year": 2025,
        "location": "Studio Production",
        "featured": True,
        "published": True,
        "views": 0,
        "beforeImage": "",
        "afterImage": "",
        "createdAt": "2025-11-20T09:15:00Z",
        "updatedAt": "2025-11-20T09:15:00Z"
    },
    {
        "id": "proj-5",
        "title": "Minimalist Film Poster Series",
        "slug": "minimalist-film-poster-series",
        "description": "A collection of alternative minimalist movie posters combining bold typography, negative space, and dual-tone vector geometry.",
        "category": "Poster Design",
        "subcategory": "Graphic Design",
        "images": [
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200"
        ],
        "video": "",
        "thumbnail": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800",
        "tags": ["Poster", "Minimalism", "Typography", "Branding", "Vector", "Design"],
        "tools": ["Adobe Illustrator", "Figma", "Photoshop"],
        "camera": "",
        "lens": "",
        "editingSoftware": "Adobe Illustrator & Figma",
        "year": 2026,
        "location": "Digital Work",
        "featured": False,
        "published": True,
        "views": 0,
        "beforeImage": "",
        "afterImage": "",
        "createdAt": "2026-01-15T11:00:00Z",
        "updatedAt": "2026-01-15T11:00:00Z"
    },
    {
        "id": "proj-6",
        "title": "Cinematic YouTube Thumbnail Collection",
        "slug": "cinematic-youtube-thumbnail-collection",
        "description": "High CTR thumbnail designs created for tech and filmmaking creators with dynamic glow overlays and sharp subject cutouts.",
        "category": "Thumbnail Design",
        "subcategory": "Social Media",
        "images": [
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200"
        ],
        "video": "",
        "thumbnail": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
        "tags": ["Thumbnail", "YouTube", "CTR", "Graphics", "Photoshop", "Social Media"],
        "tools": ["Photoshop", "Lightroom"],
        "camera": "",
        "lens": "",
        "editingSoftware": "Adobe Photoshop",
        "year": 2026,
        "location": "Online Creator Series",
        "featured": False,
        "published": True,
        "views": 0,
        "beforeImage": "",
        "afterImage": "",
        "createdAt": "2026-02-22T16:00:00Z",
        "updatedAt": "2026-02-22T16:00:00Z"
    },
    {
        "id": "proj-7",
        "title": "Varanasi Ghats 4K Cinema Reel",
        "slug": "varanasi-ghats-4k-cinema-reel",
        "description": "A 60-second atmospheric 4K film reel capturing the golden evening Ganga Aarti, incense smoke, and rhythmic boat movements on the Ganges.",
        "category": "Video Editing",
        "subcategory": "Short Film",
        "images": [
            "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200"
        ],
        "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "thumbnail": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
        "tags": ["Video", "Varanasi", "Reels", "Cinematic", "Premiere Pro", "Ghats", "India"],
        "tools": ["Sony FX3", "24-70mm GM", "Premiere Pro", "DaVinci Resolve"],
        "camera": "Sony FX3",
        "lens": "FE 24-70mm F2.8 GM II",
        "editingSoftware": "Premiere Pro & DaVinci Resolve",
        "year": 2026,
        "location": "Varanasi, Uttar Pradesh",
        "featured": True,
        "published": True,
        "views": 0,
        "beforeImage": "",
        "afterImage": "",
        "createdAt": "2026-03-05T18:00:00Z",
        "updatedAt": "2026-03-05T18:00:00Z"
    },
    {
        "id": "proj-8",
        "title": "Generative Light Fields â€” AI & Three.js Experiment",
        "slug": "generative-light-fields-experiment",
        "description": "An interactive creative code experiment combining WebGL shaders, particle velocity fields, and real-time GPU raymarching.",
        "category": "Experiments",
        "subcategory": "Creative Tech",
        "images": [
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200"
        ],
        "video": "",
        "thumbnail": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
        "tags": ["Three.js", "WebGL", "Creative Coding", "Shaders", "Generative Art", "AI"],
        "tools": ["Three.js", "GLSL", "React", "GLSL Canvas"],
        "camera": "",
        "lens": "",
        "editingSoftware": "VS Code & Three.js",
        "year": 2026,
        "location": "Web Experiment",
        "featured": True,
        "published": True,
        "views": 0,
        "beforeImage": "",
        "afterImage": "",
        "createdAt": "2026-03-18T10:00:00Z",
        "updatedAt": "2026-03-18T10:00:00Z"
    }
]

SEED_CATEGORIES = [
    {"id": "cat-1", "name": "Photography", "slug": "photography", "description": "Portraits, landscapes, architecture, street and experimental photography."},
    {"id": "cat-2", "name": "Digital Art", "slug": "digital-art", "description": "Digital illustrations, compositions and creative artwork."},
    {"id": "cat-3", "name": "Photo Editing", "slug": "photo-editing", "description": "Before/after editing projects, color grading, and retouching."},
    {"id": "cat-4", "name": "Poster Design", "slug": "poster-design", "description": "Creative poster and graphic design work."},
    {"id": "cat-5", "name": "Thumbnail Design", "slug": "thumbnail-design", "description": "YouTube and social media thumbnail designs."},
    {"id": "cat-6", "name": "Video Editing", "slug": "video-editing", "description": "Cinematic edits, reels and short-form videos."},
    {"id": "cat-7", "name": "Experiments", "slug": "experiments", "description": "Experimental creative and technology-based projects."}
]

SEED_TESTIMONIALS = [
    {
        "id": "test-1",
        "name": "Ananya Roy",
        "role": "Film Director & Producer",
        "message": "FrameKatha brought an extraordinary cinematic vision to our documentary project. Their mastery over color grading and visual depth is world-class.",
        "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
        "rating": 5,
        "active": True,
        "createdAt": "2026-01-10T10:00:00Z"
    },
    {
        "id": "test-2",
        "name": "Vikramaditya Sengupta",
        "role": "Creative Lead, Studio Pulse",
        "message": "The before/after retouching and thumbnail designs delivered by FrameKatha boosted our channel CTR by over 35%. Exceptional artistic precision!",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        "rating": 5,
        "active": True,
        "createdAt": "2026-02-14T12:00:00Z"
    }
]

class DatabaseStore:
    def __init__(self):
        self.load()

    def load(self):
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.projects = data.get("projects", SEED_PROJECTS)
                    self.categories = data.get("categories", SEED_CATEGORIES)
                    self.testimonials = data.get("testimonials", SEED_TESTIMONIALS)
                    self.messages = data.get("messages", [])
                    self.analytics = data.get("analytics", [])
                    self.client_galleries = data.get("client_galleries", [])
                    self.settings = data.get("settings", {
                        "title": "FrameKatha",
                        "tagline": "Every Frame Tells a Story.",
                        "aboutText": "FrameKatha is a professional creative portfolio platform showcasing photography, digital art, color grading, poster design, and visual filmmaking.",
                        "socialLinks": {
                            "instagram": "https://instagram.com/framekatha",
                            "github": "https://github.com/framekatha",
                            "linkedin": "https://linkedin.com/in/framekatha",
                            "youtube": "https://youtube.com/@framekatha",
                            "email": "parasaware05@gmail.com"
                        }
                    })
                    return
            except Exception as e:
                print("Error loading store file:", e)
        
        self.projects = SEED_PROJECTS
        self.categories = SEED_CATEGORIES
        self.testimonials = SEED_TESTIMONIALS
        self.messages = []
        self.analytics = []
        self.client_galleries = []
        self.settings = {
            "title": "FrameKatha",
            "tagline": "Every Frame Tells a Story.",
            "aboutText": "FrameKatha is a professional creative portfolio platform showcasing photography, digital art, color grading, poster design, and visual filmmaking.",
            "socialLinks": {
                "instagram": "https://instagram.com/framekatha",
                "github": "https://github.com/framekatha",
                "linkedin": "https://linkedin.com/in/framekatha",
                "youtube": "https://youtube.com/@framekatha",
                "email": "parasaware05@gmail.com"
            }
        }
        self.save()

    def save(self):
        data = {
            "projects": self.projects,
            "categories": self.categories,
            "testimonials": self.testimonials,
            "messages": self.messages,
            "analytics": self.analytics,
            "client_galleries": self.client_galleries,
            "settings": self.settings
        }
        temp_file = DATA_FILE + ".tmp"
        try:
            with open(temp_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            if os.path.exists(temp_file):
                os.replace(temp_file, DATA_FILE)
        except Exception as e:
            print("Error saving database store:", e)
            # Fallback direct write
            with open(DATA_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

db_store = DatabaseStore()


