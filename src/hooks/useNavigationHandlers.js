/**
 * Custom hook for managing all navigation-related handlers
 * Extracts navigation logic from App.jsx to reduce component complexity
 */
export const useNavigationHandlers = ({
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
}) => {
  const handleSelectWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    setSelectedRunVersion(null);
    setSelectedRunQuestions([]);
    setCurrentView('runs');
  };

  const handleViewRunDetails = (version, questions, runData = null) => {
    setSelectedRunVersion(version);
    setSelectedRunQuestions(questions);
    setSelectedRun(runData);
    setViewMode('conversation');
    setCurrentView('details');
  };

  const handleToggleViewMode = (executionId = null) => {
    if (executionId && viewMode === 'conversation') {
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
    startQuestionComparison(baseID, runVersion);
    setCurrentView('comparison');
  };

  const handleCloseComparison = () => {
    setCurrentView('details');
    clearQuestionComparison();
  };

  const handleCompareRuns = (workflowId, runIds) => {
    startRunComparison(workflowId, runIds);
    setCurrentView('runComparison');
  };

  const handleCloseRunComparison = () => {
    setCurrentView('runs');
    clearRunComparison();
  };

  const handleCompareSession = (sessionId) => {
    startConversationComparison(sessionId, selectedRunVersion);
    setCurrentView('conversationComparison');
  };

  const handleCloseConversationComparison = () => {
    setCurrentView('details');
    setViewMode('conversation');
    clearConversationComparison();
  };

  const handleNavigateToSubExecution = (workflowId, runId, executionId, navigateToStandalone = false) => {
    if (navigateToStandalone) {
      const targetWorkflow = selectedProject?.workflows?.find(w => w.id === workflowId);
      if (!targetWorkflow) {
        return;
      }
      
      setSelectedWorkflow(targetWorkflow);
      setSelectedRunVersion(null);
      setSelectedRunQuestions([]);
      setAutoExpandExecutionId(null);
      setCurrentView('runs');
      return;
    }
    
    let targetWorkflow = null;
    let targetRun = null;
    let parentExecutionId = null;
    
    for (const workflow of selectedProject?.workflows || []) {
      const run = workflow.runs?.find(r => r.id === runId);
      if (run) {
        targetWorkflow = workflow;
        targetRun = run;
        
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
      return;
    }

    setSelectedWorkflow(targetWorkflow);
    setSelectedRunVersion(targetRun.version);
    setSelectedRunQuestions(targetRun.runs || targetRun.questions || []);
    setAutoExpandExecutionId(parentExecutionId);
    setCurrentView('details');
  };

  const handleNavigate = (destination, project, workflow, _subworkflow, run) => {
    if (destination === 'workflow' && workflow) {
      handleSelectWorkflow(workflow);
    } else if (destination === 'run' && workflow && run) {
      setSelectedWorkflow(workflow);
      const questions = run.runs || run.questions || [];
      handleViewRunDetails(run.version, questions, run);
    }
  };

  return {
    handleSelectWorkflow,
    handleViewRunDetails,
    handleToggleViewMode,
    handleBackToWorkflows,
    handleBackToRuns,
    handleCompareQuestion,
    handleCloseComparison,
    handleCompareRuns,
    handleCloseRunComparison,
    handleCompareSession,
    handleCloseConversationComparison,
    handleNavigateToSubExecution,
    handleNavigate,
  };
};
