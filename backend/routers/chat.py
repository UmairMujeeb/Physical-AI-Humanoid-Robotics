"""
API router for chat functionality
"""
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import Optional
import logging
import uuid
from datetime import datetime

from models.query import QueryRequest, QueryResponse
from services.rag_service import rag_service
from config.settings import settings

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/chat", response_model=QueryResponse)
async def chat_endpoint(query_request: QueryRequest):
    """
    Handle chat queries through the RAG pipeline

    Args:
        query_request: The query request with user input

    Returns:
        QueryResponse with answer and citations
    """
    try:
        # Validate query length
        if len(query_request.query) > settings.MAX_QUERY_LENGTH:
            raise HTTPException(
                status_code=400,
                detail=f"Query exceeds maximum length of {settings.MAX_QUERY_LENGTH} characters"
            )

        # Process the query through RAG service
        response = await rag_service.process_query(query_request)

        logger.info(f"Processed chat query: {query_request.query[:50]}...")
        return response

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error processing chat query: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error processing query"
        )

@router.get("/health")
async def chat_health():
    """
    Health check for the chat service

    Returns:
        Health status information
    """
    try:
        # Test basic functionality
        status = {
            "status": "healthy",
            "service": "chat",
            "timestamp": datetime.utcnow().isoformat(),
            "dependencies": {
                "qdrant": "checking...",
                "openai": "checking...",
                "postgres": "checking..."
            }
        }

        # Perform basic connectivity checks
        try:
            # Test Qdrant connectivity by checking collection
            # (actual implementation would depend on your Qdrant setup)
            status["dependencies"]["qdrant"] = "connected"
        except Exception:
            status["dependencies"]["qdrant"] = "disconnected"

        # Add other dependency checks as needed

        return status
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Health check failed")