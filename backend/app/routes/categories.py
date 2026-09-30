from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from app.models.schemas import CategoryBase, CategoryResponse
from app.database.db import db_store

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("", response_model=List[CategoryResponse])
def get_categories():
    return db_store.categories

@router.post("", response_model=CategoryResponse)
def create_category(cat_in: CategoryBase):
    new_id = f"cat-{uuid.uuid4().hex[:6]}"
    cat_dict = cat_in.dict()
    cat_dict["id"] = new_id
    db_store.categories.append(cat_dict)
    db_store.save()
    return cat_dict

@router.delete("/{cat_id}")
def delete_category(cat_id: str):
    idx = next((i for i, c in enumerate(db_store.categories) if c.get("id") == cat_id or c.get("slug") == cat_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Category not found")
    deleted = db_store.categories.pop(idx)
    db_store.save()
    return {"message": "Category deleted", "id": deleted["id"]}
