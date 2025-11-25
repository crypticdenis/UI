import { useState, useMemo, useRef, Fragment } from 'react';
import { getUniqueScoreFields, formatNumber } from '../utils/metricUtils';
import RunCard from '../components/RunCard';

// Helper function to get grade and colors based on score
const getGradeInfo = (score) => {
  if (score >= 0.9) {
    return { grade: 'Excellent', color: '#ffffff', bgColor: '#10b981' };
  } else if (score >= 0.8) {
    return { grade: 'Very Good', color: '#ffffff', bgColor: '#22c55e' };
  } else if (score >= 0.7) {
    return { grade: 'Good', color: '#ffffff', bgColor: '#84cc16' };
  } else if (score >= 0.6) {
    return { grade: 'Fair', color: '#000000', bgColor: '#eab308' };
  } else if (score >= 0.5) {
    return { grade: 'Below Avg', color: '#ffffff', bgColor: '#f59e0b' };
  } else {
    return { grade: 'Poor', color: '#ffffff', bgColor: '#ef4444' };
  }
};

// Performance Trends Chart Component
const PerformanceTrendsChart = ({ runs, scoreFields, onViewRunDetails }) => {
  const [selectedMetric, setSelectedMetric] = useState('combined');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // '7d', '14d', '30d', 'all'
  const svgRef = useRef(null);

  // Sort runs chronologically by start time
  const chronologicalRuns = useMemo(() => {
    const sorted = [...runs]
      .filter(run => run.startTs) // Only include runs with timestamps
      .sort((a, b) => new Date(a.startTs) - new Date(b.startTs));

    // Filter by time range
    if (timeRange === 'all') {
      return sorted;
    }

    const now = new Date();
    const daysMap = { '7d': 7, '14d': 14, '30d': 30 };
    const days = daysMap[timeRange];
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

    return sorted.filter(run => new Date(run.startTs) >= cutoffDate);
  }, [runs, timeRange]);

  // Get data for selected metric
  const chartData = useMemo(() => {
    if (!selectedMetric) return [];
    return chronologicalRuns.map(run => {
      let value;
      if (selectedMetric === 'combined') {
        // Calculate average across all metrics
        const scores = scoreFields
          .map(f => parseFloat(run[`avg_${f.key}`]))
          .filter(v => !isNaN(v));
        value = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      } else {
        value = parseFloat(run[`avg_${selectedMetric}`]) || 0;
      }
      
      return {
        version: run.version,
        id: run.id,
        runs: run.runs,
        value,
        timestamp: run.startTs,
        date: new Date(run.startTs).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: new Date(run.startTs).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
    });
  }, [chronologicalRuns, selectedMetric, scoreFields]);

  // Calculate chart dimensions and scaling
  const maxValue = Math.max(...chartData.map(d => d.value), 1);
  const minValue = Math.min(...chartData.map(d => d.value), 0);
  const valueRange = maxValue - minValue || 1;
  
  // Chart dimensions
  const chartWidth = 1000; // viewBox width
  const chartHeight = 300; // viewBox height (increased for better aspect ratio)
  const padding = { left: 50, right: 50, top: 20, bottom: 40 };
  
  // Calculate points for the line
  const points = chartData.map((d, i) => {
    const usableWidth = chartWidth - padding.left - padding.right;
    const x = chartData.length === 1 
      ? chartWidth / 2 
      : padding.left + (i / (chartData.length - 1)) * usableWidth;
    const y = chartHeight - padding.bottom - ((d.value - minValue) / valueRange) * (chartHeight - padding.top - padding.bottom);
    return { x, y, ...d };
  });

  // Create SVG path
  const linePath = points.length > 0
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';

  return (
    <div className="performance-trends-chart">
      <div className="chart-header">
        <div>
          <h3>Performance Trends Over Time</h3>
          <div className="time-range-chips">
            <button
              className={`time-chip ${timeRange === '7d' ? 'active' : ''}`}
              onClick={() => setTimeRange('7d')}
            >
              7D
            </button>
            <button
              className={`time-chip ${timeRange === '14d' ? 'active' : ''}`}
              onClick={() => setTimeRange('14d')}
            >
              14D
            </button>
            <button
              className={`time-chip ${timeRange === '30d' ? 'active' : ''}`}
              onClick={() => setTimeRange('30d')}
            >
              30D
            </button>
            <button
              className={`time-chip ${timeRange === 'all' ? 'active' : ''}`}
              onClick={() => setTimeRange('all')}
            >
              ALL
            </button>
          </div>
        </div>
        <div className="chart-controls">
          <label>Metric:</label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="metric-select"
          >
            <option value="combined">Combined Score</option>
            {scoreFields.map(field => (
              <option key={field.key} value={field.key}>
                {field.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="chart-empty-state">
          <p>No data available for the selected timeframe</p>
          <p className="empty-state-hint">Try selecting a different time range or "ALL" to view all available data</p>
        </div>
      ) : (
      <div className="chart-container">
        <svg ref={svgRef} width="100%" height="300px" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="trends-svg">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight - padding.bottom - (ratio * (chartHeight - padding.top - padding.bottom));
            const value = minValue + (ratio * valueRange);
            return (
              <g key={i}>
                <line
                  x1={0}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="rgba(96, 165, 250, 0.1)"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y={y - 4}
                  fill="rgba(148, 163, 184, 0.6)"
                  fontSize="10"
                  className="chart-label"
                >
                  {value.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Line path */}
          <path 
            d={linePath} 
            fill="none" 
            stroke="#ff900c" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#ff900c"
                stroke="#0f172a"
                strokeWidth="1"
                className="data-point cursor-pointer"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => onViewRunDetails(point.version, point.runs)}
              />
            </g>
          ))}

        </svg>

        {/* Tooltip */}
        {hoveredPoint && svgRef.current && (() => {
          const gradeInfo = getGradeInfo(hoveredPoint.value);
          const svgRect = svgRef.current.getBoundingClientRect();

          // Calculate position relative to the container
          const xPercent = (hoveredPoint.x / chartWidth) * 100;
          const yPixel = (hoveredPoint.y / chartHeight) * svgRect.height;

          return (
            <div
              className="chart-tooltip"
              style={{
                left: `${xPercent}%`,
                top: `${yPixel}px`,
                transform: 'translate(-50%, calc(-100% - 12px))'
              }}
            >
              <div className="tooltip-title">{hoveredPoint.version}</div>
              <div className="tooltip-value">{hoveredPoint.value.toFixed(3)}</div>
              <div
                className="tooltip-grade"
                style={{
                  backgroundColor: gradeInfo.bgColor,
                  color: gradeInfo.color
                }}
              >
                {hoveredPoint.value.toFixed(2)}
              </div>
              <div className="tooltip-date">{hoveredPoint.date} at {hoveredPoint.time}</div>
              <div className="tooltip-hint">Click to view details</div>
            </div>
          );
        })()}
      </div>
      )}
    </div>
  );
};

