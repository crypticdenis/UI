import React, { useState } from 'react';

const ProjectsLandingPage = ({ projects, onSelectProject, onCreateProject }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Filter projects based on search
  const filteredProjects = projects.filter(project => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      project.name?.toLowerCase().includes(searchLower) ||
      project.description?.toLowerCase().includes(searchLower)
    );
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle timestamp sorting
    if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt') {
      const aTime = aValue ? new Date(aValue).getTime() : 0;
      const bTime = bValue ? new Date(bValue).getTime() : 0;
      return sortConfig.direction === 'ascending' ? aTime - bTime : bTime - aTime;
    }

    // Handle numeric sorting
    if (sortConfig.key === 'workflowCount') {
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

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    onCreateProject({
      name: newProjectName.trim(),
      description: newProjectDescription.trim()
    });
    
    setNewProjectName('');
    setNewProjectDescription('');
    setShowCreateModal(false);
  };

  return (
    <div className="projects-landing-page">
      <div className="overview-header">
        <div>
          <h2>Projects</h2>
          <p className="overview-subtitle">
            <span className="stat-item">
              <strong>{sortedProjects.length}</strong> {sortedProjects.length === 1 ? 'Project' : 'Projects'}
            </span>
            <span className="stat-divider">|</span>
            <span className="stat-item">
              <strong>{sortedProjects.reduce((sum, p) => sum + (p.workflowCount || 0), 0)}</strong> Total Workflows
            </span>
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)} 
          className="btn-primary create-project-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Create New Project
        </button>
      </div>

      <div className="overview-search-bar">
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search projects..."
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
          <option value="workflowCount">Workflow Count</option>
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
        {sortedProjects.map((project) => (
          <div 
            key={project.id} 
            className="run-card project-card" 
            onClick={() => onSelectProject(project)}
          >
            <div className="run-card-header">
              <div className="run-card-title">
                <h3>{project.name}</h3>
                <span className="question-count-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  {project.workflowCount || 0}
                </span>
              </div>
              <div className="project-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
            </div>

            {project.description && (
              <div className="project-description">
                <p>{project.description}</p>
              </div>
            )}

            <div className="run-card-meta">
              <div className="meta-item">
                <span className="meta-label">Created:</span>
                <span className="meta-value timestamp">
                  {project.createdAt ? new Date(project.createdAt).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit'
                  }) : 'N/A'}
                </span>
              </div>
              {project.updatedAt && (
                <div className="meta-item">
                  <span className="meta-label">Updated:</span>
                  <span className="meta-value timestamp">
                    {new Date(project.updatedAt).toLocaleDateString('de-DE', {
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
                onSelectProject(project);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
              Open Project
            </button>
          </div>
        ))}
      </div>

      {sortedProjects.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3>No projects found</h3>
          <p>
            {searchQuery 
              ? 'No projects match your search. Try a different query.'
              : 'No projects available yet. Create your first project to get started.'}
          </p>
          {!searchQuery && (
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Create New Project
            </button>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Project</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="project-name">Project Name *</label>
                <input
                  id="project-name"
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  className="form-input"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="project-description">Description</label>
                <textarea
                  id="project-description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Enter project description..."
                  className="form-input"
                  rows="4"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsLandingPage;
