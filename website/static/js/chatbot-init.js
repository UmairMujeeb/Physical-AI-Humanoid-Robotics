/**
 * Chatbot initialization script for Docusaurus
 * This script adds the floating chatbot to the page after it loads
 */

// Wait for the page to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create a container for the chatbot
  const chatbotContainer = document.createElement('div');
  chatbotContainer.id = 'chatbot-container';
  chatbotContainer.style.display = 'none';
  document.body.appendChild(chatbotContainer);

  // Function to initialize the chatbot
  function initializeChatbot() {
    // Check if React and the chatbot component are available
    if (window.React && window.ReactDOM) {
      try {
        // This would dynamically load the chatbot component
        // In a real implementation, we'd use the Docusaurus component
        console.log('Chatbot initialized');
      } catch (error) {
        console.error('Error initializing chatbot:', error);
      }
    }
  }

  // Initialize when DOM is ready
  initializeChatbot();

  // Add functionality to highlight text and ask the chatbot about it
  document.addEventListener('mouseup', function() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText && selectedText.length > 10) { // Only for meaningful selections
      // Store the selected text in case the user wants to ask about it
      sessionStorage.setItem('selectedText', selectedText);
    }
  });
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {};
}