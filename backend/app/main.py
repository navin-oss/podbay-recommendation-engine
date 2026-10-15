from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.app.core.config import settings
from backend.app.api.routes import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Explainable, modular recommendation engine for podcast recording studios.",
    version="1.0.0",
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Static files for frontend build if present
DIST_DIR = settings.BASE_DIR / "frontend" / "dist"

if DIST_DIR.exists() and (DIST_DIR / "index.html").exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    # Serve static root files (e.g. PodcastStudio_Background.png, favicon)
    @app.get("/PodcastStudio_Background.png")
    async def serve_bg():
        img = DIST_DIR / "PodcastStudio_Background.png"
        if img.exists():
            return FileResponse(img)
        # Fallback to root or frontend/public
        public_img = settings.BASE_DIR / "frontend" / "public" / "PodcastStudio_Background.png"
        if public_img.exists():
            return FileResponse(public_img)
        return FileResponse(settings.BASE_DIR / "PodcastStudio_Background.png")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API or docs routes
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None
        file_path = DIST_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(DIST_DIR / "index.html")
else:
    @app.get("/")
    def root():
        return {
            "message": "PodBay Podcast Studio Recommendation Engine API",
            "docs": "/docs",
            "health": f"{settings.API_V1_PREFIX}/health",
            "version": "1.0.0",
            "data_provenance": "Synthetic demonstration dataset (60 studios, 20 users)"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
