import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .seed_data import seed_database
from .routes import auth, problems, submissions, ai_coach, mock_interview, roadmap, analytics, notes

# Create tables and seed data
Base.metadata.create_all(bind=engine)
try:
    seed_database()
except Exception as e:
    print(f"Seed info: {e}")

app = FastAPI(
    title="TeetCode API",
    description="Precision AI-Powered Data Structures & Algorithms Mastery Platform",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route routers
app.include_router(auth.router)
app.include_router(problems.router)
app.include_router(submissions.router)
app.include_router(ai_coach.router)
app.include_router(mock_interview.router)
app.include_router(roadmap.router)
app.include_router(analytics.router)
app.include_router(notes.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "TeetCode Platform API",
        "version": "2.0.0",
        "color_palette": "leetcode_dark_mode"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
