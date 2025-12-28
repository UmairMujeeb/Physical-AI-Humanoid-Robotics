# Data Model: Physical AI & Humanoid Robotics RAG Chatbot

## Core Entities

### DocumentChunk
Represents a segment of book content stored in the vector database for RAG retrieval.

**Fields**:
- `id`: UUID (primary key)
- `content`: String (text content of the chunk)
- `embedding`: Float[] (vector embedding of the content)
- `metadata`: JSON (source document, page/chapter, section)
- `created_at`: DateTime (timestamp of creation)
- `updated_at`: DateTime (timestamp of last update)

**Relationships**:
- Belongs to one source document
- Referenced by many conversation contexts

### Conversation
Tracks user interactions with the chatbot including history and context.

**Fields**:
- `id`: UUID (primary key)
- `user_id`: UUID (identifier for user session)
- `messages`: JSON[] (list of conversation messages)
- `contexts`: JSON[] (list of document contexts used)
- `created_at`: DateTime (timestamp of creation)
- `updated_at`: DateTime (timestamp of last update)

**Relationships**:
- Contains many Message entities
- References many DocumentChunk entities

### Message
Individual message within a conversation.

**Fields**:
- `id`: UUID (primary key)
- `conversation_id`: UUID (foreign key to Conversation)
- `role`: String (either "user" or "assistant")
- `content`: String (message content)
- `citations`: JSON[] (references to DocumentChunks)
- `created_at`: DateTime (timestamp of creation)

**Relationships**:
- Belongs to one Conversation
- References many DocumentChunk entities

### UserSession
Temporary session management for conversation continuity.

**Fields**:
- `id`: UUID (primary key)
- `session_token`: String (encrypted session identifier)
- `expires_at`: DateTime (expiration timestamp)
- `preferences`: JSON (user preferences for chatbot)

**Relationships**:
- Has many Conversation entities

### QueryRequest
Model for incoming queries to the RAG system.

**Fields**:
- `query`: String (user's question)
- `context`: String (selected text context, optional)
- `conversation_id`: UUID (optional, for conversation continuity)
- `temperature`: Float (creativity control, 0.0-1.0)

### QueryResponse
Model for responses from the RAG system.

**Fields**:
- `answer`: String (generated response)
- `citations`: JSON[] (sources used in response)
- `context_used`: String (selected text that was used)
- `tokens_used`: Integer (number of tokens in response)
- `processing_time`: Float (time taken to process query in seconds)

## Validation Rules

### DocumentChunk Validation
- Content length: 100-2000 characters
- Embedding dimension: Must match configured model (1536 for ada-002)
- Metadata must contain source document reference
- Created_at must be before updated_at

### Conversation Validation
- Messages array cannot exceed 50 items (prevent memory issues)
- User_id must be valid UUID
- Updated_at must be after created_at
- Cannot have more than 10 concurrent conversations per user

### Message Validation
- Content length: 1-5000 characters
- Role must be either "user" or "assistant"
- Citations must reference valid DocumentChunk IDs
- Created_at must be in past

### UserSession Validation
- Session token must be encrypted
- Expires_at must be in future
- Preferences must be valid JSON
- Cannot have more than 5 active sessions per user

## State Transitions

### Conversation States
- `active`: New conversation, accepting messages
- `paused`: Conversation temporarily inactive (timeout)
- `completed`: Conversation concluded by user
- `archived`: Old conversation moved for storage efficiency

### Message States
- `pending`: Message sent, waiting for response
- `processing`: Backend is generating response
- `complete`: Response generated and returned
- `error`: Error occurred during processing

## Indexes

### DocumentChunk
- Embedding vector index (for similarity search)
- Source document index (for filtering)
- Created_at index (for temporal queries)

### Conversation
- User_id index (for user lookup)
- Created_at index (for chronological sorting)
- Updated_at index (for recent activity)

### Message
- Conversation_id index (for conversation lookup)
- Created_at index (for chronological ordering)
- Role index (for filtering by sender type)

## Constraints

### Referential Integrity
- DocumentChunk references must exist in source documents
- Conversation references in Message must exist
- UserSession references must exist for active sessions

### Performance Constraints
- DocumentChunk content should not exceed 2KB for optimal performance
- Conversation history limited to 50 messages to prevent memory issues
- Embedding vectors must be normalized for cosine similarity

### Data Quality Constraints
- No duplicate content chunks allowed
- All citations must reference existing DocumentChunk entities
- Response accuracy must be validated against source content