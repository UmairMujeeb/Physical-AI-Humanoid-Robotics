"""
RAG (Retrieval-Augmented Generation) service for the chatbot
"""
import asyncio
from typing import List, Optional, Dict, Any
import logging
from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient
from qdrant_client.http.models import PointStruct, VectorParams, Distance, Filter, FieldCondition, MatchValue
import uuid
from datetime import datetime
from models.query import QueryRequest, QueryResponse, DocumentChunk, Citation
from .embedding_service import embedding_service
from config.settings import settings

logger = logging.getLogger(__name__)

class RAGService:
    """
    Service class for Retrieval-Augmented Generation functionality
    """

    def __init__(self):
        """
        Initialize the RAG service with Qdrant client and OpenAI client
        """
        self.client = AsyncQdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )
        self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.collection_name = settings.QDRANT_COLLECTION_NAME

    async def initialize_collection(self):
        """
        Initialize the Qdrant collection for storing document chunks
        """
        try:
            # Check if collection exists
            collections = await self.client.get_collections()
            collection_names = [collection.name for collection in collections.collections]

            if self.collection_name not in collection_names:
                # Create collection with appropriate vector size (1536 for OpenAI ada-002)
                await self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
                )
                logger.info(f"Created Qdrant collection: {self.collection_name}")
            else:
                logger.info(f"Qdrant collection {self.collection_name} already exists")

        except Exception as e:
            logger.error(f"Error initializing Qdrant collection: {str(e)}")
            raise

    async def ingest_document_chunk(self, content: str, metadata: Dict[str, Any]) -> str:
        """
        Ingest a document chunk into the vector database

        Args:
            content: The text content of the document chunk
            metadata: Additional metadata about the document chunk

        Returns:
            ID of the created document chunk
        """
        try:
            # Generate embedding for the content
            embedding = await embedding_service.generate_embedding(content)

            # Create a unique ID for this chunk
            chunk_id = str(uuid.uuid4())

            # Prepare the point to insert
            point = PointStruct(
                id=chunk_id,
                vector=embedding,
                payload={
                    "content": content,
                    "metadata": metadata,
                    "created_at": datetime.utcnow().isoformat()
                }
            )

            # Insert the point into Qdrant
            await self.client.upsert(
                collection_name=self.collection_name,
                points=[point]
            )

            logger.debug(f"Ingested document chunk with ID: {chunk_id}")
            return chunk_id

        except Exception as e:
            logger.error(f"Error ingesting document chunk: {str(e)}")
            raise

    async def retrieve_relevant_chunks(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieve the most relevant document chunks for a query

        Args:
            query: The user's query
            top_k: Number of top results to return

        Returns:
            List of relevant document chunks with similarity scores
        """
        try:
            # Generate embedding for the query
            query_embedding = await embedding_service.generate_embedding(query)

            # Search in Qdrant for similar vectors
            search_results = await self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=top_k,
                score_threshold=settings.SIMILARITY_THRESHOLD
            )

            # Format the results
            relevant_chunks = []
            for result in search_results:
                chunk_data = {
                    "id": result.id,
                    "content": result.payload.get("content", ""),
                    "metadata": result.payload.get("metadata", {}),
                    "score": result.score
                }
                relevant_chunks.append(chunk_data)

            logger.debug(f"Retrieved {len(relevant_chunks)} relevant chunks for query")
            return relevant_chunks

        except Exception as e:
            logger.error(f"Error retrieving relevant chunks: {str(e)}")
            raise

    async def generate_response(self, query: str, context_chunks: List[Dict[str, Any]], selected_text: Optional[str] = None) -> str:
        """
        Generate a response using the retrieved context chunks

        Args:
            query: The user's query
            context_chunks: Retrieved relevant document chunks
            selected_text: Optional selected text context

        Returns:
            Generated response from the LLM
        """
        try:
            # Build the context from retrieved chunks
            context_text = ""
            for chunk in context_chunks:
                context_text += f"\n\nFrom {chunk['metadata'].get('source', 'unknown')}:\n{chunk['content']}"

            # Build the full prompt
            prompt_parts = [
                "You are an AI assistant for the Physical AI & Humanoid Robotics book. Answer questions based ONLY on the provided book content. Do not fabricate or hallucinate information.",
                f"Selected text context (if provided): {selected_text}" if selected_text else "",
                f"Query: {query}",
                "Relevant book content:",
                context_text,
                "Answer the query using only the provided book content. If the information is not in the provided content, clearly state that the topic is not covered in the book."
            ]

            full_prompt = "\n\n".join([part for part in prompt_parts if part])

            # Call OpenAI to generate the response
            response = await self.openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are an AI assistant for the Physical AI & Humanoid Robotics book. Answer questions based ONLY on the provided book content. Do not fabricate or hallucinate information. Always cite your sources from the provided content."},
                    {"role": "user", "content": full_prompt}
                ],
                max_tokens=settings.MAX_RESPONSE_TOKENS,
                temperature=settings.TEMPERATURE
            )

            generated_text = response.choices[0].message.content.strip()
            logger.debug(f"Generated response of length {len(generated_text)} characters")
            return generated_text

        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            raise

    async def process_query(self, query_request: QueryRequest) -> QueryResponse:
        """
        Process a user query through the RAG pipeline

        Args:
            query_request: The query request with user input

        Returns:
            QueryResponse with answer and citations
        """
        start_time = datetime.now()

        try:
            # Retrieve relevant document chunks
            relevant_chunks = await self.retrieve_relevant_chunks(query_request.query)

            # Generate response using the context
            response_text = await self.generate_response(
                query_request.query,
                relevant_chunks,
                query_request.context
            )

            # Create citations from the relevant chunks
            citations = []
            for chunk in relevant_chunks:
                citation = Citation(
                    document_id=chunk["id"],
                    source=chunk["metadata"].get("source", "unknown"),
                    text_snippet=chunk["content"][:200] + "..." if len(chunk["content"]) > 200 else chunk["content"]
                )
                citations.append(citation)

            # Calculate processing time
            processing_time = (datetime.now() - start_time).total_seconds()

            # Create response
            response = QueryResponse(
                answer=response_text,
                citations=citations,
                conversation_id=query_request.conversation_id or str(uuid.uuid4()),
                tokens_used=len(response_text.split()) if response_text else 0,
                processing_time=processing_time
            )

            logger.info(f"Processed query in {processing_time:.2f}s with {len(citations)} citations")
            return response

        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            raise

# Singleton instance
rag_service = RAGService()