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
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [expandedWorkflows, setExpandedWorkflows] = useState(new Set());
  const [expandedSubworkflows, setExpandedSubworkflows] = useState(new Set());
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  // Auto-expand current path
  useEffect(() => {
    if (selectedProject) {
      setExpandedProjects(prev => new Set([...prev, selectedProject.id]));
    }
    if (selectedWorkflow) {
      setExpandedWorkflows(prev => new Set([...prev, selectedWorkflow.id]));
    }
    if (selectedSubworkflow) {
      setExpandedSubworkflows(prev => new Set([...prev, selectedSubworkflow.id]));
    }
  }, [selectedProject, selectedWorkflow, selectedSubworkflow]);

  const toggleProject = (projectId, e) => {
    e.stopPropagation();
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

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

  const isActive = (view, projectId, workflowId, subworkflowId) => {
    if (view === 'projects' && currentView === 'projects' && !selectedProject) {
      return true;
    }
    if (view === 'project' && selectedProject?.id === projectId && currentView === 'workflows') {
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

  // Notify parent of width changes when collapsed state changes
  useEffect(() => {
    if (onWidthChange) {
      onWidthChange(isCollapsed ? 56 : sidebarWidth);
    }
  }, [isCollapsed, sidebarWidth, onWidthChange]);

  return (
    <>
      <div 
        ref={sidebarRef}
        className={`navigation-sidebar ${isCollapsed ? 'collapsed' : ''} ${isResizing ? 'resizing' : ''}`}
        style={{ 
          width: isCollapsed ? '56px' : `${sidebarWidth}px`,
          '--sidebar-width': `${sidebarWidth}px`
        }}
      >
        {/* Resize handle - must be first for proper z-index */}
        {!isCollapsed && (
          <div 
            className="sidebar-resize-handle"
            onMouseDown={handleMouseDown}
            title="Drag to resize sidebar"
          />
        )}
        
        <div className="sidebar-header">
        <div className="sidebar-title">
          {!isCollapsed && <span>Explorer</span>}
        </div>
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
          {/* Projects Root */}
          <div 
            className={`nav-item ${isActive('projects') ? 'active' : ''}`}
            onClick={() => onNavigate('projects')}
          >
            <div className="nav-item-content">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              <span className="nav-item-label">Projects</span>
              <span className="nav-item-count">{projects?.length || 0}</span>
            </div>
          </div>

          {/* Project Tree */}
          {projects?.map(project => (
            <div key={project.id} className="nav-tree-item">
              <div 
                className={`nav-item nested ${isActive('project', project.id) ? 'active' : ''}`}
                onClick={() => onNavigate('project', project)}
              >
                <button 
                  className={`expand-btn ${expandedProjects.has(project.id) ? 'expanded' : ''}`}
                  onClick={(e) => toggleProject(project.id, e)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
                <div className="nav-item-content">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span className="nav-item-label">{project.name}</span>
                  <span className="nav-item-count">{project.workflows?.length || 0}</span>
                </div>
              </div>

              {/* Workflows */}
              {expandedProjects.has(project.id) && project.workflows?.length > 0 && (
                <div className="nav-tree-children">
                  {project.workflows.map(workflow => (
                    <div key={workflow.id} className="nav-tree-item">
                      <div 
                        className={`nav-item nested-2 ${isActive('workflow', null, workflow.id) ? 'active' : ''}`}
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
                        </div>
                      </div>

                      {/* Subworkflows */}
                      {expandedWorkflows.has(workflow.id) && workflow.subworkflows?.length > 0 && (
                        <div className="nav-tree-children">
                          {workflow.subworkflows.map(subworkflow => (
                            <div key={subworkflow.id} className="nav-tree-item">
                              <div 
                                className={`nav-item nested-3 ${isActive('subworkflow', null, null, subworkflow.id) ? 'active' : ''}`}
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
                                  <span className="nav-item-count">
                                    {subworkflow.runs ? [...new Set(subworkflow.runs.map(r => r.version))].length : 0}
                                  </span>
                                </div>
                              </div>

                              {/* Runs - Group by unique version */}
                              {expandedSubworkflows.has(subworkflow.id) && subworkflow.runs?.length > 0 && (() => {
                                // Group runs by version to avoid duplicates
                                const uniqueVersions = [...new Set(subworkflow.runs.map(r => r.version))];
                                const groupedRuns = uniqueVersions.map(version => {
                                  const runsForVersion = subworkflow.runs.filter(r => r.version === version);
                                  return { version, runs: runsForVersion };
                                });
                                
                                return (
                                  <div className="nav-tree-children">
                                    {groupedRuns.map((runGroup) => (
                                      <div 
                                        key={runGroup.version}
                                        className={`nav-item nested-4 ${
                                          selectedRunVersion === runGroup.version && 
                                          selectedSubworkflow?.id === subworkflow.id 
                                            ? 'active' 
                                            : ''
                                        }`}
                                        onClick={() => onNavigate('run', project, workflow, subworkflow, { version: runGroup.version, questions: runGroup.runs })}
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

                      {/* Direct workflow runs - Always show if they exist, regardless of subworkflows */}
                      {expandedWorkflows.has(workflow.id) && workflow.runs?.length > 0 && (() => {
                        // Group runs by version to avoid duplicates
                        const uniqueVersions = [...new Set(workflow.runs.map(r => r.version))];
                        const groupedRuns = uniqueVersions.map(version => {
                          const runsForVersion = workflow.runs.filter(r => r.version === version);
                          return { version, runs: runsForVersion };
                        });
                        
                        return (
                          <div className="nav-tree-children">
                            {groupedRuns.map((runGroup) => (
                              <div 
                                key={runGroup.version}
                                className={`nav-item nested-3 ${
                                  selectedRunVersion === runGroup.version && 
                                  selectedWorkflow?.id === workflow.id && 
                                  !selectedSubworkflow
                                    ? 'active' 
                                    : ''
                                }`}
                                onClick={() => onNavigate('workflow-run', project, workflow, null, { version: runGroup.version, questions: runGroup.runs })}
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
      </div>
      
      {/* Expand width button - positioned outside sidebar */}
      {!isCollapsed && (
        <button 
          className="sidebar-expand-btn"
          style={{
            left: `${sidebarWidth}px`
          }}
          onClick={() => {
            const newWidth = sidebarWidth >= 450 ? 280 : 500;
            setSidebarWidth(newWidth);
            if (onWidthChange) {
              onWidthChange(newWidth);
            }
          }}
          title={sidebarWidth >= 450 ? "Shrink sidebar" : "Expand sidebar width"}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {sidebarWidth >= 450 ? (
              <path d="M15 18l-6-6 6-6"/>
            ) : (
              <path d="M9 18l6-6-6-6"/>
            )}
          </svg>
        </button>
      )}
    </>
  );
};

export default NavigationSidebar;
