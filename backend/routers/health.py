"""
API router for health check functionality
"""
from fastapi import APIRouter
import logging
from datetime import datetime
import asyncio

from config.settings import settings

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/")
async def health_check():
    """
    Main health check endpoint

    Returns:
        Health status information for the entire service
    """
    try:
        # Perform basic health checks
        health_status = {
            "status": "healthy",
            "service": "Physical AI & Humanoid Robotics RAG Chatbot API",
            "version": "1.0.0",
            "timestamp": datetime.utcnow().isoformat(),
            "uptime": "calculated uptime would go here",
            "dependencies": {
                "qdrant": await check_qdrant_health(),
                "openai": await check_openai_health(),
                "postgres": await check_postgres_health()
            }
        }

        # Determine overall status based on dependencies
        all_healthy = all(
            status.get("status") == "healthy"
            for status in health_status["dependencies"].values()
            if isinstance(status, dict)
        )

        health_status["overall_status"] = "healthy" if all_healthy else "degraded"

        logger.info("Health check completed successfully")
        return health_status

    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "service": "Physical AI & Humanoid Robotics RAG Chatbot API",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e),
            "dependencies": {
                "qdrant": {"status": "unknown", "error": "Health check failed"},
                "openai": {"status": "unknown", "error": "Health check failed"},
                "postgres": {"status": "unknown", "error": "Health check failed"}
            }
        }

async def check_qdrant_health():
    """
    Check the health of the Qdrant vector database connection

    Returns:
        Dictionary with health status information
    """
    try:
        from qdrant_client import AsyncQdrantClient

        client = AsyncQdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )

        # Try to connect and get collections
        collections = await client.get_collections()

        return {
            "status": "healthy",
            "collections_count": len(collections.collections),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.warning(f"Qdrant health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

async def check_openai_health():
    """
    Check the health of the OpenAI API connection

    Returns:
        Dictionary with health status information
    """
    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

        # Try a simple API call to test connectivity
        response = await client.models.list()

        return {
            "status": "healthy",
            "models_available": len(response.data),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.warning(f"OpenAI health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

async def check_postgres_health():
    """
    Check the health of the PostgreSQL database connection

    Returns:
        Dictionary with health status information
    """
    try:
        import asyncpg

        # Connect to the database and run a simple query
        conn = await asyncpg.connect(dsn=settings.DATABASE_URL)
        result = await conn.fetchval("SELECT 1")
        await conn.close()

        return {
            "status": "healthy",
            "connection_test": result == 1,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.warning(f"PostgreSQL health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@router.get("/ready")
async def readiness_check():
    """
    Readiness check for the service

    Returns:
        Readiness status information
    """
    try:
        # For readiness, check if the service is ready to accept traffic
        # This typically means all initialization is complete

        # Check if RAG service is properly initialized
        from services.rag_service import rag_service
        try:
            # Attempt to initialize collection if needed
            await rag_service.initialize_collection()

            readiness_status = {
                "status": "ready",
                "service": "Physical AI & Humanoid Robotics RAG Chatbot",
                "timestamp": datetime.utcnow().isoformat(),
                "ready_services": ["rag", "embedding", "qdrant", "openai"]
            }

            return readiness_status
        except Exception as e:
            logger.error(f"Service not ready: {str(e)}")
            return {
                "status": "not_ready",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

    except Exception as e:
        logger.error(f"Readiness check failed: {str(e)}")
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@router.get("/alive")
async def liveness_check():
    """
    Liveness check for the service

    Returns:
        Liveness status information
    """
    # Liveness check verifies if the service is running
    liveness_status = {
        "status": "alive",
        "service": "Physical AI & Humanoid Robotics RAG Chatbot",
        "timestamp": datetime.utcnow().isoformat(),
        "process_info": {
            "pid": "process id would go here",
            "memory_usage": "memory usage would go here"
        }
    }

    return liveness_status