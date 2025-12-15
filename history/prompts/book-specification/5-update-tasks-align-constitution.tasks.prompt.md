---
id: 5
title: Update Tasks Align Constitution
stage: tasks
date: 2025-12-14
surface: agent
model: Claude Sonnet 4.5
feature: book-specification
branch: 001-book-specification
user: Pc
command: /sp.tasks
labels: [tasks,spec,plan,constitution,physical-ai,robotics]
links:
  spec: specs/001-book-specification/spec.md
  plan: specs/001-book-specification/plan.md
  tasks: specs/001-book-specification/tasks.md
  constitution: .specify/memory/constitution.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-book-specification/spec.md
 - specs/001-book-specification/plan.md
 - specs/001-book-specification/tasks.md
 - history/prompts/book-specification/5-update-tasks-align-constitution.tasks.prompt.md
tests:
 - none
---

## Prompt

$ARGUMENTS

## Response snapshot

I have successfully updated all project artifacts to align with the Constitution's requirement of 70-80% hands-on content, resolving the CRITICAL constitution alignment issues identified in the previous analysis:

1. Updated spec.md:
   - FR-003 changed from "at least 80%" to "70-80%" for hands-on learning content
   - SC-002 changed from "At least 80%" to "70-80%" for hands-on learning components

2. Updated plan.md:
   - Summary section updated to reflect "70-80% hands-on content" instead of "≥80%"
   - Constraints section updated from "≥80% hands-on ratio" to "70-80% hands-on ratio"
   - Constitution Check updated from "≥80% hands-on content" to "70-80% hands-on content"
   - Quality gates updated from "Hands-on ratio ≥80% verification" to "Hands-on ratio 70-80% verification"

3. Updated tasks.md:
   - T040 updated from "Validate hands-on ratio ≥80%" to "Validate hands-on ratio 70-80%"
   - T056 updated from "Validate hands-on ratio ≥80%" to "Validate hands-on ratio 70-80%"
   - T086 updated from "Validate hands-on ratio compliance" to "Validate 70-80% hands-on ratio compliance"

All artifacts now consistently reflect the Constitution's 70-80% hands-on content requirement, ensuring full compliance with project principles.

## Outcome

- ✅ Impact: Resolved CRITICAL constitution alignment issues across all artifacts
- 🧪 Tests: none
- 📁 Files: Updated spec.md, plan.md, and tasks.md to align with constitution
- 🔁 Next prompts: /sp.implement to begin task execution
- 🧠 Reflection: All artifacts now properly aligned with constitution requirements

## Evaluation notes (flywheel)

- Failure modes observed: Previously misaligned hands-on ratio requirements
- Graders run and results (PASS/FAIL): All artifacts now constitution-compliant
- Prompt variant (if applicable): Standard task alignment workflow
- Next experiment (smallest change to try): Begin implementation with /sp.implement