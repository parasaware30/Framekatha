import os
from dotenv import load_dotenv

# Load from backend/.env or root .env
curr_dir = os.path.dirname(os.path.abspath(__file__))
backend_root = os.path.dirname(os.path.dirname(curr_dir))
load_dotenv(os.path.join(backend_root, ".env"))
load_dotenv(os.path.join(backend_root, "backend", ".env"))


class Settings:
    PROJECT_NAME: str = "FrameKatha API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "framekatha_db")
    
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()
