from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Submission, Problem
from ..auth import get_current_user_optional

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Progress"])

@router.get("")
def get_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    # Solved over time data (last 8 weeks)
    velocity_history = [
        {"week": "Week 1", "solved": 8, "accuracy": 70},
        {"week": "Week 2", "solved": 14, "accuracy": 72},
        {"week": "Week 3", "solved": 18, "accuracy": 75},
        {"week": "Week 4", "solved": 15, "accuracy": 74},
        {"week": "Week 5", "solved": 21, "accuracy": 80},
        {"week": "Week 6", "solved": 19, "accuracy": 79},
        {"week": "Week 7", "solved": 16, "accuracy": 78},
        {"week": "Week 8 (Current)", "solved": 16, "accuracy": 81},
    ]

    # Topic performance statistics
    topic_breakdown = [
        {"topic": "Arrays", "accuracy": 82, "solved": 24, "total": 30, "status": "Strong"},
        {"topic": "Strings", "accuracy": 76, "solved": 19, "total": 25, "status": "Strong"},
        {"topic": "Stack & Queue", "accuracy": 72, "solved": 24, "total": 35, "status": "Proficient"},
        {"topic": "Linked Lists", "accuracy": 65, "solved": 14, "total": 20, "status": "Proficient"},
        {"topic": "Binary Search", "accuracy": 74, "solved": 16, "total": 22, "status": "Proficient"},
        {"topic": "Trees & BST", "accuracy": 44, "solved": 20, "total": 44, "status": "Needs Practice"},
        {"topic": "Heap / Priority Queue", "accuracy": 49, "solved": 7, "total": 18, "status": "Needs Practice"},
        {"topic": "Graphs", "accuracy": 31, "solved": 8, "total": 30, "status": "Weakest"},
        {"topic": "Dynamic Programming", "accuracy": 18, "solved": 5, "total": 35, "status": "Critical Focus"}
    ]

    difficulty_distribution = {
        "easy": {"solved": 62, "total": 75, "percentage": 82.6},
        "medium": {"solved": 51, "total": 85, "percentage": 60.0},
        "hard": {"solved": 14, "total": 40, "percentage": 35.0}
    }

    common_mistakes = [
        {
            "type": "Off-by-one errors",
            "frequency": 32,
            "description": "Subarray slice boundaries or pointer updates exceeding valid range.",
            "remediation": "Always verify inclusive vs exclusive loop condition bounds before running."
        },
        {
            "type": "Missing edge cases",
            "frequency": 28,
            "description": "Failing to handle null/empty containers, single element inputs, or all-negative values.",
            "remediation": "Establish 3 guard clauses at the very start of every function."
        },
        {
            "type": "Incorrect recursion base case",
            "frequency": 18,
            "description": "Infinite recursion or returning 0 instead of infinity for invalid paths.",
            "remediation": "Draw the 2-level base recursion tree explicitly before coding."
        },
        {
            "type": "Wrong complexity",
            "frequency": 14,
            "description": "Unintentionally generating O(n²) operations inside inner loops or string concatenation.",
            "remediation": "Use array join / StringBuilder and replace nested lookups with Hash Sets."
        },
        {
            "type": "Incorrect visited handling",
            "frequency": 8,
            "description": "Forgetting to mark nodes as visited during BFS/DFS queue pushes, leading to cycles.",
            "remediation": "Mark visited at the moment of queue enqueue, not upon dequeue."
        }
    ]

    return {
        "summary": {
            "problems_solved": 127,
            "current_streak": 14,
            "accuracy": 78,
            "weakest_topic": "Graphs",
            "total_attempts": 163,
            "active_days_this_month": 24
        },
        "velocity_history": velocity_history,
        "topic_breakdown": topic_breakdown,
        "difficulty_distribution": difficulty_distribution,
        "common_mistakes": common_mistakes
    }
