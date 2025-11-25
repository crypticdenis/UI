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
import './styles/App.css';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('workflows'); // 'workflows', 'runs', 'details', 'conversation', 'comparison'
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'conversation'
  const [highlightExecutionId, setHighlightExecutionId] = useState(null);
  
  // Navigation state
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [selectedRunVersion, setSelectedRunVersion] = useState(null);
  const [selectedRunQuestions, setSelectedRunQuestions] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [autoExpandExecutionId, setAutoExpandExecutionId] = useState(null);
  
  const [comparisonBaseID, setComparisonBaseID] = useState(null);
  const [comparisonRunVersion, setComparisonRunVersion] = useState(null);
  const [runComparisonWorkflowId, setRunComparisonWorkflowId] = useState(null);
  const [runComparisonRunIds, setRunComparisonRunIds] = useState([]);
  const [conversationComparisonSessionId, setConversationComparisonSessionId] = useState(null);
  const [conversationComparisonRunVersion, setConversationComparisonRunVersion] = useState(null);
  const [viewerContent, setViewerContent] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [navSidebarCollapsed, setNavSidebarCollapsed] = useState(false);

  // Fetch projects from API and auto-select the single project
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        setProjects(data);
        
        // Auto-select the single hardcoded project and show workflows
        if (data.length > 0) {
          setSelectedProject(data[0]);
          setCurrentView('workflows');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC key - go back or close modals
      if (e.key === 'Escape') {
        if (viewerContent) {
          setViewerContent(null);
        } else if (currentView === 'comparison') {
          handleCloseComparison();
        } else if (currentView === 'runComparison') {
          handleCloseRunComparison();
        } else if (currentView === 'details') {
          handleBackToRuns();
        } else if (currentView === 'runs') {
          handleBackToWorkflows();
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
  }, [currentView, viewerContent]);


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
    setHighlightExecutionId(executionId);
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
          <div className="loading-container font-size-15rem color-muted-888">
            Loading projects...
          </div>
        )}

        {error && (
          <div className="error-container font-size-12rem color-error">
            <div>Error loading projects: {error}</div>
            <div className="font-size-09rem color-muted-888">
              Make sure the backend server is running on http://localhost:3001
            </div>
          </div>
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
