from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = "Tanmay"

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    streak: int
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Problem Schemas
class ProblemListItem(BaseModel):
    id: int
    slug: str
    title: str
    difficulty: str
    topics: List[str]
    estimated_time: str
    acceptance_rate: float
    is_solved: Optional[bool] = False
    is_attempted: Optional[bool] = False

class ProblemDetail(BaseModel):
    id: int
    slug: str
    title: str
    difficulty: str
    topics: List[str]
    description: str
    constraints: List[str]
    examples: List[Dict[str, Any]]
    starter_code: Dict[str, str]
    test_cases: List[Dict[str, Any]]
    hints: List[Dict[str, Any]]
    solution_explanation: Optional[str] = None
    optimal_time_complexity: str
    optimal_space_complexity: str
    estimated_time: str

# Code Execution Schemas
class CodeRunRequest(BaseModel):
    problem_id: int
    language: str # python, javascript, cpp, java
    code: str
    custom_testcase: Optional[str] = None

class TestCaseResult(BaseModel):
    input: str
    expected_output: str
    actual_output: str
    passed: bool
    execution_time_ms: float
    error: Optional[str] = None

class CodeRunResponse(BaseModel):
    status: str # Accepted, Wrong Answer, Runtime Error, Time Limit Exceeded, Compilation Error
    passed_count: int
    total_count: int
    execution_time_ms: float
    memory_kb: float
    results: List[TestCaseResult]
    stdout: Optional[str] = None
    stderr: Optional[str] = None

# Submission & AI Review Schemas
class SubmissionCreate(BaseModel):
    problem_id: int
    language: str
    code: str

class CodeQualityScore(BaseModel):
    readability: str
    variable_naming: str
    unnecessary_operations: str
    edge_cases: str
    code_structure: str

class AIReviewResponse(BaseModel):
    correctness: str
    mistake_detection: Optional[str] = None
    time_complexity: str
    space_complexity: str
    time_complexity_optimal: str
    space_complexity_optimal: str
    code_quality: CodeQualityScore
    overall_summary: str
    recommendations: List[str]

# AI Coaching Chat Schemas
class AICoachMessage(BaseModel):
    role: str # user or assistant
    content: str

class AICoachChatRequest(BaseModel):
    problem_id: int
    code: Optional[str] = ""
    language: Optional[str] = "python"
    messages: List[AICoachMessage]
    action_type: Optional[str] = "chat" # chat, hint, explain_concept, check_approach, find_mistake, explain_complexity, show_solution
    hint_level: Optional[int] = 1 # 1 to 5
    socratic_mode: Optional[bool] = True

class AICoachChatResponse(BaseModel):
    reply: str
    hint_level_provided: Optional[int] = None
    suggested_questions: Optional[List[str]] = []
    concept_breakdown: Optional[Dict[str, str]] = None

# Mock Interview Schemas
class MockInterviewStartRequest(BaseModel):
    company_type: str = "Top Tech / FAANG"
    difficulty: str = "Medium"
    topic: str = "Graphs"
    duration_minutes: int = 45

class MockInterviewStepRequest(BaseModel):
    interview_id: int
    step: int # 1: Approach, 2: Complexity, 3: Code, 4: Followup
    user_input: str
    code: Optional[str] = None
    language: Optional[str] = "python"

class MockInterviewReport(BaseModel):
    problem_solving: str
    communication: str
    algorithm_choice: str
    code_quality: str
    complexity_analysis: str
    edge_cases: str
    strengths: List[str]
    areas_for_improvement: List[str]
    verdict: str

# Practice Generation
class PracticeGenerateRequest(BaseModel):
    topic: str
    difficulty: str
    count: int = 5
    goal: str = "Prepare for interviews"

# Notes
class NoteCreate(BaseModel):
    topic: str
    title: str
    content: str
    tags: Optional[str] = ""

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    topic: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[str] = None
