import { useEffect } from 'react';

/**
 * Custom hook for handling keyboard shortcuts
 * @param {Object} handlers - Object containing handler functions
 */
export const useKeyboardShortcuts = ({
  currentView,
  viewerContent,
  setViewerContent,
  setCurrentView,
  clearQuestionComparison,
  clearRunComparison,
  setSelectedWorkflow,
  setSelectedRunVersion,
  setSelectedRunQuestions,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC key - go back or close modals
      if (e.key === 'Escape') {
        if (viewerContent) {
          setViewerContent(null);
        } else if (currentView === 'comparison') {
          setCurrentView('details');
          clearQuestionComparison();
        } else if (currentView === 'runComparison') {
          setCurrentView('runs');
          clearRunComparison();
        } else if (currentView === 'details') {
          setCurrentView('runs');
          setSelectedRunVersion(null);
          setSelectedRunQuestions([]);
        } else if (currentView === 'runs') {
          setCurrentView('workflows');
          setSelectedWorkflow(null);
          setSelectedRunVersion(null);
          setSelectedRunQuestions([]);
        }
      }
      
      // Ctrl/Cmd + K - focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentView,
    viewerContent,
    setViewerContent,
    setCurrentView,
    clearQuestionComparison,
    clearRunComparison,
    setSelectedWorkflow,
    setSelectedRunVersion,
    setSelectedRunQuestions,
  ]);
};
