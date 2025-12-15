# Physical AI & Humanoid Robotics Book

A comprehensive guide to Physical AI & Humanoid Robotics with hands-on learning focus, built with Docusaurus. This educational resource covers ROS 2, Gazebo, NVIDIA Isaac, and VLA models for advanced robotics applications.

## 📚 Overview

The Physical AI & Humanoid Robotics book is an educational platform designed for beginners to intermediate learners, emphasizing hands-on learning through simulations, code tutorials, and exercises. The content prioritizes accessibility by focusing on free/open-source simulations rather than expensive hardware.

### Key Features

- **Interactive Learning**: 70-80% hands-on ratio with interactive code blocks and simulations
- **Accessible Design**: WCAG 2.1 AA compliant with comprehensive accessibility features
- **Modern Framework**: Built with Docusaurus v3.9.2 for optimal performance
- **Cross-Platform**: Supports multiple simulation environments (Gazebo, Unity, Isaac Sim)
- **Ethical Focus**: Integrated ethical discussions in all practical implementations
- **Performance Optimized**: Fast loading with modern web standards

### Course Structure

1. **Introduction**: Getting started with robotics concepts
2. **ROS 2 Fundamentals**: Core ROS 2 concepts with interactive examples
3. **Gazebo & Unity Simulation**: Physics simulation and environment creation
4. **NVIDIA Isaac**: Perception, manipulation, and AI integration
5. **VLA & Capstone Module**: Vision-language-action models and capstone project

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/physical-ai-humanoid-robotics-book/physical-ai-humanoid-robotics-book.git
cd physical-ai-humanoid-robotics-book/website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

This will start the development server at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
```

The built site will be available in the `build` directory.

## 📖 Documentation Structure

```
website/
├── docs/                 # Course content and documentation
│   ├── intro/           # Introduction materials
│   ├── ros2/            # ROS 2 fundamentals
│   ├── gazebo-unity/    # Simulation content
│   ├── nvidia-isaac/    # NVIDIA Isaac content
│   ├── vla-capstone/    # Capstone module
│   └── appendices/      # Additional resources
├── src/                 # Custom React components
│   └── components/      # Interactive components
├── static/              # Static assets
└── docusaurus.config.ts # Site configuration
```

## 🧩 Interactive Features

### Interactive Code Blocks
Run Python code directly in your browser using Pyodide:
- Browser-based Python execution
- Real-time code modification
- Immediate output feedback
- Robotics-specific examples

### 3D Visualizations
Interactive 3D robot visualizations using Three.js:
- Robot kinematics demonstrations
- Real-time manipulation visualization
- Interactive controls and parameters

### Code Sandbox
Advanced code execution environment:
- Full Python environment in browser
- Console output and error handling
- Reset and clear functionality
- Multiple example scenarios

## 🎨 Custom Components

The site includes several custom React components for enhanced learning:

- `InteractiveCodeBlock`: Browser-based Python execution
- `LessonStructure`: Consistent lesson formatting
- `RobotArmDemo`: 3D robot arm visualization
- `PathPlanningDemo`: Interactive path planning algorithm
- `CodeSandbox`: Advanced code execution environment

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `website` directory for environment-specific configurations:

```env
# Google Analytics (optional)
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Algolia Search (optional)
ALGOLIA_APP_ID=YOUR_APP_ID
ALGOLIA_SEARCH_API_KEY=YOUR_API_KEY
ALGOLIA_INDEX_NAME=physical-ai-humanoid-robotics
```

### Site Configuration
Edit `docusaurus.config.ts` to customize:
- Site metadata and SEO settings
- Navigation structure
- Analytics integration
- Theme customization
- Plugin configurations

## 📱 Responsive Design

The site is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)

All interactive components maintain functionality across device sizes.

## 🔍 SEO & Performance

- **SEO Optimized**: Proper metadata, sitemaps, and structured data
- **Fast Loading**: Optimized assets, code splitting, and lazy loading
- **Search Integration**: Algolia search functionality
- **Analytics Ready**: Google Analytics integration

## 🌐 Deployment

### GitHub Pages
The site is configured for GitHub Pages deployment:
- Built-in GitHub Actions workflow
- Automatic deployment on main branch updates
- Custom domain support

### Vercel
Vercel deployment configuration included:
- `vercel.json` configuration file
- Automatic builds and deployments
- Preview deployments for pull requests

## 🧪 Testing & Quality Assurance

### Browser Compatibility
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper semantic HTML structure

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add documentation for new features
5. Test your changes locally (`npm start`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Content Guidelines
- Maintain 70-80% hands-on ratio
- Include ethical discussions in practical implementations
- Follow accessibility best practices
- Use clear, concise language appropriate for target audience
- Include interactive elements where appropriate

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Project Documentation](https://physical-ai-humanoid-robotics-book.github.io)

### Community
- GitHub Issues for bug reports and feature requests
- GitHub Discussions for questions and community support

## 🙏 Acknowledgments

- Built with [Docusaurus](https://docusaurus.io/)
- Interactive code execution with [Pyodide](https://pyodide.org/)
- 3D visualizations with [Three.js](https://threejs.org/)
- Open-source robotics tools: [ROS 2](https://ros.org/), [Gazebo](https://gazebosim.org/)

## 📊 Analytics

The site includes Google Analytics for tracking user engagement and improving the learning experience. All tracking is done in compliance with privacy regulations and user consent requirements.

---

*This project is part of the Physical AI & Humanoid Robotics educational initiative, designed to make advanced robotics education accessible to learners worldwide.*