const RunsOverview = ({ runs, onViewRunDetails, breadcrumbs }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'descending' });
  const [filters, setFilters] = useState({
    model: '',
    promptVersion: '',
    version: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get all unique score fields dynamically from executions within runs
  const scoreFields = useMemo(() => {
    const allExecutions = runs.flatMap(run => run.runs || run.questions || []);
    return getUniqueScoreFields(allExecutions);
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
          acc[version].validScoreCount++;
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
      const total = group[`total_${field.key}`];
      // Calculate average per metric (validScoreCount tracks how many times each metric appeared)
      const metricCount = executionCount; // Assume each execution can have the metric
      avgScores[`avg_${field.key}`] = metricCount > 0
        ? formatNumber(total / metricCount)
        : '-';
    });

    // Calculate overall average score across all metrics
    const scores = scoreFields
      .map(f => parseFloat(avgScores[`avg_${f.key}`]))
      .filter(v => !isNaN(v));
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    // Calculate run duration
    let durationMinutes = null;
    if (group.startTs && group.finishTs) {
      const start = new Date(group.startTs);
      const finish = new Date(group.finishTs);
      durationMinutes = ((finish - start) / 1000 / 60).toFixed(1);
    }

    return {
      version: group.version,
      id: group.id,
      workflowId: group.workflowId,
      startTs: group.startTs,
      finishTs: group.finishTs,
      durationMinutes,
      questionCount: executionCount,
      avgScore, // Overall average score
      ...avgScores,
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
    if (filters.version && run.version !== filters.version) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({ version: '' });
    setSearchQuery('');
  };

  const hasActiveFilters = filters.version || searchQuery;
  const activeFilterCount = [filters.version, searchQuery].filter(Boolean).length;



  // Sort runs
  const sortedRuns = [...filteredRuns].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle numeric sorting for avgScore, questionCount, and all avg_* metrics
    if (sortConfig.key === 'avgScore' ||
        sortConfig.key === 'questionCount' ||
        sortConfig.key.startsWith('avg_')) {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
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
          <option value="version">Version</option>
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
        {sortedRuns.map((run) => (
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
              onViewRunDetails(run.version, run.runs);
            }}
            onViewDetails={() => onViewRunDetails(run.version, run.runs)}
          />
        ))}
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
