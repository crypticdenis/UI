import { useState, useEffect } from 'react';
import WorkflowsOverview from './views/WorkflowsOverview.jsx';
import RunsOverview from './views/RunsOverview.jsx';
import RunDetails from './views/RunDetails.jsx';
import SessionConversationView from './views/SessionConversationView.jsx';
import QuestionComparison from './views/QuestionComparison.jsx';
import RunComparison from './views/RunComparison.jsx';
import ConversationComparison from './views/ConversationComparison.jsx';
import ContentViewer from './components/ContentViewer.jsx';
import NavigationSidebar from './components/NavigationSidebar.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorDisplay from './components/ErrorDisplay.jsx';
import { useNavigationState } from './hooks/useNavigationState.js';
import { useProjects } from './hooks/useAPI.js';
import './styles/App.css';

function App() {
  const [highlightExecutionId, setHighlightExecutionId] = useState(null);
  const [autoExpandExecutionId, setAutoExpandExecutionId] = useState(null);
  
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
  
  const [comparisonBaseID, setComparisonBaseID] = useState(null);
  const [comparisonRunVersion, setComparisonRunVersion] = useState(null);
  const [runComparisonWorkflowId, setRunComparisonWorkflowId] = useState(null);
  const [runComparisonRunIds, setRunComparisonRunIds] = useState([]);
  const [conversationComparisonSessionId, setConversationComparisonSessionId] = useState(null);
  const [conversationComparisonRunVersion, setConversationComparisonRunVersion] = useState(null);
  const [viewerContent, setViewerContent] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [navSidebarCollapsed, setNavSidebarCollapsed] = useState(false);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC key - go back or close modals
      if (e.key === 'Escape') {
        if (viewerContent) {
          setViewerContent(null);
        } else if (currentView === 'comparison') {
          setCurrentView('details');
          setComparisonBaseID(null);
          setComparisonRunVersion(null);
        } else if (currentView === 'runComparison') {
          setCurrentView('runs');
          setRunComparisonWorkflowId(null);
          setRunComparisonRunIds([]);
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
  }, [currentView, viewerContent, setCurrentView, setComparisonBaseID, setComparisonRunVersion, setRunComparisonWorkflowId, setRunComparisonRunIds, setSelectedWorkflow, setSelectedRunVersion, setSelectedRunQuestions, setViewerContent]);


  // Navigation handlers
  const handleSelectWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    setSelectedRunVersion(null);
    setSelectedRunQuestions([]);
    setCurrentView('runs');
  };

  const handleViewRunDetails = (version, questions, runData = null) => {
    console.log('handleViewRunDetails called with:', { version, questions, runData });
    console.log('Questions array length:', questions?.length);
    if (questions?.length > 0) {
      console.log('First question:', questions[0]);
    }
    setSelectedRunVersion(version);
    setSelectedRunQuestions(questions);
    setSelectedRun(runData); // Store full run object
    setViewMode('conversation'); // Default to conversation view
    setCurrentView('details');
  };

  const handleToggleViewMode = (executionId = null) => {
    // If switching to conversation view with a specific execution, ensure highlight triggers
    if (executionId && viewMode === 'conversation') {
      // Clear highlight first, then set it again to trigger useEffect
      setHighlightExecutionId(null);
      setTimeout(() => {
        setHighlightExecutionId(executionId);
      }, 0);
    } else {
      setHighlightExecutionId(executionId);
    }
    setViewMode(prev => prev === 'table' ? 'conversation' : 'table');
  };

  const handleBackToWorkflows = () => {
    setCurrentView('workflows');
    setSelectedWorkflow(null);
    setSelectedRunVersion(null);
    setSelectedRunQuestions([]);
  };

  const handleBackToRuns = () => {
    setCurrentView('runs');
    setSelectedRunVersion(null);
    setSelectedRunQuestions([]);
  };

  const handleCompareQuestion = (baseID, runVersion) => {
    setComparisonBaseID(baseID);
    setComparisonRunVersion(runVersion);
    setCurrentView('comparison');
  };

  const handleCloseComparison = () => {
    setCurrentView('details');
    setComparisonBaseID(null);
    setComparisonRunVersion(null);
  };

  const handleCompareRuns = (workflowId, runIds) => {
    setRunComparisonWorkflowId(workflowId);
    setRunComparisonRunIds(runIds);
    setCurrentView('runComparison');
  };

  const handleCloseRunComparison = () => {
    setCurrentView('runs');
    setRunComparisonWorkflowId(null);
    setRunComparisonRunIds([]);
  };

  const handleCompareSession = (sessionId) => {
    setConversationComparisonSessionId(sessionId);
    setConversationComparisonRunVersion(selectedRunVersion);
    setCurrentView('conversationComparison');
  };

  const handleCloseConversationComparison = () => {
    setCurrentView('details');
    setViewMode('conversation');
    setConversationComparisonSessionId(null);
    setConversationComparisonRunVersion(null);
  };

  const handleExpandContent = (content, title, runId, gtId) => {
    setViewerContent({ content, title, runId, gtId });
  };

  const handleNavigateToSubExecution = (workflowId, runId, executionId, navigateToStandalone = false) => {
    console.log('🔍 Navigating to sub-execution:', { workflowId, runId, executionId, navigateToStandalone });
    
    // If navigateToStandalone is true, navigate to the standalone workflow
    if (navigateToStandalone) {
      const targetWorkflow = selectedProject?.workflows?.find(w => w.id === workflowId);
      if (!targetWorkflow) {
        console.error('❌ Standalone workflow not found:', workflowId);
        return;
      }
      
      console.log('✅ Navigating to standalone workflow:', targetWorkflow.id);
      setSelectedWorkflow(targetWorkflow);
      setSelectedRunVersion(null);
      setSelectedRunQuestions([]);
      setAutoExpandExecutionId(null);
      setCurrentView('runs');
      return;
    }
    
    // Sub-executions are nested within their parent run
    // Find the run that contains this sub-execution
    let targetWorkflow = null;
    let targetRun = null;
    let parentExecutionId = null;
    
    // Search all workflows for the run containing this sub-execution
    for (const workflow of selectedProject?.workflows || []) {
      const run = workflow.runs?.find(r => r.id === runId);
      if (run) {
        targetWorkflow = workflow;
        targetRun = run;
        
        // Find the parent execution that contains this sub-execution
        const executions = run.runs || run.questions || [];
        for (const exec of executions) {
          if (exec.subExecutions && exec.subExecutions.some(sub => sub.id === executionId)) {
            parentExecutionId = exec.id;
            break;
          }
        }
        
        if (parentExecutionId) break;
      }
    }
    
    if (!targetWorkflow || !targetRun || !parentExecutionId) {
      console.error('❌ Could not find parent execution for sub-execution:', { workflowId, runId, executionId });
      return;
    }

    console.log('✅ Found parent execution:', { 
      workflow: targetWorkflow.id, 
      run: targetRun.id, 
      parentExec: parentExecutionId,
      subExec: executionId,
      subWorkflow: workflowId
    });

    // Navigate to the run and expand the parent execution (which will show the sub-execution)
    setSelectedWorkflow(targetWorkflow);
    setSelectedRunVersion(targetRun.version);
    setSelectedRunQuestions(targetRun.runs || targetRun.questions || []);
    setAutoExpandExecutionId(parentExecutionId); // Expand the PARENT, not the sub
    setCurrentView('details');
  };

  const handleNavigate = (destination, project, workflow, _subworkflow, run) => {
    if (destination === 'workflow' && workflow) {
      handleSelectWorkflow(workflow);
    } else if (destination === 'run' && workflow && run) {
      setSelectedWorkflow(workflow);
      // Open run details directly (same behavior as clicking the card)
      const questions = run.runs || run.questions || [];
      console.log('App.jsx - Navigating to run from sidebar:', { version: run.version, questionsCount: questions.length });
      handleViewRunDetails(run.version, questions, run);
    }
  };

  return (
    <div className="App dark">
      <NavigationSidebar
        currentView={currentView}
        selectedProject={selectedProject}
        selectedWorkflow={selectedWorkflow}
        selectedRunVersion={selectedRunVersion}
        projects={projects}
        onNavigate={handleNavigate}
        onWidthChange={setSidebarWidth}
        isCollapsed={navSidebarCollapsed}
        onCollapseChange={setNavSidebarCollapsed}
      />
      <div className="main-content" style={{ marginLeft: `${sidebarWidth}px` }}>
        {loading && (
          <LoadingSpinner 
            size="large" 
            text="Loading projects..." 
          />
        )}

        {error && (
          <ErrorDisplay 
            error={error}
            title="Failed to Load Projects"
            description="Make sure the backend server is running on http://localhost:3001"
            onRetry={retry}
          />
        )}

        {!loading && !error && currentView === 'workflows' && selectedProject && (
          <WorkflowsOverview 
            workflows={selectedProject.workflows || []}
            projectName={selectedProject.name}
            onSelectWorkflow={handleSelectWorkflow}
          />
        )}

        {currentView === 'runs' && selectedWorkflow && (
          <RunsOverview 
            runs={selectedWorkflow.runs || []}
            onViewRunDetails={handleViewRunDetails}
            onCompareRuns={handleCompareRuns}
            breadcrumbs={[
              { label: selectedProject?.name, onClick: () => handleBackToWorkflows() },
              { label: `${selectedWorkflow.name} - Runs` }
            ]}
          />
        )}

        {currentView === 'details' && viewMode === 'table' && (
          <RunDetails
            runVersion={selectedRunVersion}
            questions={selectedRunQuestions}
            run={selectedRun}
            onBack={handleBackToRuns}
            onCompareQuestion={handleCompareQuestion}
            onExpandContent={handleExpandContent}
            onNavigateToSubExecution={handleNavigateToSubExecution}
            selectedProject={selectedProject}
            autoExpandExecutionId={autoExpandExecutionId}
            onToggleViewMode={handleToggleViewMode}
            viewMode={viewMode}
          />
        )}

        {currentView === 'details' && viewMode === 'conversation' && (
          <SessionConversationView
            runVersion={selectedRunVersion}
            executions={selectedRunQuestions}
            onBack={handleBackToRuns}
            onToggleViewMode={handleToggleViewMode}
            highlightExecutionId={highlightExecutionId}
            onCompareSession={handleCompareSession}
            allRuns={selectedWorkflow?.runs || []}
            onNavCollapse={setNavSidebarCollapsed}
          />
        )}

        {currentView === 'conversationComparison' && (
          <ConversationComparison
            sessionId={conversationComparisonSessionId}
            baseRunVersion={conversationComparisonRunVersion}
            allRuns={selectedWorkflow?.runs || []}
            onClose={handleCloseConversationComparison}
          />
        )}

        {currentView === 'comparison' && (
          <QuestionComparison
            baseID={comparisonBaseID}
            currentRunVersion={comparisonRunVersion}
            allRuns={selectedWorkflow?.runs || []}
            onClose={handleCloseComparison}
          />
        )}

        {currentView === 'runComparison' && (
          <RunComparison
            workflowId={runComparisonWorkflowId}
            selectedRunIds={runComparisonRunIds}
            onClose={handleCloseRunComparison}
          />
        )}
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
