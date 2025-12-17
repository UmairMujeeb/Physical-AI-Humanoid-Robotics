import React from 'react';
import ChatbotWrapper from '@site/src/components/ChatbotWrapper/ChatbotWrapper';

// This Root component will wrap the entire Docusaurus application
export default function Root({ children }) {
  return (
    <>
      {children}
      <ChatbotWrapper position="floating" />
    </>
  );
}