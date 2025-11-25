from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database.connection import Base, engine
from app.middleware.auth_middleware import AuthMiddleware
from app.models import User, Project, DocumentStructure, Content, RefinementHistory
from app.routes import auth, export, generate, projects, outline

Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(
    title="AI-Assisted Document Authoring API",
    version="0.2.0",
    description="Backend service for generating and refining business documents with Gemini.",
)

cors_origins = [origin.strip() for origin in settings.cors_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)
app.add_middleware(AuthMiddleware)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(generate.router)
app.include_router(export.router)
app.include_router(outline.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}

