import os
import io
import zipfile
import requests
from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from typing import List, Optional
import uuid
from datetime import datetime, date
from app.models.schemas import ProjectCreate, ProjectUpdate, ProjectResponse, CommentCreate
from app.database.db import db_store

router = APIRouter(prefix="/projects", tags=["projects"])

# ── View deduplication ──────────────────────────────────────────────────────
# Stores "ip:projectId:YYYY-MM-DD" keys so one unique visitor IP contributes
# at most 1 view per project per calendar day (even across page refreshes).
_view_seen: set[str] = set()


def is_project_public(p: dict) -> bool:
    val = p.get("published")
    if val is False or val == "false" or val == 0:
        return False
    return True


@router.get("", response_model=List[ProjectResponse])
def get_projects(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    year: Optional[int] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "latest"  # latest, oldest, most_viewed, featured
):
    # Strict public filter: only return projects where published is True
    projects = [p for p in db_store.projects if is_project_public(p)]
    
    if category and category.lower() != "all":
        projects = [p for p in projects if p.get("category", "").lower() == category.lower()]
        
    if tag:
        projects = [p for p in projects if any(tag.lower() in t.lower() for t in p.get("tags", []))]
        
    if year:
        projects = [p for p in projects if p.get("year") == year]
        
    if featured is not None:
        projects = [p for p in projects if p.get("featured") == featured]
        
    if search:
        s = search.lower()
        projects = [
            p for p in projects
            if s in p.get("title", "").lower()
            or s in p.get("description", "").lower()
            or s in p.get("category", "").lower()
            or any(s in t.lower() for t in p.get("tags", []))
            or any(s in tool.lower() for tool in p.get("tools", []))
            or s in p.get("camera", "").lower()
            or s in p.get("editingSoftware", "").lower()
            or s in p.get("location", "").lower()
        ]
        
    # Sorting
    if sort_by == "oldest":
        projects = sorted(projects, key=lambda x: x.get("createdAt", ""))
    elif sort_by == "most_viewed":
        projects = sorted(projects, key=lambda x: x.get("views", 0), reverse=True)
    elif sort_by == "featured":
        projects = sorted(projects, key=lambda x: (not x.get("featured", False), x.get("createdAt", "")), reverse=True)
    else:  # latest (default)
        projects = sorted(projects, key=lambda x: x.get("createdAt", ""), reverse=True)
        
    return projects

@router.get("/all-cms", response_model=List[ProjectResponse])
def get_all_projects_cms():
    """Returns all projects including unpublished for CMS"""
    return db_store.projects

@router.get("/{slug}/download-zip")
def download_project_folder_zip(slug: str):
    """
    Download entire folder contents (all photos and video) bundled as a ZIP archive.
    """
    project = next((p for p in db_store.projects if p.get("slug") == slug or p.get("id") == slug), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    folder_name = project.get("folderName") or project.get("title") or "creative_media_folder"
    # sanitize folder name for filename
    clean_folder_name = "".join(c for c in folder_name if c.isalnum() or c in (" ", "_", "-")).strip() or "media_folder"

    upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")

    # Gather items to package in ZIP
    items_to_pack = []
    images = project.get("images") or []
    for idx, img_url in enumerate(images):
        items_to_pack.append({
            "url": img_url,
            "prefix": f"photo_{idx + 1:03d}",
            "type": "image"
        })

    if project.get("video"):
        items_to_pack.append({
            "url": project.get("video"),
            "prefix": "showcase_video",
            "type": "video"
        })

    # If project has no images list, fallback to thumbnail/after/before
    if not items_to_pack:
        for key, prefix in [("thumbnail", "cover_thumbnail"), ("folderThumbnail", "folder_thumbnail"), ("afterImage", "after_edit"), ("beforeImage", "before_raw")]:
            val = project.get(key)
            if val:
                items_to_pack.append({
                    "url": val,
                    "prefix": prefix,
                    "type": "image"
                })

    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for item in items_to_pack:
            url = item["url"]
            if not url:
                continue

            file_data = None
            ext = ".jpg" if item["type"] == "image" else ".mp4"

            # 1. Try reading directly from local uploads directory if it's an uploaded file
            if "/uploads/" in url:
                fname = url.split("/uploads/")[-1].split("?")[0]
                local_path = os.path.join(upload_dir, fname)
                if os.path.exists(local_path):
                    try:
                        with open(local_path, "rb") as f:
                            file_data = f.read()
                        _, parsed_ext = os.path.splitext(fname)
                        if parsed_ext:
                            ext = parsed_ext
                    except Exception:
                        file_data = None

            # 2. If external URL or not found locally, fetch via HTTP
            if file_data is None and (url.startswith("http://") or url.startswith("https://")):
                try:
                    resp = requests.get(url, timeout=12)
                    if resp.status_code == 200:
                        file_data = resp.content
                        ct = resp.headers.get("content-type", "").lower()
                        if "png" in ct:
                            ext = ".png"
                        elif "webp" in ct:
                            ext = ".webp"
                        elif "gif" in ct:
                            ext = ".gif"
                        elif "mp4" in ct or "video" in ct:
                            ext = ".mp4"
                        elif "jpeg" in ct or "jpg" in ct:
                            ext = ".jpg"
                except Exception:
                    pass

            if file_data:
                arcname = f"{clean_folder_name}/{item['prefix']}{ext}"
                zip_file.writestr(arcname, file_data)

    zip_buffer.seek(0)

    filename_header = f'{clean_folder_name}.zip'
    headers = {
        "Content-Disposition": f'attachment; filename="{filename_header}"',
        "Access-Control-Expose-Headers": "Content-Disposition"
    }
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers=headers
    )

