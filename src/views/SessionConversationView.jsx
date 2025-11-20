import { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../styles/SessionConversationView.css';

const getScoreColor = (score) => {
  if (score >= 0.9) return '#10b981';
  if (score >= 0.8) return '#22c55e';
  if (score >= 0.7) return '#84cc16';
  if (score >= 0.6) return '#eab308';
  if (score >= 0.5) return '#f97316';
  return '#ef4444';
};

const MetricBadge = ({ name, value, reason }) => {
  const color = getScoreColor(value);
  return (
    <div 
      className="metric-badge" 
      style={{ borderColor: color }}
      title={reason || `${name}: ${value.toFixed(2)}`}
    >
      <span className="metric-name">{name}</span>
      <span className="metric-value" style={{ color }}>{value.toFixed(2)}</span>
    </div>
  );
};

const SubExecution = ({ subExec }) => {
  return (
    <div className="sub-execution">
      <div className="sub-execution-header">
        <span className="sub-execution-id">{subExec.id}</span>
        <span className="sub-execution-meta">
          {subExec.duration && `${subExec.duration}s`}
          {subExec.totalTokens && ` • ${subExec.totalTokens} tokens`}
        </span>
      </div>
      {subExec.input && (
        <div className="sub-execution-content">{subExec.input}</div>
      )}
      {subExec.output && (
        <div className="sub-execution-output">→ {subExec.output}</div>
      )}
    </div>
  );
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false 
  });
};

