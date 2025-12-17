import { useState, useMemo, useEffect, Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import RunCard from '../components/RunCard';
import ColumnFilter from '../components/ColumnFilter';
import { getScoreColor, getUniqueScoreFields } from '../utils/metricUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMetricFields } from '../hooks/useMetricFields';
import '../styles/RunDetails.css';

const RunDetails = ({ runVersion, questions, run, onBack, onCompareQuestion, onNavigateToSubExecution, autoExpandExecutionId, onToggleViewMode, _viewMode }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [searchInput, setSearchInput] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  // Use localStorage hook for visible columns
  const [visibleColumns, setVisibleColumns] = useLocalStorage(
    'runDetails_visibleColumns',
    new Set()
  );

  // Use localStorage hook for column order
  const [columnOrder, setColumnOrder] = useLocalStorage(
    'runDetails_columnOrder',
    []
  );

  // Calculate score fields from questions
  const scoreFields = useMemo(() => {
    return getUniqueScoreFields(questions || []);
  }, [questions]);

  // Extract metric fields and get toggle functions
  const { allMetricFields: _metricFields, toggleMetricVisibility: toggleColumnVisibility, toggleAllMetrics: toggleAllColumns } = useMetricFields(
    questions,
    visibleColumns,
    setVisibleColumns
  );

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
      'groundtruth': 12,
      'output': 13,
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
    const skipFields = new Set(['id', 'runId', 'workflowId', 'parentExecutionId', 'creationTs', 'subExecutions', 'sessionId']);
    
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
            console.log(`[RunDetails] Found metric field: ${key}, value:`, val);
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
    
    const fields = Array.from(fieldMap.values()).sort((a, b) => a.order - b.order);
    console.log('[RunDetails] All fields:', fields.map(f => ({key: f.key, type: f.type, isMetric: f.isMetric})));
    
    // Apply saved column order if available
    if (columnOrder.length > 0) {
      const orderedFields = [];
      const fieldsByKey = new Map(fields.map(f => [f.key, f]));
      
      // First add fields in saved order
      columnOrder.forEach(key => {
        if (fieldsByKey.has(key)) {
          orderedFields.push(fieldsByKey.get(key));
          fieldsByKey.delete(key);
        }
      });
      
      // Then add any new fields that weren't in saved order
      fieldsByKey.forEach(field => orderedFields.push(field));
      
      return orderedFields;
    }
    
    return fields;
  }, [questions, columnOrder]);

  // Initialize visible columns on first render if empty
  useEffect(() => {
    if (visibleColumns.size === 0 && allFields.length > 0) {
      // Show all fields by default on first visit
      const defaultVisible = new Set(allFields.map(f => f.key));
      setVisibleColumns(defaultVisible);
    }
  }, [allFields, visibleColumns.size, setVisibleColumns]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    if (!questions) return [];
    
    return questions.filter(q => {
      if (!searchInput) return true;
      const search = searchInput.toLowerCase();
      return (
        (q.input || '').toLowerCase().includes(search) ||
        (q.output || '').toLowerCase().includes(search) ||
        (q.expectedOutput || '').toLowerCase().includes(search) ||
        (q.groundtruth || '').toLowerCase().includes(search)
      );
    });
  }, [questions, searchInput]);

  // Get visible fields based on user preferences
  const visibleFields = useMemo(() => {
    return allFields.filter(field => visibleColumns.has(field.key));
  }, [allFields, visibleColumns]);

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

  const handleReorderColumns = (newFields) => {
    const newOrder = newFields.map(f => f.key);
    setColumnOrder(newOrder);
  };

  const getCellValue = (question, field) => {
    const value = question[field.key];
    
    if (value == null || value === undefined) return '-';
    
    // Always extract value from metric objects to prevent rendering object error
    if (typeof value === 'object' && value !== null && 'value' in value) {
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

  return (
    <div className="run-details">
      <div className="details-header">
        <div className="details-header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <button className="btn btn-secondary" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Runs
          </button>
          {onToggleViewMode && (
            <button className="btn btn-secondary" onClick={() => onToggleViewMode()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Conversation View
            </button>
          )}
        </div>
        {/* Details Header - Using RunCard in card mode like RunsOverview */}
        <RunCard
          mode="card"
          run={run}
          scoreFields={scoreFields}
          maxMetrics={3}
          showAvgScore={true}
          showAllScores={true}
        />
      </div>

      <div className="details-search-bar">
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Quick search across executions (input, output, expected output, groundtruth)... Press Ctrl+K"
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
        
        {/* Column Filter Button */}
        <ColumnFilter
          allFields={allFields}
          visibleColumns={visibleColumns}
          onToggleColumn={toggleColumnVisibility}
          onToggleAll={toggleAllColumns}
          onReorderColumns={handleReorderColumns}
          storageKey="runDetails_visibleColumns"
        />
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
              {visibleFields.map(field => (
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
                <td colSpan={visibleFields.length + 2} className="text-center p-20 text-muted-color">
                  No executions found
                </td>
              </tr>
            ) : (
              sortedQuestions.map((question) => {
                const isExpanded = expandedRows.has(question.id);
                const hasSubExecutions = question.subExecutions && question.subExecutions.length > 0;
                return (
                  <Fragment key={question.id}>
                    <tr>
                      <td className="cell-icon">
                        <div className="cell-icon-inner">
                          <button
                            onClick={() => toggleRowExpansion(question.id)}
                            className="btn-expand"
                            title={isExpanded ? "Collapse details" : "Expand details"}
                          >
                            {isExpanded ? '−' : '+'}
                          </button>
                          {hasSubExecutions && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubExecutionClick(question);
                              }}
                              className="btn-sub-exec"
                              title={`View ${Array.isArray(question.subExecutions) ? question.subExecutions.length : 0} ${question.subExecutions[0]?.workflowId || 'sub-workflow'} execution(s)`}
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
                      {visibleFields.map(field => {
                        const cellValue = getCellValue(question, field);
                        const reason = getCellReason(question, field);
                    
                        // Handle different field types
                        if (field.type === 'longtext' && typeof cellValue === 'string') {
                          return (
                            <td key={field.key} className="question-cell cell-medium">
                              <div className="word-break">
                                {cellValue.length > 100 ? cellValue.substring(0, 100) + '...' : cellValue}
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
                              title={reason || ''}
                            >
                              {cellValue.toFixed(2)}
                            </td>
                          );
                        }
                    
                    if (field.type === 'number' && typeof cellValue === 'number') {
                      return (
                        <td key={field.key} className="text-right font-mono">
                          {cellValue.toFixed(2)}
                        </td>
                      );
                    }
                    
                        // Default text rendering
                        const textValue = String(cellValue);
                        const displayValue = textValue.length <= 100 ? textValue : textValue.substring(0, 100) + '...';
                        
                        return (
                          <td key={field.key} className="cell-medium">
                            <div className="word-break">
                              {displayValue}
                            </div>
                          </td>
                        );
                      })}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {onCompareQuestion && (
                            <button 
                              className="compare-question-btn"
                              onClick={() => onCompareQuestion(question.id, runVersion)}
                              title="Compare this execution across all runs"
                            >
                              Compare
                            </button>
                          )}
                          {onToggleViewMode && (
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => onToggleViewMode(question.id)}
                              title="View in conversation mode"
                            >
                              View
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="expanded-row">
                        <td colSpan={visibleFields.length + 2} className="expanded-row-cell">
                          <div className="expanded-content-grid">
                            {allFields.map(field => {
                              const cellValue = getCellValue(question, field);
                              const reason = getCellReason(question, field);
                              
                              // Fields that should render as markdown
                              const markdownFields = ['groundtruth', 'expectedOutput', 'input', 'output'];
                              const shouldRenderMarkdown = markdownFields.includes(field.key) && 
                                                          typeof cellValue === 'string' && 
                                                          cellValue.length > 100;
                              
                              return (
                                <div key={field.key} className="expanded-field">
                                  <div className="expanded-field-label">
                                    {field.label}
                                  </div>
                                  <div className="expanded-field-value">
                                    {field.isMetric && typeof cellValue === 'number' ? (
                                      <div>
                                        <span className="metric-score-badge" style={{ 
                                          backgroundColor: getScoreColor(cellValue)
                                        }}>
                                          {cellValue.toFixed(2)}
                                        </span>
                                        {reason && (
                                          <div className="metric-reason">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                              {reason}
                                            </ReactMarkdown>
                                          </div>
                                        )}
                                      </div>
                                    ) : shouldRenderMarkdown ? (
                                      <div className="markdown-content">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                          {String(cellValue)}
                                        </ReactMarkdown>
                                      </div>
                                    ) : String(cellValue)}
                                  </div>
                                </div>
                              );
                            })}
                            
                            {/* Display Sub-Executions */}
                            {question.subExecutions && question.subExecutions.length > 0 && (
                              <div className="sub-executions-section">
                                <div className="sub-executions-title">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3"/>
                                    <path d="M12 1v6m0 6v6m7.07-13.07l-4.24 4.24m0 5.66l4.24 4.24M1 12h6m6 0h6M4.93 4.93l4.24 4.24m5.66 0l4.24-4.24"/>
                                  </svg>
                                  Sub-Workflow Executions ({question.subExecutions.length})
                                </div>
                                {question.subExecutions.map((subExec, idx) => (
                                  <div key={subExec.id} className="sub-exec-card" style={{ 
                                    marginBottom: idx < question.subExecutions.length - 1 ? '16px' : '0'
                                  }}>
                                    <div className="sub-exec-header">
                                      <div className="sub-exec-header-left">
                                        <span className="sub-exec-id">
                                          {subExec.workflowId || 'Sub-Workflow'}
                                        </span>
                                        <span className="sub-exec-meta">
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
                                          className="btn btn-secondary"
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
                                        <div key={key} className="sub-exec-metric">
                                          <div className="sub-exec-metric-label">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase())}
                                          </div>
                                          <div className="sub-exec-metric-value">
                                            {isMetric && typeof displayValue === 'number' ? (
                                              <div>
                                                <span className="metric-score-badge" style={{ 
                                                  backgroundColor: getScoreColor(displayValue)
                                                }}>
                                                  {displayValue.toFixed(2)}
                                                </span>
                                                {reason && (
                                                  <div className="sub-exec-metric-reason">
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
                  </Fragment>
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
