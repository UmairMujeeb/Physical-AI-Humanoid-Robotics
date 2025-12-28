"""
Citation Validator for RAG Chatbot

This module provides utilities to validate that citations in RAG responses
are accurate and properly support the claims made in the answers.
"""
import asyncio
import logging
from typing import List, Dict, Any, Tuple
from dataclasses import dataclass

from sentence_transformers import CrossEncoder
import numpy as np

logger = logging.getLogger(__name__)

@dataclass
class CitationValidationResult:
    """Result of citation validation"""
    is_valid: bool
    confidence_score: float
    supporting_evidence: List[str]
    validation_details: Dict[str, Any]

class CitationValidator:
    """
    Validates that citations in RAG responses actually support the claims made
    """

    def __init__(self):
        """
        Initialize the citation validator
        """
        # Using a cross-encoder model for semantic similarity between answer and citations
        self.cross_encoder = CrossEncoder('cross-encoder/nli-deberta-v3-base')

    async def validate_citations(
        self,
        answer: str,
        citations: List[str],
        question: str = None
    ) -> CitationValidationResult:
        """
        Validate that provided citations support the answer

        Args:
            answer: The generated answer from the RAG system
            citations: List of citation texts that should support the answer
            question: Original question (optional, for additional context)

        Returns:
            CitationValidationResult with validation outcome
        """
        try:
            # If no citations provided, validation fails
            if not citations:
                return CitationValidationResult(
                    is_valid=False,
                    confidence_score=0.0,
                    supporting_evidence=[],
                    validation_details={
                        "reason": "No citations provided",
                        "answer_length": len(answer),
                        "citations_count": 0
                    }
                )

            # Check if any citation supports the answer
            supporting_evidence = []
            max_similarity = 0.0

            for citation in citations:
                # Calculate semantic similarity between answer and citation
                similarity = await self._calculate_answer_citation_similarity(answer, citation)

                if similarity > 0.7:  # Threshold for considering citation as supportive
                    supporting_evidence.append(citation)
                    max_similarity = max(max_similarity, similarity)

            # Determine if validation passes based on supporting citations
            is_valid = len(supporting_evidence) > 0
            confidence_score = max_similarity

            return CitationValidationResult(
                is_valid=is_valid,
                confidence_score=confidence_score,
                supporting_evidence=supporting_evidence[:3],  # Return top 3 supporting citations
                validation_details={
                    "total_citations": len(citations),
                    "supporting_citations": len(supporting_evidence),
                    "max_similarity": max_similarity,
                    "threshold_used": 0.7
                }
            )

        except Exception as e:
            logger.error(f"Error validating citations: {str(e)}")
            return CitationValidationResult(
                is_valid=False,
                confidence_score=0.0,
                supporting_evidence=[],
                validation_details={
                    "error": str(e),
                    "reason": "Exception during validation"
                }
            )

    async def _calculate_answer_citation_similarity(self, answer: str, citation: str) -> float:
        """
        Calculate semantic similarity between answer and citation

        Args:
            answer: Generated answer
            citation: Citation text to compare against

        Returns:
            Similarity score between 0 and 1
        """
        try:
            # Use cross-encoder to get similarity score
            scores = self.cross_encoder.predict([(answer, citation)])
            # The model returns logits, convert to probability-like score
            # For NLI models, we can use the entailment score
            return float(np.tanh(scores[0] / 10.0))  # Normalize to 0-1 range approximately
        except Exception as e:
            logger.warning(f"Error calculating similarity: {str(e)}, defaulting to 0.0")
            return 0.0

    async def validate_grounding(
        self,
        question: str,
        answer: str,
        citations: List[str]
    ) -> CitationValidationResult:
        """
        Validate that the answer is properly grounded in the provided citations

        Args:
            question: Original question
            answer: Generated answer
            citations: List of citations used to generate answer

        Returns:
            CitationValidationResult with grounding validation
        """
        try:
            # Create pairs of answer sentences with citations for detailed validation
            answer_sentences = self._split_into_sentences(answer)

            total_sentences = len(answer_sentences)
            grounded_sentences = 0
            ungrounded_sentences = []

            for sentence in answer_sentences:
                if len(sentence.strip()) < 5:  # Skip very short sentences
                    continue

                sentence_is_supported = False
                for citation in citations:
                    similarity = await self._calculate_answer_citation_similarity(sentence, citation)
                    if similarity > 0.6:  # Threshold for sentence-level support
                        sentence_is_supported = True
                        break

                if sentence_is_supported:
                    grounded_sentences += 1
                else:
                    ungrounded_sentences.append(sentence)

            # Calculate grounding ratio
            grounding_ratio = grounded_sentences / total_sentences if total_sentences > 0 else 0

            return CitationValidationResult(
                is_valid=grounding_ratio >= 0.8,  # At least 80% of sentences should be grounded
                confidence_score=grounding_ratio,
                supporting_evidence=ungrounded_sentences[:3],  # Show up to 3 ungrounded sentences
                validation_details={
                    "total_sentences": total_sentences,
                    "grounded_sentences": grounded_sentences,
                    "ungrounded_sentences": len(ungrounded_sentences),
                    "grounding_ratio": grounding_ratio,
                    "required_ratio": 0.8
                }
            )

        except Exception as e:
            logger.error(f"Error validating grounding: {str(e)}")
            return CitationValidationResult(
                is_valid=False,
                confidence_score=0.0,
                supporting_evidence=[],
                validation_details={
                    "error": str(e),
                    "reason": "Exception during grounding validation"
                }
            )

    def _split_into_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences

        Args:
            text: Input text to split

        Returns:
            List of sentences
        """
        import re
        # Simple sentence splitting using common sentence delimiters
        sentences = re.split(r'[.!?]+', text)
        # Remove empty strings and strip whitespace
        return [s.strip() for s in sentences if s.strip()]

# Singleton instance
citation_validator = CitationValidator()