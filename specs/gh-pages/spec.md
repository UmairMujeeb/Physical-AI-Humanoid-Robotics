# Feature Specification: GitHub Pages Single-Branch Deployment Configuration

**Feature Branch**: `gh-pages`
**Created**: 2025-12-23
**Status**: Draft

## Overview

This feature addresses GitHub Pages deployment infrastructure configuration for the Physical AI & Humanoid Robotics book project. The purpose is to establish a single-source deployment setup using only the gh-pages branch to prevent confusion and ensure consistent deployment practices. This infrastructure setup enables deployment of content that already complies with Constitution VI (Deployment-Ready Content). This feature is specifically about deployment infrastructure, not content readiness - it assumes book content already meets Constitution VI standards.

## Requirements

### Functional Requirements

- **FR-001**: System MUST use only the gh-pages branch for deployment
- **FR-002**: System MUST be configured via GitHub Settings > Pages with Deploy from branch option
- **FR-003**: System MUST NOT enable Pages from main/master or other branches to avoid duplicate sites
- **FR-004**: System MUST document the Docusaurus build process (npm run build → /build folder)
- **FR-005**: System MUST maintain Vercel connection to main branch for preview/production
- **FR-006**: System MUST verify deployed site reflects latest build from gh-pages only

### Non-Functional Requirements

- **NR-001**: Deployment configuration MUST be documented to prevent confusion
- **NR-002**: Process MUST be repeatable and consistent across environments

## Success Criteria

### Measurable Outcomes

- **SC-001**: GitHub Pages successfully deploys from gh-pages branch
- **SC-002**: No duplicate/multiple sites exist from other branches
- **SC-003**: Documentation exists to prevent future deployment confusion
- **SC-004**: Vercel remains connected to main branch for preview/production
- **SC-005**: Deployed site reflects the latest build from gh-pages branch only

## Notes

This feature is specifically about "GitHub Pages Deployment Infrastructure Configuration" (branch selection, build process, single-source setup). It supports, but is distinct from, Constitution VI ("Deployment-Ready Content" = complete, accurate, hands-on book content in the static build). This infrastructure setup enables deployment of content that already complies with Constitution VI. Assumes book content already meets Constitution VI standards.