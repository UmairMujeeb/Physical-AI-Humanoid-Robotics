---
id: 2
title: Create Book Plan
stage: plan
date: 2025-12-14
surface: agent
model: Claude Sonnet 4.5
feature: book-specification
branch: 001-book-specification
user: Pc
command: /sp.plan
labels: [plan,book,physical-ai,robotics,docusaurus]
links:
  spec: specs/001-book-specification/spec.md
  plan: specs/001-book-specification/plan.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-book-specification/plan.md
 - specs/001-book-specification/research.md
 - specs/001-book-specification/data-model.md
 - specs/001-book-specification/quickstart.md
 - specs/001-book-specification/contracts/
 - history/prompts/book-specification/2-create-book-plan.plan.prompt.md
tests:
 - none
---

## Prompt

comprehensive development plan (plan.md) for building the Docusaurus-based book "Physical AI & Humanoid Robotics".

This regenerated plan must fully inherit and comply with the project's Constitution (.specify/memory/constitution.md) and Specification (.specify/memory/specification.md), including all principles, constraints, quality standards, hands-on focus (≥80% per chapter), ethical rigor, accessibility, and brand voice.

The plan must be phased, actionable, and optimized for an AI/spec-driven workflow using Spec-Kit Plus and Claude Code. Ensure the plan is designed to produce "zero errors" in future /sp.analyze runs by proactively addressing all potential gaps, such as ensuring tasks for hands-on tutorials, readability checks (Flesch-Kincaid 8-12), ethical discussions, and simulation testing/validation cover AT LEAST 14 of 17 chapters (or all functional requirements).

Incorporate fixes based on the previous /sp.analyze findings (e.g., CRITICAL issues on hands-on ratio, readability, ethics; HIGH issues on simulation testing and performance ambiguity). Focus explicitly on all chapters and modules (Introduction, ROS 2, Gazebo/Unity, NVIDIA Isaac, VLA/Capstone, Appendices) to ensure full coverage.

Key requirements to include and expand upon:

1. Docusaurus Setup Steps and Configuration
   - Detailed repository initialization and Spec-Kit Plus setup.
   - Step-by-step Docusaurus installation (using the classic template, latest version as of December 2025, e.g., Docusaurus 3.x+).
   - Key updates to docusaurus.config.js: site metadata, theme settings (dark mode, search), plugins (e.g., live-codeblock for interactive code, ideal-image, MDX support), docs configuration (routeBasePath: '/', sidebarPath), custom CSS for robot-themed branding.
   - Create a custom home page (index.md or homepage component) describing the book: Include overview, target audience (beginners-intermediate), hands-on focus, modules summary, and call-to-action for navigation.
   - Initial deployment setup: GitHub Pages (gh-pages script) and Vercel integration, plus basic GitHub Actions CI/CD workflow.
   - Local server deployment: Explicit steps for running on local server via npm (e.g., npm run start for development server, npm run build && npm run serve for production preview).

2. Content Development Phase
   - Phased rollout timeline (estimated 8-12 weeks total), with explicit focus on all chapters/modules.
   - Chapter-by-chapter workflow: spec refinement (/sp.specify per chapter) → planning (/sp.plan per section) → AI-assisted content generation (/sp.implement with Claude Code) → human review/edit (including readability/ethics checks) → asset creation → commit (/sp.git.commit_pr).
   - Grouping of chapters by sections (Intro → ROS 2 → Gazebo/Unity → NVIDIA Isaac → VLA/Capstone → Appendices), with milestones ensuring 100% coverage of the 14 chapters + 3 appendices.
   - Quality gates and review criteria per chapter: Hands-on ratio ≥80% (tutorials, code, exercises), readability compliance, ethical discussions, simulation testing, accuracy sourcing.
   - Emphasize executable code (Python/rclpy), simulations (Gazebo/Isaac Sim/Colab links), and step-by-step exercises runnable without expensive hardware.

