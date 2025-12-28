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
    <div className="chatbot-container robot-themed-card">
      <div className="chatbot-header">
        <div className="robot-avatar">🤖</div>
        <h3>Physical AI & Robotics Assistant</h3>
        <div className="header-actions">
          <button
            onClick={handleClearChat}
            className="action-button"
            aria-label="Clear chat history"
          >
            🗑️
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="action-button"
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
            <div className="welcome-icon">🤖</div>
            <h4>Hi! I'm your Physical AI guide</h4>
            <p>Ask me anything about humanoid robotics or highlight text to dive deeper.</p>
          </div>
        ) : (
          state.messages.map((message) => (
            <div
              key={message.id}
              className={`message-bubble ${message.role}`}
              aria-live={message.role === 'assistant' ? 'polite' : 'off'}
              aria-atomic="true"
            >
              {message.role === 'assistant' && (
                <div className="avatar">🤖</div>
              )}
              <div className="message-content">
                {message.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}

                {message.citations && message.citations.length > 0 && (
                  <div className="citations-container">
                    <div className="citations-header">Sources:</div>
                    <div className="citations-list">
                      {message.citations.map((citation, idx) => (
                        <a
                          key={idx}
                          href={citation.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="citation-chip"
                        >
                          {citation.text_snippet.substring(0, 60)}...
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="avatar">👤</div>
              )}
            </div>
          ))
        )}
        {state.isLoading && (
          <div className="message-bubble assistant">
            <div className="avatar">🤖</div>
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
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
            className="robot-themed-input"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || state.isLoading}
            aria-label="Send message"
            className="robot-themed-button"
          >
            {state.isLoading ? 'Sending...' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;