import { useState, useEffect } from 'react';
import ContentViewer from './components/ContentViewer.jsx';
import NavigationSidebar from './components/NavigationSidebar.jsx';
import ViewManager from './components/ViewManager.jsx';
import { useNavigationState } from './hooks/useNavigationState.js';
import { useComparisonState } from './hooks/useComparisonState.js';
import { useNavigationHandlers } from './hooks/useNavigationHandlers.js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';
import { useProjects } from './hooks/useAPI.js';
import './styles/App.css';

function App() {
  const [highlightExecutionId, setHighlightExecutionId] = useState(null);
  const [autoExpandExecutionId, setAutoExpandExecutionId] = useState(null);
  const [viewerContent, setViewerContent] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [navSidebarCollapsed, setNavSidebarCollapsed] = useState(false);
  
  // Fetch projects from API
  const { projects, loading, error, retry } = useProjects();
  
  // Navigation state with localStorage persistence
  const {
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
  } = useNavigationState();
  
  // Comparison state management
  const {
    comparisonBaseID,
    comparisonRunVersion,
    runComparisonWorkflowId,
    runComparisonRunIds,
    conversationComparisonSessionId,
    conversationComparisonRunVersion,
    startQuestionComparison,
    clearQuestionComparison,
    startRunComparison,
    clearRunComparison,
    startConversationComparison,
    clearConversationComparison,
  } = useComparisonState();

  // Auto-select the single project when projects load
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
      // Only set to workflows if no view is already set from localStorage
      if (!localStorage.getItem('app_currentView')) {
        setCurrentView('workflows');
      }
    }
  }, [projects, selectedProject, setSelectedProject, setCurrentView]);

  // Navigation handlers hook
  const navigationHandlers = useNavigationHandlers({
    selectedProject,
    selectedRunVersion,
    setCurrentView,
    setSelectedWorkflow,
    setSelectedRunVersion,
    setSelectedRunQuestions,
    setSelectedRun,
    setViewMode,
    setHighlightExecutionId,
    setAutoExpandExecutionId,
    viewMode,
    startQuestionComparison,
    clearQuestionComparison,
    startRunComparison,
    clearRunComparison,
    startConversationComparison,
    clearConversationComparison,
  });

  // Keyboard shortcuts hook
  useKeyboardShortcuts({
    currentView,
    viewerContent,
    setViewerContent,
    setCurrentView,
    clearQuestionComparison,
    clearRunComparison,
    setSelectedWorkflow,
    setSelectedRunVersion,
    setSelectedRunQuestions,
  });

  const handleExpandContent = (content, title, runId, gtId) => {
    setViewerContent({ content, title, runId, gtId });
  };

  return (
    <div className="App dark">
      <NavigationSidebar
        currentView={currentView}
        selectedProject={selectedProject}
        selectedWorkflow={selectedWorkflow}
        selectedRunVersion={selectedRunVersion}
        projects={projects}
        onNavigate={navigationHandlers.handleNavigate}
        onWidthChange={setSidebarWidth}
        isCollapsed={navSidebarCollapsed}
        onCollapseChange={setNavSidebarCollapsed}
      />
      <div className="main-content" style={{ marginLeft: `${sidebarWidth}px` }}>
        <ViewManager
          loading={loading}
          error={error}
          currentView={currentView}
          viewMode={viewMode}
          selectedProject={selectedProject}
          selectedWorkflow={selectedWorkflow}
          selectedRunVersion={selectedRunVersion}
          selectedRunQuestions={selectedRunQuestions}
          selectedRun={selectedRun}
          highlightExecutionId={highlightExecutionId}
          autoExpandExecutionId={autoExpandExecutionId}
          comparisonBaseID={comparisonBaseID}
          comparisonRunVersion={comparisonRunVersion}
          runComparisonWorkflowId={runComparisonWorkflowId}
          runComparisonRunIds={runComparisonRunIds}
          conversationComparisonSessionId={conversationComparisonSessionId}
          conversationComparisonRunVersion={conversationComparisonRunVersion}
          retry={retry}
          handleSelectWorkflow={navigationHandlers.handleSelectWorkflow}
          handleViewRunDetails={navigationHandlers.handleViewRunDetails}
          handleCompareRuns={navigationHandlers.handleCompareRuns}
          handleBackToWorkflows={navigationHandlers.handleBackToWorkflows}
          handleBackToRuns={navigationHandlers.handleBackToRuns}
          handleCompareQuestion={navigationHandlers.handleCompareQuestion}
          handleExpandContent={handleExpandContent}
          handleNavigateToSubExecution={navigationHandlers.handleNavigateToSubExecution}
          handleToggleViewMode={navigationHandlers.handleToggleViewMode}
          handleCloseComparison={navigationHandlers.handleCloseComparison}
          handleCloseRunComparison={navigationHandlers.handleCloseRunComparison}
          handleCompareSession={navigationHandlers.handleCompareSession}
          handleCloseConversationComparison={navigationHandlers.handleCloseConversationComparison}
          setNavSidebarCollapsed={setNavSidebarCollapsed}
        />
      </div>

      {viewerContent && (
        <ContentViewer 
          title={viewerContent.title} 
          content={viewerContent.content}
          runId={viewerContent.runId}
          gtId={viewerContent.gtId}
          onClose={() => setViewerContent(null)} 
        />
      )}
    </div>
  );
}

export default App;
