---
id: 1
title: Create Project Constitution
stage: constitution
date: 2025-12-13
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user: Pc
command: /sp.constitution
labels: [constitution,spec-driven,physical-ai,robotics]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

Create a comprehensive project constitution for an AI/spec-driven book creation project titled "Physical AI & Humanoid Robotics".

The book is a digital documentation-style book built as a static site using Docusaurus, targeted at beginners to intermediate learners, with a strong emphasis on hands-on learning (practical tutorials, code examples, simulations, and exercises).

Key project details:
- AI/Spec-Driven workflow: Use Spec-Kit Plus[](https://github.com/panaversity/spec-kit-plus/) for managing specifications, plans, tasks, and history. Use Claude Code for code generation, refinement, and implementation.
- Tech stack: Docusaurus for the documentation site and book content (Markdown-based pages, sidebar navigation, versioning, search, etc.).
- Deployment: Push the repository to GitHub (public repo preferred). Deploy the site to both GitHub Pages and Vercel for redundancy and faster previews.
- Focus: Hands-on learning – every major section/chapter must include executable code snippets, tutorials, simulations (e.g., using ROS, Gazebo, or simple Python setups), and step-by-step exercises that readers can replicate with affordable hardware or free simulators.

Structure the constitution.md with the following required sections:
- Project Overview
- Core Concept
- Core Principles
- Global Principles (Quality Standards) – make them testable and measurable where possible
- Constraints (scope, timeline, tech restrictions, audience alignment)
- Stakeholders
- Brand Voice (also referred to as "brain voice" – educational, engaging, conversational, mentor-like tone)

Additional guidelines for the constitution:
- Emphasize accessibility: Beginner-friendly language, glossaries, progressive difficulty.
- Hands-on priority: At least 70-80% of chapters include practical elements.
- Ethical considerations: Promote safe robotics practices, bias mitigation, and responsible AI.
- Technical standards: Content accuracy traceable to sources, readability (e.g., Flesch-Kincaid 8-12), no plagiarism, consistent Docusaurus formatting.
- Deployment readiness: All builds must work on GitHub Pages and Vercel; use CI/CD where possible.
- Success criteria: Measurable outcomes like complete chapters, live deployments, and alignment with hands-on focus.

Make all standards clear, testable, and non-negotiable. Ensure the constitution guides all future /sp.specify, /sp.plan, /sp.tasks, and /sp.implement phases.

After generating, store it as .specify/memory/constitution.md and suggest committing it to Git.

## Response snapshot

I have created the comprehensive project constitution for the "Physical AI & Humanoid Robotics" book project. The constitution includes all required sections:

- Project Overview: Describes the aim to create a digital documentation-style book using Docusaurus
- Core Concept: Explains the educational resource bridging theory with practical implementation
- Core Principles: Six key principles including hands-on learning priority, accessibility, AI/Spec-driven development, technical accuracy, ethical considerations, and deployment-ready content
- Global Principles: Quality standards covering readability, technical standards, and quality assurance
- Constraints: Scope, timeline, and audience alignment constraints
- Stakeholders: Identifies primary and secondary stakeholders
- Brand Voice: Defines the educational, engaging, conversational, mentor-like tone

The constitution has been saved to .specify/memory/constitution.md with version 1.0.0 and appropriate governance sections. All requirements from the user have been implemented.

## Outcome

- ✅ Impact: Created initial project constitution document with all required sections
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with comprehensive constitution
- 🔁 Next prompts: /sp.specify to create feature specifications
- 🧠 Reflection: The constitution establishes clear governance for the AI/spec-driven book creation project

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): not applicable
- Prompt variant (if applicable): not applicable
- Next experiment (smallest change to try): Begin creating feature specifications using /sp.specify