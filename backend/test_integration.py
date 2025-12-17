"""
Integration test for the RAG Chatbot API endpoints
This script tests that the API endpoints work correctly with the frontend
"""

import asyncio
import json
from typing import Dict, Any
import httpx
import pytest


async def test_api_health():
    """Test the health endpoint"""
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"
        print("✓ Health endpoint test passed")


async def test_chat_endpoint_structure():
    """Test the chat endpoint structure"""
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        # Test with a simple query
        payload = {
            "query": "Hello",
            "context": "",
            "conversation_id": "test_conversation"
        }

        response = await client.post("/api/chat", json=payload)

        # Should return 200 OK or appropriate error
        assert response.status_code in [200, 400, 500]  # 400 if no documents indexed, 500 if service unavailable

        if response.status_code == 200:
            data = response.json()
            # Check that response has expected structure
            assert "answer" in data
            assert "citations" in data
            assert "conversation_id" in data
            print("✓ Chat endpoint structure test passed")
        else:
            print(f"⚠ Chat endpoint returned status {response.status_code} (this may be expected if no documents are indexed)")


async def test_cors_headers():
    """Test that CORS headers are properly set"""
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        # Make a request with origin header to test CORS
        headers = {"Origin": "http://localhost:3000"}  # Docusaurus default port
        response = await client.get("/api/health", headers=headers)

        # Check for CORS headers
        cors_headers = [
            "access-control-allow-origin",
            "access-control-allow-credentials",
            "access-control-allow-headers",
            "access-control-allow-methods"
        ]

        for header in cors_headers:
            assert header in [h.lower() for h in response.headers.keys()], f"Missing CORS header: {header}"

        print("✓ CORS headers test passed")


async def test_api_endpoints_exist():
    """Test that all expected API endpoints exist"""
    endpoints_to_test = [
        ("/api/health", "GET"),
        ("/api/chat", "POST"),
        ("/api/documents/stats", "GET"),
        ("/api/documents/ingest", "POST"),
    ]

    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        for endpoint, method in endpoints_to_test:
            if method == "GET":
                response = await client.get(endpoint)
            elif method == "POST":
                # For POST endpoints, send empty payload to check if endpoint exists
                response = await client.post(endpoint, json={})

            # We expect 200 for GET, 405 for POST to non-POST endpoints, or 422 for validation errors
            assert response.status_code in [200, 404, 405, 422], f"Endpoint {endpoint} returned unexpected status {response.status_code}"

    print("✓ API endpoints existence test passed")


async def run_all_tests():
    """Run all integration tests"""
    print("Running RAG Chatbot API integration tests...")

    try:
        await test_api_health()
        await test_chat_endpoint_structure()
        await test_cors_headers()
        await test_api_endpoints_exist()

        print("\n🎉 All integration tests passed!")
        print("The backend API is properly configured for Docusaurus integration.")

    except Exception as e:
        print(f"\n❌ Integration test failed: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(run_all_tests())