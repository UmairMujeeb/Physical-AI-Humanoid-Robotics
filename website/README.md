# Physical AI & Humanoid Robotics Book

A comprehensive guide to Physical AI & Humanoid Robotics with hands-on learning focus. This Docusaurus-based educational book targets beginners to intermediate learners, emphasizing practical exercises and simulations over expensive hardware.

## Overview

This book provides:
- 70-80% hands-on learning content with executable code examples
- Focus on free/open-source simulations (Gazebo, Unity) instead of expensive hardware
- Comprehensive coverage of ROS 2, NVIDIA Isaac, and VLA models
- Ethical discussions integrated throughout practical implementations
- Accessibility for beginners to intermediate learners

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

The site supports dual deployment to both GitHub Pages and Vercel:

### GitHub Pages
```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

### Vercel
For Vercel deployment, the site will automatically detect and build the static files when you push to your repository.

## Project Structure

- `docs/intro/` - Introduction module with getting started and overview
- `docs/ros2/` - ROS 2 fundamentals and concepts
- `docs/gazebo-unity/` - Simulation environments for robotics
- `docs/nvidia-isaac/` - NVIDIA Isaac robotics platform
- `docs/vla-capstone/` - Vision Language Action models and capstone project
- `docs/appendices/` - Additional resources, glossary, and references

## Learning Approach

Each lesson follows a consistent structure:
1. Learning Objectives
2. Theoretical Background
3. Hands-On Tutorials with executable code
4. Simulation Environment instructions
5. Exercises for practice
6. Ethical Considerations
7. Key Takeaways
8. Further Reading

## Contributing

To contribute to this book:
1. Fork the repository
2. Create a new branch for your content
3. Add your content following the lesson template structure
4. Submit a pull request with your changes
