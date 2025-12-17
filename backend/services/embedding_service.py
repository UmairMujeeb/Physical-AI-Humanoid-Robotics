"""
Service for handling text embeddings using OpenAI
"""
import asyncio
from typing import List, Optional
import logging
from openai import AsyncOpenAI
from config.settings import settings

logger = logging.getLogger(__name__)

class EmbeddingService:
    """
    Service class for generating and managing text embeddings
    """

    def __init__(self):
        """
        Initialize the embedding service with OpenAI client
        """
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.EMBEDDING_MODEL

    async def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for a single text

        Args:
            text: The text to generate embedding for

        Returns:
            List of floats representing the embedding vector
        """
        try:
            response = await self.client.embeddings.create(
                input=text,
                model=self.model
            )

            embedding = response.data[0].embedding
            logger.debug(f"Generated embedding of length {len(embedding)} for text of length {len(text)}")
            return embedding

        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            raise

    async def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a batch of texts

        Args:
            texts: List of texts to generate embeddings for

        Returns:
            List of embedding vectors
        """
        try:
            # OpenAI has a limit of 2048 texts per request
            batch_size = min(2048, len(texts))
            embeddings = []

            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                response = await self.client.embeddings.create(
                    input=batch,
                    model=self.model
                )

                batch_embeddings = [item.embedding for item in response.data]
                embeddings.extend(batch_embeddings)

            logger.debug(f"Generated {len(embeddings)} embeddings for {len(texts)} texts")
            return embeddings

        except Exception as e:
            logger.error(f"Error generating batch embeddings: {str(e)}")
            raise

    async def calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """
        Calculate cosine similarity between two embeddings

        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector

        Returns:
            Cosine similarity score between -1 and 1
        """
        # Calculate dot product
        dot_product = sum(a * b for a, b in zip(embedding1, embedding2))

        # Calculate magnitudes
        magnitude1 = sum(a * a for a in embedding1) ** 0.5
        magnitude2 = sum(b * b for b in embedding2) ** 0.5

        # Calculate cosine similarity
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0

        similarity = dot_product / (magnitude1 * magnitude2)
        return similarity

# Singleton instance
embedding_service = EmbeddingService()