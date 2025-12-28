#!/usr/bin/env python3
"""
Evaluation Runner for Physical AI & Humanoid Robotics RAG Chatbot

This script runs the complete evaluation suite including:
1. Golden QA dataset evaluation
2. RAGAS metrics (faithfulness, answer relevancy, context precision)
3. Citation accuracy validation
4. Negative (out-of-scope) test evaluation
"""
import asyncio
import sys
import argparse
import logging
from datetime import datetime
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add the backend directory to the path so we can import modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from evaluation.evaluation_suite import evaluation_suite
from evaluation.citation_validator import citation_validator


async def run_full_evaluation(output_dir: str = "evaluation_results"):
    """
    Run the complete evaluation suite

    Args:
        output_dir: Directory to save evaluation results

    Returns:
        Dictionary with complete evaluation results
    """
    logger.info("Starting full evaluation of RAG Chatbot...")

    start_time = datetime.now()

    try:
        # Run the comprehensive evaluation suite
        results = await evaluation_suite.run_comprehensive_evaluation()

        # Calculate additional metrics
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()

        # Add execution time to results
        results["execution_duration_seconds"] = duration

        logger.info(f"Evaluation completed successfully in {duration:.2f} seconds")
        logger.info(f"Overall score: {results['overall_score']:.3f}")

        return results

    except Exception as e:
        logger.error(f"Error during evaluation: {str(e)}")
        raise


async def run_citation_validation_test():
    """
    Run a specific test of the citation validation functionality
    """
    logger.info("Testing citation validation...")

    # Test cases for citation validation
    test_cases = [
        {
            "question": "What is ROS?",
            "answer": "ROS stands for Robot Operating System. It is a flexible framework for writing robot software.",
            "citations": [
                "ROS (Robot Operating System) is a flexible framework for writing robot software...",
                "The Robot Operating System provides hardware abstraction..."
            ]
        },
        {
            "question": "What is a robot sensor?",
            "answer": "A robot sensor is a device that detects events or changes in the environment.",
            "citations": [
                "This is completely unrelated text about cooking.",
                "Another unrelated citation about gardening."
            ]
        }
    ]

    for i, test_case in enumerate(test_cases):
        result = await citation_validator.validate_citations(
            answer=test_case["answer"],
            citations=test_case["citations"],
            question=test_case["question"]
        )

        logger.info(f"Test {i+1}: Valid={result.is_valid}, Confidence={result.confidence_score:.3f}")

    logger.info("Citation validation test completed")


async def main():
    """
    Main function to run the evaluation
    """
    parser = argparse.ArgumentParser(description="Run evaluation for RAG Chatbot")
    parser.add_argument(
        "--eval-type",
        choices=["full", "citations", "golden", "negative"],
        default="full",
        help="Type of evaluation to run (default: full)"
    )
    parser.add_argument(
        "--output-dir",
        default="evaluation_results",
        help="Directory to save evaluation results (default: evaluation_results)"
    )
    parser.add_argument(
        "--book-content-path",
        default="../website/docs",
        help="Path to book content for ingestion before evaluation"
    )

    args = parser.parse_args()

    logger.info(f"Starting evaluation of type: {args.eval_type}")

    try:
        if args.eval_type == "full":
            results = await run_full_evaluation(output_dir=args.output_dir)
            print(f"\nEvaluation Summary:")
            print(f"Overall Score: {results['overall_score']:.3f}")
            print(f"Golden Dataset Faithfulness: {results['golden_dataset_results']['summary']['avg_faithfulness']:.3f}")
            print(f"Golden Dataset Relevancy: {results['golden_dataset_results']['summary']['avg_relevancy']:.3f}")
            print(f"Negative Test Rejection Rate: {results['negative_test_results']['rejection_rate']:.3f}")

        elif args.eval_type == "citations":
            await run_citation_validation_test()

        elif args.eval_type == "golden":
            results = await evaluation_suite.run_golden_dataset_evaluation()
            print(f"\nGolden Dataset Evaluation:")
            print(f"Average Faithfulness: {results['faithfulness']['average_faithfulness']:.3f}")
            print(f"Average Relevancy: {results['relevancy']['average_relevancy']:.3f}")
            print(f"Citation Accuracy: {results['citation_accuracy']['citation_accuracy']:.3f}")

        elif args.eval_type == "negative":
            results = await evaluation_suite.run_negative_test_evaluation()
            print(f"\nNegative Test Evaluation:")
            print(f"Rejection Rate: {results['rejection_rate']:.3f}")
            print(f"Correct Rejections: {results['correct_rejections']}/{results['total_negative_tests']}")

    except KeyboardInterrupt:
        logger.info("Evaluation interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Evaluation failed: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())