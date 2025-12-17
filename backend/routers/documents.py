"""
API router for document management functionality
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, BackgroundTasks
from typing import Optional
import logging
from datetime import datetime

from models.query import DocumentIngestRequest, DocumentIngestResponse
from services.rag_service import rag_service
from config.settings import settings

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/documents/ingest", response_model=DocumentIngestResponse)
async def ingest_documents_endpoint(request: DocumentIngestRequest):
    """
    Ingest documents into the vector database for RAG retrieval

    Args:
        request: Document ingestion request with source path

    Returns:
        DocumentIngestResponse with ingestion statistics
    """
    try:
        # Validate source path
        if not request.source_path or len(request.source_path) == 0:
            raise HTTPException(
                status_code=400,
                detail="Source path is required for document ingestion"
            )

        # Process document ingestion
        result = await rag_service.ingest_documents(
            source_path=request.source_path,
            force_refresh=request.force_refresh
        )

        logger.info(f"Ingested documents from {request.source_path}: {result}")
        return result

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error ingesting documents: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error during document ingestion"
        )

@router.post("/documents/ingest-file")
async def ingest_single_file(file: UploadFile = File(...)):
    """
    Ingest a single document file into the vector database

    Args:
        file: The document file to ingest

    Returns:
        DocumentIngestResponse with ingestion result
    """
    try:
        # Validate file type
        allowed_types = ['text/markdown', 'text/plain', 'application/pdf']
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type {file.content_type} not supported. Allowed types: {allowed_types}"
            )

        # Save uploaded file temporarily
        import tempfile
        import os
        from pathlib import Path

        temp_dir = Path(tempfile.gettempdir()) / "rag_upload"
        temp_dir.mkdir(exist_ok=True)

        temp_file_path = temp_dir / file.filename
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Process document ingestion
        result = await rag_service.ingest_documents(
            source_path=str(temp_file_path.parent),
            force_refresh=True
        )

        # Clean up temporary file
        os.remove(temp_file_path)

        logger.info(f"Ingested single file {file.filename}: {result}")
        return result

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error ingesting single file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error during file ingestion"
        )

@router.get("/documents/stats")
async def get_document_stats():
    """
    Get statistics about indexed documents

    Returns:
        DocumentStatsResponse with document statistics
    """
    try:
        stats = await rag_service.get_document_statistics()
        logger.info(f"Retrieved document statistics: {stats}")
        return stats

    except Exception as e:
        logger.error(f"Error retrieving document stats: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error retrieving document statistics"
        )

@router.get("/documents/health")
async def documents_health():
    """
    Health check for the documents service

    Returns:
        Health status information
    """
    try:
        # Test document service functionality
        stats = await rag_service.get_document_statistics()

        status = {
            "status": "healthy",
            "service": "documents",
            "timestamp": datetime.utcnow().isoformat(),
            "document_count": stats.get("total_documents", 0) if isinstance(stats, dict) else 0,
            "chunk_count": stats.get("total_chunks", 0) if isinstance(stats, dict) else 0
        }

        return status
    except Exception as e:
        logger.error(f"Documents health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Health check failed")