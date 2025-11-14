import React, { useState, useEffect } from 'react';
import ProjectsLandingPage from './views/ProjectsLandingPage.jsx';
import WorkflowsOverview from './views/WorkflowsOverview.jsx';
import RunsOverview from './views/RunsOverview.jsx';
import RunDetails from './views/RunDetails.jsx';
import QuestionComparison from './views/QuestionComparison.jsx';
import RunComparison from './views/RunComparison.jsx';
import ContentViewer from './components/ContentViewer.jsx';
import EvaluationTrigger from './components/EvaluationTrigger.jsx';
import NavigationSidebar from './components/NavigationSidebar.jsx';
import './styles/App.css';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('projects'); // 'projects', 'workflows', 'runs', 'details', 'comparison'
  
  // Navigation state
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [selectedRunVersion, setSelectedRunVersion] = useState(null);
  const [selectedRunQuestions, setSelectedRunQuestions] = useState([]);
  const [autoExpandExecutionId, setAutoExpandExecutionId] = useState(null);
  
  const [comparisonBaseID, setComparisonBaseID] = useState(null);
  const [comparisonRunVersion, setComparisonRunVersion] = useState(null);
  const [runComparisonWorkflowId, setRunComparisonWorkflowId] = useState(null);
  const [runComparisonRunIds, setRunComparisonRunIds] = useState([]);
  const [viewerContent, setViewerContent] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);

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
        } else if (currentView === 'workflows') {
          handleBackToProjects();
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

  const _handleEvaluationComplete = async (config) => {
    console.log('Creating new evaluation run with config:', config);
    
    try {
      // Create new run via API
      const newRun = {
        id: `${Date.now()}-${config.model}-${config.promptVersion}`,
        workflow_id: selectedWorkflow?.id || null,
        base_id: Date.now() % 1000,
        version: `${config.model}_${config.promptVersion}`,
        active: false,
        is_running: false,
        model: config.model,
        prompt_version: config.promptVersion,
        timestamp: new Date().toISOString(),
        ground_truth_id: `GT-${Date.now()}`,
        input_text: config.input || 'Evaluation input',
        expected_output: config.expectedOutput || 'Expected output',
        execution_id: `EX-${Date.now()}`,
        output: 'Evaluation in progress...',
        output_score: 0,
        output_score_reason: 'Pending evaluation',
        rag_relevancy_score: 0,
        rag_relevancy_score_reason: 'Pending evaluation',
        hallucination_rate: 0,
        hallucination_rate_reason: 'Pending evaluation',
        system_prompt_alignment_score: 0,
        system_prompt_alignment_score_reason: 'Pending evaluation'
      };

      const response = await fetch(`${API_BASE_URL}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRun)
      });

      if (!response.ok) {
        throw new Error(`Failed to create run: ${response.statusText}`);
      }

      // Refresh projects to get updated data
      const projectsResponse = await fetch(`${API_BASE_URL}/projects`);
      if (!projectsResponse.ok) {
        throw new Error(`Failed to refresh projects: ${projectsResponse.statusText}`);
      }
      const updatedProjects = await projectsResponse.json();
      setProjects(updatedProjects);
      
      console.log('Successfully created new evaluation run');
      alert(`✓ Evaluation run created successfully!`);
    } catch (error) {
      console.error('Failed to load evaluation results:', error);
      alert('❌ Failed to load evaluation results. Check console for details.');
    }
  };

  // Navigation handlers
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setCurrentView('workflows');
    setSelectedRunVersion(null);
    setSelectedRunQuestions([]);
  };

  const handleCreateProject = (projectData) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      name: projectData.name,
      description: projectData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workflowCount: 0,
      workflows: []
    };
    setProjects([...projects, newProject]);
    alert(`✓ Project "${projectData.name}" created successfully!`);
  };

  const handleSelectWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    setSelectedRunVersion(null);
    setSelectedRunQuestions([]);
    setCurrentView('runs');
  };

  const handleViewRunDetails = (version, questions) => {
    console.log('handleViewRunDetails called with:', { version, questions });
    console.log('Questions array length:', questions?.length);
    if (questions?.length > 0) {
      console.log('First question:', questions[0]);
    }
    setSelectedRunVersion(version);
    setSelectedRunQuestions(questions);
    setCurrentView('details');
  };

  const handleBackToProjects = () => {
    setCurrentView('projects');
    setSelectedProject(null);
    setSelectedWorkflow(null);
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
    if (destination === 'projects') {
      handleBackToProjects();
    } else if (destination === 'project' && project) {
      handleSelectProject(project);
    } else if (destination === 'workflow' && project && workflow) {
      setSelectedProject(project);
      handleSelectWorkflow(workflow);
    } else if (destination === 'run' && project && workflow && run) {
      setSelectedProject(project);
      setSelectedWorkflow(workflow);
      // Open run details directly (same behavior as clicking the card)
      const questions = run.runs || run.questions || [];
      console.log('App.jsx - Navigating to run from sidebar:', { version: run.version, questionsCount: questions.length });
      handleViewRunDetails(run.version, questions);
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
      />
      <div className="main-content" style={{ marginLeft: `${sidebarWidth}px` }}>
        {loading && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '1.5rem',
            color: '#888'
          }}>
            Loading projects...
          </div>
        )}

        {error && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '1.2rem',
            color: '#ff4444',
            gap: '1rem'
          }}>
            <div>Error loading projects: {error}</div>
            <div style={{ fontSize: '0.9rem', color: '#888' }}>
              Make sure the backend server is running on http://localhost:3001
            </div>
          </div>
        )}

        {!loading && !error && currentView === 'projects' && (
          <ProjectsLandingPage 
            projects={projects}
            onSelectProject={handleSelectProject}
            onCreateProject={handleCreateProject}
          />
        )}

        {!loading && !error && currentView === 'workflows' && selectedProject && (
          <WorkflowsOverview 
            workflows={selectedProject.workflows || []}
            projectName={selectedProject.name}
            onSelectWorkflow={handleSelectWorkflow}
            onBack={handleBackToProjects}
          />
        )}

        {currentView === 'runs' && selectedWorkflow && (
          <RunsOverview 
            runs={selectedWorkflow.runs || []}
            onViewRunDetails={handleViewRunDetails}
            onCompareRuns={handleCompareRuns}
            breadcrumbs={[
              { label: 'Projects', onClick: () => handleBackToProjects() },
              { label: selectedProject?.name, onClick: () => handleBackToWorkflows() },
              { label: `${selectedWorkflow.name} - Runs` }
            ]}
          />
        )}

        {currentView === 'details' && (
          <RunDetails
            runVersion={selectedRunVersion}
            questions={selectedRunQuestions}
            onBack={handleBackToRuns}
            onCompareQuestion={handleCompareQuestion}
            onExpandContent={handleExpandContent}
            onNavigateToSubExecution={handleNavigateToSubExecution}
            selectedProject={selectedProject}
            autoExpandExecutionId={autoExpandExecutionId}
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
