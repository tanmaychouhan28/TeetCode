import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Problem, Submission, User
from ..schemas import CodeRunRequest, CodeRunResponse, SubmissionCreate, AIReviewResponse
from ..runner import execute_code
from ..ai_engine import AICoachEngine
from ..auth import get_current_user_optional

router = APIRouter(prefix="/api/code", tags=["Code Execution & Submissions"])

@router.post("/run", response_model=CodeRunResponse)
def run_code(req: CodeRunRequest, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == req.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    raw_test_cases = json.loads(problem.test_cases) if isinstance(problem.test_cases, str) else []
    
    # If custom test case provided, append or use it
    if req.custom_testcase and req.custom_testcase.strip():
        test_cases = [{
            "input": req.custom_testcase.strip(),
            "expected_output": "Custom Run",
            "is_hidden": False
        }]
    else:
        # Run on public visible test cases
        test_cases = [tc for tc in raw_test_cases if not tc.get("is_hidden", False)]
        if not test_cases:
            test_cases = raw_test_cases

    res = execute_code(req.language, req.code, test_cases, problem_slug=problem.slug)
    return CodeRunResponse(**res)

@router.post("/submit")
def submit_code(
    req: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    problem = db.query(Problem).filter(Problem.id == req.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    # Run on all test cases (both public and hidden)
    all_test_cases = json.loads(problem.test_cases) if isinstance(problem.test_cases, str) else []
    exec_res = execute_code(req.language, req.code, all_test_cases, problem_slug=problem.slug)

    # Generate AI Code Review & Mistake Detection
    ai_review_obj = AICoachEngine.generate_code_review(problem, req.code, req.language, exec_res)
    ai_review_dict = ai_review_obj.model_dump()

    user_id = current_user.id if current_user else 1

    submission = Submission(
        user_id=user_id,
        problem_id=problem.id,
        language=req.language,
        code=req.code,
        status=exec_res.get("status", "Accepted"),
        passed_tests=exec_res.get("passed_count", 0),
        total_tests=exec_res.get("total_count", len(all_test_cases)),
        execution_time_ms=exec_res.get("execution_time_ms", 0.0),
        memory_kb=exec_res.get("memory_kb", 14200.0),
        ai_review=json.dumps(ai_review_dict)
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "submission_id": submission.id,
        "execution": exec_res,
        "ai_review": ai_review_dict
    }

@router.get("/submissions/{problem_id}")
def get_submissions_for_problem(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else 1
    subs = db.query(Submission).filter(
        Submission.problem_id == problem_id,
        Submission.user_id == user_id
    ).order_by(Submission.created_at.desc()).limit(10).all()

    return [
        {
            "id": s.id,
            "status": s.status,
            "language": s.language,
            "passed_tests": s.passed_tests,
            "total_tests": s.total_tests,
            "execution_time_ms": s.execution_time_ms,
            "memory_kb": s.memory_kb,
            "created_at": s.created_at.isoformat(),
            "ai_review": json.loads(s.ai_review) if s.ai_review else None
        } for s in subs
    ]
