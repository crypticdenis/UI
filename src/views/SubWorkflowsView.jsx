import React, { useState } from 'react';

const SubWorkflowsView = ({ subworkflows, workflowName, projectName, onViewSubworkflowRuns, onBack }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [searchQuery, setSearchQuery] = useState('');

  // Filter subworkflows based on search
  const filteredSubworkflows = subworkflows.filter(subworkflow => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      subworkflow.name?.toLowerCase().includes(searchLower) ||
      subworkflow.description?.toLowerCase().includes(searchLower)
    );
  });

  // Sort subworkflows
  const sortedSubworkflows = [...filteredSubworkflows].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle timestamp sorting
    if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt') {
      const aTime = aValue ? new Date(aValue).getTime() : 0;
      const bTime = bValue ? new Date(bValue).getTime() : 0;
      return sortConfig.direction === 'ascending' ? aTime - bTime : bTime - aTime;
    }

    // Handle numeric sorting
    if (sortConfig.key === 'runCount') {
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
    <div className="subworkflows-view">
      <div className="overview-header">
        <div>
          <div className="breadcrumb-nav">
            <button onClick={() => onBack('projects')} className="breadcrumb-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Projects
            </button>
            <span className="breadcrumb-separator">/</span>
            <button onClick={() => onBack('workflows')} className="breadcrumb-link">
              {projectName}
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{workflowName}</span>
          </div>
          <h2>Subworkflows in {workflowName}</h2>
          <p className="overview-subtitle">
            <span className="stat-item">
              <strong>{sortedSubworkflows.length}</strong> {sortedSubworkflows.length === 1 ? 'Subworkflow' : 'Subworkflows'}
            </span>
            <span className="stat-divider">|</span>
            <span className="stat-item">
              <strong>{sortedSubworkflows.reduce((sum, s) => sum + (s.runCount || 0), 0)}</strong> Total Runs
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
            placeholder="Search subworkflows..."
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
          <option value="runCount">Run Count</option>
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
        {sortedSubworkflows.map((subworkflow) => (
          <div 
            key={subworkflow.id} 
            className="run-card subworkflow-card" 
            onClick={() => onViewSubworkflowRuns(subworkflow)}
          >
            <div className="run-card-header">
              <div className="run-card-title">
                <h3>{subworkflow.name}</h3>
                <span className="question-count-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                    <rect x="9" y="3" width="6" height="4" rx="1"/>
                  </svg>
                  {subworkflow.runCount || 0}
                </span>
              </div>
              <div className="subworkflow-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
            </div>

            {subworkflow.description && (
              <div className="project-description">
                <p>{subworkflow.description}</p>
              </div>
            )}

            <div className="run-card-meta">
              <div className="meta-item">
                <span className="meta-label">Type:</span>
                <span className="meta-value prompt-badge">Subworkflow</span>
              </div>
              {subworkflow.createdAt && (
                <div className="meta-item">
                  <span className="meta-label">Created:</span>
                  <span className="meta-value timestamp">
                    {new Date(subworkflow.createdAt).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit'
                    })}
                  </span>
                </div>
              )}
              {subworkflow.updatedAt && (
                <div className="meta-item">
                  <span className="meta-label">Updated:</span>
                  <span className="meta-value timestamp">
                    {new Date(subworkflow.updatedAt).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>

            <button 
              className="view-details-btn"
              onClick={(e) => {
                e.stopPropagation();
                onViewSubworkflowRuns(subworkflow);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
              View Runs
            </button>
          </div>
        ))}
      </div>

      {sortedSubworkflows.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <h3>No subworkflows found</h3>
          <p>
            {searchQuery 
              ? 'No subworkflows match your search. Try a different query.'
              : 'No subworkflows available in this workflow yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubWorkflowsView;
