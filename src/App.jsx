import React, { useState, useEffect } from 'react';
import ProjectsLandingPage from './ProjectsLandingPage.jsx';
import WorkflowsOverview from './WorkflowsOverview.jsx';
import SubWorkflowsView from './SubWorkflowsView.jsx';
import RunsOverview from './RunsOverview.jsx';
import RunDetails from './RunDetails.jsx';
import QuestionComparison from './QuestionComparison.jsx';
import ContentViewer from './ContentViewer.jsx';
import EvaluationTrigger from './EvaluationTrigger.jsx';
import projectsData from './projectsData.json';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
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

  useEffect(() => {
    setProjects(projectsData);
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

  const handleEvaluationComplete = async (config) => {
    console.log('Loading evaluation results with config:', config);
    
    try {
      // Load dummy results from public folder
      const response = await fetch('/UI/dummy-evaluation-results.json');
      const newResults = await response.json();
      
      // Update the config in the results
      const updatedResults = newResults.map(result => ({
        ...result,
        model: config.model,
        promptVersion: config.promptVersion,
        timestamp: new Date().toISOString()
      }));
      
      // Add to current subworkflow's runs
      if (selectedSubworkflow && selectedProject && selectedWorkflow) {
        const updatedProjects = projects.map(project => {
          if (project.id === selectedProject.id) {
            return {
              ...project,
              workflows: project.workflows.map(workflow => {
                if (workflow.id === selectedWorkflow.id) {
                  return {
                    ...workflow,
                    subworkflows: workflow.subworkflows.map(subworkflow => {
                      if (subworkflow.id === selectedSubworkflow.id) {
                        return {
                          ...subworkflow,
                          runs: [...(subworkflow.runs || []), ...updatedResults],
                          runCount: (subworkflow.runCount || 0) + updatedResults.length
                        };
                      }
                      return subworkflow;
                    })
                  };
                }
                return workflow;
              })
            };
          }
          return project;
        });
        setProjects(updatedProjects);
      }
      
      console.log('Successfully loaded', updatedResults.length, 'new evaluation results');
      alert(`✓ Evaluation complete! ${updatedResults.length} new results loaded.`);
    } catch (error) {
      console.error('Failed to load evaluation results:', error);
      alert('❌ Failed to load evaluation results. Check console for details.');
    }
  };

  // Navigation handlers
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setCurrentView('workflows');
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
    if (viewType === 'runs') {
      setCurrentView('workflow-runs');
    } else if (viewType === 'subworkflows') {
      setCurrentView('subworkflows');
    }
  };

  const handleSelectSubworkflow = (subworkflow) => {
    setSelectedSubworkflow(subworkflow);
    setCurrentView('runs');
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

  return (
    <div className="App dark">
      <div className="main-content">
        {currentView === 'projects' && (
          <ProjectsLandingPage 
            projects={projects}
            onSelectProject={handleSelectProject}
            onCreateProject={handleCreateProject}
          />
        )}

        {currentView === 'workflows' && selectedProject && (
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
