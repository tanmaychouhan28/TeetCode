import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import MockInterview, Problem, User
from ..schemas import MockInterviewStartRequest, MockInterviewStepRequest
from ..ai_engine import AICoachEngine
from ..auth import get_current_user_optional

router = APIRouter(prefix="/api/mock-interview", tags=["Mock Interview Simulator"])

@router.post("/start")
def start_interview(
    req: MockInterviewStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    # Select a problem matching topic/difficulty or default to Number of Islands
    problem = db.query(Problem).filter(Problem.topics.ilike(f"%{req.topic}%")).first()
    if not problem:
        problem = db.query(Problem).first()

    problem_data = {
        "id": problem.id,
        "title": problem.title,
        "difficulty": problem.difficulty,
        "description": problem.description,
        "optimal_time": problem.optimal_time_complexity,
        "starter_code": json.loads(problem.starter_code) if isinstance(problem.starter_code, str) else {}
    }

    initial_interviewer_msg = (
        f"Hello! Welcome to your {req.company_type} technical coding interview. "
        f"Today we'll be working through **{problem.title}** ({req.difficulty}).\n\n"
        f"**Problem Statement**:\n{problem.description}\n\n"
        f"To get started, please **explain your high-level approach** in your own words before writing code: "
        f"What data structures are you considering, and how will you address the core constraints?"
    )

    transcript = [
        {"role": "assistant", "content": initial_interviewer_msg, "step": 1}
    ]

    user_id = current_user.id if current_user else 1
    interview = MockInterview(
        user_id=user_id,
        company_type=req.company_type,
        difficulty=req.difficulty,
        topic=req.topic,
        duration_minutes=req.duration_minutes,
        current_step=1,
        status="in_progress",
        problem_data=json.dumps(problem_data),
        transcript=json.dumps(transcript)
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)

    return {
        "interview_id": interview.id,
        "step": 1,
        "problem": problem_data,
        "transcript": transcript
    }

@router.post("/step")
def interview_step(req: MockInterviewStepRequest, db: Session = Depends(get_db)):
    interview = db.query(MockInterview).filter(MockInterview.id == req.interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found")

    transcript = json.loads(interview.transcript) if interview.transcript else []
    problem_data = json.loads(interview.problem_data) if interview.problem_data else {}

    # Append user response
    transcript.append({
        "role": "user",
        "content": req.user_input,
        "step": req.step,
        "code": req.code
    })

    next_step = req.step + 1
    assistant_reply = ""

    if req.step == 1:
        # User just explained approach -> Prompt for Complexity & Trade-offs
        assistant_reply = (
            "Good breakdown of the high-level strategy. "
            "Before we dive into implementation: **What are the expected Time and Space complexities** of this proposed algorithm? "
            "Are there any specific trade-offs or alternate approaches you considered?"
        )
    elif req.step == 2:
        # User discussed complexity -> Prompt for Live Code
        assistant_reply = (
            "Understood. The complexity analysis makes sense. "
            "Now let's jump into the editor on the right: **Implement the complete solution in your chosen language.** "
            "Focus on clean code, edge cases (e.g. empty inputs, single element), and idiomatic syntax."
        )
    elif req.step == 3:
        # User submitted code -> Follow-up & Edge cases
        assistant_reply = (
            "Thanks for writing the code. Let's inspect potential edge cases:\n\n"
            "1. What happens if the input size `N` is 0 or contains duplicate values?\n"
            "2. How would you modify your solution if memory was strictly constrained to O(1) auxiliary space?"
        )
    else:
        # Step 4: Final wrap up and generation of comprehensive interview report
        next_step = 5
        interview.status = "completed"
        report_obj = AICoachEngine.evaluate_mock_interview(transcript, req.code or "", problem_data.get("title", "DSA Problem"))
        interview.final_report = json.dumps(report_obj.model_dump())
        assistant_reply = (
            "Excellent job completing the interview session! "
            "I've compiled your comprehensive performance report across Problem Solving, Communication, Code Quality, and Complexity Analysis below."
        )

    transcript.append({
        "role": "assistant",
        "content": assistant_reply,
        "step": next_step
    })

    interview.current_step = next_step
    interview.transcript = json.dumps(transcript)
    db.commit()

    return {
        "interview_id": interview.id,
        "step": next_step,
        "status": interview.status,
        "transcript": transcript,
        "final_report": json.loads(interview.final_report) if interview.final_report else None
    }

@router.get("/{interview_id}")
def get_interview(interview_id: int, db: Session = Depends(get_db)):
    interview = db.query(MockInterview).filter(MockInterview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    return {
        "interview_id": interview.id,
        "company_type": interview.company_type,
        "difficulty": interview.difficulty,
        "topic": interview.topic,
        "duration_minutes": interview.duration_minutes,
        "current_step": interview.current_step,
        "status": interview.status,
        "problem": json.loads(interview.problem_data) if interview.problem_data else {},
        "transcript": json.loads(interview.transcript) if interview.transcript else [],
        "final_report": json.loads(interview.final_report) if interview.final_report else None
    }
