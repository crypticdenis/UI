import React, { useState, useMemo } from 'react';
import { getUniqueScoreFields, getScoreColor, formatNumber } from '../utils/metricUtils';

const QuestionComparison = ({ baseID, currentRunVersion, allRuns, onClose }) => {
  // Find the base execution and its position within its run
  const baseRun = allRuns.find(run => (run.runs || []).some(exec => exec.id === baseID));
  const baseExecutions = baseRun?.runs || [];
  const baseIndex = baseExecutions.findIndex(exec => exec.id === baseID);
  const baseExecution = baseExecutions[baseIndex];
  
  // Match executions at the SAME POSITION across all runs (same workflow)
  const questionsWithSameID = allRuns.flatMap(run => {
    const executions = run.runs || [];
    const matchingExec = executions[baseIndex];
    if (matchingExec) {
      return [{
        ...matchingExec,
        runVersion: run.version,
        runId: run.id
      }];
    }
    return [];
  });
  
  // Group by run version
  const runsByVersion = questionsWithSameID.reduce((acc, q) => {
    if (!acc[q.runVersion]) {
      acc[q.runVersion] = q;
    }
    return acc;
  }, {});

  const availableVersions = Object.keys(runsByVersion);
  
  // Filter and sort state
  const [sortBy, setSortBy] = useState('timestamp'); // timestamp, avgScore, version
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [filterText, setFilterText] = useState('');
  
  // Initialize with current run selected (limit to 2 runs max)
  const [selectedVersions, setSelectedVersions] = useState([currentRunVersion].filter(v => runsByVersion[v]));

  const toggleVersion = (version) => {
    if (selectedVersions.includes(version)) {
      setSelectedVersions(selectedVersions.filter(v => v !== version));
    } else {
      // Limit to 2 runs maximum
      if (selectedVersions.length >= 2) {
        // Replace the oldest selection (first in array)
        setSelectedVersions([selectedVersions[1], version]);
      } else {
        setSelectedVersions([...selectedVersions, version]);
      }
    }
  };

  // Get all unique score fields dynamically from executions
  const scoreFields = useMemo(() => getUniqueScoreFields(questionsWithSameID), [questionsWithSameID]);

  // Sort and filter available versions for the selector
  const sortedFilteredVersions = useMemo(() => {
    let versions = availableVersions.filter(v => {
      if (!filterText) return true;
      const run = runsByVersion[v];
      return v.toLowerCase().includes(filterText.toLowerCase()) ||
             (run.model && run.model.toLowerCase().includes(filterText.toLowerCase())) ||
             (run.promptVersion && run.promptVersion.toLowerCase().includes(filterText.toLowerCase()));
    });

    versions.sort((a, b) => {
      const runA = runsByVersion[a];
      const runB = runsByVersion[b];
      
      let comparison = 0;
      if (sortBy === 'timestamp') {
        const dateA = runA.executionTs ? new Date(runA.executionTs) : new Date(0);
        const dateB = runB.executionTs ? new Date(runB.executionTs) : new Date(0);
        comparison = dateB - dateA; // Most recent first by default
      } else if (sortBy === 'avgScore') {
        const avgA = scoreFields.map(f => {
          const val = runA[f.key];
          return val && typeof val === 'object' && 'value' in val ? val.value : val;
        }).filter(v => v != null && !isNaN(v)).reduce((sum, v, _, arr) => sum + v / arr.length, 0);
        
        const avgB = scoreFields.map(f => {
          const val = runB[f.key];
          return val && typeof val === 'object' && 'value' in val ? val.value : val;
        }).filter(v => v != null && !isNaN(v)).reduce((sum, v, _, arr) => sum + v / arr.length, 0);
        
        comparison = avgB - avgA; // Higher score first by default
      } else { // version
        comparison = a.localeCompare(b);
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return versions;
  }, [availableVersions, runsByVersion, filterText, sortBy, sortOrder, scoreFields]);

  const selectedQuestions = selectedVersions
    .map(v => runsByVersion[v])
    .filter(Boolean)
    .sort((a, b) => {
      // Sort by execution timestamp
      if (a.executionTs && b.executionTs) {
        return new Date(a.executionTs) - new Date(b.executionTs);
      }
      return 0;
    });

  // Calculate score deltas for comparison
  const calculateDelta = (currentScore, prevScore) => {
    if (!prevScore || isNaN(prevScore) || !currentScore || isNaN(currentScore)) return null;
    return ((currentScore - prevScore) / prevScore * 100).toFixed(1);
  };

  const renderScoreWithDelta = (score, prevScore, label, reason) => {
    const delta = calculateDelta(score, prevScore);
    const isImprovement = delta && parseFloat(delta) > 0;
    const isRegression = delta && parseFloat(delta) < 0;
    
    return (
      <div className="comparison-score-item-enhanced">
        <div className="score-header">
          <span className="score-label">{label}</span>
          {delta && (
            <span className={`score-delta ${isImprovement ? 'positive' : isRegression ? 'negative' : ''}`}>
              {isImprovement ? '↑' : isRegression ? '↓' : ''} {Math.abs(parseFloat(delta))}%
            </span>
          )}
        </div>
        <div className="score-bar-container">
          <div 
            className="score-bar" 
            style={{ 
              width: `${(score || 0) * 100}%`,
              backgroundColor: getScoreColor(score)
            }}
          >
            <span className="score-bar-value">{formatNumber(score)}</span>
          </div>
        </div>
        {reason && (
          <div style={{ 
            marginTop: '8px', 
            fontSize: '13px', 
            color: '#94a3b8', 
            fontStyle: 'italic',
            lineHeight: '1.4'
          }}>
            {reason}
          </div>
        )}
      </div>
    );
  };

  const [expandedContent, setExpandedContent] = useState(null);

  const exportComparison = (format) => {
    if (format === 'json') {
      const exportData = selectedQuestions.map(q => ({
        id: q.id,
        version: q.version,
        timestamp: q.timestamp,
        input: q.input,
        expectedOutput: q.expectedOutput,
        output: q.output,
        metrics: scoreFields.reduce((acc, field) => {
          const metricData = q[field.key];
          if (metricData && typeof metricData === 'object' && 'value' in metricData) {
            acc[field.key] = {
              value: metricData.value,
              reason: metricData.reason
            };
          }
          return acc;
        }, {})
      }));
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comparison-question-${baseID}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = ['Version', 'Base ID', 'Model', 'Prompt Version', 'Timestamp', ...scoreFields.map(f => f.label)];
      const rows = selectedQuestions.map(q => [
        q.version,
        q.baseID,
        q.model,
        q.promptVersion,
        q.timestamp,
        ...scoreFields.map(f => formatNumber(q.ExecutionData?.[f.key]))
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comparison-question-${baseID}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="comparison-modal-overlay" onClick={onClose}>
      <div className="comparison-modal-content question-comparison-split" onClick={(e) => e.stopPropagation()}>
        <div className="comparison-modal-header">
          <div>
            <h2>Compare Question Across Runs</h2>
            {baseExecution && (
              <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px', fontStyle: 'italic' }}>
                Position {baseIndex + 1}: "{baseExecution.input?.length > 80 ? baseExecution.input.substring(0, 80) + '...' : baseExecution.input}"
              </div>
            )}
          </div>
          <div className="modal-header-actions">
            <div className="export-buttons">
              <button 
                onClick={() => exportComparison('json')}
                className="export-btn"
                title="Export as JSON"
                disabled={selectedQuestions.length === 0}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                JSON
              </button>
              <button 
                onClick={() => exportComparison('csv')}
                className="export-btn"
                title="Export as CSV"
                disabled={selectedQuestions.length === 0}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                CSV
              </button>
            </div>
            <button className="comparison-modal-close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="comparison-modal-body question-comparison-body">
          {availableVersions.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3 style={{ color: '#94a3b8', marginBottom: '12px' }}>No Matching Executions Found</h3>
              <p style={{ color: '#64748b', marginBottom: '8px' }}>
                Could not find other runs with execution at position {baseIndex + 1}
              </p>
            </div>
          ) : (
            <>
              {/* LEFT SIDEBAR: Run Selector */}
              <div className="question-comparison-sidebar">
                <div className="sidebar-header">
                  <h3>Select Runs</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="selection-count">
                      {selectedVersions.length}/2 selected
                    </div>
                    {selectedVersions.length > 0 && (
                      <button
                        onClick={() => setSelectedVersions([])}
                        className="clear-selection-btn"
                        title="Clear selection"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Filters and Sort */}
                <div className="sidebar-filters">
                  <input
                    type="text"
                    placeholder="Filter runs..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="filter-input"
                  />
                  <div className="sort-controls">
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sort-select"
                    >
                      <option value="timestamp">Date</option>
                      <option value="avgScore">Avg Score</option>
                      <option value="version">Version</option>
                    </select>
                    <button 
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="sort-order-btn"
                      title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>

                {/* Run List */}
                <div className="sidebar-run-list">
                  {sortedFilteredVersions.length === 0 ? (
                    <div className="no-results">
                      <p>No runs match your filter</p>
                    </div>
                  ) : (
                    sortedFilteredVersions.map(version => {
                      const run = runsByVersion[version];
                      const isSelected = selectedVersions.includes(version);
                      // Calculate average score dynamically from all metric fields
                      const avgScore = (() => {
                        const scores = scoreFields
                          .map(f => {
                            const val = run[f.key];
                            // Handle metric objects with value property
                            if (val && typeof val === 'object' && 'value' in val) {
                              return val.value;
                            }
                            return val;
                          })
                          .filter(v => v != null && !isNaN(v));
                        return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
                      })();
                      
                      return (
                        <div
                          key={version}
                          className={`sidebar-run-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleVersion(version)}
                        >
                          <div className="run-item-header">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleVersion(version);
                              }}
                              disabled={!isSelected && selectedVersions.length >= 2}
                            />
                            <div className="run-item-title">
                              <span className="run-version">{version}</span>
                              <span className="run-score-badge" style={{ backgroundColor: getScoreColor(avgScore) }}>
                                {formatNumber(avgScore)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="run-item-meta">
                            {run.executionTs && (
                              <div className="meta-item">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10"/>
                                  <polyline points="12 6 12 12 16 14"/>
                                </svg>
                                <span>
                                  {new Date(run.executionTs).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            )}
                            {run.model && (
                              <div className="meta-item">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                                <span>{run.model}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT SIDE: Comparison Display */}
              <div className="question-comparison-content">
                {selectedQuestions.length === 0 ? (
                  <div className="no-selection">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <p>Select up to 2 runs to compare</p>
                  </div>
                ) : selectedQuestions.length === 1 ? (
                  <div className="single-selection">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <p>Select one more run to enable comparison</p>
                  </div>
                ) : (
                  <>
                    {/* Shared Context Section */}
                    <div className="comparison-shared-context">
                      <div className="shared-context-section">
                        <h4>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                          Question Input
                        </h4>
                        <div className="shared-context-text">
                          {selectedQuestions[0].input || 'No input provided'}
                        </div>
                      </div>
                      
                      <div className="shared-context-section">
                        <h4>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Expected Output
                        </h4>
                        <div className="shared-context-text">
                          {selectedQuestions[0].expectedOutput || 'No expected output provided'}
                        </div>
                      </div>
                    </div>

                    {/* Comparison Grid */}
                    <div className="comparison-container-grid">
                    {selectedQuestions.map((question, index) => {
                      const prevQuestion = index > 0 ? selectedQuestions[0] : null;
                      const durationDelta = prevQuestion && prevQuestion.duration && question.duration 
                        ? ((question.duration - prevQuestion.duration) / prevQuestion.duration * 100).toFixed(1)
                        : null;
                      const tokensDelta = prevQuestion && prevQuestion.totalTokens && question.totalTokens
                        ? ((question.totalTokens - prevQuestion.totalTokens) / prevQuestion.totalTokens * 100).toFixed(1)
                        : null;

                      return (
                        <div key={question.id} className="comparison-card-compact">
                          <div className="comparison-card-header">
                            <h3>{question.runVersion}</h3>
                            {index === 0 && <span className="baseline-badge">Baseline</span>}
                          </div>
                          <div className="comparison-metadata">
                            {question.duration != null && (
                              <div className="metadata-item">
                                <span className="metadata-label">Duration:</span>
                                <span className="metadata-value">{question.duration}s</span>
                                {durationDelta && (
                                  <span className={`metadata-delta ${parseFloat(durationDelta) < 0 ? 'positive' : 'negative'}`}>
                                    {parseFloat(durationDelta) > 0 ? '+' : ''}{durationDelta}%
                                  </span>
                                )}
                              </div>
                            )}
                            {question.totalTokens != null && (
                              <div className="metadata-item">
                                <span className="metadata-label">Tokens:</span>
                                <span className="metadata-value">{question.totalTokens}</span>
                                {tokensDelta && (
                                  <span className={`metadata-delta ${parseFloat(tokensDelta) < 0 ? 'positive' : 'negative'}`}>
                                    {parseFloat(tokensDelta) > 0 ? '+' : ''}{tokensDelta}%
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="content-section">
                            <h4>Actual Output</h4>
                            <div className="content-text-full">
                              {question.output || 'No output provided'}
                            </div>
                          </div>

                          <h4 className="scores-title">Evaluation Scores</h4>
                          <div className="comparison-scores-compact">
                            {scoreFields.map(field => {
                              const currentVal = question[field.key];
                              const currentScore = currentVal && typeof currentVal === 'object' && 'value' in currentVal ? currentVal.value : currentVal;
                              const currentReason = currentVal && typeof currentVal === 'object' && 'reason' in currentVal ? currentVal.reason : null;
                              
                              // Only show delta for non-baseline runs (index > 0)
                              const prevVal = index > 0 ? selectedQuestions[0]?.[field.key] : null;
                              const prevScore = prevVal && typeof prevVal === 'object' && 'value' in prevVal ? prevVal.value : prevVal;
                              
                              return renderScoreWithDelta(
                                currentScore,
                                prevScore,
                                field.label,
                                currentReason
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {expandedContent && (
          <div className="modal-overlay" onClick={() => setExpandedContent(null)}>
            <div className="modal-content content-viewer-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{expandedContent.title}</h3>
                <button className="modal-close" onClick={() => setExpandedContent(null)}>✕</button>
              </div>
              <div className="modal-body">
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {expandedContent.content}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionComparison;
