import React, { useState, useEffect, useRef } from 'react';
import '../styles/NavigationSidebar.css';

const NavigationSidebar = ({ 
  currentView, 
  selectedProject, 
  selectedWorkflow, 
  selectedRunVersion,
  projects,
  onNavigate,
  onWidthChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedWorkflows, setExpandedWorkflows] = useState(new Set());
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  // Auto-expand current path
  useEffect(() => {
    if (selectedWorkflow) {
      setExpandedWorkflows(prev => new Set([...prev, selectedWorkflow.id]));
    }
  }, [selectedWorkflow]);

  // Update parent when collapse state changes
  useEffect(() => {
    if (onWidthChange) {
      onWidthChange(isCollapsed ? 48 : sidebarWidth);
    }
  }, [isCollapsed, sidebarWidth, onWidthChange]);

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

              {/* Workflow Runs (no subworkflows) */}
              {expandedWorkflows.has(workflow.id) && (
                <div className="nav-tree-children">
                  {workflow.runs?.map((run) => (
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
                        onNavigate('run', project, workflow, null, { version: run.version, runs: run.runs || run.questions || [] });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="nav-item-content">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 11 12 14 22 4"/>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                        </svg>
                        <span className="nav-item-label run-label">{run.version}</span>
                      </div>
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
