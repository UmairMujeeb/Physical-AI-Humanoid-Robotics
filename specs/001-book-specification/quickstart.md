# Quickstart Guide for Physical AI & Humanoid Robotics Book Development

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git
- Basic knowledge of Markdown and JavaScript/React

## Setup Docusaurus Environment

1. **Install Docusaurus globally**:
```bash
npm install -g @docusaurus/core@latest
```

2. **Initialize a new Docusaurus project**:
```bash
npx create-docusaurus@latest website classic
```

3. **Navigate to project directory**:
```bash
cd website
```

4. **Install additional dependencies for interactive content**:
```bash
npm install @docusaurus/module-type-aliases @docusaurus/types
npm install prism-react-renderer  # For code highlighting
npm install @docusaurus/preset-classic  # For classic preset
```

## Configuration Setup

1. **Update docusaurus.config.js** with the following settings:
```javascript
module.exports = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'A comprehensive guide to robotics with hands-on learning',
  favicon: 'img/favicon.ico',

  url: 'https://your-username.github.io', // Replace with your URL
  baseUrl: '/physical-ai-book/',

  organizationName: 'your-username', // GitHub username
  projectName: 'physical-ai-book', // GitHub repo name

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',  // Serve docs at root
          editUrl: 'https://github.com/your-username/physical-ai-book/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themes: [
    // Add live code blocks plugin if needed
  ],

  plugins: [
    // Add additional plugins as needed
  ],
};
```

2. **Create custom CSS** in `src/css/custom.css` for robot-themed styling:
```css
/* Custom robot-themed styles */
:root {
  --ifm-color-primary: #2563eb;
  --ifm-color-primary-dark: #1d4ed8;
  --ifm-color-primary-darker: #1a47c4;
  --ifm-color-primary-darkest: #153a9f;
  --ifm-color-primary-light: #3b82f6;
  --ifm-color-primary-lighter: #60a5fa;
  --ifm-color-primary-lightest: #93c5fd;
}

/* Additional custom styles for educational content */
.lesson-objectives {
  background-color: #f0f9ff;
  border-left: 4px solid #2563eb;
  padding: 1rem;
  margin: 1rem 0;
}

.hands-on-section {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
}
```

## Running the Development Server

1. **Start the development server**:
```bash
npm run start
```

2. **Build for production preview**:
```bash
npm run build && npm run serve
```

## Creating Content Structure

1. **Create the docs folder structure**:
```
docs/
├── intro/
│   ├── _category_.json
│   ├── getting-started.md
│   └── overview.md
├── ros2/
│   ├── _category_.json
│   ├── basics.md
│   ├── nodes.md
│   └── topics.md
├── gazebo-unity/
│   ├── _category_.json
│   ├── simulation-basics.md
│   └── physics-engines.md
├── nvidia-isaac/
│   ├── _category_.json
│   ├── introduction.md
│   └── perception.md
├── vla-capstone/
│   ├── _category_.json
│   └── capstone-project.md
└── appendices/
    ├── _category_.json
    ├── glossary.md
    └── resources.md
```

2. **Create category files** (e.g., `docs/ros2/_category_.json`):
```json
{
  "label": "ROS 2 Module",
  "position": 3,
  "link": {
    "type": "generated-index",
    "description": "Learn about Robot Operating System 2"
  }
}
```

## Creating Your First Chapter

1. **Create a new markdown file** in the appropriate module folder
2. **Use frontmatter** to specify metadata:
```markdown
---
title: Your Chapter Title
description: A brief description of this chapter
sidebar_position: 1
---

# Chapter Title

## Learning Objectives
- Objective 1
- Objective 2

## Introduction
Brief introduction to the topic...

## Theory
Theoretical concepts...

## Hands-On Tutorial
Step-by-step practical tutorial...

## Exercise
Practice exercise for the learner...

## Key Takeaways
- Key point 1
- Key point 2

## Further Reading
- Resource 1
- Resource 2
```

## Deployment

1. **Deploy to GitHub Pages**:
```bash
GIT_USER=<Your GitHub username> \
  CURRENT_BRANCH=main \
  USE_SSH=true \
  npm run deploy
```

2. **For Vercel deployment**, push your code to a GitHub repository and connect it to Vercel.