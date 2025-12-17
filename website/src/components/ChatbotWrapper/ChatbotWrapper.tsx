import React, { useState, useEffect, lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import type { FunctionComponent } from 'react';

// Import CSS for styling
import './ChatbotWrapper.css';

// Dynamically import the chatbot component to avoid SSR issues
const Chatbot = lazy(() => import('@site/src/components/Chatbot/Chatbot'));

interface ChatbotWrapperProps {
  initialQuery?: string;
  context?: string;
  position?: 'floating' | 'inline';
  className?: string;
}

const ChatbotWrapper: FunctionComponent<ChatbotWrapperProps> = ({
  initialQuery = '',
  context = '',
  position = 'floating',
  className = ''
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render on client side to avoid SSR issues
  if (!isMounted) {
    return <div>Loading chatbot...</div>;
  }

  // For floating chatbot, we'll render a button that toggles visibility
  if (position === 'floating') {
    return (
      <BrowserOnly>
        {() => (
          <>
            {!isOpen && (
              <button
                className="chatbot-toggle-button"
                onClick={() => setIsOpen(true)}
                aria-label="Open chatbot"
              >
                💬
              </button>
            )}
            {isOpen && (
              <div className={`chatbot-floating-wrapper ${className}`}>
                <Suspense fallback={<div>Loading chatbot...</div>}>
                  <Chatbot
                    initialQuery={initialQuery}
                    context={context}
                    onClose={() => setIsOpen(false)}
                  />
                </Suspense>
              </div>
            )}
          </>
        )}
      </BrowserOnly>
    );
  }

  // For inline chatbot, render directly in the page
  return (
    <BrowserOnly>
      {() => (
        <div className={`chatbot-inline-wrapper ${className}`}>
          <Suspense fallback={<div>Loading chatbot...</div>}>
            <Chatbot
              initialQuery={initialQuery}
              context={context}
            />
          </Suspense>
        </div>
      )}
    </BrowserOnly>
  );
};

export default ChatbotWrapper;