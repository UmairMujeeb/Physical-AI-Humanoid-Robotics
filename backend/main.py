from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Import routers
from routers import chat, documents, health

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler for startup and shutdown events
    """
    logger.info("Starting up RAG Chatbot backend...")
    # Startup logic can go here
    yield
    # Shutdown logic can go here
    logger.info("Shutting down RAG Chatbot backend...")

# Create FastAPI app instance
app = FastAPI(
    title="Physical AI & Humanoid Robotics RAG Chatbot API",
    description="API for the RAG-powered chatbot that answers questions based on book content",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(documents.router, prefix="/api", tags=["documents"])
app.include_router(health.router, prefix="/api", tags=["health"])

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Physical AI & Humanoid Robotics RAG Chatbot API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)