const ChatExchange = ({ execution, highlighted }) => {
  const [showEvaluationDetails, setShowEvaluationDetails] = useState(false);
  
  // Extract and categorize metrics
  const qualityMetrics = {};
  const performanceMetrics = {};
  
  Object.keys(execution).forEach(key => {
    const value = execution[key];
    if (value && typeof value === 'object' && 'value' in value) {
      // Categorize metrics
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('time') || lowerKey.includes('duration') || lowerKey.includes('token') || lowerKey.includes('cost')) {
        performanceMetrics[key] = value;
      } else {
        qualityMetrics[key] = value;
      }
    }
  });
  
  // Also add direct properties like duration and totalTokens as performance metrics
  if (execution.duration) {
    performanceMetrics['Response Time'] = { value: execution.duration, reason: '' };
  }
  if (execution.totalTokens) {
    performanceMetrics['Token Count'] = { value: execution.totalTokens, reason: '' };
  }
  
  // Calculate overall score from quality metrics
  const avgScore = Object.keys(qualityMetrics).length > 0
    ? Object.values(qualityMetrics).reduce((sum, m) => sum + m.value, 0) / Object.keys(qualityMetrics).length
    : 0;
  
  return (
    <>
      {/* User Message */}
      {execution.input && (
        <div className={`chat-message user-message ${highlighted ? 'highlighted' : ''}`} id={`execution-${execution.id}`}>
          <div className="message-header-tag">
            <span className="message-role-label">User</span>
            <span className="message-timestamp-header">
              {(execution.executionTs || execution.creationTs) && formatTimestamp(execution.executionTs || execution.creationTs)}
            </span>
          </div>
          <div className="message-bubble">
            <div className="message-text">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{execution.input}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
      
      {/* Assistant Message */}
      {execution.output && (
        <div className={`chat-message assistant-message ${highlighted ? 'highlighted' : ''}`}>
          <div className="message-header-tag">
            <span className="message-role-label">Assistant</span>
            <span className="message-timestamp-header">
              {(execution.executionTs || execution.creationTs) && formatTimestamp(execution.executionTs || execution.creationTs)}
            </span>
            {avgScore > 0 && (
              <span className="quality-score-badge" style={{ backgroundColor: getScoreColor(avgScore) }}>
                {(avgScore * 10).toFixed(1)}/10
              </span>
            )}
          </div>
          <div className="message-bubble">
            <div className={`message-bubble-content ${showEvaluationDetails ? 'expanded' : ''}`}>

              <div className="message-text-section">
                <div className="message-text">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{execution.output}</ReactMarkdown>
                </div>
                {execution.duration && execution.totalTokens && (
                  <div className="message-footer-inline">
                    <span className="message-meta-inline">
                      {execution.totalTokens} tokens • {execution.duration}s
                    </span>
                  </div>
                )}

                {/* Expected Output Section - shown when evaluation is expanded */}
                {showEvaluationDetails && execution.expectedOutput && (
                  <div className="expected-output-block">
                    <div className="expected-header">
                      <span className="expected-icon">✓</span>
                      <span className="expected-label">Expected Output</span>
                    </div>
                    <div className="expected-text">{execution.expectedOutput}</div>
                  </div>
                )}

                {/* Toggle Button underneath message */}
                {(Object.keys(qualityMetrics).length > 0 || Object.keys(performanceMetrics).length > 0 || execution.expectedOutput) && (
                  <button
                    className="evaluation-toggle-button"
                    onClick={() => setShowEvaluationDetails(!showEvaluationDetails)}
                  >
                    {showEvaluationDetails ? 'Hide Evaluation Details' : 'Show Evaluation Details'}
                  </button>
                )}
              </div>

              {/* Evaluation Details Section - Metrics on the right */}
              {(Object.keys(qualityMetrics).length > 0 || Object.keys(performanceMetrics).length > 0) && (
                <div className="evaluation-details-section">
                  {showEvaluationDetails && (
                    <div className="evaluation-content">
                  <div className="evaluation-grid">
                      {/* Quality Metrics Column */}
                      {Object.keys(qualityMetrics).length > 0 && (
                        <div className="metrics-column">
                          <h4 className="metrics-column-title">QUALITY METRICS</h4>
                          <div className="quality-metrics-list">
                            {Object.entries(qualityMetrics).map(([name, metric]) => (
                              <div key={name} className="quality-metric-item">
                                <div className="metric-item-header">
                                  <span className="metric-item-name">{name}</span>
                                  <span className="metric-item-value">{Math.round(metric.value * 100)}%</span>
                                </div>
                                <div className="metric-progress-bar">
                                  <div 
                                    className="metric-progress-fill"
                                    style={{ 
                                      width: `${metric.value * 100}%`,
                                      backgroundColor: getScoreColor(metric.value)
                                    }}
                                  />
                                </div>
                                {metric.reason && (
                                  <div className="metric-item-reason">{metric.reason}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Performance Metrics Column */}
                      {Object.keys(performanceMetrics).length > 0 && (
                        <div className="metrics-column">
                          <h4 className="metrics-column-title">PERFORMANCE METRICS</h4>
                          <div className="performance-metrics-list">
                            {Object.entries(performanceMetrics).map(([name, metric]) => {
                              const lowerName = name.toLowerCase();
                              let displayValue = metric.value;
                              
                              if (lowerName.includes('time') || lowerName.includes('duration')) {
                                displayValue = `${metric.value}s`;
                              } else if (lowerName.includes('token')) {
                                displayValue = Math.round(metric.value);
                              } else if (lowerName.includes('cost')) {
                                displayValue = `$${metric.value.toFixed(4)}`;
                              }
                              
                              return (
                                <div key={name} className="performance-metric-item">
                                  <span className="perf-name">{name}</span>
                                  <span className="perf-value">{displayValue}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Overall Score */}
                    {avgScore > 0 && (
                      <div className="overall-score-section">
                        <div className="overall-score-value" style={{ color: getScoreColor(avgScore) }}>
                          {Math.round(avgScore * 100)}%
                        </div>
                        <div className="overall-score-label">Overall Quality Score</div>
                      </div>
                    )}
                    
                    {/* Sub-executions */}
                    {execution.subExecutions && execution.subExecutions.length > 0 && (
                      <div className="sub-executions">
                        <h4 className="sub-executions-title">Sub-Executions</h4>
                        {execution.subExecutions.map(subExec => (
                          <SubExecution key={subExec.id} subExec={subExec} />
                        ))}
                      </div>
                    )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SessionConversationView = ({ runVersion, executions, onBack, onToggleViewMode, highlightExecutionId, onCompareSession, allRuns, onNavCollapse }) => {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [highlightedExecId, setHighlightedExecId] = useState(highlightExecutionId);
  const [compareRunVersion, setCompareRunVersion] = useState(null);
  const [showCompareDropdown, setShowCompareDropdown] = useState(false);
  const [sessionsSidebarCollapsed, setSessionsSidebarCollapsed] = useState(false);
  
  // Group executions by sessionId
  const sessionGroups = useMemo(() => {
    if (!executions || executions.length === 0) return [];
    
    const groups = {};
    executions.forEach(exec => {
      const sessionId = exec.sessionId || `exec_${exec.id}`;
      if (!groups[sessionId]) {
        groups[sessionId] = [];
      }
      groups[sessionId].push(exec);
    });
    
    // Convert to array and sort by timestamp
    return Object.entries(groups).map(([sessionId, execs]) => {
      const sortedExecs = execs.sort((a, b) => {
        const timeA = new Date(a.executionTs || a.creationTs || 0);
        const timeB = new Date(b.executionTs || b.creationTs || 0);
        return timeA - timeB;
      });
      
      // Calculate average score
      const metrics = [];
      sortedExecs.forEach(exec => {
        Object.keys(exec).forEach(key => {
          const value = exec[key];
          if (value && typeof value === 'object' && 'value' in value) {
            metrics.push(value.value);
          }
        });
      });
      
      const avgScore = metrics.length > 0
        ? metrics.reduce((sum, val) => sum + val, 0) / metrics.length
        : 0;
      
      return {
        sessionId,
        executions: sortedExecs,
        avgScore,
        messageCount: sortedExecs.length,
        firstMessage: sortedExecs[0]?.input || 'No input',
        timestamp: sortedExecs[0]?.executionTs || sortedExecs[0]?.creationTs
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [executions]);
  
  // Filter sessions
  const filteredSessions = useMemo(() => {
    if (!searchInput) return sessionGroups;
    const search = searchInput.toLowerCase();
    return sessionGroups.filter(session => 
      session.sessionId.toLowerCase().includes(search) ||
      session.executions.some(exec => 
        (exec.input || '').toLowerCase().includes(search) ||
        (exec.output || '').toLowerCase().includes(search)
      )
    );
  }, [sessionGroups, searchInput]);
  
  // Handle highlighting and navigation to specific execution
  useEffect(() => {
    if (highlightExecutionId && sessionGroups.length > 0) {
      // Find which session contains this execution
      const targetSession = sessionGroups.find(session => 
        session.executions.some(exec => exec.id === highlightExecutionId)
      );
      
      if (targetSession) {
        setSelectedSessionId(targetSession.sessionId);
        
        // Wait for render, then scroll to the execution
        setTimeout(() => {
          const element = document.getElementById(`execution-${highlightExecutionId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          
          // Remove highlight after animation
          setTimeout(() => {
            setHighlightedExecId(null);
          }, 3000);
        }, 100);
      }
    }
  }, [highlightExecutionId, sessionGroups]);
  
  // Auto-collapse sidebars when comparison starts
  useEffect(() => {
    if (compareRunVersion) {
      setSessionsSidebarCollapsed(true);
      if (onNavCollapse) {
        onNavCollapse(true);
      }
    } else {
      // When comparison ends, only expand sessions sidebar (not nav sidebar)
      setSessionsSidebarCollapsed(false);
    }
  }, [compareRunVersion, onNavCollapse]);

  // Auto-select first session if none selected
  const selectedSession = useMemo(() => {
    if (!selectedSessionId && filteredSessions.length > 0) {
      setSelectedSessionId(filteredSessions[0].sessionId);
      return filteredSessions[0];
    }
    return filteredSessions.find(s => s.sessionId === selectedSessionId);
  }, [selectedSessionId, filteredSessions]);

  // Get comparison session if a compare run is selected (match by session ID prefix)
  const compareSession = useMemo(() => {
    if (!compareRunVersion || !selectedSessionId || !allRuns || !selectedSession) return null;

    const compareRun = allRuns.find(r => r.version === compareRunVersion);
    if (!compareRun) return null;

    const compareExecs = compareRun.runs || [];
    
    // Extract session prefix (e.g., "1_20251117" from "1_20251117_083608")
    // Format: sessionNumber_datePrefix
    const getSessionPrefix = (sessionId) => {
      if (!sessionId) return null;
      const parts = sessionId.split('_');
      if (parts.length >= 2) {
        return `${parts[0]}_${parts[1]}`; // e.g., "1_20251117"
      }
      return sessionId;
    };

    const basePrefix = getSessionPrefix(selectedSessionId);
    if (!basePrefix) return null;

    // Find executions with matching session prefix
    const matchingExecs = compareExecs.filter(exec => {
      const execPrefix = getSessionPrefix(exec.sessionId);
      return execPrefix === basePrefix;
    });

    if (matchingExecs.length === 0) return null;

    // Use the actual sessionId from the first matched execution
    const matchedSessionId = matchingExecs[0]?.sessionId;
    
    return {
      sessionId: matchedSessionId,
      executions: matchingExecs.sort((a, b) => {
        const timeA = new Date(a.executionTs || a.creationTs || 0);
        const timeB = new Date(b.executionTs || b.creationTs || 0);
        return timeA - timeB;
      }),
      runVersion: compareRunVersion
    };
  }, [compareRunVersion, selectedSessionId, allRuns, selectedSession]);

  // Filter runs that have the selected session (by matching session ID prefix)
  const availableCompareRuns = useMemo(() => {
    if (!allRuns || !selectedSessionId || !selectedSession) return [];

    // Extract session prefix (e.g., "1_20251117" from "1_20251117_083608")
    const getSessionPrefix = (sessionId) => {
      if (!sessionId) return null;
      const parts = sessionId.split('_');
      if (parts.length >= 2) {
        return `${parts[0]}_${parts[1]}`; // e.g., "1_20251117"
      }
      return sessionId;
    };

    const basePrefix = getSessionPrefix(selectedSessionId);
    if (!basePrefix) return [];

    return allRuns
      .filter(run => run.version !== runVersion)
      .map(run => {
        const runExecutions = run.runs || [];

        // Check if this run has executions with matching session prefix
        const matchingExecs = runExecutions.filter(exec => {
          const execPrefix = getSessionPrefix(exec.sessionId);
          return execPrefix === basePrefix;
        });

        if (matchingExecs.length > 0) {
          // Calculate average score for matching executions
          const metrics = [];
          matchingExecs.forEach(exec => {
            Object.keys(exec).forEach(key => {
              const value = exec[key];
              if (value && typeof value === 'object' && 'value' in value) {
                const numValue = parseFloat(value.value);
                if (!isNaN(numValue) && numValue <= 1) {
                  metrics.push(numValue);
                }
              }
            });
          });

          const avgScore = metrics.length > 0
            ? metrics.reduce((sum, val) => sum + val, 0) / metrics.length
            : 0;

          return { ...run, hasSession: true, avgScore };
        }

        return null;
      })
      .filter(run => run !== null && run.hasSession);
  }, [allRuns, runVersion, selectedSessionId, selectedSession]);
  
  return (
    <div className="session-conversation-view">
      {/* Header */}
        <div className="conversation-header">
          <button className="btn btn-secondary" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Runs
          </button>
          <h1>Run: {runVersion}</h1>

          {/* Comparison Dropdown */}
          {availableCompareRuns.length > 0 && (
            <div className="compare-selector-container">
              {compareRunVersion ? (
                <div className="compare-active">
                  <span className="compare-label">Comparing with:</span>
                  <select
                    value={compareRunVersion}
                    onChange={(e) => setCompareRunVersion(e.target.value || null)}
                    className="compare-select"
                  >
                    <option value="">None</option>
                    {availableCompareRuns.map(run => (
                      <option key={run.id} value={run.version}>{run.version}</option>
                    ))}
                  </select>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setCompareRunVersion(null)}
                    title="Close comparison"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowCompareDropdown(!showCompareDropdown)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                    <path d="M15 18l6-6-6-6"/>
                  </svg>
                  Compare
                </button>
              )}

              {showCompareDropdown && !compareRunVersion && (
                <div className="compare-dropdown">
                  <div className="compare-dropdown-header">
                    <span>Select run to compare</span>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setShowCompareDropdown(false)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="compare-dropdown-list">
                    {availableCompareRuns.length === 0 ? (
                      <div className="compare-dropdown-empty">
                        No other runs found with this session
                      </div>
                    ) : (
                      availableCompareRuns.map(run => (
                        <div
                          key={run.id}
                          className="compare-dropdown-item"
                          onClick={() => {
                            setCompareRunVersion(run.version);
                            setShowCompareDropdown(false);
                          }}
                        >
                          <div className="run-dropdown-info">
                            <span className="run-version-name">{run.version}</span>
                            {run.model && <span className="run-meta-tag">{run.model}</span>}
                          </div>
                          {run.avgScore > 0 && (
                            <span
                              className="run-score-badge"
                              style={{ backgroundColor: getScoreColor(run.avgScore) }}
                            >
                              {(run.avgScore * 10).toFixed(1)}/10
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <button className="btn btn-secondary" onClick={onToggleViewMode}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            Table View
          </button>
        </div>
        
        <div className="conversation-container">
            <div className={`sessions-sidebar ${sessionsSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sessions-sidebar-header">
            <h2>Sessions</h2>
            <button
              className="sidebar-collapse-toggle"
              onClick={() => setSessionsSidebarCollapsed(!sessionsSidebarCollapsed)}
              title={sessionsSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {sessionsSidebarCollapsed ? (
                  <path d="M9 18l6-6-6-6"/>
                ) : (
                  <path d="M15 18l-6-6 6-6"/>
                )}
              </svg>
            </button>
          </div>
          {!sessionsSidebarCollapsed && (
            <div className="sessions-list">
              {filteredSessions.map(session => (
                <div
            key={session.sessionId}
            className={`session-card ${session.sessionId === selectedSessionId ? 'selected' : ''}`}
            onClick={() => setSelectedSessionId(session.sessionId)}
                >
            <div className="session-card-header">
              <span className="session-id">{session.sessionId}</span>
              {session.avgScore > 0 && (
                <span className="session-score-wrap">
              <span
                className="quality-score-badge session-score"
                style={{ backgroundColor: getScoreColor(session.avgScore) }}
                title={`Overall Quality: ${Math.round(session.avgScore * 100)}%`}
              >
                {(session.avgScore * 10).toFixed(1)}/10
              </span>
                </span>
              )}
            </div>
            <div className="session-card-preview">
              {session.firstMessage.substring(0, 60)}{session.firstMessage.length > 60 ? '...' : ''}
            </div>
            <div className="session-card-meta">
              {session.messageCount} {session.messageCount === 1 ? 'execution' : 'executions'}
            </div>
                </div>
              ))}
            </div>
          )}
            </div>
            
            {/* Conversation Area */}
        <div className={`conversation-area ${compareSession ? 'split-view' : ''}`}>
          {selectedSession ? (
            <>
              {compareSession ? (
                /* Split-screen comparison */
                <div className="split-screen-comparison">
                  <div className="comparison-panel base-panel">
                    <div className="conversation-area-header">
                      <div className="header-info-group">
                        <h2>{runVersion}</h2>
                        <span className="panel-session-id">{selectedSession.sessionId}</span>
                      </div>
                      {selectedSession.avgScore > 0 && (
                        <span
                          className="panel-score-badge"
                          style={{ backgroundColor: getScoreColor(selectedSession.avgScore) }}
                        >
                          {(selectedSession.avgScore * 10).toFixed(1)}/10
                        </span>
                      )}
                    </div>
                    <div className="conversation-content">
                      <div className="chat-history">
                        {selectedSession.executions.map((execution) => (
                          <ChatExchange
                            key={execution.id}
                            execution={execution}
                            highlighted={highlightedExecId === execution.id}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="comparison-panel compare-panel">
                    <div className="conversation-area-header">
                      <div className="header-info-group">
                        <h2>{compareSession.runVersion}</h2>
                        <span className="panel-session-id">{compareSession.sessionId}</span>
                      </div>
                      {(() => {
                        // Calculate avg score for compare session
                        const metrics = [];
                        compareSession.executions.forEach(exec => {
                          Object.keys(exec).forEach(key => {
                            const value = exec[key];
                            if (value && typeof value === 'object' && 'value' in value) {
                              const numValue = parseFloat(value.value);
                              if (!isNaN(numValue) && numValue <= 1) {
                                metrics.push(numValue);
                              }
                            }
                          });
                        });
                        const avgScore = metrics.length > 0
                          ? metrics.reduce((sum, val) => sum + val, 0) / metrics.length
                          : 0;

                        return avgScore > 0 ? (
                          <span
                            className="panel-score-badge"
                            style={{ backgroundColor: getScoreColor(avgScore) }}
                          >
                            {(avgScore * 10).toFixed(1)}/10
                          </span>
                        ) : null;
                      })()}
                    </div>
                    <div className="conversation-content">
                      <div className="chat-history">
                        {compareSession.executions.map((execution) => (
                          <ChatExchange
                            key={execution.id}
                            execution={execution}
                            highlighted={false}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Single view */
                <>
                  <div className="conversation-area-header">
                    <div className="header-info-group">
                      <h2>{selectedSession.sessionId}</h2>
                    </div>
                    {selectedSession.avgScore > 0 && (
                      <span
                        className="panel-score-badge"
                        style={{ backgroundColor: getScoreColor(selectedSession.avgScore) }}
                      >
                        {(selectedSession.avgScore * 10).toFixed(1)}/10
                      </span>
                    )}
                  </div>
                  <div className="conversation-content">
                    <div className="chat-history">
                      {selectedSession.executions.map((execution) => (
                        <ChatExchange
                          key={execution.id}
                          execution={execution}
                          highlighted={highlightedExecId === execution.id}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="conversation-empty">
              <p>Select a conversation to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionConversationView;
