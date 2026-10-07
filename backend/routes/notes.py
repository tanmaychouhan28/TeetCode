from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Note, User
from ..schemas import NoteCreate, NoteUpdate
from ..auth import get_current_user_optional

router = APIRouter(prefix="/api/notes", tags=["Notes"])

@router.get("")
def list_notes(
    topic: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else 1
    query = db.query(Note).filter(Note.user_id == user_id)
    if topic and topic.lower() != "all":
        query = query.filter(Note.topic.ilike(f"%{topic}%"))
    
    notes = query.order_by(Note.updated_at.desc()).all()
    return [
        {
            "id": n.id,
            "topic": n.topic,
            "title": n.title,
            "content": n.content,
            "tags": [t.strip() for t in n.tags.split(",") if t.strip()] if n.tags else [],
            "created_at": n.created_at.isoformat(),
            "updated_at": n.updated_at.isoformat()
        } for n in notes
    ]

@router.post("")
def create_note(
    req: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else 1
    note = Note(
        user_id=user_id,
        topic=req.topic,
        title=req.title,
        content=req.content,
        tags=req.tags or ""
    )
    db.add(note)
    db.commit()
    db.refresh(note)

    return {
        "id": note.id,
        "topic": note.topic,
        "title": note.title,
        "content": note.content,
        "tags": [t.strip() for t in note.tags.split(",") if t.strip()] if note.tags else [],
        "created_at": note.created_at.isoformat(),
        "updated_at": note.updated_at.isoformat()
    }

@router.put("/{note_id}")
def update_note(
    note_id: int,
    req: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else 1
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    if req.title is not None:
        note.title = req.title
    if req.topic is not None:
        note.topic = req.topic
    if req.content is not None:
        note.content = req.content
    if req.tags is not None:
        note.tags = req.tags

    db.commit()
    db.refresh(note)

    return {
        "id": note.id,
        "topic": note.topic,
        "title": note.title,
        "content": note.content,
        "tags": [t.strip() for t in note.tags.split(",") if t.strip()] if note.tags else [],
        "created_at": note.created_at.isoformat(),
        "updated_at": note.updated_at.isoformat()
    }

@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else 1
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    db.delete(note)
    db.commit()
    return {"status": "success", "deleted_id": note_id}
