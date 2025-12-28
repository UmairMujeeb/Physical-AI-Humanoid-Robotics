import React from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useCurrentSidebarCategory } from '@docusaurus/theme-common';

interface NavigationButtonProps {
  to: string;
  label: string;
  direction: 'prev' | 'next';
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ to, label, direction }) => {
  const arrow = direction === 'prev' ? '←' : '→';
  const buttonClass = direction === 'prev'
    ? 'navigation-button--prev robot-themed-button'
    : 'navigation-button--next robot-themed-button';

  return (
    <a
      href={to}
      className={buttonClass}
    >
      <span className="mr-2">{arrow}</span>
      <span>{label}</span>
    </a>
  );
};

const NavigationButtons: React.FC = () => {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const sidebar = useCurrentSidebarCategory();

  // Find the current page in the sidebar
  const findCurrentPage = (items: any[], currentPath: string) => {
    for (const item of items) {
      if (item.type === 'link' && item.permalink === currentPath) {
        return item;
      }
      if (item.items) {
        const found = findCurrentPage(item.items, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

  // Find the index of the current page in the flattened sidebar
  const findPageIndices = (items: any[], currentPath: string, flatItems: any[] = [], parentCategory: string | null = null) => {
    for (const item of items) {
      if (item.type === 'category') {
        findPageIndices(item.items, currentPath, flatItems, item.label);
      } else if (item.type === 'link') {
        flatItems.push({ ...item, category: parentCategory });
      }
    }
    return flatItems;
  };

  // Get all sidebar items as a flat array
  let allItems: any[] = [];
  if (sidebar && sidebar.items) {
    allItems = findPageIndices(sidebar.items, location.pathname);
  }

  // Find current page index
  const currentPageIndex = allItems.findIndex(item => item.permalink === location.pathname);
  const currentPage = currentPageIndex !== -1 ? allItems[currentPageIndex] : null;

  if (!currentPage || allItems.length === 0) {
    return null;
  }

  const prevPage = currentPageIndex > 0 ? allItems[currentPageIndex - 1] : null;
  const nextPage = currentPageIndex < allItems.length - 1 ? allItems[currentPageIndex + 1] : null;

  return (
    <div className="navigation-buttons-container">
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="navigation-buttons-wrapper">
              {prevPage && (
                <NavigationButton
                  to={prevPage.permalink}
                  label={`← Prev: ${prevPage.label}`}
                  direction="prev"
                />
              )}
              {nextPage && (
                <NavigationButton
                  to={nextPage.permalink}
                  label={`Next: ${nextPage.label} →`}
                  direction="next"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationButtons;