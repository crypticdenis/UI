import { useState, useMemo, Fragment } from 'react';
import { getUniqueScoreFields, formatNumber } from '../utils/metricUtils';
import RunCard from '../components/RunCard';
import PerformanceTrendsChart from '../components/PerformanceTrendsChart';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/RunsOverview.css';

const RunsOverview = ({ runs, onViewRunDetails, breadcrumbs, loading = false }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'startTs', direction: 'descending' });
  const [searchQuery, setSearchQuery] = useState('');

  // Get all unique score fields dynamically from executions within runs
  const scoreFields = useMemo(() => {
    const allExecutions = runs.flatMap(run => run.runs || run.questions || []);
    const fields = getUniqueScoreFields(allExecutions);
    
    return fields;
  }, [runs]);

  // Group runs by version and calculate aggregate stats dynamically
  const groupedRuns = runs.reduce((acc, run) => {
    const version = run.version;
    if (!acc[version]) {
      const scoreMetrics = {};
      scoreFields.forEach(field => {
        scoreMetrics[`total_${field.key}`] = 0;
      });
      
      acc[version] = {
        version: version,
        runs: run.runs || run.questions || [],  // Store the executions
        id: run.id,
        workflowId: run.workflowId,
        startTs: run.startTs,
        finishTs: run.finishTs,
        questionCount: run.questionCount || 0,
        validScoreCount: 0,
        ...scoreMetrics
      };
    }
    
    // Aggregate scores from executions
    const executions = run.runs || run.questions || [];
    executions.forEach(execution => {
      scoreFields.forEach(field => {
        const metricData = execution[field.key];
        // Handle {value, reason} structure
        const value = metricData && typeof metricData === 'object' && 'value' in metricData 
          ? metricData.value 
          : metricData;
        
        if (value != null && !isNaN(value)) {
          acc[version][`total_${field.key}`] += parseFloat(value);
          // Track count per metric
          if (!acc[version][`count_${field.key}`]) {
            acc[version][`count_${field.key}`] = 0;
          }
          acc[version][`count_${field.key}`]++;
        }
      });
    });
    
    return acc;
  }, {});

  // Convert to array and calculate averages
  const runsArray = Object.values(groupedRuns).map(group => {
    const avgScores = {};
    const executionCount = group.runs?.length || 0;

    scoreFields.forEach(field => {
      const total = group[`total_${field.key}`] || 0;
      const metricCount = group[`count_${field.key}`] || 0;
      const numericValue = metricCount > 0 ? total / metricCount : null;
      
      // Store both numeric (for sorting) and formatted (for display)
      avgScores[`avg_${field.key}`] = numericValue;
      avgScores[`avg_${field.key}_formatted`] = numericValue != null
        ? formatNumber(numericValue)
        : '-';
    });

    // Calculate overall average score across all metrics using numeric values
    const scores = scoreFields
      .map(f => avgScores[`avg_${f.key}`])
      .filter(v => !isNaN(v) && v > 0);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    // Calculate run duration
    let durationMinutes = null;
    if (group.startTs && group.finishTs) {
      const start = new Date(group.startTs);
      const finish = new Date(group.finishTs);
      durationMinutes = ((finish - start) / 1000 / 60).toFixed(1);
    }

    // Clean up any properties from group that might be objects with {value, reason}
    // Only include known safe properties
    return {
      version: group.version,
      id: group.id,
      workflowId: group.workflowId,
      startTs: group.startTs,
      finishTs: group.finishTs,
      duration: group.duration, // Include duration if it exists
      durationMinutes,
      questionCount: executionCount,
      avgScore, // Overall average score (numeric)
      ...avgScores, // Contains both numeric (avg_X) and formatted (avg_X_formatted) values
      runs: group.runs  // This is the executions array
    };
  });

  // Filter runs
  const filteredRuns = runsArray.filter(run => {
    // Search query filter (searches across version, id, and workflow)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        run.version?.toLowerCase().includes(searchLower) ||
        String(run.id || '').includes(searchLower) ||
        String(run.workflowId || '').includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Model filter removed - not in database schema
    // Prompt version filter removed - not in database schema
    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
  };

  const hasActiveFilters = searchQuery;
  const activeFilterCount = [searchQuery].filter(Boolean).length;



  // Sort runs
  const sortedRuns = [...filteredRuns].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle numeric sorting for avgScore, questionCount, and all avg_* metrics
    if (sortConfig.key === 'avgScore' ||
        sortConfig.key === 'questionCount' ||
        sortConfig.key.startsWith('avg_')) {
      // Handle '-' strings and convert to numbers
      aValue = (aValue === '-' || aValue == null) ? 0 : parseFloat(aValue);
      bValue = (bValue === '-' || bValue == null) ? 0 : parseFloat(bValue);
      return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
    }

    // Handle timestamp sorting
    if (sortConfig.key === 'startTs' || sortConfig.key === 'finishTs') {
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

  return (
    <div className="runs-overview">
      <div className="overview-header">
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="breadcrumb-nav">
              {breadcrumbs.map((crumb, index) => (
                <Fragment key={index}>
                  {index > 0 && <span className="breadcrumb-separator">/</span>}
                  {index < breadcrumbs.length - 1 ? (
                    <button onClick={() => crumb.onClick()} className="breadcrumb-link">
                      {index === 0 && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 18l-6-6 6-6"/>
                        </svg>
                      )}
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="breadcrumb-current">{crumb.label}</span>
                  )}
                </Fragment>
              ))}
            </div>
          )}
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-svg">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  {activeFilterCount} {activeFilterCount === 1 ? 'Filter' : 'Filters'} Active
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-12">
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
      </div>

      {/* Performance Trends Chart */}
      {sortedRuns.length > 1 && <PerformanceTrendsChart runs={sortedRuns} scoreFields={scoreFields} onViewRunDetails={onViewRunDetails} />}

      <div className="overview-search-bar">
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Quick search across all runs (version, model, prompt)... Press Ctrl+K"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            title="Use Ctrl+K or Cmd+K to focus"
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
          <option value="startTs">Start Time</option>
          <option value="avgScore">Avg Score (Overall)</option>
          {scoreFields.map(field => (
            <option key={field.key} value={`avg_${field.key}`}>
              Avg {field.label}
            </option>
          ))}
          <option value="questionCount">Execution Count</option>
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

      <div className="runs-list">
        {loading ? (
          <LoadingSpinner 
            size="large" 
            text="Loading runs..." 
          />
        ) : (
          sortedRuns.map((run) => (
            <RunCard
              key={run.version}
              mode="card"
              run={run}
              scoreFields={scoreFields}
              maxMetrics={3}
              showAvgScore={true}
              showAllScores={true}
              onClick={() => {
                console.log('Run card clicked:', { version: run.version, runs: run.runs, runKeys: Object.keys(run) });
                console.log('run.runs length:', run.runs?.length);
                if (run.runs?.length > 0) {
                  console.log('First run item:', run.runs[0]);
                }
                onViewRunDetails(run.version, run.runs, run);
              }}
              onViewDetails={() => onViewRunDetails(run.version, run.runs, run)}
            />
          ))
        )}
      </div>

      {!loading && sortedRuns.length === 0 && (
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