@router.get("/{slug}", response_model=ProjectResponse)
def get_project_by_slug(slug: str):
    project = next((p for p in db_store.projects if p.get("slug") == slug or p.get("id") == slug), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/{project_id}/views")
def increment_project_views(project_id: str, request: Request):
    """
    Increment view count for a project.
    Deduplicates by visitor IP + project + calendar date so each unique
    visitor is counted at most once per day (refresh-proof).
    """
    project = next((p for p in db_store.projects if p.get("id") == project_id or p.get("slug") == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Build a dedup key: clientIP:projectId:today
    client_ip = (
        request.headers.get("x-forwarded-for", "").split(",")[0].strip()
        or request.headers.get("x-real-ip", "")
        or (request.client.host if request.client else "unknown")
    )
    today_str = date.today().isoformat()          # e.g. "2026-09-28"
    dedup_key = f"{client_ip}:{project['id']}:{today_str}"

    if dedup_key in _view_seen:
        # Already counted this visitor today — return current count without incrementing
        return {"views": project.get("views", 0), "counted": False}

    # First visit today — count it
    _view_seen.add(dedup_key)
    project["views"] = project.get("views", 0) + 1

    # Record analytics event
    db_store.analytics.append({
        "id": str(uuid.uuid4()),
        "projectId": project["id"],
        "event": "view",
        "ip": client_ip,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    })
    db_store.save()
    return {"views": project["views"], "counted": True}


@router.post("/{project_id}/like")
def toggle_project_like(project_id: str, action: Optional[str] = Query("like")):
    """
    Toggle or increment like count for a project.
    """
    project = next((p for p in db_store.projects if p.get("id") == project_id or p.get("slug") == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    current_likes = project.get("likes", 0) or 0
    if action == "unlike":
        new_likes = max(0, current_likes - 1)
    else:
        new_likes = current_likes + 1

    project["likes"] = new_likes
    db_store.save()
    return {"likes": new_likes, "projectId": project["id"]}

@router.get("/{project_id}/comments")
def get_project_comments(project_id: str):
    """
    Get all comments for a project.
    """
    project = next((p for p in db_store.projects if p.get("id") == project_id or p.get("slug") == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project.get("comments", []) or []

@router.post("/{project_id}/comments")
def add_project_comment(project_id: str, comment_in: CommentCreate):
    """
    Add a new comment to a project.
    """
    project = next((p for p in db_store.projects if p.get("id") == project_id or p.get("slug") == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if "comments" not in project or not isinstance(project.get("comments"), list):
        project["comments"] = []

    clean_comment = comment_in.comment.strip()
    if not clean_comment:
        raise HTTPException(status_code=400, detail="Comment text cannot be empty")

    new_comment = {
        "id": f"comm-{uuid.uuid4().hex[:8]}",
        "name": (comment_in.name or "Creative Guest").strip() or "Creative Guest",
        "comment": clean_comment,
        "createdAt": datetime.utcnow().isoformat() + "Z"
    }
    project["comments"].insert(0, new_comment)
    db_store.save()
    return new_comment

@router.delete("/{project_id}/comments/{comment_id}")
def delete_project_comment(project_id: str, comment_id: str):
    """
    Delete a comment from a project.
    """
    project = next((p for p in db_store.projects if p.get("id") == project_id or p.get("slug") == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    comments = project.get("comments", []) or []
    project["comments"] = [c for c in comments if c.get("id") != comment_id]
    db_store.save()
    return {"message": "Comment deleted", "success": True}

@router.post("", response_model=ProjectResponse)
def create_project(project_in: ProjectCreate):
    new_id = f"proj-{uuid.uuid4().hex[:8]}"
    now = datetime.utcnow().isoformat() + "Z"
    
    project_dict = project_in.dict()
    project_dict["id"] = new_id
    project_dict["views"] = 0
    project_dict["createdAt"] = now
    project_dict["updatedAt"] = now
    
    db_store.projects.insert(0, project_dict)
    db_store.save()
    return project_dict

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: str, project_in: ProjectUpdate):
    idx = next((i for i, p in enumerate(db_store.projects) if p.get("id") == project_id or p.get("slug") == project_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    current = db_store.projects[idx]
    update_data = project_in.dict(exclude_unset=True)
    
    for k, v in update_data.items():
        if v is not None:
            current[k] = v
            
    current["updatedAt"] = datetime.utcnow().isoformat() + "Z"
    db_store.projects[idx] = current
    db_store.save()
    return current

@router.delete("/{project_id}")
def delete_project(project_id: str):
    idx = next((i for i, p in enumerate(db_store.projects) if p.get("id") == project_id or p.get("slug") == project_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    deleted = db_store.projects.pop(idx)
    db_store.save()
    return {"message": "Project deleted successfully", "id": deleted["id"]}
