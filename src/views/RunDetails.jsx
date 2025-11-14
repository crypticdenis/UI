import React, { useState, useMemo, useEffect } from 'react';
import CollapsibleCell from '../components/CollapsibleCell';

const getScoreColor = (score) => {
  if (score >= 0.9) return '#10b981';
  if (score >= 0.8) return '#22c55e';
  if (score >= 0.7) return '#84cc16';
  if (score >= 0.6) return '#eab308';
  if (score >= 0.5) return '#f97316';
  return '#ef4444';
};

const formatNumber = (value) => {
  if (value == null || isNaN(value)) return '-';
  return Number(value).toFixed(2);
};

const RunDetails = ({ runVersion, questions, onBack, onCompareQuestion, onExpandContent, onNavigateToSubExecution, selectedProject, autoExpandExecutionId }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [searchInput, setSearchInput] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());

  console.log('RunDetails received:', { runVersion, questionsCount: questions?.length, questions });

  // Auto-expand execution if specified
  useEffect(() => {
    if (autoExpandExecutionId) {
      setExpandedRows(new Set([autoExpandExecutionId]));
    }
  }, [autoExpandExecutionId]);

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.details-search-bar .search-input');
        if (searchInput) searchInput.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const toggleRowExpansion = (questionId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubExecutionClick = (parentExecution) => {
    if (!parentExecution.subExecutions || parentExecution.subExecutions.length === 0) {
      return;
    }
    
    // Get the first sub-execution to navigate to
    const subExec = parentExecution.subExecutions[0];
    const workflowId = subExec.workflowId;
    const runId = subExec.runId;
    const executionId = subExec.id;
    
    console.log('Navigating to sub-execution:', { workflowId, runId, executionId, parentId: parentExecution.id });
    
    // Call the navigation handler
    if (onNavigateToSubExecution) {
      onNavigateToSubExecution(workflowId, runId, executionId);
    }
  };

  // Define field display order helper first
  const getFieldOrder = (key) => {
    const orderMap = {
      'id': 1,
      'sessionId': 5,
      'input': 10,
      'expectedOutput': 11,
      'output': 12,
      'duration': 100,
      'totalTokens': 101,
      'executionTs': 102,
    };
    
    // Metrics get 200+, everything else gets 300+
    if (orderMap[key] !== undefined) return orderMap[key];
    return key.toLowerCase().includes('score') || 
           key.toLowerCase().includes('rate') || 
           key.toLowerCase().includes('accuracy') ||
           key.toLowerCase().includes('metric') ? 200 : 300;
  };

  // Extract ALL fields dynamically from the data
  const allFields = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    
    const fieldMap = new Map();
    const skipFields = new Set(['runId', 'workflowId', 'parentExecutionId', 'creationTs', 'subExecutions']);
    
    questions.forEach(q => {
      Object.keys(q).forEach(key => {
        if (skipFields.has(key)) return; // Skip internal fields
        
        const val = q[key];
        if (!fieldMap.has(key)) {
          // Determine field type
          let type = 'text';
          let isMetric = false;
          
          if (val && typeof val === 'object' && 'value' in val) {
            // Metric object with {value, reason}
            type = typeof val.value === 'number' ? 'metric' : 'text';
            isMetric = true;
          } else if (typeof val === 'number') {
            type = 'number';
          } else if (typeof val === 'string' && val.length > 50) {
            type = 'longtext';
          }
          
          fieldMap.set(key, {
            key,
            label: key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase()),
            type,
            isMetric,
            order: getFieldOrder(key)
          });
        } else {
          // Update field type if we find a longer value
          const existingField = fieldMap.get(key);
          if (existingField.type === 'text' && typeof val === 'string' && val.length > 50) {
            existingField.type = 'longtext';
          }
        }
      });
    });
    
    // Sort fields by order
    return Array.from(fieldMap.values()).sort((a, b) => a.order - b.order);
  }, [questions]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    if (!questions) return [];
    
    return questions.filter(q => {
      if (!searchInput) return true;
      const search = searchInput.toLowerCase();
      return (
        (q.input || '').toLowerCase().includes(search) ||
        (q.output || '').toLowerCase().includes(search) ||
        (q.expectedOutput || '').toLowerCase().includes(search)
      );
    });
  }, [questions, searchInput]);

  // Sort questions
  const sortedQuestions = useMemo(() => {
    return [...filteredQuestions].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle metric objects - extract value
      if (aValue && typeof aValue === 'object' && 'value' in aValue) {
        aValue = aValue.value;
      }
      if (bValue && typeof bValue === 'object' && 'value' in bValue) {
        bValue = bValue.value;
      }

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [filteredQuestions, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const getCellValue = (question, field) => {
    const value = question[field.key];
    
    if (value == null || value === undefined) return '-';
    
    // Handle metric objects
    if (field.isMetric && typeof value === 'object' && 'value' in value) {
      return value.value;
    }
    
    return value;
  };

  const getCellReason = (question, field) => {
    if (!field.isMetric) return null;
    const value = question[field.key];
    if (value && typeof value === 'object' && 'reason' in value) {
      return value.reason;
    }
    return null;
  };

  // Calculate aggregate statistics
  const calculateAggregates = () => {
    if (!sortedQuestions || sortedQuestions.length === 0) return null;

    const stats = {
      totalExecutions: sortedQuestions.length,
      metrics: {}
    };

    // Fields to exclude from aggregates (non-metric fields)
    const excludedFields = [
      'id', 'input', 'expected_output', 'actual_output', 'timestamp', 
      'subExecutions', 'workflowId', 'parentExecutionId', 'runId',
      'duration', 'total_tokens', 'execution_ts', 'created_at', 'updated_at'
    ];

    // Collect all metrics dynamically
    const metricSums = {};
    const metricCounts = {};

    sortedQuestions.forEach(question => {
      Object.keys(question).forEach(key => {
        if (excludedFields.includes(key)) {
          return;
        }

        const value = question[key];
        let numValue = null;
        
        if (value && typeof value === 'object' && 'value' in value) {
          numValue = parseFloat(value.value);
        } else if (typeof value === 'number' || !isNaN(parseFloat(value))) {
          numValue = parseFloat(value);
        }

        // Only include metrics that are likely 0-1 scaled (scores, rates, accuracy)
        if (numValue !== null && !isNaN(numValue) && numValue >= 0 && numValue <= 1) {
          if (!metricSums[key]) {
            metricSums[key] = 0;
            metricCounts[key] = 0;
          }
          metricSums[key] += numValue;
          metricCounts[key]++;
        }
      });
    });

    // Calculate averages
    Object.keys(metricSums).forEach(key => {
      stats.metrics[key] = {
        avg: metricSums[key] / metricCounts[key],
        count: metricCounts[key]
      };
    });

    return stats;
  };

  const aggregates = calculateAggregates();

  return (
    <div className="run-details">
      <div className="details-header">
        <div className="details-header-top">
          <button className="back-button" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Runs
          </button>
        </div>
        <div className="details-header-main">
          <div className="details-title-section">
            <h1>Run: {runVersion}</h1>
            <span className="execution-count-badge">
              {sortedQuestions.length} execution{sortedQuestions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Aggregate Statistics */}
      {aggregates && Object.keys(aggregates.metrics).length > 0 && (
        <div className="aggregate-stats-container">
          <div className="aggregate-stats-header">
            <h3>Average Metrics</h3>
            <span className="stats-count">{aggregates.totalExecutions} executions</span>
          </div>
          <div className="aggregate-stats-grid">
            {Object.entries(aggregates.metrics)
              .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
              .map(([key, data]) => {
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const color = getScoreColor(data.avg);
                
                return (
                  <div key={key} className="aggregate-stat-card">
                    <div className="stat-label">{label}</div>
                    <div 
                      className="stat-value"
                      style={{ backgroundColor: color }}
                    >
                      {formatNumber(data.avg)}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="details-search-bar">
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Quick search across executions (input, output, expected output)... Press Ctrl+K"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          {searchInput && (
            <button 
              onClick={() => setSearchInput('')}
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

      <div className="questions-table-container">
        <table className="questions-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </th>
              {allFields.map(field => (
                <th key={field.key} onClick={() => handleSort(field.key)} style={{ cursor: 'pointer' }}>
                  {field.label} {sortConfig.key === field.key && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedQuestions.length === 0 ? (
              <tr>
                <td colSpan={allFields.length + 1} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  No executions found
                </td>
              </tr>
            ) : (
              sortedQuestions.map((question) => {
                const isExpanded = expandedRows.has(question.id);
                const hasSubExecutions = question.subExecutions && question.subExecutions.length > 0;
                return (
                  <React.Fragment key={question.id}>
                    <tr>
                      <td style={{ width: '60px', textAlign: 'center', padding: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                          <button
                            onClick={() => toggleRowExpansion(question.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#3b82f6',
                              fontSize: '18px',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title={isExpanded ? "Collapse details" : "Expand details"}
                          >
                            {isExpanded ? '▼' : '▶'}
                          </button>
                          {hasSubExecutions && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubExecutionClick(question);
                              }}
                              style={{
                                background: '#1e293b',
                                border: '2px solid #3b82f6',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                cursor: 'pointer',
                                color: '#3b82f6',
                                fontSize: '11px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                              }}
                              title={`View ${Array.isArray(question.subExecutions) ? question.subExecutions.length : 0} ${question.subExecutions[0]?.workflowId || 'sub-workflow'} execution(s)`}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#3b82f6';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.transform = 'scale(1.1)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = '#1e293b';
                                e.currentTarget.style.color = '#3b82f6';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              {(() => {
                                if (Array.isArray(question.subExecutions)) {
                                  return question.subExecutions.length;
                                }
                                console.error('subExecutions is not an array:', question.subExecutions);
                                return '?';
                              })()}
                            </button>
                          )}
                        </div>
                      </td>
                      {allFields.map(field => {
                        const cellValue = getCellValue(question, field);
                        const reason = getCellReason(question, field);
                    
                        // Handle different field types
                        if (field.type === 'longtext' && typeof cellValue === 'string') {
                          return (
                            <td key={field.key} className="question-cell" style={{ maxWidth: '300px' }}>
                              <div style={{ wordBreak: 'break-word' }}>
                                {isExpanded ? cellValue : (cellValue.length > 100 ? cellValue.substring(0, 100) + '...' : cellValue)}
                              </div>
                            </td>
                          );
                        }
                    
                        if (field.type === 'metric' && typeof cellValue === 'number') {
                          return (
                            <td 
                              key={field.key} 
                              className="metric-cell" 
                              style={{ 
                                backgroundColor: getScoreColor(cellValue),
                                color: '#ffffff',
                                padding: '8px',
                                textAlign: 'center',
                                fontWeight: '700',
                                fontSize: '16px'
                              }}
                              title={reason && !isExpanded ? reason : ''}
                            >
                              {cellValue.toFixed(2)}
                            </td>
                          );
                        }
                    
                    if (field.type === 'number' && typeof cellValue === 'number') {
                      return (
                        <td key={field.key} style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                          {cellValue.toFixed(2)}
                        </td>
                      );
                    }
                    
                        // Default text rendering
                        const textValue = String(cellValue);
                        const displayValue = isExpanded || textValue.length <= 100 ? textValue : textValue.substring(0, 100) + '...';
                        
                        return (
                          <td key={field.key} style={{ maxWidth: '300px' }}>
                            <div style={{ wordBreak: 'break-word' }}>
                              {displayValue}
                            </div>
                          </td>
                        );
                      })}
                      <td>
                        {onCompareQuestion && (
                          <button 
                            className="compare-question-btn"
                            onClick={() => onCompareQuestion(question.id, runVersion)}
                            title="Compare this execution across all runs"
                          >
                            Compare
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr style={{ backgroundColor: '#1e293b' }}>
                        <td colSpan={allFields.length + 2} style={{ padding: '16px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                            {allFields.map(field => {
                              const cellValue = getCellValue(question, field);
                              const reason = getCellReason(question, field);
                              
                              return (
                                <div key={field.key} style={{ borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
                                  <div style={{ fontWeight: '600', color: '#60a5fa', marginBottom: '8px', fontSize: '13px' }}>
                                    {field.label}
                                  </div>
                                  <div style={{ color: '#e2e8f0', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '14px', lineHeight: '1.6' }}>
                                    {field.type === 'metric' && typeof cellValue === 'number' ? (
                                      <div>
                                        <span style={{ 
                                          padding: '4px 12px',
                                          borderRadius: '4px',
                                          backgroundColor: getScoreColor(cellValue),
                                          color: 'white',
                                          fontWeight: '700',
                                          fontSize: '16px'
                                        }}>
                                          {cellValue.toFixed(2)}
                                        </span>
                                        {reason && (
                                          <div style={{ marginTop: '8px', fontStyle: 'italic', color: '#cbd5e1' }}>
                                            {reason}
                                          </div>
                                        )}
                                      </div>
                                    ) : String(cellValue)}
                                  </div>
                                </div>
                              );
                            })}
                            
                            {/* Display Sub-Executions */}
                            {question.subExecutions && question.subExecutions.length > 0 && (
                              <div style={{ marginTop: '24px', borderTop: '2px solid #3b82f6', paddingTop: '16px' }}>
                                <div style={{ fontWeight: '700', color: '#3b82f6', marginBottom: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3"/>
                                    <path d="M12 1v6m0 6v6m7.07-13.07l-4.24 4.24m0 5.66l4.24 4.24M1 12h6m6 0h6M4.93 4.93l4.24 4.24m5.66 0l4.24-4.24"/>
                                  </svg>
                                  Sub-Workflow Executions ({question.subExecutions.length})
                                </div>
                                {question.subExecutions.map((subExec, idx) => (
                                  <div key={subExec.id} style={{ 
                                    marginBottom: idx < question.subExecutions.length - 1 ? '16px' : '0',
                                    padding: '16px', 
                                    backgroundColor: '#0f172a', 
                                    borderRadius: '8px',
                                    border: '1px solid #334155'
                                  }}>
                                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ 
                                          padding: '4px 12px',
                                          borderRadius: '4px',
                                          backgroundColor: '#1e40af',
                                          color: 'white',
                                          fontWeight: '600',
                                          fontSize: '13px'
                                        }}>
                                          {subExec.workflowId || 'Sub-Workflow'}
                                        </span>
                                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                                          Execution ID: {subExec.id}
                                        </span>
                                      </div>
                                      {onNavigateToSubExecution && subExec.workflowId && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Navigate to the standalone workflow
                                            if (onNavigateToSubExecution) {
                                              onNavigateToSubExecution(subExec.workflowId, null, null, true);
                                            }
                                          }}
                                          style={{
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            border: '1px solid #3b82f6',
                                            backgroundColor: 'transparent',
                                            color: '#3b82f6',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.2s'
                                          }}
                                          onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = '#3b82f6';
                                            e.currentTarget.style.color = 'white';
                                          }}
                                          onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#3b82f6';
                                          }}
                                          title={`View standalone ${subExec.workflowId} workflow`}
                                        >
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="3"/>
                                            <path d="M12 1v6m0 6v6m7.07-13.07l-4.24 4.24m0 5.66l4.24 4.24M1 12h6m6 0h6M4.93 4.93l4.24 4.24m5.66 0l4.24-4.24"/>
                                          </svg>
                                          View Workflow
                                        </button>
                                      )}
                                    </div>
                                    {Object.keys(subExec).filter(k => !['id', 'runId', 'workflowId', 'parentExecutionId', 'creationTs', 'subExecutions'].includes(k)).map(key => {
                                      const val = subExec[key];
                                      const displayValue = val && typeof val === 'object' && 'value' in val ? val.value : val;
                                      const reason = val && typeof val === 'object' && 'reason' in val ? val.reason : null;
                                      const isMetric = val && typeof val === 'object' && 'value' in val;
                                      
                                      return (
                                        <div key={key} style={{ marginBottom: '12px' }}>
                                          <div style={{ fontWeight: '600', color: '#60a5fa', marginBottom: '4px', fontSize: '12px' }}>
                                            {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase())}
                                          </div>
                                          <div style={{ color: '#e2e8f0', fontSize: '13px', lineHeight: '1.5' }}>
                                            {isMetric && typeof displayValue === 'number' ? (
                                              <div>
                                                <span style={{ 
                                                  padding: '2px 8px',
                                                  borderRadius: '4px',
                                                  backgroundColor: getScoreColor(displayValue),
                                                  color: 'white',
                                                  fontWeight: '600',
                                                  fontSize: '14px'
                                                }}>
                                                  {displayValue.toFixed(2)}
                                                </span>
                                                {reason && (
                                                  <div style={{ marginTop: '4px', fontStyle: 'italic', color: '#94a3b8', fontSize: '12px' }}>
                                                    {reason}
                                                  </div>
                                                )}
                                              </div>
                                            ) : typeof displayValue === 'number' ? (
                                              displayValue.toFixed(2)
                                            ) : (
                                              String(displayValue || '-')
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RunDetails;
