/**
 * Floating chatbot component for Docusaurus integration
 * Provides a floating bubble that can be toggled to show/hide the chat interface
 */

import React, { useState, useEffect } from 'react';
import Chatbot from './Chatbot';
import SelectionHandler from '../SelectionHandler/SelectionHandler';

interface FloatingChatbotProps {
  initialQuery?: string;
  context?: string;
}

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ initialQuery = '', context = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  // Handle text selection from the SelectionHandler
  const handleSelection = (selectedText: string, position: { x: number; y: number }) => {
    setSelectedText(selectedText);
    setIsOpen(true); // Open the chatbot when text is selected
  };

  // Clear selection when chatbot is opened or closed
  const handleClearSelection = () => {
    setSelectedText('');
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      handleClearSelection();
    }
  };

  // Close chatbot when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        handleClearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Text selection handler - captures text selections across the page */}
      <SelectionHandler
        onSelection={handleSelection}
        onClear={handleClearSelection}
      />

      {/* Floating chat button */}
      {!isOpen && (
        <button
          className="floating-chat-button"
          onClick={toggleChatbot}
          aria-label="Open chatbot"
          title="Ask about the book content"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 15.01 3.02 16.32L2 22L7.68 20.98C8.99 21.64 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM9 17L8 16L8.5 15C8.5 15 8.7 14.39 9 14H10V11H8V10H12V13H14V12L15 11V10H16V11H17V12H16V13H14V14H13V17H12V18H9V17ZM15 15H16V16H15V15ZM15 13H16V14H15V13ZM13 11H15V12H13V11Z"
              fill="white"
            />
          </svg>
        </button>
      )}

      {/* Chatbot modal/popup */}
      {isOpen && (
        <div className="chatbot-modal-overlay" onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
          <div className="chatbot-modal">
            <Chatbot
              initialQuery={selectedText || initialQuery}
              context={context}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Add styles via script or CSS injection - in a real implementation, these would be in CSS files */}
      <style>{`
        .floating-chat-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #007bff;
          border: none;
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: all 0.3s ease;
        }

        .floating-chat-button:hover {
          transform: scale(1.1);
          background-color: #0056b3;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .floating-chat-button:focus {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }

        .chatbot-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .chatbot-modal {
          width: 100%;
          max-width: 500px;
          height: 70vh;
          max-height: 700px;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .chatbot-modal {
            max-width: 95%;
            height: 80vh;
            margin: 20px;
          }

          .floating-chat-button {
            bottom: 15px;
            right: 15px;
            width: 55px;
            height: 55px;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .floating-chat-button {
            border: 2px solid;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .floating-chat-button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingChatbot;