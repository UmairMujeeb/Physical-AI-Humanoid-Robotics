# Deployment Configuration – GitHub Pages

## Overview
This document clarifies the correct GitHub Pages deployment setup for the Physical AI & Humanoid Robotics book project to prevent future confusion and deployment issues.

## GitHub Pages Branch Configuration

### Only Use gh-pages Branch for Deployment
- **Critical**: Only the `gh-pages` branch should be used for GitHub Pages deployment
- Do not enable GitHub Pages from `main`, `master`, or any other branches
- Multiple active Pages deployments can cause conflicts and unexpected behavior

### Steps to Configure GitHub Pages in Repository Settings

1. Navigate to your repository on GitHub
2. Go to **Settings** > **Pages** (under Code and automation section)
3. Under **Source**, select:
   - **Deploy from branch**
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**

### Warning: Do Not Enable Pages from Other Branches
- **Never** enable GitHub Pages from `main/master` or other feature branches (e.g., `001-book-specification`)
- Having multiple active Pages deployments will result in duplicate/multiple sites
- This can cause URL conflicts and inconsistent content delivery

## Docusaurus Build Process

### Build Command
- Docusaurus build command: `npm run build`
- This outputs the static site to the `/build` folder
- The contents of the `/build` folder are what get deployed to GitHub Pages

### Branch Content
- The `gh-pages` branch contains the built static site (output of `npm run build`)
- This branch should only contain the built files, not source code
- The build process automatically updates this branch when configured properly

## Vercel Integration

### Branch Connections
- Vercel remains connected to the `main` branch for preview and production deployments
- GitHub Pages deployment via `gh-pages` branch operates independently of Vercel
- Both can coexist, but serve different purposes and audiences

### Preview vs Production
- Vercel provides preview deployments for pull requests and production deployments from `main`
- GitHub Pages serves as an alternative deployment target using the `gh-pages` branch
- Ensure both deployment methods are consistent in terms of content and features

## Troubleshooting

### Duplicate Site Issues
If you see multiple versions of the site:
1. Check GitHub repository settings for multiple active Pages deployments
2. Disable Pages from any branch other than `gh-pages`
3. Verify that only one source is active for GitHub Pages

### Build Not Reflecting Changes
1. Ensure the `gh-pages` branch is up-to-date with the latest build
2. Verify that the build process completed successfully
3. Check that the correct build output directory is being deployed