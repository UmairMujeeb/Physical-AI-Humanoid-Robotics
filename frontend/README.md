# Physical AI & Humanoid Robotics Chatbot Frontend

This directory contains the React-based frontend for the Physical AI & Humanoid Robotics book chatbot, featuring interactive code execution, 3D visualizations, and seamless integration with the Docusaurus documentation site.

## 🚀 Features

- **Interactive Chat Interface**: Real-time chat with the RAG-powered assistant
- **Code Execution**: Browser-based Python execution using Pyodide
- **3D Visualizations**: Interactive robot arm and path planning demos using Three.js
- **Responsive Design**: Mobile-friendly interface for all device sizes
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Real-time Feedback**: Streaming responses and typing indicators

## 🛠 Tech Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: CSS Modules and custom CSS
- **Visualization**: Three.js for 3D graphics
- **Runtime**: Pyodide for in-browser Python execution
- **Build Tool**: Vite or Create React App
- **Testing**: Jest and React Testing Library

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Setup Instructions
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Or if using yarn
yarn install
yarn start
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root of the frontend directory:

```env
# Backend API URL
REACT_APP_API_BASE_URL=http://localhost:8000
# or for production:
# REACT_APP_API_BASE_URL=https://your-backend-domain.com

# Optional: Analytics
REACT_APP_GA_MEASUREMENT_ID=G-YOUR-GA-ID
```

### Development Scripts
- `npm start` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## 🏗 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── Chatbot/        # Main chatbot components
│   │   ├── CodeBlock/      # Interactive code components
│   │   ├── Visualization/  # 3D visualization components
│   │   └── UI/             # Common UI components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and utility services
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Global styles and CSS
│   └── App.tsx             # Main application component
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Build configuration (if using Vite)
```

## 🧩 Key Components

### Chatbot Components
- `Chatbot.tsx` - Main chat interface with message history
- `Message.tsx` - Individual message display component
- `ChatInput.tsx` - Input area with text area and send button
- `CitationDisplay.tsx` - Shows sources for chatbot responses

### Interactive Code Components
- `InteractiveCodeBlock.tsx` - Browser-based Python execution
- `CodeEditor.tsx` - Syntax-highlighted code editor
- `CodeOutput.tsx` - Displays execution results

### 3D Visualization Components
- `RobotArmDemo.tsx` - Interactive 3D robot arm visualization
- `PathPlanningDemo.tsx` - Path planning algorithm visualization
- `Scene3D.tsx` - Generic 3D scene component

### UI Components
- `Button.tsx` - Accessible button component
- `ThemeProvider.tsx` - Theme context provider
- `LoadingSpinner.tsx` - Loading indicators

## 🔌 API Integration

The frontend communicates with the backend API through these endpoints:

### Chat API
- `POST /api/chat` - Send a message and get a response
- `GET /api/health` - Health check endpoint

### Example API Call
```typescript
interface ChatRequest {
  query: string;
  context?: string; // Selected text context
  conversation_id?: string;
}

interface ChatResponse {
  answer: string;
  citations: Citation[];
  conversation_id: string;
  tokens_used: number;
  processing_time: number;
}

interface Citation {
  document_id: string;
  source: string;
  text_snippet: string;
}
```

## 🎨 Styling Approach

- **Component-specific styles**: CSS Modules for scoped styling
- **Global styles**: Custom CSS for consistent theming
- **Responsive design**: Mobile-first approach with media queries
- **Accessibility**: Proper contrast, focus indicators, ARIA labels

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

Tests are written using Jest and React Testing Library with:
- Component rendering tests
- User interaction simulations
- Accessibility checks
- API integration mocks

### E2E Tests
Coming soon with Playwright or Cypress integration.

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Static Hosting
The build output in the `build/` directory can be hosted on:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

### Environment-Specific Configuration
Use environment variables for different deployment targets:
- Development: `REACT_APP_API_BASE_URL=http://localhost:8000`
- Staging: `REACT_APP_API_BASE_URL=https://staging.yourdomain.com`
- Production: `REACT_APP_API_BASE_URL=https://api.yourdomain.com`

## 🧭 Navigation Integration

The chatbot is designed to integrate seamlessly with the Docusaurus site:
- Floating chat button appears on all pages
- Context-aware responses based on current page content
- Text selection integration for "Explain this" functionality

## 📱 Mobile Support

- Touch-friendly controls and targets
- Responsive layout for all screen sizes
- Optimized performance for mobile devices
- Orientation change handling

## 🔒 Security Considerations

- API calls use secure HTTPS connections
- No sensitive data stored in frontend
- Proper input sanitization
- CSRF protection through tokens
- Content Security Policy enforcement

## 🚨 Error Handling

- Graceful degradation when APIs are unavailable
- User-friendly error messages
- Offline support where possible
- Fallback mechanisms for critical functionality

## 📈 Performance Optimization

- Code splitting for faster initial loads
- Lazy loading of non-critical components
- Image optimization and compression
- Efficient state management
- Memoization of expensive computations

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers with similar versions

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Commit changes with conventional commits
7. Push to your fork
8. Create a pull request

### Code Standards
- Follow React best practices
- Use TypeScript for type safety
- Write accessible components
- Maintain consistent styling
- Add appropriate comments and documentation

## 🐛 Troubleshooting

### Common Issues
- **API calls failing**: Check if backend is running and CORS is configured
- **3D visualizations not working**: Ensure browser supports WebGL
- **Code execution errors**: Verify Pyodide is loading correctly
- **Performance issues**: Check browser console for errors

### Debugging
- Use React Developer Tools
- Check browser console for errors
- Monitor network requests
- Use component state inspection

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and TypeScript
- Interactive code execution with Pyodide
- 3D visualizations with Three.js
- Styled with CSS Modules
- Tested with Jest and React Testing Library

---

*Part of the Physical AI & Humanoid Robotics educational project*