from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Problem
from ..schemas import AICoachChatRequest, AICoachChatResponse
from ..ai_engine import AICoachEngine

router = APIRouter(prefix="/api/ai", tags=["AI Coach"])

@router.post("/coach/chat", response_model=AICoachChatResponse)
def coach_chat(req: AICoachChatRequest, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == req.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    messages_list = [{"role": m.role, "content": m.content} for m in req.messages]

    res = AICoachEngine.generate_coach_response(
        problem=problem,
        user_code=req.code or "",
        language=req.language or "python",
        messages=messages_list,
        action_type=req.action_type or "chat",
        hint_level=req.hint_level or 1,
        socratic_mode=req.socratic_mode if req.socratic_mode is not None else True
    )

    return AICoachChatResponse(**res)
