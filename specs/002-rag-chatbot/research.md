# Research Findings: Physical AI & Humanoid Robotics RAG Chatbot

## Decision: Text Chunking Strategy
**Rationale**: Selected RecursiveCharacterTextSplitter with 1000-2000 character chunks and 200 character overlap to preserve context while enabling efficient retrieval.
**Alternatives considered**:
- Sentence-based splitting (too granular for context)
- Fixed-size splitting (risk of cutting important concepts)
- Semantic splitting (more complex, potential performance issues)

## Decision: Vector Database Provider
**Rationale**: Qdrant Cloud Free Tier chosen for its balance of performance, ease of use, and generous free tier suitable for book-sized dataset.
**Alternatives considered**:
- Pinecone (commercial focus, less flexible free tier)
- Weaviate (self-hosting required for full control)
- ChromaDB (local-only, not suitable for deployment)

## Decision: Embedding Model
**Rationale**: OpenAI text-embedding-ada-002 selected for consistency with GPT models and proven performance for document retrieval.
**Alternatives considered**:
- Sentence Transformers (local, but lower accuracy)
- Cohere embeddings (different ecosystem, potential integration issues)
- Custom embeddings (development overhead, likely lower quality)

## Decision: Frontend Integration Method
**Rationale**: Docusaurus plugin approach chosen to maintain tight integration with existing documentation structure while preserving all existing functionality.
**Alternatives considered**:
- Standalone page (would fragment user experience)
- Iframe embedding (cross-origin issues, styling difficulties)
- Widget approach (more complex state management)

## Decision: Conversation Storage
**Rationale**: Neon Serverless Postgres selected for its serverless scalability, PostgreSQL compatibility, and generous free tier appropriate for conversation history.
**Alternatives considered**:
- SQLite (not suitable for concurrent access)
- MongoDB (different skill set, more complex for relational data)
- Firebase (vendor lock-in, potentially more expensive at scale)

## Decision: API Architecture
**Rationale**: FastAPI chosen for its performance, automatic API documentation, and strong type validation that reduces errors.
**Alternatives considered**:
- Flask (slower, less automatic documentation)
- Express.js (different language ecosystem)
- Django REST Framework (heavier, overkill for this use case)

## Decision: Security Model
**Rationale**: Backend-only API keys with frontend proxy ensures security while maintaining good user experience.
**Alternatives considered**:
- Direct frontend API calls (security risk)
- Environment-specific keys (complexity without benefit)
- Token-based authentication (unnecessary for this use case)

## Decision: UI Framework
**Rationale**: Custom React components using Docusaurus theme for seamless integration and maximum customization control.
**Alternatives considered**:
- Third-party chat widgets (limited customization)
- Pre-built chat solutions (poor integration with book content)
- Vanilla JavaScript (increased complexity for state management)

## Decision: RAG Strategy
**Rationale**: Hybrid approach using both semantic search and keyword matching to maximize relevant document retrieval.
**Alternatives considered**:
- Pure semantic search (might miss relevant documents with different terminology)
- Pure keyword search (might return irrelevant documents)
- Graph-based retrieval (overly complex for book content)

## Decision: Conversation Memory Management
**Rationale**: Sliding window approach with token-based limits to maintain conversation context while managing costs and performance.
**Alternatives considered**:
- Full conversation history (cost prohibitive)
- Fixed message limits (might lose important context)
- Summarization approach (potential loss of detail)