/**
 * Interactive chatbot component for the Physical AI & Humanoid Robotics book
 */

import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

interface Citation {
  document_id: string;
  source: string;
  text_snippet: string;
}

interface ChatbotProps {
  initialQuery?: string;
  context?: string;
  theme?: 'light' | 'dark';
  onClose?: () => void;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const Chatbot: React.FC<ChatbotProps> = ({
  initialQuery = '',
  context = '',
  theme = 'light',
  onClose
}) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const [inputValue, setInputValue] = useState(initialQuery);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    // Add user message to chat
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    // Clear input
    setInputValue('');

    try {
      // Call the backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputValue,
          context: context,
          conversation_id: getConversationId(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.answer,
        citations: data.citations,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      setState(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: 'Sorry, I encountered an error processing your request. Please try again.',
            timestamp: new Date(),
          },
        ],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get or create conversation ID
  const getConversationId = (): string => {
    if (typeof window !== 'undefined') {
      let conversationId = localStorage.getItem('chatbot_conversation_id');
      if (!conversationId) {
        conversationId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('chatbot_conversation_id', conversationId);
      }
      return conversationId;
    }
    return '';
  };

  // Clear chat history
  const handleClearChat = () => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
    localStorage.removeItem('chatbot_conversation_id');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Physical AI & Robotics Assistant</h3>
        <div>
          <button onClick={handleClearChat} className="clear-button">
            Clear Chat
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="clear-button"
              style={{ marginLeft: '8px' }}
              aria-label="Close chatbot"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {state.messages.length === 0 ? (
          <div className="welcome-message">
            <p>Hello! I'm your Physical AI & Humanoid Robotics assistant.</p>
            <p>Ask me anything about the book content, or highlight text and ask me to "Explain this".</p>
          </div>
        ) : (
          state.messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role}`}
              aria-live={message.role === 'assistant' ? 'polite' : 'off'}
              aria-atomic="true"
            >
              <div className="message-content">
                {message.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              {message.citations && message.citations.length > 0 && (
                <div className="citations">
                  <details>
                    <summary>Sources ({message.citations.length})</summary>
                    <ul>
                      {message.citations.map((citation, idx) => (
                        <li key={idx}>
                          <a href={citation.source} target="_blank" rel="noopener noreferrer">
                            {citation.text_snippet.substring(0, 100)}...
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}
            </div>
          ))
        )}
        {state.isLoading && (
          <div className="message assistant">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        {state.error && (
          <div className="error-message" role="alert">
            {state.error}
          </div>
        )}
        <div className="input-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question about the book content..."
            rows={2}
            aria-label="Type your question here"
            disabled={state.isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || state.isLoading}
            aria-label="Send message"
          >
            {state.isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;