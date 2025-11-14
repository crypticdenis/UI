import React, { useState, useEffect } from 'react';
import { getScoreColor, formatNumber } from '../utils/metricUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const RunComparison = ({ workflowId, selectedRunIds = [], onClose }) => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedRunIds || selectedRunIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchRuns = async () => {
      try {
        setLoading(true);
        const promises = selectedRunIds.map(runId =>
          fetch(`${API_BASE_URL}/runs/${runId}`)
            .then(res => res.json())
        );
        
        const results = await Promise.all(promises);
        setRuns(results);
        setError(null);
      } catch (err) {
        console.error('Error fetching runs:', err);
        setError('Failed to load run data');
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, [selectedRunIds]);

  // Calculate aggregate metrics for a run
  const calculateAggregateMetrics = (run) => {
    if (!run || !run.runs || run.runs.length === 0) {
      return { count: 0, metrics: {}, scaledMetrics: {} };
    }

    const allExecutions = run.runs;
    const metricSums = {};
    const metricCounts = {};
    const scaledMetrics = new Set(); // Track 0-1 scaled metrics

    // Fields to exclude (non-metrics)
    const excludedFields = [
      'id', 'input', 'expected_output', 'actual_output', 'timestamp', 
      'subExecutions', 'workflowId', 'parentExecutionId', 'runId',
      'duration', 'total_tokens', 'execution_ts', 'created_at', 'updated_at',
      'creation_ts', 'creationts'
    ];

    // Collect all metrics from all executions
    allExecutions.forEach(execution => {
      Object.keys(execution).forEach(key => {
        if (excludedFields.includes(key) || excludedFields.includes(key.toLowerCase())) {
          return;
        }

        const value = execution[key];
        let numValue = null;
        
        // Handle metric objects with value and reason
        if (value && typeof value === 'object' && 'value' in value) {
          numValue = parseFloat(value.value);
        }
        // Handle direct numeric values
        else if (typeof value === 'number' || !isNaN(parseFloat(value))) {
          numValue = parseFloat(value);
        }

        if (numValue !== null && !isNaN(numValue)) {
          if (!metricSums[key]) {
            metricSums[key] = 0;
            metricCounts[key] = 0;
          }
          metricSums[key] += numValue;
          metricCounts[key]++;

          // Track if this is a 0-1 scaled metric
          if (numValue >= 0 && numValue <= 1) {
            scaledMetrics.add(key);
          }
        }
      });
    });

    // Calculate averages
    const metrics = {};
    Object.keys(metricSums).forEach(key => {
      metrics[key] = metricSums[key] / metricCounts[key];
    });

    return {
      count: allExecutions.length,
      metrics,
      scaledMetrics,
      firstExecution: allExecutions[0],
    };
  };

  if (loading) {
    return (
      <div className="run-comparison-container">
        <div className="run-comparison-header">
          <h2>Run Comparison</h2>
          <button onClick={onClose} className="close-button">✕</button>
        </div>
        <p>Loading runs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="run-comparison-container">
        <div className="run-comparison-header">
          <h2>Run Comparison</h2>
          <button onClick={onClose} className="close-button">✕</button>
        </div>
        <p style={{ color: '#ef4444' }}>{error}</p>
      </div>
    );
  }

  if (!selectedRunIds || selectedRunIds.length === 0) {
    return (
      <div className="run-comparison-container">
        <div className="run-comparison-header">
          <h2>Run Comparison</h2>
          <button onClick={onClose} className="close-button">✕</button>
        </div>
        <p>No runs selected for comparison. Please select at least 2 runs from the Runs Overview.</p>
      </div>
    );
  }

  return (
    <div className="run-comparison-container">
      <div className="run-comparison-header">
        <h2>Run Comparison - {workflowId || 'Unknown Workflow'}</h2>
        <button onClick={onClose} className="close-button">✕</button>
      </div>

      <div className="run-comparison-grid">
        {runs.map((runData, index) => {
          const aggregate = calculateAggregateMetrics(runData);
          const run = runData.runs?.[0]; // Get first execution for metadata

          // Calculate percentage differences relative to first run
          const baselineAggregate = index === 0 ? null : calculateAggregateMetrics(runs[0]);

          return (
            <div key={runData.id} className="run-comparison-card">
              {/* Run Header */}
              <div className="run-comparison-card-header">
                <h3>Run Version {runData.version}</h3>
                <span className="execution-count-badge">
                  {aggregate.count} execution{aggregate.count !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Run Metadata */}
              <div className="run-metadata">
                {run?.timestamp && (
                  <div className="metadata-item">
                    <span className="metadata-label">Date:</span>
                    <span className="metadata-value">
                      {new Date(run.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {run?.model && (
                  <div className="metadata-item">
                    <span className="metadata-label">Model:</span>
                    <span className="metadata-value model-badge">{run.model}</span>
                  </div>
                )}
                {run?.promptVersion && (
                  <div className="metadata-item">
                    <span className="metadata-label">Prompt:</span>
                    <span className="metadata-value prompt-badge">{run.promptVersion}</span>
                  </div>
                )}
              </div>

              {/* Aggregate Metrics */}
              <div className="aggregate-metrics">
                <h4>Average Metrics</h4>
                {Object.keys(aggregate.metrics).length > 0 ? (
                  <div className="metrics-grid">
                    {Object.entries(aggregate.metrics)
                      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                      .map(([key, value]) => {
                        const isScaled = aggregate.scaledMetrics.has(key);
                        const baselineValue = baselineAggregate?.metrics[key];
                        let percentDiff = null;

                        if (baselineValue !== null && baselineValue !== undefined && baselineValue !== 0) {
                          percentDiff = ((value - baselineValue) / baselineValue) * 100;
                        }

                        return (
                          <div key={key} className="metric-item">
                            <span className="metric-label">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                            </span>
                            <div className="metric-value-container">
                              <span
                                className="metric-value"
                                style={{
                                  backgroundColor: isScaled ? getScoreColor(value) : 'rgba(96, 165, 250, 0.2)',
                                  color: '#ffffff',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontWeight: '600',
                                  display: 'inline-block',
                                }}
                              >
                                {formatNumber(value)}
                              </span>
                              {percentDiff !== null && (
                                <span
                                  className="metric-diff"
                                  style={{
                                    color: percentDiff > 0 ? '#10b981' : percentDiff < 0 ? '#ef4444' : '#94a3b8',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    marginLeft: '8px',
                                  }}
                                >
                                  {percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>No numeric metrics available</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .run-comparison-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .run-comparison-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(96, 165, 250, 0.3);
        }

        .run-comparison-header h2 {
          margin: 0;
          color: #60a5fa;
          font-size: 24px;
        }

        .close-button {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .close-button:hover {
          background: rgba(239, 68, 68, 0.3);
          transform: scale(1.05);
        }

        .run-comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .run-comparison-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(96, 165, 250, 0.3);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s;
        }

        .run-comparison-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(96, 165, 250, 0.2);
          border-color: rgba(96, 165, 250, 0.5);
        }

        .run-comparison-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(96, 165, 250, 0.2);
        }

        .run-comparison-card-header h3 {
          margin: 0;
          color: #60a5fa;
          font-size: 18px;
        }

        .execution-count-badge {
          background: rgba(96, 165, 250, 0.2);
          color: #60a5fa;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
        }

        .run-metadata {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
        }

        .metadata-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .metadata-label {
          color: #94a3b8;
          font-weight: 500;
        }

        .metadata-value {
          color: #e2e8f0;
          font-weight: 600;
        }

        .model-badge {
          background: rgba(96, 165, 250, 0.2);
          color: #60a5fa;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .prompt-badge {
          background: rgba(254, 143, 15, 0.2);
          color: #fe8f0f;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .aggregate-metrics {
          margin-top: 16px;
        }

        .aggregate-metrics h4 {
          margin: 0 0 12px 0;
          color: #60a5fa;
          font-size: 16px;
        }

        .metrics-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .metric-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
        }

        .metric-label {
          color: #cbd5e1;
          font-size: 14px;
          font-weight: 500;
        }

        .metric-value-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .metric-value {
          font-size: 14px;
        }

        .metric-diff {
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default RunComparison;
