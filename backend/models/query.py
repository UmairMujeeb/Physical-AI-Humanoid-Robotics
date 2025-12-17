"""
Pydantic models for query requests and responses
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class QueryRequest(BaseModel):
    """
    Request model for chat queries
    """
    query: str = Field(..., min_length=1, max_length=2000, description="The user's question/query")
    context: Optional[str] = Field(None, description="Additional context from selected text")
    conversation_id: Optional[str] = Field(None, description="ID of the conversation for continuity")
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=1.0, description="Creativity control for response")


class Citation(BaseModel):
    """
    Model for source citations in responses
    """
    document_id: str = Field(..., description="ID of the source document chunk")
    source: str = Field(..., description="Source reference (chapter/page)")
    text_snippet: str = Field(..., description="Relevant text snippet from the source")


class QueryResponse(BaseModel):
    """
    Response model for chat queries
    """
    answer: str = Field(..., description="The chatbot's response")
    citations: List[Citation] = Field(default_factory=list, description="Sources used in the response")
    conversation_id: str = Field(..., description="ID of the conversation")
    tokens_used: Optional[int] = Field(None, description="Number of tokens in the response")
    processing_time: Optional[float] = Field(None, description="Time taken to process query in seconds")


class DocumentChunk(BaseModel):
    """
    Model for document chunks stored in vector database
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique identifier")
    content: str = Field(..., description="Text content of the chunk")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of creation")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of last update")


class Message(BaseModel):
    """
    Model for individual messages in a conversation
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique identifier")
    conversation_id: str = Field(..., description="Foreign key to Conversation")
    role: str = Field(..., description="Either 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    citations: List[Citation] = Field(default_factory=list, description="References to DocumentChunks")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of creation")


class Conversation(BaseModel):
    """
    Model for conversation tracking
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique identifier")
    user_id: str = Field(..., description="Identifier for user session")
    messages: List[Message] = Field(default_factory=list, description="List of conversation messages")
    contexts: List[Dict[str, Any]] = Field(default_factory=list, description="List of document contexts used")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of creation")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of last update")