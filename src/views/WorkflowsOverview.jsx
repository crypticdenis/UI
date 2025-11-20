import React, { useState } from 'react';

const WorkflowsOverview = ({ workflows, projectName, onSelectWorkflow }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [searchQuery, setSearchQuery] = useState('');

  // Filter workflows based on search
  const filteredWorkflows = workflows.filter(workflow => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      workflow.name?.toLowerCase().includes(searchLower) ||
      workflow.description?.toLowerCase().includes(searchLower)
    );
  });

  // Sort workflows
  const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle timestamp sorting
    if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt') {
      const aTime = aValue ? new Date(aValue).getTime() : 0;
      const bTime = bValue ? new Date(bValue).getTime() : 0;
      return sortConfig.direction === 'ascending' ? aTime - bTime : bTime - aTime;
    }

    // Handle numeric sorting
    if (sortConfig.key === 'subworkflowCount') {
      aValue = aValue || 0;
      bValue = bValue || 0;
      return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
    }

    // Handle string sorting
    const aStr = String(aValue || '').toLowerCase();
    const bStr = String(bValue || '').toLowerCase();
    if (aStr < bStr) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  return (
    <div className="workflows-overview">
      <div className="overview-header">
        <div>
          <h2>Workflows in {projectName}</h2>
          <p className="overview-subtitle">
            <span className="stat-item">
              <strong>{sortedWorkflows.length}</strong> {sortedWorkflows.length === 1 ? 'Workflow' : 'Workflows'}
            </span>
          </p>
        </div>
      </div>

      <div className="overview-search-bar">
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="clear-search-btn"
              title="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="overview-controls">
        <label>Sort By:</label>
        <select 
          value={sortConfig.key} 
          onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })}
          className="sort-select"
        >
          <option value="name">Name</option>
          <option value="createdAt">Created Date</option>
          <option value="updatedAt">Last Updated</option>
        </select>
        <select 
          value={sortConfig.direction} 
          onChange={(e) => setSortConfig({ ...sortConfig, direction: e.target.value })}
          className="sort-select"
        >
          <option value="ascending">↑ Ascending</option>
          <option value="descending">↓ Descending</option>
        </select>
      </div>

      <div className="runs-grid">
        {sortedWorkflows.map((workflow) => (
          <div 
            key={workflow.id} 
            className="run-card workflow-card clickable"
            onClick={() => onSelectWorkflow(workflow, 'runs')}
            title="Click to view runs"
          >
            <div className="run-card-header">
              <div className="run-card-title">
                <h3>{workflow.name}</h3>
                <span className="question-count-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                  </svg>
                  {workflow.subworkflowCount || 0}
                </span>
              </div>
              <div className="workflow-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m7.07-13.07l-4.24 4.24m0 5.66l4.24 4.24M1 12h6m6 0h6M4.93 4.93l4.24 4.24m5.66 0l4.24-4.24"/>
                </svg>
              </div>
            </div>

            {workflow.description && (
              <div className="project-description">
                <p>{workflow.description}</p>
              </div>
            )}

            <div className="">
              <div className="meta-item">
                <span className="meta-label">Runs:</span>
                <span className="meta-value model-badge">{workflow.runCount || 0}</span>
              </div>
              {workflow.createdAt && (
                <div className="meta-item">
                  <span className="meta-label">Created:</span>
                  <span className="meta-value timestamp">
                    {new Date(workflow.createdAt).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className="workflow-actions">
              <button 
                className="view-details-btn workflow-runs-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectWorkflow(workflow);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/>
                </svg>
                View Runs
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedWorkflows.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
          </div>
          <h3>No workflows found</h3>
          <p>
            {searchQuery 
              ? 'No workflows match your search. Try a different query.'
              : 'No workflows available in this project yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkflowsOverview;