3. File Structure for Chapters and Lessons
   - Recommended docs/ folder structure with nested sections (e.g., docs/intro/, docs/ros2/, etc.) and _category_.json files for sidebar labels.
   - Detailed example of full file tree, including home page (e.g., docs/home.md or custom src/pages/index.js).
   - How lessons are implemented within chapter .md/.mdx files (frontmatter, ## headings for lessons, consistent formatting with objectives, theory, hands-on, exercises, takeaways).
   - Sidebar configuration (sidebars.js – manual for custom order, including home page link).
   - Asset management (static/img/ for diagrams/screenshots/videos).

Additional instructions:
- Integrate Context7 MCP Server for enhanced code accuracy across all phases:
  - Setup in Phase 1: Installation command (e.g., npx -y @upstash/context7-mcp@latest or client-specific like npx -y @smithery/cli install @upstash/context7-mcp --client claude).
  - Usage: In all code/content generation prompts, include "use context7" for up-to-date docs on libraries (Docusaurus, ROS 2, React/MDX, NVIDIA Isaac, Gazebo). Auto-trigger for setups/configs to avoid outdated APIs.
  - Benefits: Ensures accurate, version-specific examples in hands-on sections, reducing hallucinations in robotics simulations and Docusaurus configs.
- Include a final Polish, Testing, and Deployment phase: Interactivity enhancements (live code blocks, embeds), SEO, full build (npm run build), local testing (npm run serve), mobile/responsiveness checks, dual deployment (GitHub Pages + Vercel).
- Integrate Spec-Kit Plus commands throughout (/sp.specify, /sp.plan, /sp.tasks, /sp.implement, /sp.git.commit_pr, /sp.analyze for validation).
- Perform proactive gap analysis in the plan: Address mismatches (e.g., hardware to simulations/cloud), add CI/CD, interactivity plugins, asset handling, testing to ensure zero critical/high issues.
- Emphasize accessibility adaptations (simulation-first, cloud alternatives like AWS RoboMaker, Colab links).
- End with milestones per phase, success criteria for zero-error (e.g., pass /sp.analyze cleanly), and a note on storing this as .specify/memory/plan.md before committing.

Generate the full plan.md content in clear, structured Markdown with headings, bullets, and code blocks where appropriate for commands/config snippets.

## Response snapshot

I have created a comprehensive implementation plan for the Physical AI & Humanoid Robotics book project. The plan includes:

- A complete implementation plan (plan.md) with technical context, constitution check, project structure, and phased implementation approach
- Research outcomes documenting technology stack decisions, simulation environment, content structure, and deployment strategy
- Data model for book entities including chapters, lessons, code examples, simulation environments, assessments, and resources
- Quickstart guide with setup instructions for Docusaurus environment, configuration, and content creation
- API contracts directory structure

The plan addresses all requirements from the user, including:
- Full compliance with Constitution principles and specification requirements
- Docusaurus setup with configuration for site metadata, theme settings, plugins, and robot-themed branding
- Content development phase with chapter-by-chapter workflow using Spec-Kit Plus commands
- File structure with nested modules and proper organization
- Quality gates ensuring ≥80% hands-on ratio, readability compliance, ethical discussions, and simulation testing
- Integration of Context7 MCP Server for enhanced code accuracy
- Polish, testing, and deployment phase with interactivity enhancements and dual deployment strategy

All artifacts were created in the specs/001-book-specification/ directory with proper documentation structure.

## Outcome

- ✅ Impact: Created comprehensive implementation plan aligned with Constitution and specification
- 🧪 Tests: none
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, and contracts/ in specs/001-book-specification/
- 🔁 Next prompts: /sp.tasks to create implementation tasks
- 🧠 Reflection: The plan provides a complete roadmap for implementing the Docusaurus-based book with all required features

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): not applicable
- Prompt variant (if applicable): not applicable
- Next experiment (smallest change to try): Begin creating implementation tasks with /sp.tasks