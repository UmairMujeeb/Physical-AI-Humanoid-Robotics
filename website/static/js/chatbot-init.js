/**
 * Chatbot initialization script for Docusaurus
 * This script initializes the chatbot component after the page loads
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Create a container for the chatbot if it doesn't exist
    let chatbotContainer = document.getElementById('chatbot-container');

    if (!chatbotContainer) {
      // Create the chatbot container
      chatbotContainer = document.createElement('div');
      chatbotContainer.id = 'chatbot-container';
      document.body.appendChild(chatbotContainer);
    }

    // Initialize the chatbot after a small delay to ensure all page content is loaded
    setTimeout(() => {
      initializeChatbot();
    }, 1000);
  }
});

function initializeChatbot() {
  // Check if the chatbot component is already loaded
  if (window.ChatbotInitialized) {
    console.log('Chatbot already initialized');
    return;
  }

  // Set a flag to indicate the chatbot has been initialized
  window.ChatbotInitialized = true;

  console.log('Initializing Physical AI & Humanoid Robotics Chatbot');

  // Set the API base URL for the chatbot
  window.CHATBOT_API_BASE_URL = window.CHATBOT_API_BASE_URL ||
                                process.env.REACT_APP_API_BASE_URL ||
                                'http://localhost:8000';

  // Create the floating chatbot button if it doesn't exist
  createFloatingChatbot();

  // Initialize text selection functionality
  initializeTextSelection();

  // Add keyboard shortcuts
  initializeKeyboardShortcuts();
}

function createFloatingChatbot() {
  // This function would normally render the React component
  // In a real implementation, this would use React's render function
  console.log('Floating chatbot created');
}

function initializeTextSelection() {
  // Add event listener for text selection
  document.addEventListener('mouseup', function() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText && selectedText.length > 0) {
      // Store the selected text in case the user wants to use it
      window.LastSelectedText = selectedText;

      // In a real implementation, this would trigger the "Explain this" context menu
      console.log('Text selected:', selectedText.substring(0, 50) + (selectedText.length > 50 ? '...' : ''));
    }
  });
}

function initializeKeyboardShortcuts() {
  // Add keyboard shortcut to open chatbot (e.g., Ctrl/Cmd + Shift + C)
  document.addEventListener('keydown', function(event) {
    // Check for Ctrl/Cmd + Shift + C
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
      event.preventDefault();

      // In a real implementation, this would open the chatbot
      console.log('Chatbot keyboard shortcut triggered');

      // Show a temporary notification
      showNotification('Chatbot shortcut: Press this combination to open the chatbot');
    }
  });
}

function showNotification(message) {
  // Create a temporary notification element
  let notification = document.getElementById('chatbot-notification');

  if (notification) {
    notification.remove();
  }

  notification = document.createElement('div');
  notification.id = 'chatbot-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #007bff;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    max-width: 300px;
    word-wrap: break-word;
  `;

  document.body.appendChild(notification);

  // Remove the notification after 3 seconds
  setTimeout(() => {
    if (notification && notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Export functions for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeChatbot,
    createFloatingChatbot,
    initializeTextSelection,
    initializeKeyboardShortcuts
  };
}