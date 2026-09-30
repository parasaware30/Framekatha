import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config.settings import settings
from app.routes import projects, categories, testimonials, messages, analytics, settings as settings_route, ai, upload, client_galleries

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Enable CORS for all frontends & origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads and videos directories exist and mount static routes
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

VIDEOS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "videos"))
if not os.path.exists(VIDEOS_DIR):
    VIDEOS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
if os.path.exists(VIDEOS_DIR):
    app.mount("/videos", StaticFiles(directory=VIDEOS_DIR), name="videos")

# Include API Routers
app.include_router(projects.router, prefix=settings.API_PREFIX)
app.include_router(categories.router, prefix=settings.API_PREFIX)
app.include_router(testimonials.router, prefix=settings.API_PREFIX)
app.include_router(messages.router, prefix=settings.API_PREFIX)
app.include_router(analytics.router, prefix=settings.API_PREFIX)
app.include_router(settings_route.router, prefix=settings.API_PREFIX)
app.include_router(ai.router, prefix=settings.API_PREFIX)
app.include_router(upload.router, prefix=settings.API_PREFIX)
app.include_router(client_galleries.router, prefix=settings.API_PREFIX)

@app.get("/api/health")
def api_health():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/api/docs"
    }

# ── Serve Built React Frontend SPA in Production ─────────────────────────────
DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "dist"))
if not os.path.exists(DIST_DIR):
    DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))

if os.path.exists(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa_app(full_path: str):
        # Don't intercept API routes
        if full_path.startswith("api/") or full_path == "api":
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"status": "online", "app": settings.PROJECT_NAME}
else:
    @app.get("/")
    def root():
        return {
            "status": "online",
            "app": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "docs": "/api/docs"
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
