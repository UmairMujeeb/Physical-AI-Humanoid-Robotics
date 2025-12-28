#!/usr/bin/env python3
"""
Content Ingestion Pipeline for Physical AI & Humanoid Robotics RAG Chatbot

This script processes Markdown files from the book content, splits them into chunks,
generates embeddings, and stores them in Qdrant vector database and Neon Postgres.
"""
import os
import sys
import hashlib
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

import yaml
from dotenv import load_dotenv
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import Distance, VectorParams
from sqlalchemy import create_engine, text
from markdown import markdown
from bs4 import BeautifulSoup
import tiktoken

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DocumentChunk:
    """Represents a chunk of document content with metadata."""

    def __init__(self, content: str, source_path: str, heading: str = "",
                 section: str = "", chunk_index: int = 0):
        self.content = content
        self.source_path = source_path
        self.heading = heading
        self.section = section
        self.chunk_index = chunk_index
        self.id = self._generate_id()
        self.created_at = datetime.utcnow()

    def _generate_id(self) -> str:
        """Generate a unique ID for this chunk based on content and source."""
        content_hash = hashlib.md5(f"{self.content}{self.source_path}{self.chunk_index}".encode()).hexdigest()
        return f"chunk_{content_hash}"

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for storage."""
        return {
            "id": self.id,
            "content": self.content,
            "source_path": self.source_path,
            "heading": self.heading,
            "section": self.section,
            "chunk_index": self.chunk_index,
            "created_at": self.created_at.isoformat()
        }

class TextSplitter:
    """Handles intelligent splitting of text content."""

    def __init__(self, chunk_size: int = 1500, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")

    def split_text_by_headings(self, text: str, source_path: str) -> List[DocumentChunk]:
        """Split text intelligently by headings and section breaks."""
        # First, parse the markdown to identify headings
        html = markdown(text)
        soup = BeautifulSoup(html, 'html.parser')

        chunks = []
        current_chunk = ""
        current_heading = ""
        chunk_index = 0

        # Process the document structure
        elements = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'code', 'pre'])

        for element in elements:
            element_text = element.get_text().strip()

            if element.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                # This is a heading
                if current_chunk and len(current_chunk.strip()) > 50:  # If we have content, save the chunk
                    chunks.append(DocumentChunk(
                        content=current_chunk.strip(),
                        source_path=source_path,
                        heading=current_heading,
                        chunk_index=chunk_index
                    ))
                    chunk_index += 1
                    current_chunk = ""

                current_heading = element_text
            elif element_text:
                # Add content to current chunk
                element_content = element_text + "\n\n"

                # Check if adding this would exceed chunk size
                if len(self.encoding.encode(current_chunk + element_content)) > self.chunk_size:
                    if len(self.encoding.encode(current_chunk)) > 50:  # Minimum chunk size
                        chunks.append(DocumentChunk(
                            content=current_chunk.strip(),
                            source_path=source_path,
                            heading=current_heading,
                            chunk_index=chunk_index
                        ))
                        chunk_index += 1

                    # Start new chunk, possibly with overlap
                    current_chunk = element_content
                else:
                    current_chunk += element_content

        # Add the final chunk if it has content
        if current_chunk and len(current_chunk.strip()) > 50:
            chunks.append(DocumentChunk(
                content=current_chunk.strip(),
                source_path=source_path,
                heading=current_heading,
                chunk_index=chunk_index
            ))

        return chunks

    def split_text_recursive(self, text: str, source_path: str) -> List[DocumentChunk]:
        """Split text using recursive character splitting as fallback."""
        chunks = []
        start = 0
        chunk_index = 0

        while start < len(text):
            end = start + self.chunk_size

            # If we're at the end, take the remaining text
            if end >= len(text):
                end = len(text)
            else:
                # Try to find a good breaking point (sentence or paragraph boundary)
                for break_point in [". ", "! ", "? ", "\n", " ", ""]:
                    if break_point:
                        # Find the last occurrence of the break point within our chunk
                        last_break = text.rfind(break_point, start, end)
                        if last_break != -1 and last_break > start + 100:  # Ensure we have some content
                            end = last_break + len(break_point)
                            break

            chunk_text = text[start:end].strip()
            if chunk_text:  # Only add non-empty chunks
                chunks.append(DocumentChunk(
                    content=chunk_text,
                    source_path=source_path,
                    chunk_index=chunk_index
                ))
                chunk_index += 1

            # Move start position, with overlap if possible
            start = end
            if self.chunk_overlap > 0 and start > self.chunk_overlap:
                start = start - self.chunk_overlap

        return chunks

class EmbeddingService:
    """Handles embedding generation using OpenAI."""

    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")

        self.client = OpenAI(api_key=api_key)
        self.model = os.getenv("EMBEDDING_MODEL", "text-embedding-ada-002")
        self.dimension = 1536 if self.model == "text-embedding-ada-002" else 3072

    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a text chunk."""
        try:
            response = self.client.embeddings.create(
                input=text,
                model=self.model
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise

    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a batch of texts."""
        try:
            response = self.client.embeddings.create(
                input=texts,
                model=self.model
            )
            return [item.embedding for item in response.data]
        except Exception as e:
            logger.error(f"Error generating embeddings batch: {e}")
            raise

class QdrantService:
    """Handles vector database operations with Qdrant."""

    def __init__(self):
        qdrant_url = os.getenv("QDRANT_URL")
        qdrant_api_key = os.getenv("QDRANT_API_KEY")

        if not qdrant_url:
            raise ValueError("QDRANT_URL environment variable is required")

        if qdrant_api_key:
            self.client = QdrantClient(
                url=qdrant_url,
                api_key=qdrant_api_key,
                prefer_grpc=True
            )
        else:
            self.client = QdrantClient(url=qdrant_url)

        self.collection_name = os.getenv("QDRANT_COLLECTION_NAME", "book_chunks")
        self.dimension = 1536  # Default for ada-002, will be updated based on embedding model

    def create_collection(self):
        """Create the collection if it doesn't exist."""
        try:
            collections = self.client.get_collections().collections
            collection_exists = any(c.name == self.collection_name for c in collections)

            if not collection_exists:
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=self.dimension,
                        distance=Distance.COSINE
                    )
                )
                logger.info(f"Created collection: {self.collection_name}")
            else:
                logger.info(f"Collection {self.collection_name} already exists")
        except Exception as e:
            logger.error(f"Error creating collection: {e}")
            raise

    def upsert_chunks(self, chunks: List[Dict[str, Any]], embeddings: List[List[float]]):
        """Upsert document chunks with their embeddings to Qdrant."""
        try:
            points = []
            for chunk, embedding in zip(chunks, embeddings):
                points.append(models.PointStruct(
                    id=chunk["id"],
                    vector=embedding,
                    payload={
                        "content": chunk["content"],
                        "source_path": chunk["source_path"],
                        "heading": chunk["heading"],
                        "section": chunk["section"],
                        "chunk_index": chunk["chunk_index"],
                        "created_at": chunk["created_at"]
                    }
                ))

            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
            logger.info(f"Upserted {len(points)} chunks to Qdrant")
        except Exception as e:
            logger.error(f"Error upserting chunks to Qdrant: {e}")
            raise

