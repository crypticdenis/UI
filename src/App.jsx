import React, { useState, useEffect } from 'react';
import ProjectsLandingPage from './ProjectsLandingPage.jsx';
import WorkflowsOverview from './WorkflowsOverview.jsx';
import SubWorkflowsView from './SubWorkflowsView.jsx';
import RunsOverview from './RunsOverview.jsx';
import RunDetails from './RunDetails.jsx';
import QuestionComparison from './QuestionComparison.jsx';
import ContentViewer from './ContentViewer.jsx';
import EvaluationTrigger from './EvaluationTrigger.jsx';
import NavigationSidebar from './NavigationSidebar.jsx';
import './App.css';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('projects'); // 'projects', 'workflows', 'workflow-runs', 'subworkflows', 'runs', 'details', 'workflow-details', 'comparison'
  
  // Navigation state
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [selectedSubworkflow, setSelectedSubworkflow] = useState(null);
  const [selectedRunVersion, setSelectedRunVersion] = useState(null);
  const [selectedRunQuestions, setSelectedRunQuestions] = useState([]);
  
  const [comparisonBaseID, setComparisonBaseID] = useState(null);
  const [comparisonRunVersion, setComparisonRunVersion] = useState(null);
  const [viewerContent, setViewerContent] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);

  // Fetch projects from API
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
        } else if (currentView === 'details') {
          handleBackToRuns();
        } else if (currentView === 'workflow-details') {
          handleBackToWorkflowRuns();
        } else if (currentView === 'runs') {
          handleBackToSubworkflows();
        } else if (currentView === 'workflow-runs') {
          handleBackToWorkflows();
        } else if (currentView === 'subworkflows') {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, viewerContent]);

  const _handleEvaluationComplete = async (config) => {
    console.log('Creating new evaluation run with config:', config);
    
    try {
      // Create new run via API
      const newRun = {
        id: `${Date.now()}-${config.model}-${config.promptVersion}`,
        subworkflow_id: selectedSubworkflow?.id || null,
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

  const handleSelectWorkflow = (workflow, viewType) => {
    setSelectedWorkflow(workflow);
    setSelectedRunVersion(null);
    setSelectedRunQuestions([]);
    if (viewType === 'runs') {
      setCurrentView('workflow-runs');
    } else if (viewType === 'subworkflows') {
      setCurrentView('subworkflows');
    }
  };

  const handleSelectSubworkflow = (subworkflow) => {
    setSelectedSubworkflow(subworkflow);
    setCurrentView('runs');
    setSelectedRunVersion(null);
    setSelectedRunQuestions([]);
  };

  const handleViewRunDetails = (version, questions) => {
    setSelectedRunVersion(version);
    setSelectedRunQuestions(questions);
    // Determine which view we're coming from
    if (currentView === 'workflow-runs') {
      setCurrentView('workflow-details');
    } else {
      setCurrentView('details');
    }
  };

  const handleBackToProjects = () => {
    setCurrentView('projects');
    setSelectedProject(null);
    setSelectedWorkflow(null);
    setSelectedSubworkflow(null);
  };

  const handleBackToWorkflows = () => {
    setCurrentView('workflows');
    setSelectedWorkflow(null);
    setSelectedSubworkflow(null);
    setSelectedRunVersion(null);
    setSelectedRunQuestions([]);
  };

  const handleBackToSubworkflows = () => {
    setCurrentView('subworkflows');
    setSelectedSubworkflow(null);
    setSelectedRunVersion(null);
    setSelectedRunQuestions([]);
  };

  const handleBackToWorkflowRuns = () => {
    setCurrentView('workflow-runs');
    setSelectedRunVersion(null);
    setSelectedRunQuestions([]);
  };

  const handleBackToRuns = () => {
    setCurrentView('runs');
    setSelectedRunVersion(null);
    setSelectedRunQuestions([]);
  };

  const handleNavigateBack = (destination) => {
    if (destination === 'projects') {
      handleBackToProjects();
    } else if (destination === 'workflows') {
      handleBackToWorkflows();
    } else if (destination === 'subworkflows') {
      handleBackToSubworkflows();
    } else if (destination === 'workflow-runs') {
      handleBackToWorkflowRuns();
    }
  };

  const handleCompareQuestion = (baseID, runVersion) => {
    setComparisonBaseID(baseID);
    setComparisonRunVersion(runVersion);
    setCurrentView('comparison');
  };

  const handleCloseComparison = () => {
    // Determine which view to return to based on what we came from
    if (selectedSubworkflow) {
      setCurrentView('details');
    } else if (selectedWorkflow && currentView === 'comparison') {
      setCurrentView('workflow-details');
    } else {
      setCurrentView('details');
    }
    setComparisonBaseID(null);
    setComparisonRunVersion(null);
  };

  const handleExpandContent = (content, title, runId, gtId) => {
    setViewerContent({ content, title, runId, gtId });
  };

  const handleNavigate = (destination, project, workflow, subworkflow, run) => {
    if (destination === 'projects') {
      handleBackToProjects();
    } else if (destination === 'project' && project) {
      handleSelectProject(project);
    } else if (destination === 'workflow' && project && workflow) {
      setSelectedProject(project);
      if (workflow.subworkflows && workflow.subworkflows.length > 0) {
        handleSelectWorkflow(workflow, 'subworkflows');
      } else {
        handleSelectWorkflow(workflow, 'runs');
      }
    } else if (destination === 'subworkflow' && project && workflow && subworkflow) {
      setSelectedProject(project);
      setSelectedWorkflow(workflow);
      handleSelectSubworkflow(subworkflow);
    } else if (destination === 'run' && project && workflow && subworkflow && run) {
      setSelectedProject(project);
      setSelectedWorkflow(workflow);
      setSelectedSubworkflow(subworkflow);
      // Open run details directly (same behavior as clicking the card)
      const questions = run.questions || run.runs || [];
      handleViewRunDetails(run.version, questions);
    } else if (destination === 'workflow-run' && project && workflow && run) {
      setSelectedProject(project);
      setSelectedWorkflow(workflow);
      // Open workflow run details directly (same behavior as clicking the card)
      const questions = run.questions || run.runs || [];
      setSelectedRunVersion(run.version);
      setSelectedRunQuestions(questions);
      setCurrentView('workflow-details');
    }
  };

  return (
    <div className="App dark">
      <NavigationSidebar
        currentView={currentView}
        selectedProject={selectedProject}
        selectedWorkflow={selectedWorkflow}
        selectedSubworkflow={selectedSubworkflow}
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

        {currentView === 'workflow-runs' && selectedWorkflow && (
          <RunsOverview 
            runs={selectedWorkflow.runs || []}
            onViewRunDetails={handleViewRunDetails}
            breadcrumbs={[
              { label: 'Projects', onClick: () => handleBackToProjects() },
              { label: selectedProject?.name, onClick: () => handleBackToWorkflows() },
              { label: `${selectedWorkflow.name} - Runs` }
            ]}
          />
        )}

        {currentView === 'subworkflows' && selectedWorkflow && (
          <SubWorkflowsView 
            subworkflows={selectedWorkflow.subworkflows || []}
            workflowName={selectedWorkflow.name}
            projectName={selectedProject?.name}
            onViewSubworkflowRuns={handleSelectSubworkflow}
            onBack={handleNavigateBack}
          />
        )}

        {currentView === 'runs' && selectedSubworkflow && (
          <RunsOverview 
            runs={selectedSubworkflow.runs || []}
            onViewRunDetails={handleViewRunDetails}
            breadcrumbs={[
              { label: 'Projects', onClick: () => handleBackToProjects() },
              { label: selectedProject?.name, onClick: () => handleBackToWorkflows() },
              { label: selectedWorkflow?.name, onClick: () => handleBackToSubworkflows() },
              { label: `${selectedSubworkflow.name} - Runs` }
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
          />
        )}

        {currentView === 'workflow-details' && (
          <RunDetails
            runVersion={selectedRunVersion}
            questions={selectedRunQuestions}
            onBack={handleBackToWorkflowRuns}
            onCompareQuestion={handleCompareQuestion}
            onExpandContent={handleExpandContent}
          />
        )}

        {currentView === 'comparison' && (
          <QuestionComparison
            baseID={comparisonBaseID}
            currentRunVersion={comparisonRunVersion}
            allRuns={selectedSubworkflow?.runs || selectedWorkflow?.runs || []}
            onClose={handleCloseComparison}
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
