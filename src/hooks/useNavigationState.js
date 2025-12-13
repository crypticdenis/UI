import { useState, useEffect } from 'react';

/**
 * Custom hook to manage navigation state with localStorage persistence
 */
export function useNavigationState() {
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('app_currentView') || 'workflows';
  });
  
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('app_viewMode') || 'table';
  });
  
  const [selectedProject, setSelectedProject] = useState(() => {
    const saved = localStorage.getItem('app_selectedProject');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [selectedWorkflow, setSelectedWorkflow] = useState(() => {
    const saved = localStorage.getItem('app_selectedWorkflow');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [selectedRunVersion, setSelectedRunVersion] = useState(() => {
    return localStorage.getItem('app_selectedRunVersion') || null;
  });
  
  const [selectedRunQuestions, setSelectedRunQuestions] = useState(() => {
    const saved = localStorage.getItem('app_selectedRunQuestions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedRun, setSelectedRun] = useState(() => {
    const saved = localStorage.getItem('app_selectedRun');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('app_currentView', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('app_viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem('app_selectedProject', JSON.stringify(selectedProject));
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedWorkflow) {
      localStorage.setItem('app_selectedWorkflow', JSON.stringify(selectedWorkflow));
    }
  }, [selectedWorkflow]);

  useEffect(() => {
    if (selectedRunVersion) {
      localStorage.setItem('app_selectedRunVersion', selectedRunVersion);
    }
  }, [selectedRunVersion]);

  useEffect(() => {
    if (selectedRunQuestions.length > 0) {
      localStorage.setItem('app_selectedRunQuestions', JSON.stringify(selectedRunQuestions));
    }
  }, [selectedRunQuestions]);

  useEffect(() => {
    if (selectedRun) {
      localStorage.setItem('app_selectedRun', JSON.stringify(selectedRun));
    }
  }, [selectedRun]);

  return {
    currentView,
    setCurrentView,
    viewMode,
    setViewMode,
    selectedProject,
    setSelectedProject,
    selectedWorkflow,
    setSelectedWorkflow,
    selectedRunVersion,
    setSelectedRunVersion,
    selectedRunQuestions,
    setSelectedRunQuestions,
    selectedRun,
    setSelectedRun,
  };
}
