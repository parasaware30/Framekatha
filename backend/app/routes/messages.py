from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from datetime import datetime
from app.models.schemas import MessageCreate, MessageResponse
from app.database.db import db_store
from app.services.email_service import send_contact_notification

router = APIRouter(prefix="/messages", tags=["messages"])

@router.get("", response_model=List[MessageResponse])
def get_messages():
    return db_store.messages

@router.post("", response_model=MessageResponse)
def send_message(msg_in: MessageCreate):
    new_id = f"msg-{uuid.uuid4().hex[:6]}"
    now = datetime.utcnow().isoformat() + "Z"
    m_dict = msg_in.dict()
    m_dict["id"] = new_id
    m_dict["status"] = "unread"
    m_dict["createdAt"] = now
    db_store.messages.insert(0, m_dict)
    db_store.save()

    # Trigger email notification to parasaware05@gmail.com
    send_contact_notification(
        name=msg_in.name,
        sender_email=msg_in.email,
        subject=msg_in.subject,
        message=msg_in.message
    )

    return m_dict

@router.put("/{msg_id}/read")
def mark_message_read(msg_id: str):
    msg = next((m for m in db_store.messages if m.get("id") == msg_id), None)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg["status"] = "read"
    db_store.save()
    return msg

@router.delete("/{msg_id}")
def delete_message(msg_id: str):
    idx = next((i for i, m in enumerate(db_store.messages) if m.get("id") == msg_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Message not found")
    deleted = db_store.messages.pop(idx)
    db_store.save()
    return {"message": "Message deleted", "id": deleted["id"]}
