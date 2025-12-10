import { useMemo } from 'react';
import { getScoreColor, getGradeInfo } from '../utils/metricUtils';

/**
 * Unified component to display run information
 * Can be used in both list view (RunsOverview) and detail view (RunDetails)
 *
 * Modes:
 * - 'card': Full card with header, metadata, and metrics (for RunsOverview list)
 * - 'header': Details header with title and metrics (for RunDetails header)
 * - 'metrics-only': Just the metrics bar (standalone)
 */
const RunCard = ({
  // Display mode
  mode = 'metrics-only', // 'card' | 'header' | 'metrics-only'

  // Run data (raw data - component will calculate what it needs)
  run, // The run object with all data
  questions, // For header mode: the questions/executions array

  // Legacy props (for backwards compatibility)
  version,
  startTs,
  questionCount,
  onClick,
  avgScore,
  scoreFields = [],
  metrics = {},
  durationMinutes,
  totalTokens,

  // Display options
  maxMetrics = 3,
  showAvgScore = true,
  showAllScores = false, // Show the full score list below metrics (for 'card' mode)
  onViewDetails // For 'card' mode button
}) => {
  // Extract data from run object if provided (new API)
  const runVersion = run?.version || version;
  const runStartTs = run?.startTs || startTs;
  const runFinishTs = run?.finishTs;
  const runQuestionCount = run?.questionCount || run?.runs?.length || questions?.length || questionCount;
  
  // Memoize data objects to prevent unnecessary re-renders
  const runData = useMemo(() => run || {}, [run]);
  const executionsData = useMemo(() => questions || run?.runs || [], [questions, run]);

  // Determine run status - simple: has finish_ts or not
  const isFinished = runFinishTs != null;
  const runStatus = isFinished ? 'finished' : 'running';

  // Calculate score fields dynamically from run data
  const calculatedScoreFields = useMemo(() => {
    if (scoreFields.length > 0) return scoreFields;

    // Extract score fields from run data or executions
    const fieldMap = new Map();
    const dataSource = executionsData.length > 0 ? executionsData : [runData];

    dataSource.forEach(item => {
      Object.keys(item).forEach(key => {
        // Skip duration and totalTokens - they're not score metrics
        if (key === 'duration' || key === 'totalTokens') return;
        
        // Identify metric fields
        if (key.startsWith('avg_') ||
            (item[key] && typeof item[key] === 'object' && 'value' in item[key]) ||
            (typeof item[key] === 'number' && item[key] <= 1 && item[key] >= 0 &&
             (key.toLowerCase().includes('score') ||
              key.toLowerCase().includes('rate') ||
              key.toLowerCase().includes('accuracy')))) {
          const fieldKey = key.startsWith('avg_') ? key.substring(4) : key;
          if (!fieldMap.has(fieldKey)) {
            fieldMap.set(fieldKey, {
              key: fieldKey,
              label: fieldKey.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()
                .replace(/\b\w/g, l => l.toUpperCase())
            });
          }
        }
      });
    });

    return Array.from(fieldMap.values());
  }, [scoreFields, runData, executionsData]);

  // Calculate metrics from run data or executions
  const calculatedMetrics = useMemo(() => {
    if (Object.keys(metrics).length > 0) return metrics;

    const result = {};

    if (executionsData.length > 0) {
      // Calculate from executions (header mode)
      const sums = {};
      const counts = {};

      executionsData.forEach(exec => {
        calculatedScoreFields.forEach(field => {
          const value = exec[field.key];
          const numValue = value && typeof value === 'object' && 'value' in value
            ? parseFloat(value.value)
            : parseFloat(value);

          if (!isNaN(numValue)) {
            if (!sums[field.key]) {
              sums[field.key] = 0;
              counts[field.key] = 0;
            }
            sums[field.key] += numValue;
            counts[field.key]++;
          }
        });
      });

      Object.keys(sums).forEach(key => {
        result[`avg_${key}`] = (sums[key] / counts[key]).toFixed(2);
      });
    } else {
      // Use existing avg_ fields from run data (card mode)
      calculatedScoreFields.forEach(field => {
        const value = runData[`avg_${field.key}`];
        if (value !== undefined) {
          // Extract value if it's an object with {value, reason} structure
          result[`avg_${field.key}`] = value && typeof value === 'object' && 'value' in value
            ? value.value
            : value;
        }
      });
    }

    return result;
  }, [metrics, runData, executionsData, calculatedScoreFields]);

  // Calculate average score
  const calculatedAvgScore = useMemo(() => {
    // Check if avgScore was passed as prop
    if (avgScore != null) return avgScore;

    // Check if avgScore exists in run data (preferred - already calculated correctly)
    if (runData.avgScore != null) return runData.avgScore;

    // Fallback: calculate from metrics
    const scores = calculatedScoreFields
      .map(f => parseFloat(calculatedMetrics[`avg_${f.key}`]))
      .filter(v => !isNaN(v));

    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
  }, [avgScore, runData, calculatedScoreFields, calculatedMetrics]);

  // Get duration - comes from DB as "MM:SS" format or null if not finished
  const calculatedDuration = useMemo(() => {
    // Use duration from run data if available (comes from backend/DB)
    if (runData.duration != null) {
      // Extract value if duration is an object with {value, reason}
      const duration = runData.duration;
      if (typeof duration === 'object' && duration !== null && 'value' in duration) {
        // Convert to string to ensure it's renderable
        return String(duration.value);
      }
      // Ensure it's a string
      return String(duration);
    }
    
    // If no duration but run is not finished, show "-"
    if (!isFinished) return '-';
    
    // Legacy: use durationMinutes if provided
    if (durationMinutes != null) return durationMinutes;

    // For executions data, calculate average
    if (executionsData.length > 0) {
      const durations = executionsData
        .map(e => parseFloat(e.duration))
        .filter(d => !isNaN(d));
      return durations.length > 0
        ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2)
        : null;
    }

    return null;
  }, [runData, isFinished, durationMinutes, executionsData]);

  // Calculate total tokens
  const calculatedTotalTokens = useMemo(() => {
    if (totalTokens != null && totalTokens > 0) return totalTokens;

    if (executionsData.length > 0) {
      // Average tokens from executions
      const tokens = executionsData
        .map(e => parseFloat(e.totalTokens))
        .filter(t => !isNaN(t) && t > 0);
      return tokens.length > 0
        ? Math.round(tokens.reduce((a, b) => a + b, 0) / tokens.length)
        : 0;
    }

    if (runData.runs) {
      return runData.runs.reduce((sum, execution) => sum + (execution.totalTokens || 0), 0);
    }

    return 0;
  }, [totalTokens, runData, executionsData]);

  // Get grade info for average score using utility function
  const gradeInfo = calculatedAvgScore != null ? getGradeInfo(calculatedAvgScore) : null;

  // Render metrics inline helper
  const renderMetrics = () => (
    <>
      {/* Average Score */}
      {showAvgScore && calculatedAvgScore != null && (
        <div className="metric-detail-item">
          <div className="metric-detail-label">AVG SCORE</div>
          <div
            className="metric-detail-value"
            style={{
              backgroundColor: gradeInfo.bgColor,
              color: gradeInfo.color
            }}
          >
            {calculatedAvgScore.toFixed(2)}
          </div>
        </div>
      )}

      {/* Quality Metrics */}
      {calculatedScoreFields.slice(0, maxMetrics).map(field => {
        const avgValue = parseFloat(calculatedMetrics[`avg_${field.key}`]);
        return (
          <div key={field.key} className="metric-detail-item">
            <div className="metric-detail-label">{field.label.toUpperCase()}</div>
            <div
              className="metric-detail-value"
              style={{ backgroundColor: getScoreColor(avgValue) }}
            >
              {!isNaN(avgValue) ? avgValue.toFixed(2) : '-'}
            </div>
          </div>
        );
      })}

      {/* Duration / Status */}
      {calculatedDuration && (
        <div className="metric-detail-item">
          <div className="metric-detail-label">AVG DURATION</div>
          <div
            className={`metric-detail-value ${calculatedDuration === '-' ? 'metric-status-unfinished' : 'metric-duration'}`}
          >
            {calculatedDuration}
          </div>
        </div>
      )}

      {/* Total Tokens */}
      {calculatedTotalTokens > 0 && (
        <div className="metric-detail-item">
          <div className="metric-detail-label">AVG TOKENS</div>
          <div className="metric-detail-value metric-tokens">
            {calculatedTotalTokens}
          </div>
        </div>
      )}
    </>
  );

  // Header mode (for RunDetails header with title and metrics) - completely flat
  if (mode === 'header') {
    return (
      <div className="details-header-main">
        {/* Title */}
        <h1>Run: {runVersion}</h1>

        {/* Execution count badge */}
        <span className="execution-count-badge">
          {runQuestionCount} execution{runQuestionCount !== 1 ? 's' : ''}
        </span>

        {/* All metrics as direct children */}
        {showAvgScore && calculatedAvgScore != null && (
          <div className="metric-detail-item">
            <div className="metric-detail-label">AVG SCORE</div>
            <div
              className="metric-detail-value"
              style={{
                backgroundColor: gradeInfo.bgColor,
                color: gradeInfo.color
              }}
            >
              {calculatedAvgScore.toFixed(2)}
            </div>
          </div>
        )}

        {calculatedScoreFields.slice(0, maxMetrics).map(field => {
          // Use calculated metrics (works for both sidebar and RunsOverview navigation)
          const avgValue = parseFloat(calculatedMetrics[`avg_${field.key}`]);
          const displayValue = !isNaN(avgValue) ? avgValue.toFixed(2) : '-';

          return (
            <div key={field.key} className="metric-detail-item">
              <div className="metric-detail-label">{field.label.toUpperCase()}</div>
              <div
                className="metric-detail-value"
                style={{ backgroundColor: !isNaN(avgValue) ? getScoreColor(avgValue) : '#334155' }}
              >
                {displayValue}
              </div>
            </div>
          );
        })}

        {calculatedDuration && (
          <div className="metric-detail-item">
            <div className="metric-detail-label">AVG DURATION</div>
            <div
              className={`metric-detail-value ${calculatedDuration === '-' ? 'metric-status-unfinished' : 'metric-duration'}`}
            >
              {calculatedDuration}
            </div>
          </div>
        )}

        {calculatedTotalTokens > 0 && (
          <div className="metric-detail-item">
            <div className="metric-detail-label">AVG TOKENS</div>
            <div className="metric-detail-value metric-tokens">
              {calculatedTotalTokens}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Metrics-only mode (standalone metrics bar - just the metrics without container)
  if (mode === 'metrics-only') {
    return (
      <div className="run-metrics-detailed">
        {renderMetrics()}
      </div>
    );
  }

  // Full card mode (for RunsOverview list) - completely flat structure
  // All elements are direct children of the main run-card container
  return (
    <div
      className={`run-card run-card-list clickable ${!isFinished ? 'run-card-running' : ''}`}
      data-run-version={runVersion}
      data-status={runStatus}
      onClick={onClick}
    >
      {/* Run version title */}
      <h3>{runVersion}</h3>

      {/* Status indicator for running runs */}
      {!isFinished && (
        <div className="metric-detail-item">
          <div className="metric-detail-label">STATUS</div>
          <div className="metric-detail-value metric-status-running">
            RUNNING
          </div>
        </div>
      )}

      {/* Timestamp as metric item */}
      {runStartTs && (
        <div className="metric-detail-item">
          <div className="metric-detail-label">TIMESTAMP</div>
          <div className="metric-detail-value metric-timestamp">
            {new Date(runStartTs).toLocaleString('de-DE', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      )}

      {/* Question count as metric item */}
      <div className="metric-detail-item">
        <div className="metric-detail-label">EXECUTIONS</div>
        <div className="metric-detail-value metric-count">
          {runQuestionCount}
        </div>
      </div>

      {/* All metrics as direct children */}
      {showAvgScore && calculatedAvgScore != null && (
        <div className="metric-detail-item">
          <div className="metric-detail-label">AVG SCORE</div>
          <div
            className="metric-detail-value"
            style={{
              backgroundColor: gradeInfo.bgColor,
              color: gradeInfo.color
            }}
          >
            {calculatedAvgScore.toFixed(2)}
          </div>
        </div>
      )}

      {calculatedScoreFields.slice(0, maxMetrics).map(field => {
        // Get numeric value from runData (for sorting and color)
        const numericValue = runData[`avg_${field.key}`];
        const formattedValue = runData[`avg_${field.key}_formatted`];
        const displayValue = formattedValue || (numericValue != null && !isNaN(numericValue) ? numericValue.toFixed(2) : '-');
        
        return (
          <div key={field.key} className="metric-detail-item">
            <div className="metric-detail-label">{field.label.toUpperCase()}</div>
            <div
              className="metric-detail-value"
              style={{ backgroundColor: numericValue != null && !isNaN(numericValue) ? getScoreColor(numericValue) : '#334155' }}
            >
              {displayValue}
            </div>
          </div>
        );
      })}

      {calculatedDuration && (
        <div className="metric-detail-item">
          <div className="metric-detail-label">AVG DURATION</div>
          <div
            className={`metric-detail-value ${calculatedDuration === '-' ? 'metric-status-unfinished' : 'metric-duration'}`}
          >
            {calculatedDuration}
          </div>
        </div>
      )}

      {calculatedTotalTokens > 0 && (
        <div className="metric-detail-item">
          <div className="metric-detail-label">AVG TOKENS</div>
          <div className="metric-detail-value metric-tokens">
            {calculatedTotalTokens}
          </div>
        </div>
      )}

      {/* Full Score List (optional expanded view) */}
      {showAllScores && calculatedScoreFields.length > 0 && (
        <div className="run-card-scores">
          {calculatedScoreFields.map(field => {
            const avgValue = calculatedMetrics[`avg_${field.key}`];
            // Ensure we extract value if it's an object
            const displayValue = avgValue && typeof avgValue === 'object' && 'value' in avgValue
              ? avgValue.value
              : avgValue;
            return (
              <div key={field.key} className="score-item">
                <span className="score-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6"/>
                  </svg>
                  {field.label.split(' ')[0]}
                </span>
                <span
                  className="score-value"
                  style={{ backgroundColor: getScoreColor(parseFloat(displayValue)) }}
                >
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* View Details Button */}
      {onViewDetails && (
        <button
          className="view-details-btn"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          View Details
        </button>
      )}
    </div>
  );
};

export default RunCard;
