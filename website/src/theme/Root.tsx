import React from 'react';
import { useLocation } from '@docusaurus/router';
import ChatbotWrapper from '@site/src/components/ChatbotWrapper/ChatbotWrapper';
import ScrollToTopButton from '@site/src/components/Navigation/ScrollToTopButton';

// This Root component will wrap the entire Docusaurus application
export default function Root({ children }) {
  const location = useLocation();

  // Check if we're on a documentation page
  const isDocsPage = location.pathname.startsWith('/docs/') || location.pathname === '/';

  return (
    <>
      {children}
      <ChatbotWrapper position="floating" />
      <ScrollToTopButton />
    </>
  );
}