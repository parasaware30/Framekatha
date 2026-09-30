from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from datetime import datetime
from app.models.schemas import TestimonialBase, TestimonialResponse
from app.database.db import db_store

router = APIRouter(prefix="/testimonials", tags=["testimonials"])

@router.get("", response_model=List[TestimonialResponse])
def get_testimonials(only_active: bool = True):
    if only_active:
        return [t for t in db_store.testimonials if t.get("active", True)]
    return db_store.testimonials

@router.post("", response_model=TestimonialResponse)
def create_testimonial(test_in: TestimonialBase):
    new_id = f"test-{uuid.uuid4().hex[:6]}"
    now = datetime.utcnow().isoformat() + "Z"
    t_dict = test_in.dict()
    t_dict["id"] = new_id
    t_dict["createdAt"] = now
    db_store.testimonials.append(t_dict)
    db_store.save()
    return t_dict

@router.delete("/{test_id}")
def delete_testimonial(test_id: str):
    idx = next((i for i, t in enumerate(db_store.testimonials) if t.get("id") == test_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    deleted = db_store.testimonials.pop(idx)
    db_store.save()
    return {"message": "Testimonial deleted", "id": deleted["id"]}