class PostgresService:
    """Handles metadata storage in Neon Postgres."""

    def __init__(self):
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise ValueError("DATABASE_URL environment variable is required")

        self.engine = create_engine(database_url)
        self._create_tables()

    def _create_tables(self):
        """Create necessary tables if they don't exist."""
        with self.engine.connect() as conn:
            # Create document_chunks table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS document_chunks (
                    id VARCHAR(255) PRIMARY KEY,
                    content TEXT NOT NULL,
                    source_path VARCHAR(500) NOT NULL,
                    heading VARCHAR(500),
                    section VARCHAR(500),
                    chunk_index INTEGER,
                    embedding_id VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))

            # Create trigger to update updated_at
            conn.execute(text("""
                CREATE OR REPLACE FUNCTION update_updated_at_column()
                RETURNS TRIGGER AS $$
                BEGIN
                    NEW.updated_at = CURRENT_TIMESTAMP;
                    RETURN NEW;
                END;
                $$ language 'plpgsql';
            """))

            conn.execute(text("""
                CREATE TRIGGER update_document_chunks_updated_at
                BEFORE UPDATE ON document_chunks
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
            """))

            conn.commit()
            logger.info("Ensured document_chunks table exists")

    def upsert_chunks(self, chunks: List[Dict[str, Any]]):
        """Upsert document chunks to Postgres."""
        try:
            with self.engine.connect() as conn:
                for chunk in chunks:
                    # Check if chunk already exists
                    result = conn.execute(
                        text("SELECT id FROM document_chunks WHERE id = :id"),
                        {"id": chunk["id"]}
                    )

                    if result.fetchone():
                        # Update existing
                        conn.execute(
                            text("""
                                UPDATE document_chunks
                                SET content = :content,
                                    source_path = :source_path,
                                    heading = :heading,
                                    section = :section,
                                    chunk_index = :chunk_index,
                                    updated_at = CURRENT_TIMESTAMP
                                WHERE id = :id
                            """),
                            {
                                "id": chunk["id"],
                                "content": chunk["content"],
                                "source_path": chunk["source_path"],
                                "heading": chunk["heading"],
                                "section": chunk["section"],
                                "chunk_index": chunk["chunk_index"]
                            }
                        )
                    else:
                        # Insert new
                        conn.execute(
                            text("""
                                INSERT INTO document_chunks
                                (id, content, source_path, heading, section, chunk_index)
                                VALUES (:id, :content, :source_path, :heading, :section, :chunk_index)
                            """),
                            {
                                "id": chunk["id"],
                                "content": chunk["content"],
                                "source_path": chunk["source_path"],
                                "heading": chunk["heading"],
                                "section": chunk["section"],
                                "chunk_index": chunk["chunk_index"]
                            }
                        )

                conn.commit()
                logger.info(f"Upserted {len(chunks)} chunks to Postgres")
        except Exception as e:
            logger.error(f"Error upserting chunks to Postgres: {e}")
            raise

