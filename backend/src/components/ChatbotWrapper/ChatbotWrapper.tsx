/**
 * Chatbot wrapper component for Docusaurus integration
 */

import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const ChatbotWrapper = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsVisible(!isVisible);
  };

  // Close chatbot
  const closeChatbot = () => {
    setIsVisible(false);
  };

  // Initialize chatbot when component mounts
  useEffect(() => {
    // Check if component is running in browser
    if (typeof window !== 'undefined') {
      setHasLoaded(true);
    }
  }, []);

  return (
    <BrowserOnly>
      {() => {
        if (!hasLoaded) {
          return <div>Loading chatbot...</div>;
        }

        // Dynamically import the actual chatbot component
        const ChatbotComponent = require('../../../../frontend/src/components/Chatbot/Chatbot').default;

        return (
          <>
            {/* Floating chatbot button */}
            {!isVisible && (
              <button
                onClick={toggleChatbot}
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px',
                  zIndex: 1000,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                }}
                aria-label="Open chatbot"
              >
                💬
              </button>
            )}

            {/* Chatbot container */}
            {isVisible && (
              <div
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  width: '400px',
                  height: '600px',
                  zIndex: 1000,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '10px 15px',
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Physical AI & Robotics Assistant</h3>
                  <button
                    onClick={closeChatbot}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      fontSize: '18px',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                    aria-label="Close chatbot"
                  >
                    ×
                  </button>
                </div>
                <div style={{ height: 'calc(100% - 50px)', overflow: 'hidden' }}>
                  <ChatbotComponent />
                </div>
              </div>
            )}
          </>
        );
      }}
    </BrowserOnly>
  );
};

export default ChatbotWrapper;