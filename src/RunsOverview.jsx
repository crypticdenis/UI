import React, { useState } from 'react';

const RunsOverview = ({ runs, onViewRunDetails }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'descending' });
  const [filters, setFilters] = useState({
    model: '',
    promptVersion: '',
    version: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique values for dropdowns
  const uniqueModels = [...new Set(runs.map(r => r.model).filter(Boolean))].sort();
  const uniquePromptVersions = [...new Set(runs.map(r => r.promptVersion).filter(Boolean))].sort();
  const uniqueVersions = [...new Set(runs.map(r => r.version).filter(Boolean))].sort();

  // Group runs by version and calculate aggregate stats
  const groupedRuns = runs.reduce((acc, run) => {
    const version = run.version;
    if (!acc[version]) {
      acc[version] = {
        version: version,
        runs: [],
        model: run.model,
        promptVersion: run.promptVersion,
        timestamp: run.timestamp,
        questionCount: 0,
        totalOutputScore: 0,
        totalRagScore: 0,
        totalHallucinationRate: 0,
        totalSystemPromptScore: 0,
        validScoreCount: 0
      };
    }
    
    acc[version].runs.push(run);
    acc[version].questionCount++;
    
    // Update timestamp to latest
    if (run.timestamp && (!acc[version].timestamp || run.timestamp > acc[version].timestamp)) {
      acc[version].timestamp = run.timestamp;
    }
    
    // Aggregate scores
    if (run.ExecutionData) {
      acc[version].totalOutputScore += run.ExecutionData.outputScore || 0;
      acc[version].totalRagScore += run.ExecutionData.ragRelevancyScore || 0;
      acc[version].totalHallucinationRate += run.ExecutionData.hallucinationRate || 0;
      acc[version].totalSystemPromptScore += run.ExecutionData.systemPromptAlignmentScore || 0;
      acc[version].validScoreCount++;
    }
    
    return acc;
  }, {});

  // Convert to array and calculate averages
  const runsArray = Object.values(groupedRuns).map(group => ({
    version: group.version,
    model: group.model,
    promptVersion: group.promptVersion,
    timestamp: group.timestamp,
    questionCount: group.questionCount,
    avgOutputScore: group.validScoreCount > 0 ? (group.totalOutputScore / group.validScoreCount).toFixed(2) : '-',
    avgRagScore: group.validScoreCount > 0 ? (group.totalRagScore / group.validScoreCount).toFixed(2) : '-',
    avgHallucinationRate: group.validScoreCount > 0 ? (group.totalHallucinationRate / group.validScoreCount).toFixed(2) : '-',
    avgSystemPromptScore: group.validScoreCount > 0 ? (group.totalSystemPromptScore / group.validScoreCount).toFixed(2) : '-',
    runs: group.runs
  }));

  // Filter runs
  const filteredRuns = runsArray.filter(run => {
    // Search query filter (searches across version, model, and prompt version)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        run.version?.toLowerCase().includes(searchLower) ||
        run.model?.toLowerCase().includes(searchLower) ||
        run.promptVersion?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    if (filters.model && run.model !== filters.model) return false;
    if (filters.promptVersion && run.promptVersion !== filters.promptVersion) return false;
    if (filters.version && run.version !== filters.version) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({ model: '', promptVersion: '', version: '' });
    setSearchQuery('');
  };

  const hasActiveFilters = filters.model || filters.promptVersion || filters.version || searchQuery;
  const activeFilterCount = [filters.model, filters.promptVersion, filters.version, searchQuery].filter(Boolean).length;

  // Sort runs
  const sortedRuns = [...filteredRuns].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle numeric sorting
    if (['avgOutputScore', 'avgRagScore', 'avgHallucinationRate', 'avgSystemPromptScore', 'questionCount'].includes(sortConfig.key)) {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
      return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
    }

    // Handle timestamp sorting
    if (sortConfig.key === 'timestamp') {
      const aTime = aValue ? new Date(aValue).getTime() : 0;
      const bTime = bValue ? new Date(bValue).getTime() : 0;
      return sortConfig.direction === 'ascending' ? aTime - bTime : bTime - aTime;
    }

    // Handle string sorting
    const aStr = String(aValue || '').toLowerCase();
    const bStr = String(bValue || '').toLowerCase();
    if (aStr < bStr) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const getScoreColor = (score) => {
    const numScore = parseFloat(score);
    if (isNaN(numScore)) return '#6b7280';
    if (numScore >= 0.9) return '#059669';
    if (numScore >= 0.8) return '#10b981';
    if (numScore >= 0.7) return '#34d399';
    if (numScore >= 0.6) return '#fbbf24';
    if (numScore >= 0.5) return '#f59e0b';
    if (numScore >= 0.4) return '#f97316';
    if (numScore >= 0.3) return '#ef4444';
    return '#dc2626';
  };

  return (
    <div className="runs-overview">
      <div className="overview-header">
        <div>
          <h2>Evaluation Runs Overview</h2>
          <p className="overview-subtitle">
            <span className="stat-item">
              <strong>{sortedRuns.length}</strong> {sortedRuns.length === 1 ? 'Run' : 'Runs'}
            </span>
            <span className="stat-divider">|</span>
            <span className="stat-item">
              <strong>{sortedRuns.reduce((sum, r) => sum + r.questionCount, 0)}</strong> Total Questions
            </span>
            {hasActiveFilters && (
              <>
                <span className="stat-divider">|</span>
                <span className="stat-item active-filters">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  {activeFilterCount} {activeFilterCount === 1 ? 'Filter' : 'Filters'} Active
                </span>
              </>
            )}
          </p>
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="clear-filters-btn" title="Clear all filters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Clear Filters
          </button>
        )}
      </div>

      <div className="overview-search-bar">
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="🔍 Quick search across all runs (version, model, prompt)..."
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

      {sortedRuns.length > 1 && (
        <div className="comparison-feature-info">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <span>
            You have <strong>{sortedRuns.length} runs</strong> available. 
            Click into any run and use the <strong>Compare</strong> button to analyze how different models/prompts perform on the same questions.
          </span>
        </div>
      )}

      <div className="overview-filters">
        <label>
          <span className="filter-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
            Version
          </span>
          <select
            value={filters.version}
            onChange={(e) => setFilters({ ...filters, version: e.target.value })}
            className="filter-select"
          >
            <option value="">All Versions</option>
            {uniqueVersions.map(version => (
              <option key={version} value={version}>{version}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="filter-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Model
          </span>
          <select
            value={filters.model}
            onChange={(e) => setFilters({ ...filters, model: e.target.value })}
            className="filter-select"
          >
            <option value="">All Models</option>
            {uniqueModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="filter-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Prompt
          </span>
          <select
            value={filters.promptVersion}
            onChange={(e) => setFilters({ ...filters, promptVersion: e.target.value })}
            className="filter-select"
          >
            <option value="">All Prompt Versions</option>
            {uniquePromptVersions.map(prompt => (
              <option key={prompt} value={prompt}>{prompt}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="overview-controls">
        <label>Sort By:</label>
        <select 
          value={sortConfig.key} 
          onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })}
          className="sort-select"
        >
          <option value="version">Version</option>
          <option value="timestamp">Timestamp</option>
          <option value="model">Model</option>
          <option value="promptVersion">Prompt Version</option>
          <option value="avgOutputScore">Avg Output Score</option>
          <option value="avgRagScore">Avg RAG Score</option>
          <option value="avgHallucinationRate">Avg Hallucination</option>
          <option value="avgSystemPromptScore">Avg Prompt Score</option>
          <option value="questionCount">Question Count</option>
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
        {sortedRuns.map((run) => {
          const avgScore = ((parseFloat(run.avgOutputScore) || 0) + 
                           (parseFloat(run.avgRagScore) || 0) + 
                           (parseFloat(run.avgSystemPromptScore) || 0)) / 3;
          const overallGrade = avgScore >= 0.8 ? 'A' : avgScore >= 0.7 ? 'B' : avgScore >= 0.6 ? 'C' : avgScore >= 0.5 ? 'D' : 'F';
          const gradeColor = avgScore >= 0.8 ? '#10b981' : avgScore >= 0.7 ? '#34d399' : avgScore >= 0.6 ? '#fbbf24' : avgScore >= 0.5 ? '#f59e0b' : '#ef4444';
          
          return (
            <div key={run.version} className="run-card" onClick={() => onViewRunDetails(run.version, run.runs)}>
              <div className="run-card-header">
                <div className="run-card-title">
                  <h3>{run.version}</h3>
                  <span className="question-count-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                      <rect x="9" y="3" width="6" height="4" rx="1"/>
                    </svg>
                    {run.questionCount}
                  </span>
                </div>
                <div className="overall-grade" style={{ color: gradeColor, borderColor: gradeColor }}>
                  {overallGrade}
                </div>
              </div>

              <div className="run-card-meta">
                <div className="meta-item">
                  <span className="meta-label">🤖 Model:</span>
                  <span className="meta-value model-badge">{run.model}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">📝 Prompt:</span>
                  <span className="meta-value prompt-badge">{run.promptVersion}</span>
                </div>
                {run.timestamp && (
                  <div className="meta-item">
                    <span className="meta-label">⏰ Time:</span>
                    <span className="meta-value timestamp">
                      {new Date(run.timestamp).toLocaleString('de-DE', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="run-card-scores">
                <div className="score-item">
                  <span className="score-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    Output
                  </span>
                  <span 
                    className="score-value" 
                    style={{ backgroundColor: getScoreColor(run.avgOutputScore) }}
                  >
                    {run.avgOutputScore}
                  </span>
                </div>
                <div className="score-item">
                  <span className="score-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    RAG
                  </span>
                  <span 
                    className="score-value" 
                    style={{ backgroundColor: getScoreColor(run.avgRagScore) }}
                  >
                    {run.avgRagScore}
                  </span>
                </div>
                <div className="score-item">
                  <span className="score-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    Hallucination
                  </span>
                  <span 
                    className="score-value" 
                    style={{ backgroundColor: getScoreColor(run.avgHallucinationRate) }}
                  >
                    {run.avgHallucinationRate}
                  </span>
                </div>
                <div className="score-item">
                  <span className="score-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Prompt
                  </span>
                  <span 
                    className="score-value" 
                    style={{ backgroundColor: getScoreColor(run.avgSystemPromptScore) }}
                  >
                    {run.avgSystemPromptScore}
                  </span>
                </div>
              </div>

              <button 
                className="view-details-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewRunDetails(run.version, run.runs);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {sortedRuns.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <h3>No runs found</h3>
          <p>
            {hasActiveFilters 
              ? 'No runs match your current filters. Try adjusting or clearing your filters.'
              : 'No evaluation runs available yet. Start a new evaluation to see results here.'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-primary">
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RunsOverview;
