import React, { useEffect } from 'react';
import { getScoreColor } from '../utils/metricUtils';
import { usePanelState } from '../hooks/usePanelState';
import '../styles/NavigationSidebar.css';

const NavigationSidebar = ({
  currentView,
  selectedWorkflow,
  selectedRunVersion,
  projects,
  onNavigate,
  onWidthChange,
  isCollapsed: externalIsCollapsed,
  onCollapseChange,
  title = 'Evaluation Dashboard', // Configurable title
  showResizeHandle = true // Option to show/hide resize
}) => {
  const {
    isCollapsed,
    setIsCollapsed,
    width: sidebarWidth,
    isResizing,
    startResize,
    expandedItems: expandedWorkflows,
    toggleItem: toggleWorkflow,
    expandItem,
    panelRef: sidebarRef,
  } = usePanelState({
    defaultCollapsed: false,
    defaultWidth: 280,
    minWidth: 200,
    maxWidth: 600,
    persistToLocalStorage: false,
  });

  // Sync with external collapse state if provided
  useEffect(() => {
    if (externalIsCollapsed !== undefined) {
      setIsCollapsed(externalIsCollapsed);
    }
  }, [externalIsCollapsed, setIsCollapsed]);

  // Auto-expand current path
  useEffect(() => {
    if (selectedWorkflow) {
      expandItem(selectedWorkflow.id);
    }
  }, [selectedWorkflow, expandItem]);

  // Update parent when collapse state changes
  useEffect(() => {
    if (onWidthChange) {
      onWidthChange(isCollapsed ? 48 : sidebarWidth);
    }
  }, [isCollapsed, sidebarWidth, onWidthChange]);

  const handleToggleWorkflow = (workflowId, e) => {
    e.stopPropagation();
    toggleWorkflow(workflowId);
  };

  const isActive = (view, workflowId) => {
    if (view === 'workflows' && currentView === 'workflows') {
      return true;
    }
    if (view === 'workflow' && selectedWorkflow?.id === workflowId && 
        (currentView === 'workflow-runs' || currentView === 'runs')) {
      return true;
    }
    return false;
  };

  // Handle resize functionality using usePanelState
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    startResize(e);
  };

  // Get the single project (hardcoded)
  const project = projects?.[0];

  return (
    <div 
      ref={sidebarRef}
      className={`navigation-sidebar ${isCollapsed ? 'collapsed' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{ width: isCollapsed ? '48px' : `${sidebarWidth}px` }}
    >
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            <span>{title}</span>
          </div>
        )}
        <button
          className="collapse-btn"
          onClick={() => {
            const newCollapsed = !isCollapsed;
            setIsCollapsed(newCollapsed);
            if (onCollapseChange) {
              onCollapseChange(newCollapsed);
            }
          }}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isCollapsed ? (
              <path d="M9 18l6-6-6-6"/>
            ) : (
              <path d="M15 18l-6-6 6-6"/>
            )}
          </svg>
        </button>
      </div>

      {!isCollapsed && (
        <div className="sidebar-content">

          {/* Workflow Tree */}
          {project?.workflows?.map(workflow => (
            <div key={workflow.id} className="nav-tree-item">
              <div 
                className={`nav-item nested ${isActive('workflow', workflow.id) ? 'active' : ''}`}
                onClick={() => onNavigate('workflow', project, workflow)}
              >
                <button 
                  className={`expand-btn ${expandedWorkflows.has(workflow.id) ? 'expanded' : ''}`}
                  onClick={(e) => handleToggleWorkflow(workflow.id, e)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
                <div className="nav-item-content">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6m7.07-13.07l-4.24 4.24m0 5.66l4.24 4.24M1 12h6m6 0h6M4.93 4.93l4.24 4.24m5.66 0l4.24-4.24"/>
                  </svg>
                  <span className="nav-item-label">{workflow.name}</span>
                  <span className="nav-item-count">{workflow.runCount}</span>
                </div>
              </div>

              {/* Workflow Runs (no subworkflows) */}
              {expandedWorkflows.has(workflow.id) && (
                <div className="nav-tree-children">
                  {workflow.runs?.slice().reverse().map((run) => {
                    // Calculate combined score from executions - same logic as RunCard
                    const executions = run.runs || run.questions || [];
                    
                    // First, identify score fields
                    const scoreFields = new Set();
                    executions.forEach(exec => {
                      Object.keys(exec).forEach(key => {
                        // Skip duration and totalTokens - they're not score metrics
                        if (key === 'duration' || key === 'totalTokens') return;
                        
                        const value = exec[key];
                        // Identify metric fields
                        if (value && typeof value === 'object' && 'value' in value) {
                          const numValue = parseFloat(value.value);
                          if (!isNaN(numValue) && numValue <= 1 && numValue >= 0) {
                            scoreFields.add(key);
                          }
                        } else if (typeof value === 'number' && value <= 1 && value >= 0 &&
                                   (key.toLowerCase().includes('score') ||
                                    key.toLowerCase().includes('rate') ||
                                    key.toLowerCase().includes('accuracy'))) {
                          scoreFields.add(key);
                        }
                      });
                    });
                    
                    // Calculate average for each score field
                    const fieldAverages = [];
                    scoreFields.forEach(fieldKey => {
                      const values = executions.map(exec => {
                        const val = exec[fieldKey];
                        if (val && typeof val === 'object' && 'value' in val) {
                          return parseFloat(val.value);
                        }
                        return parseFloat(val);
                      }).filter(v => !isNaN(v));
                      
                      if (values.length > 0) {
                        fieldAverages.push(values.reduce((a, b) => a + b, 0) / values.length);
                      }
                    });
                    
                    // Average of field averages
                    const combinedScore = fieldAverages.length > 0 
                      ? fieldAverages.reduce((a, b) => a + b, 0) / fieldAverages.length 
                      : null;
                    
                    return (
                      <div 
                        key={run.version}
                        className={`nav-item nested-2 ${
                          selectedRunVersion === run.version && 
                          selectedWorkflow?.id === workflow.id
                            ? 'active' 
                            : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('run', project, workflow, null, run);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="nav-item-content">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 11 12 14 22 4"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                          </svg>
                          <span className="nav-item-label run-label">{run.version}</span>
                          {combinedScore !== null && (
                            <span 
                              className="run-score-badge" 
                              style={{ 
                                backgroundColor: getScoreColor(combinedScore),
                                color: '#ffffff'
                              }}
                              title={`Combined Score: ${combinedScore.toFixed(2)}`}
                            >
                              {combinedScore.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resize Handle */}
      {!isCollapsed && showResizeHandle && (
        <div 
          className="sidebar-resize-handle"
          onMouseDown={handleMouseDown}
          title="Drag to resize sidebar"
          aria-label="Resize sidebar"
        >
          <div className="resize-handle-indicator"></div>
        </div>
      )}
    </div>
  );
};

export default NavigationSidebar;
