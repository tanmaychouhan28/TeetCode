import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), default="Tanmay")
    hashed_password = Column(String(255), nullable=False)
    streak = Column(Integer, default=14)
    last_active = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    submissions = relationship("Submission", back_populates="user")
    notes = relationship("Note", back_populates="user")
    interviews = relationship("MockInterview", back_populates="user")

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    difficulty = Column(String(50), nullable=False) # Easy, Medium, Hard
    topics = Column(Text, nullable=False) # Comma-separated or JSON list
    description = Column(Text, nullable=False)
    constraints = Column(Text, nullable=False) # JSON list
    examples = Column(Text, nullable=False) # JSON list of {input, output, explanation}
    starter_code = Column(Text, nullable=False) # JSON map of lang -> code
    test_cases = Column(Text, nullable=False) # JSON list of {input, expected_output, is_hidden}
    hints = Column(Text, nullable=False) # JSON array of 5 progressive hint tiers
    solution_explanation = Column(Text, nullable=True)
    optimal_time_complexity = Column(String(50), default="O(n)")
    optimal_space_complexity = Column(String(50), default="O(n)")
    estimated_time = Column(String(50), default="20 min")
    acceptance_rate = Column(Float, default=65.0)

    submissions = relationship("Submission", back_populates="problem")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    language = Column(String(50), nullable=False)
    code = Column(Text, nullable=False)
    status = Column(String(50), nullable=False) # Accepted, Wrong Answer, Runtime Error, Time Limit Exceeded
    passed_tests = Column(Integer, default=0)
    total_tests = Column(Integer, default=0)
    execution_time_ms = Column(Float, default=0.0)
    memory_kb = Column(Float, default=0.0)
    ai_review = Column(Text, nullable=True) # JSON containing correctness, mistakes, complexity, code quality
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="submissions")
    problem = relationship("Problem", back_populates="submissions")

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic = Column(String(100), default="General")
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    tags = Column(String(255), default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notes")

class MockInterview(Base):
    __tablename__ = "mock_interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_type = Column(String(100), default="Top Tech / FAANG")
    difficulty = Column(String(50), default="Medium")
    topic = Column(String(100), default="Graphs")
    duration_minutes = Column(Integer, default=45)
    current_step = Column(Integer, default=1)
    status = Column(String(50), default="in_progress") # in_progress, completed, abandoned
    problem_data = Column(Text, nullable=True) # JSON problem info
    transcript = Column(Text, default="[]") # JSON list of messages
    final_report = Column(Text, nullable=True) # JSON assessment
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="interviews")
