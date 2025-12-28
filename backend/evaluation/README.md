# Evaluation Suite for RAG Chatbot

This directory contains the comprehensive evaluation framework for the Physical AI & Humanoid Robotics RAG Chatbot. The evaluation suite includes multiple components to assess the quality, accuracy, and reliability of the RAG system.

## Components

### 1. Golden QA Dataset
- Contains 80-100 high-quality question-answer pairs covering all chapters of the Physical AI & Humanoid Robotics book
- Questions span various difficulty levels (easy, medium, hard) and cover different topics
- Includes multi-chapter queries that require information from multiple sources
- Used to evaluate faithfulness, answer relevancy, and context precision

### 2. RAGAS Evaluation Pipeline
- Implements standard RAG evaluation metrics using the RAGAS framework
- **Faithfulness**: Measures how factually correct the generated answer is compared to the provided context
- **Answer Relevancy**: Measures how relevant the answer is to the question
- **Context Precision**: Measures how much of the retrieved context is relevant to the question
- **Context Recall**: Measures how much of the ground truth is covered by the retrieved context

### 3. Citation Accuracy Checker
- Validates that citations in responses accurately reference the source material
- Ensures that provided citations actually support the claims made in answers
- Checks for proper grounding of responses in the source content
- Verifies that citation snippets accurately represent the source

### 4. Negative Test Set
- Contains 50 questions on topics NOT covered in the book
- Used to validate that the system properly rejects out-of-scope queries
- Tests the system's ability to avoid hallucination
- Verifies that responses contain appropriate rejection messages

## Usage

### Running the Complete Evaluation

```bash
cd backend
python -m scripts.run_evaluation --eval-type full
```

### Running Specific Evaluations

```bash
# Run only golden dataset evaluation
python -m scripts.run_evaluation --eval-type golden

# Run only negative test evaluation
python -m scripts.run_evaluation --eval-type negative

# Run only citation validation tests
python -m scripts.run_evaluation --eval-type citations
```

### Custom Output Directory

```bash
python -m scripts.run_evaluation --eval-type full --output-dir ./my_evaluation_results
```

## Evaluation Metrics

The evaluation suite calculates the following metrics:

- **Faithfulness Score**: 0.0-1.0 (higher is better) - How factually consistent the answer is with the context
- **Answer Relevancy Score**: 0.0-1.0 (higher is better) - How relevant the answer is to the question
- **Context Precision**: 0.0-1.0 (higher is better) - How precisely the retrieved context supports the answer
- **Citation Accuracy**: 0.0-1.0 (higher is better) - How accurately citations support the answer
- **Negative Test Rejection Rate**: 0.0-1.0 (higher is better) - How well the system rejects out-of-scope questions

## Success Criteria

The RAG system must meet the following criteria to be considered successful:

- Faithfulness score ≥ 0.85
- Answer relevancy score ≥ 0.80
- Citation accuracy ≥ 0.90
- Negative test rejection rate ≥ 0.95
- Overall composite score ≥ 0.85

## Files

- `evaluation_suite.py`: Main evaluation framework and golden dataset
- `citation_validator.py`: Citation validation utilities
- `run_evaluation.py`: Command-line script to run evaluations
- `golden_dataset.json`: Generated golden QA pairs (created on first run)
- `negative_test_set.json`: Out-of-scope questions (created on first run)
- `evaluation_results/`: Directory containing evaluation results

## Results Format

Evaluation results are saved in JSON format with detailed metrics and individual scores. The comprehensive evaluation results include:

- Overall composite score combining all metrics
- Detailed breakdown by evaluation type
- Individual sample results for analysis
- Execution time and performance metrics