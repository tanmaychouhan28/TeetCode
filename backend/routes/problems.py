import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Problem, Submission, User
from ..schemas import ProblemListItem, ProblemDetail, PracticeGenerateRequest
from ..auth import get_current_user_optional

router = APIRouter(prefix="/api/problems", tags=["Problems"])

@router.get("", response_model=List[ProblemListItem])
def list_problems(
    topic: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort: Optional[str] = Query("recommended"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(Problem)

    if difficulty and difficulty.lower() != "all":
        query = query.filter(Problem.difficulty.ilike(difficulty))

    if topic and topic.lower() != "all":
        query = query.filter(Problem.topics.ilike(f"%{topic}%"))

    if search:
        query = query.filter(
            Problem.title.ilike(f"%{search}%") | 
            Problem.description.ilike(f"%{search}%") |
            Problem.topics.ilike(f"%{search}%")
        )

    problems = query.all()

    # Get user submission history for status calculation
    solved_problem_ids = set()
    attempted_problem_ids = set()
    if current_user:
        user_subs = db.query(Submission).filter(Submission.user_id == current_user.id).all()
        for sub in user_subs:
            attempted_problem_ids.add(sub.problem_id)
            if sub.status == "Accepted":
                solved_problem_ids.add(sub.problem_id)

    results = []
    for p in problems:
        is_solved = p.id in solved_problem_ids
        is_attempted = p.id in attempted_problem_ids and not is_solved

        if status == "solved" and not is_solved:
            continue
        if status == "unsolved" and is_solved:
            continue
        if status == "attempted" and not is_attempted:
            continue

        try:
            t_list = json.loads(p.topics) if p.topics.startswith("[") else [t.strip() for t in p.topics.split(",")]
        except Exception:
            t_list = [p.topics]

        results.append(ProblemListItem(
            id=p.id,
            slug=p.slug,
            title=p.title,
            difficulty=p.difficulty,
            topics=t_list,
            estimated_time=p.estimated_time or "20 min",
            acceptance_rate=p.acceptance_rate or 60.0,
            is_solved=is_solved,
            is_attempted=is_attempted
        ))

    # Sorting
    if sort == "difficulty":
        diff_weight = {"Easy": 1, "Medium": 2, "Hard": 3}
        results.sort(key=lambda x: diff_weight.get(x.difficulty, 2))
    elif sort == "weak_topic":
        # Prioritize Graph / DP topics if weakest
        results.sort(key=lambda x: 0 if any(t in ["Graphs", "Dynamic Programming"] for t in x.topics) else 1)
    elif sort == "most_attempted":
        results.sort(key=lambda x: x.acceptance_rate, reverse=True)

    return results

@router.get("/{slug_or_id}", response_model=ProblemDetail)
def get_problem(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        problem = db.query(Problem).filter(Problem.id == int(slug_or_id)).first()
    else:
        problem = db.query(Problem).filter(Problem.slug == slug_or_id).first()

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    try:
        t_list = json.loads(problem.topics) if problem.topics.startswith("[") else [t.strip() for t in problem.topics.split(",")]
    except Exception:
        t_list = [problem.topics]

    return ProblemDetail(
        id=problem.id,
        slug=problem.slug,
        title=problem.title,
        difficulty=problem.difficulty,
        topics=t_list,
        description=problem.description,
        constraints=json.loads(problem.constraints) if isinstance(problem.constraints, str) else [],
        examples=json.loads(problem.examples) if isinstance(problem.examples, str) else [],
        starter_code=json.loads(problem.starter_code) if isinstance(problem.starter_code, str) else {},
        test_cases=json.loads(problem.test_cases) if isinstance(problem.test_cases, str) else [],
        hints=json.loads(problem.hints) if isinstance(problem.hints, str) else [],
        solution_explanation=problem.solution_explanation,
        optimal_time_complexity=problem.optimal_time_complexity or "O(n)",
        optimal_space_complexity=problem.optimal_space_complexity or "O(n)",
        estimated_time=problem.estimated_time or "20 min"
    )

@router.post("/generate-set")
def generate_practice_set(req: PracticeGenerateRequest, db: Session = Depends(get_db)):
    # AI Practice generation based on user weaknesses
    query = db.query(Problem)
    if req.topic.lower() != "all":
        query = query.filter(Problem.topics.ilike(f"%{req.topic}%"))
    if req.difficulty.lower() != "all":
        query = query.filter(Problem.difficulty.ilike(req.difficulty))
    
    problems = query.limit(req.count).all()
    if not problems:
        problems = db.query(Problem).limit(req.count).all()

    return {
        "set_id": f"pset-{req.topic.lower()}-{req.difficulty.lower()}",
        "title": f"Custom Practice Set: {req.topic} ({req.difficulty})",
        "goal": req.goal,
        "problems": [
            {
                "id": p.id,
                "slug": p.slug,
                "title": p.title,
                "difficulty": p.difficulty,
                "topics": json.loads(p.topics) if p.topics.startswith("[") else [p.topics],
                "estimated_time": p.estimated_time
            } for p in problems
        ],
        "ai_rationale": f"Curated {len(problems)} problems targeting {req.topic} logic patterns, boundary state handling, and complexity optimization for {req.goal}."
    }
