import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Manual sidebar configuration for Physical AI & Humanoid Robotics book
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['intro/getting-started', 'intro/overview', 'intro/lesson-template'],
      link: {
        type: 'doc',
        id: 'intro/getting-started',
      },
    },
    {
      type: 'category',
      label: 'ROS 2 Fundamentals',
      items: ['ros2/basics', 'ros2-sandbox'],
      link: {
        type: 'doc',
        id: 'ros2/basics',
      },
    },
    {
      type: 'category',
      label: 'Gazebo & Unity Simulation',
      items: ['gazebo-unity/introduction'],
      link: {
        type: 'doc',
        id: 'gazebo-unity/introduction',
      },
    },
    {
      type: 'category',
      label: 'NVIDIA Isaac',
      items: ['nvidia-isaac/introduction', 'nvidia-isaac/perception', 'nvidia-isaac/manipulation'],
      link: {
        type: 'doc',
        id: 'nvidia-isaac/introduction',
      },
    },
    {
      type: 'category',
      label: 'VLA & Capstone Module',
      items: ['vla-capstone/capstone-project'],
      link: {
        type: 'doc',
        id: 'vla-capstone/capstone-project',
      },
    },
    {
      type: 'category',
      label: 'Appendices',
      items: [
        'appendices/glossary',
        'appendices/hardware-alternatives',
        'appendices/assessments',
        'appendices/resources',
        'interactive-features',
        'interactive-demos',
        'performance-optimization',
        'accessibility',
        'analytics-implementation',
        'responsiveness-testing',
        'cross-browser-testing',
        'readability-analysis',
        'code-examples-verification',
        'hands-on-ratio-compliance',
        'ethical-considerations',
        'constitution-compliance-review',
        'content-creation-workflow',
        'maintenance-guide',
        'cross-references-guide',
        'chatbot/index',
        'chatbot/integration'
      ],
      link: {
        type: 'doc',
        id: 'appendices/glossary',
      },
    },
  ],
};

export default sidebars;
