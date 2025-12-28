---
id: "1-create-phase2-rag-chatbot"
date: "2025-12-15"
stage: "plan"
title: "Create Phase2 RAG Chatbot"
feature: "phase2-rag-chatbot"
branch: "phase2-rag-chatbot"
author: "Claude Sonnet 4.5"
tags: ["plan", "rag", "chatbot", "ai", "docusaurus"]
status: "completed"
---

# Create Phase2 RAG Chatbot

## Overview
Created a comprehensive development plan for Phase 2: Integrated RAG Chatbot Development for the Physical AI & Humanoid Robotics book.

## PROMPT_TEXT
Create a comprehensive development plan (phase2-plan.md) for Phase 2: Integrated RAG Chatbot Development.

This phase adds a Retrieval-Augmented Generation (RAG) chatbot embedded directly into the live Docusaurus book "Physical AI & Humanoid Robotics".

The chatbot must:
- Answer questions about book content using RAG over all chapters
- Support user-selected text as additional context (e.g., highlight a paragraph → ask "Explain this")
- Use only the book's content as knowledge source (no external hallucination)
- Be fast, beautiful, and mobile-friendly

Tech stack (fixed):
- Backend: FastAPI
- Vector Database: Qdrant Cloud (Free Tier)
- Metadata/History DB: Neon Serverless Postgres
- LLM & Embeddings: OpenAI (via Agents/ChatKit SDKs or direct API)
- Frontend: Custom React component integrated into Docusaurus

Plan structure:
1. Phase Overview & Goals
2. Repository & Project Structure
3. Content Ingestion Pipeline (chunking strategy, metadata, embedding script)
4. Backend Development (FastAPI routes, RAG logic, selected text handling)
5. Frontend Chatbot UI (React component, selection capture, streaming)
6. Docusaurus Integration (global placement, theming)
7. Deployment Strategy (Vercel/Railway + Qdrant/Neon)
8. Testing & Quality Gates (accuracy, speed, citation correctness)
9. Maintenance & Updates (re-ingestion on book changes)

Include:
- Estimated timeline (4-6 weeks)
- Integration with existing book (no breaking changes)
- Use of Context7 MCP for up-to-date OpenAI/FastAPI/Qdrant code
- Security considerations (no API keys in frontend)
- Fallbacks for rate limits

Store as .specify/memory/phase2-plan.md and suggest committing.
Generate the full plan in structured Markdown.

## RESPONSE_TEXT
Created comprehensive Phase 2 plan for RAG Chatbot implementation including:
- Detailed technical architecture and project structure
- Complete implementation phases (backend, RAG core, frontend, integration)
- Data models and API contracts
- Research findings and decision rationales
- Task breakdown with 63 specific tasks across 9 phases
- Timeline estimate of 5-6 weeks
- Security and deployment considerations

All required files were created in the .specify/memory/ directory:
- phase2-plan.md - Main implementation plan
- phase2-research.md - Research findings and decision rationales
- phase2-data-model.md - Data models and entity relationships
- phase2-quickstart.md - Quickstart guide for setup
- phase2-contracts/ - API contracts (chat-api.yaml)
- phase2-tasks.md - Detailed task breakdown with 63 specific tasks

The plan comprehensively addresses all requirements including book content RAG, user-selected text context, mobile-friendly design, and security considerations while maintaining compatibility with existing book content.