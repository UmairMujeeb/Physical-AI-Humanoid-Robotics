# Testing the RAG Chatbot Integration

This document outlines how to test the integration between the Docusaurus frontend and the FastAPI backend for the RAG chatbot.

## Prerequisites

- Python 3.9+ with pip
- Node.js 18+ with npm
- Access to OpenAI API key
- Access to Qdrant Cloud (or local instance)
- Access to Neon Postgres (or local instance)

## Setup and Testing Steps

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables in a `.env` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   QDRANT_API_KEY=your_qdrant_api_key
   QDRANT_URL=your_qdrant_url
   DATABASE_URL=your_neon_postgres_url
   ```

5. Start the backend server:
   ```bash
   python main.py
   ```
   The backend should be running on `http://localhost:8000`

### 2. Frontend Setup

1. Navigate to the website directory:
   ```bash
   cd website  # or wherever your Docusaurus site is
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Docusaurus development server:
   ```bash
   npm run start
   ```
   The frontend should be running on `http://localhost:3000`

### 3. Integration Testing

1. **API Connectivity Test**:
   - Visit `http://localhost:8000/api/health` to verify the backend is running
   - You should receive a JSON response with health status

2. **Frontend Integration Test**:
   - Open your browser to `http://localhost:3000`
   - Look for the floating chatbot button (💬) at the bottom right
   - Click the button to open the chat interface

3. **Basic Functionality Test**:
   - Type a simple question in the chat interface
   - Verify that the question is sent to the backend
   - Verify that a response is received and displayed
   - Check that citations are included in the response

4. **Context Integration Test**:
   - Select some text on a documentation page
   - Open the chatbot and ask a question about the selected text
   - Verify that the context is included in the query to the backend

5. **CORS Test**:
   - Ensure there are no CORS errors in the browser console
   - All API calls from the frontend should succeed

## Common Issues and Troubleshooting

### Backend Not Responding
- Verify the backend server is running on the correct port
- Check that environment variables are properly set
- Verify API keys are valid and have necessary permissions

### CORS Errors
- Ensure the backend allows requests from the frontend origin
- Check that the frontend is making requests to the correct backend URL

### Chatbot Not Appearing
- Verify the Root component is properly configured in Docusaurus
- Check that the ChatbotWrapper component is correctly imported
- Ensure there are no JavaScript errors in the browser console

### No Responses from API
- Verify the RAG service is properly configured
- Check that documents are properly indexed in Qdrant
- Verify the LLM API keys are working correctly

## Automated Testing

Run the following command to execute the integration tests:

```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests
cd website
npm run test
```

## Validation Criteria

### Success Criteria
- [ ] Floating chatbot appears on all documentation pages
- [ ] API calls to backend succeed without errors
- [ ] Responses include proper citations to book content
- [ ] Context from selected text is properly passed to backend
- [ ] Chat history persists between sessions
- [ ] Mobile responsiveness works correctly
- [ ] Accessibility features function properly

### Performance Criteria
- [ ] API responses in under 5 seconds
- [ ] Chat interface loads in under 2 seconds
- [ ] No memory leaks during extended use

### Security Criteria
- [ ] No sensitive data exposed in frontend
- [ ] Proper authentication for API endpoints (if required)
- [ ] Input sanitization is implemented