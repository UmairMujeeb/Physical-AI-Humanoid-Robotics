# Quickstart Guide: RAG Chatbot for Physical AI & Humanoid Robotics Book

## Overview
This guide helps you quickly set up and run the RAG chatbot for the Physical AI & Humanoid Robotics book. The system consists of a FastAPI backend that handles RAG processing and a React frontend component integrated into the Docusaurus site.

## Prerequisites
- Python 3.11+ installed
- Node.js 18+ installed
- Docker and Docker Compose (for containerized deployment)
- OpenAI API key
- Qdrant Cloud account (free tier)
- Neon Postgres account (free tier)

## Quick Setup

### 1. Clone the Repository
```bash
git clone https://github.com/UmairMujeeb/Physical-AI-Humanoid-Robotics.git
cd Physical-AI-Humanoid-Robotics
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and connection strings:
# OPENAI_API_KEY=your_openai_key_here
# QDRANT_URL=your_qdrant_cluster_url
# QDRANT_API_KEY=your_qdrant_api_key
# DATABASE_URL=your_neon_postgres_connection_string
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Build the chatbot component
npm run build
```

### 4. Ingest Book Content
```bash
# Still in backend directory
cd ../backend

# Activate virtual environment if not already done
source venv/bin/activate

# Run the ingestion script to process book content
python -m scripts.ingest_documents --source-path="../website/docs"
```

### 5. Start the Backend
```bash
# Run the FastAPI server
uvicorn main:app --reload --port 8000
```

### 6. Integrate with Docusaurus Site
```bash
# Navigate to website directory
cd ../website

# The chatbot component is already integrated into the site
# Start the Docusaurus development server
npm run start
```

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
QDRANT_URL=https://your-cluster-url.qdrant.tech
QDRANT_API_KEY=your_qdrant_api_key
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
DEBUG=true
MAX_QUERY_LENGTH=1000
MAX_RESPONSE_TOKENS=500
TEMPERATURE=0.7
SIMILARITY_THRESHOLD=0.7
```

## Running with Docker (Recommended)

### 1. Build and Run Containers
```bash
# From repository root
docker-compose up --build
```

### 2. Initialize the Database
```bash
# In a separate terminal
docker-compose exec backend python -m scripts.initialize_db
```

## API Endpoints

Once running, the backend API will be available at `http://localhost:8000`:

- `GET /api/health` - Health check
- `POST /api/chat` - Chat with the RAG bot
- `POST /api/documents/ingest` - Ingest new documents
- `GET /api/documents/stats` - Get ingestion statistics

## Sample API Call

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Explain ROS 2 nodes and topics",
    "context": "",
    "conversation_id": null
  }'
```

## Frontend Integration

The chatbot is already integrated into the Docusaurus site. To use it:

1. The chatbot appears as a floating button on all pages
2. Click the button to open the chat interface
3. Ask questions about the book content
4. Select text and click "Explain this" to get explanations of specific content

## Troubleshooting

### Common Issues
- **API Key Errors**: Verify your OpenAI, Qdrant, and Neon keys are correct
- **Database Connection**: Check that your Neon Postgres connection string is properly formatted
- **Vector Database**: Ensure Qdrant cluster is accessible and API key is valid
- **Content Not Found**: Re-run the ingestion script if book content changes

### Development Mode
- Backend: `uvicorn main:app --reload` (auto-reloads on code changes)
- Frontend: `npm run dev` (watch mode for component development)

## Next Steps
1. Customize the chatbot UI to match your branding
2. Fine-tune the RAG parameters for optimal performance
3. Add analytics to track user interactions
4. Set up automated deployment pipelines