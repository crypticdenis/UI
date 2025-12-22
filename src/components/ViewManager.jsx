import WorkflowsOverview from '../views/WorkflowsOverview.jsx';
import RunsOverview from '../views/RunsOverview.jsx';
import RunDetails from '../views/RunDetails.jsx';
import SessionConversationView from '../views/SessionConversationView.jsx';
import QuestionComparison from '../views/QuestionComparison.jsx';
import RunComparison from '../views/RunComparison.jsx';
import ConversationComparison from '../views/ConversationComparison.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import ErrorDisplay from './ErrorDisplay.jsx';

/**
 * Manages view rendering based on current navigation state
 * Extracted from App.jsx to reduce complexity
 */
const ViewManager = ({
  // State
  loading,
  error,
  currentView,
  viewMode,
  selectedProject,
  selectedWorkflow,
  selectedRunVersion,
  selectedRunQuestions,
  selectedRun,
  highlightExecutionId,
  autoExpandExecutionId,
  comparisonBaseID,
  comparisonRunVersion,
  runComparisonWorkflowId,
  runComparisonRunIds,
  conversationComparisonSessionId,
  conversationComparisonRunVersion,
  
  // Handlers
  retry,
  handleSelectWorkflow,
  handleViewRunDetails,
  handleCompareRuns,
  handleBackToWorkflows,
  handleBackToRuns,
  handleCompareQuestion,
  handleExpandContent,
  handleNavigateToSubExecution,
  handleToggleViewMode,
  handleCloseComparison,
  handleCloseRunComparison,
  handleCompareSession,
  handleCloseConversationComparison,
  setNavSidebarCollapsed,
}) => {
  if (loading) {
    return (
      <LoadingSpinner 
        size="large" 
        text="Loading projects..." 
      />
    );
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        title="Failed to Load Projects"
        description="Make sure the backend server is running on http://localhost:3001"
        onRetry={retry}
      />
    );
  }

  if (currentView === 'workflows' && selectedProject) {
    return (
      <WorkflowsOverview 
        workflows={selectedProject.workflows || []}
        projectName={selectedProject.name}
        onSelectWorkflow={handleSelectWorkflow}
      />
    );
  }

  if (currentView === 'runs' && selectedWorkflow) {
    return (
      <RunsOverview 
        runs={selectedWorkflow.runs || []}
        onViewRunDetails={handleViewRunDetails}
        onCompareRuns={handleCompareRuns}
        breadcrumbs={[
          { label: selectedProject?.name, onClick: handleBackToWorkflows },
          { label: `${selectedWorkflow.name} - Runs` }
        ]}
      />
    );
  }

  if (currentView === 'details' && viewMode === 'table') {
    return (
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
    );
  }

  if (currentView === 'details' && viewMode === 'conversation') {
    return (
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
    );
  }

  if (currentView === 'conversationComparison') {
    return (
      <ConversationComparison
        sessionId={conversationComparisonSessionId}
        baseRunVersion={conversationComparisonRunVersion}
        allRuns={selectedWorkflow?.runs || []}
        onClose={handleCloseConversationComparison}
      />
    );
  }

  if (currentView === 'comparison') {
    return (
      <QuestionComparison
        baseID={comparisonBaseID}
        currentRunVersion={comparisonRunVersion}
        allRuns={selectedWorkflow?.runs || []}
        onClose={handleCloseComparison}
      />
    );
  }

  if (currentView === 'runComparison') {
    return (
      <RunComparison
        workflowId={runComparisonWorkflowId}
        selectedRunIds={runComparisonRunIds}
        onClose={handleCloseRunComparison}
      />
    );
  }

  return null;
};

export default ViewManager;
