import React, { useState, useEffect, useRef } from 'react';
import '../styles/NavigationSidebar.css';

const NavigationSidebar = ({ 
  currentView, 
  selectedProject, 
  selectedWorkflow, 
  selectedSubworkflow,
  selectedRunVersion,
  projects,
  onNavigate,
  onWidthChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedWorkflows, setExpandedWorkflows] = useState(new Set());
  const [expandedSubworkflows, setExpandedSubworkflows] = useState(new Set());
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  // Auto-expand current path
  useEffect(() => {
    if (selectedWorkflow) {
      setExpandedWorkflows(prev => new Set([...prev, selectedWorkflow.id]));
    }
    if (selectedSubworkflow) {
      setExpandedSubworkflows(prev => new Set([...prev, selectedSubworkflow.id]));
    }
  }, [selectedWorkflow, selectedSubworkflow]);

  const toggleWorkflow = (workflowId, e) => {
    e.stopPropagation();
    setExpandedWorkflows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workflowId)) {
        newSet.delete(workflowId);
      } else {
        newSet.add(workflowId);
      }
      return newSet;
    });
  };

  const toggleSubworkflow = (subworkflowId, e) => {
    e.stopPropagation();
    setExpandedSubworkflows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subworkflowId)) {
        newSet.delete(subworkflowId);
      } else {
        newSet.add(subworkflowId);
      }
      return newSet;
    });
  };

  const isActive = (view, workflowId, subworkflowId) => {
    if (view === 'workflows' && currentView === 'workflows') {
      return true;
    }
    if (view === 'workflow' && selectedWorkflow?.id === workflowId && 
        (currentView === 'workflow-runs' || currentView === 'subworkflows')) {
      return true;
    }
    if (view === 'subworkflow' && selectedSubworkflow?.id === subworkflowId && currentView === 'runs') {
      return true;
    }
    return false;
  };

  // Handle resize functionality
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    
    const handleMouseMove = (e) => {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        setSidebarWidth(newWidth);
        if (onWidthChange) {
          onWidthChange(newWidth);
        }
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
            <span>RE Butler Evaluation</span>
          </div>
        )}
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
          {/* Workflows Section */}
          <div 
            className={`nav-item ${isActive('workflows') ? 'active' : ''}`}
            onClick={() => onNavigate('project', project)}
          >
            <div className="nav-item-content">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m7.07-13.07l-4.24 4.24m0 5.66l4.24 4.24M1 12h6m6 0h6M4.93 4.93l4.24 4.24m5.66 0l4.24-4.24"/>
              </svg>
              <span className="nav-item-label">Workflows</span>
              <span className="nav-item-count">{project?.workflows?.length || 0}</span>
            </div>
          </div>

          {/* Workflow Tree */}
          {project?.workflows?.map(workflow => (
            <div key={workflow.id} className="nav-tree-item">
              <div 
                className={`nav-item nested ${isActive('workflow', workflow.id) ? 'active' : ''}`}
                onClick={() => onNavigate('workflow', project, workflow)}
              >
                <button 
                  className={`expand-btn ${expandedWorkflows.has(workflow.id) ? 'expanded' : ''}`}
                  onClick={(e) => toggleWorkflow(workflow.id, e)}
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

              {/* Workflow Runs + Subworkflows */}
              {expandedWorkflows.has(workflow.id) && (
                <div className="nav-tree-children">
                  {/* Direct workflow runs */}
                  {workflow.runs?.length > 0 && (() => {
                    const uniqueVersions = [...new Set(workflow.runs.map(r => r.version))];
                    const groupedRuns = uniqueVersions.map(version => {
                      const runsForVersion = workflow.runs.filter(r => r.version === version);
                      const allExecutions = runsForVersion.flatMap(tr => tr.runs || tr.questions || []);
                      return { version, runs: allExecutions, runData: runsForVersion[0] };
                    });
                    
                    return groupedRuns.map((runGroup) => (
                      <div 
                        key={runGroup.version}
                        className={`nav-item nested-2 ${
                          selectedRunVersion === runGroup.version && 
                          selectedWorkflow?.id === workflow.id && 
                          !selectedSubworkflow
                            ? 'active' 
                            : ''
                        }`}
                        onClick={() => onNavigate('run', project, workflow, null, { version: runGroup.version, runs: runGroup.runs })}
                      >
                        <div className="nav-item-content">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 11 12 14 22 4"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                          </svg>
                          <span className="nav-item-label run-label">{runGroup.version}</span>
                        </div>
                      </div>
                    ));
                  })()}

                  {/* Subworkflows */}
                  {workflow.subworkflows?.length > 0 && workflow.subworkflows.map(subworkflow => (
                    <div key={subworkflow.id} className="nav-tree-item">
                      <div 
                        className={`nav-item nested-2 ${isActive('subworkflow', null, subworkflow.id) ? 'active' : ''}`}
                        onClick={() => onNavigate('subworkflow', project, workflow, subworkflow)}
                      >
                        <button 
                          className={`expand-btn ${expandedSubworkflows.has(subworkflow.id) ? 'expanded' : ''}`}
                          onClick={(e) => toggleSubworkflow(subworkflow.id, e)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        </button>
                        <div className="nav-item-content">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                          </svg>
                          <span className="nav-item-label">{subworkflow.name}</span>
                          <span className="nav-item-count">{subworkflow.runCount}</span>
                        </div>
                      </div>

                      {/* Subworkflow Runs */}
                      {expandedSubworkflows.has(subworkflow.id) && subworkflow.runs?.length > 0 && (() => {
                        const uniqueVersions = [...new Set(subworkflow.runs.map(r => r.version))];
                        const groupedRuns = uniqueVersions.map(version => {
                          const runsForVersion = subworkflow.runs.filter(r => r.version === version);
                          const allExecutions = runsForVersion.flatMap(tr => tr.runs || tr.questions || []);
                          return { version, runs: allExecutions };
                        });
                        
                        return (
                          <div className="nav-tree-children">
                            {groupedRuns.map((runGroup) => (
                              <div 
                                key={runGroup.version}
                                className={`nav-item nested-3 ${
                                  selectedRunVersion === runGroup.version && 
                                  selectedSubworkflow?.id === subworkflow.id 
                                    ? 'active' 
                                    : ''
                                }`}
                                onClick={() => onNavigate('run', project, workflow, subworkflow, { version: runGroup.version, runs: runGroup.runs })}
                              >
                                <div className="nav-item-content">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9 11 12 14 22 4"/>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                                  </svg>
                                  <span className="nav-item-label run-label">{runGroup.version}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!isCollapsed && (
        <div 
          className="sidebar-resize-handle"
          onMouseDown={handleMouseDown}
          title="Drag to resize"
        />
      )}
    </div>
  );
};

export default NavigationSidebar;
