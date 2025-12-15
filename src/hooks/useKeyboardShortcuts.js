import { useEffect } from 'react';

/**
 * Custom hook for handling keyboard shortcuts
 * @param {Object} handlers - Object containing handler functions
 */
export const useKeyboardShortcuts = ({
  onEscape,
  onSearch,
  currentView,
  viewerContent
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC key - go back or close modals
      if (e.key === 'Escape' && onEscape) {
        onEscape(currentView, viewerContent);
      }
      
      // Ctrl/Cmd + K - focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (onSearch) {
          onSearch();
        } else {
          // Default search behavior
          const searchInput = document.querySelector('.search-input');
          if (searchInput) searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, viewerContent, onEscape, onSearch]);
};