class DocumentIngestor:
    """Main class for document ingestion pipeline."""

    def __init__(self):
        self.text_splitter = TextSplitter()
        self.embedding_service = EmbeddingService()
        self.qdrant_service = QdrantService()
        self.postgres_service = PostgresService()

        # Set the correct dimension based on embedding model
        if self.embedding_service.model == "text-embedding-3-large":
            self.qdrant_service.dimension = 3072
        else:
            self.qdrant_service.dimension = 1536

    def process_markdown_file(self, file_path: Path) -> List[DocumentChunk]:
        """Process a single markdown file and return chunks."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Use heading-based splitting first, fall back to recursive splitting
            chunks = self.text_splitter.split_text_by_headings(content, str(file_path))

            # If heading-based splitting didn't work well (too few chunks), try recursive
            if len(chunks) < 2:
                chunks = self.text_splitter.split_text_recursive(content, str(file_path))

            logger.info(f"Processed {file_path} into {len(chunks)} chunks")
            return chunks
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {e}")
            return []

    def process_directory(self, source_dir: Path) -> List[DocumentChunk]:
        """Process all markdown files in a directory."""
        all_chunks = []

        # Find all markdown files
        md_files = list(source_dir.rglob("*.md")) + list(source_dir.rglob("*.mdx"))

        logger.info(f"Found {len(md_files)} markdown files to process")

        for md_file in md_files:
            logger.info(f"Processing: {md_file}")
            file_chunks = self.process_markdown_file(md_file)
            all_chunks.extend(file_chunks)

        return all_chunks

    def ingest_documents(self, source_path: str, force_refresh: bool = False):
        """Main ingestion method."""
        source_dir = Path(source_path)

        if not source_dir.exists():
            raise ValueError(f"Source directory does not exist: {source_path}")

        logger.info(f"Starting ingestion from: {source_path}")

        # Create Qdrant collection if needed
        self.qdrant_service.create_collection()

        # Process documents
        chunks = self.process_directory(source_dir)

        if not chunks:
            logger.warning("No chunks were generated from the source documents")
            return

        logger.info(f"Generated {len(chunks)} total chunks")

        # Generate embeddings
        logger.info("Generating embeddings...")
        chunk_texts = [chunk.content for chunk in chunks]
        embeddings = self.embedding_service.generate_embeddings_batch(chunk_texts)

        # Prepare chunks for storage
        chunk_dicts = [chunk.to_dict() for chunk in chunks]

        # Store in Qdrant
        logger.info("Storing chunks in Qdrant...")
        self.qdrant_service.upsert_chunks(chunk_dicts, embeddings)

        # Store in Postgres
        logger.info("Storing chunk metadata in Postgres...")
        self.postgres_service.upsert_chunks(chunk_dicts)

        logger.info(f"Ingestion completed! Processed {len(chunks)} chunks from {source_path}")

def main():
    import argparse

    parser = argparse.ArgumentParser(description="Ingest book content for RAG chatbot")
    parser.add_argument(
        "--source-path",
        type=str,
        required=True,
        help="Path to the directory containing markdown files to ingest"
    )
    parser.add_argument(
        "--force-refresh",
        action="store_true",
        help="Force re-processing of documents even if they already exist"
    )

    args = parser.parse_args()

    try:
        ingestor = DocumentIngestor()
        ingestor.ingest_documents(args.source_path, args.force_refresh)
        logger.info("Document ingestion completed successfully!")
    except Exception as e:
        logger.error(f"Ingestion failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()