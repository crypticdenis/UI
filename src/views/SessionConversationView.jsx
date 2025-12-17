import { useState, useMemo, useEffect } from 'react';
import ColumnFilter from '../components/ColumnFilter';
import ChatExchange from '../components/ChatExchange';
import { getScoreColor } from '../utils/metricUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMetricFields } from '../hooks/useMetricFields';
import { useSessionGroups } from '../hooks/useSessionGroups';
import '../styles/SessionConversationView.css';

const SessionConversationView = ({ runVersion, executions, onBack, onToggleViewMode, highlightExecutionId, _onCompareSession, allRuns, onNavCollapse }) => {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [highlightedExecId, setHighlightedExecId] = useState(highlightExecutionId);
  const [compareRunVersion, setCompareRunVersion] = useState(null);
  const [showCompareDropdown, setShowCompareDropdown] = useState(false);
  const [sessionsSidebarCollapsed, setSessionsSidebarCollapsed] = useState(false);
  
  // Use localStorage hook for visible metrics
  const [visibleMetrics, setVisibleMetrics] = useLocalStorage(
    'sessionConversation_visibleMetrics',
    new Set()
  );

  // Use localStorage hook for metric order
  const [metricOrder, setMetricOrder] = useLocalStorage(
    'sessionConversation_metricOrder',
    []
  );
  
  // Group executions by sessionId using custom hook
  const sessionGroups = useSessionGroups(executions);
  
  // Filter sessions
  const filteredSessions = useMemo(() => {
    return sessionGroups;
  }, [sessionGroups]);

  // Extract metric fields and get toggle functions
  const { allMetricFields: rawMetricFields, toggleMetricVisibility, toggleAllMetrics } = useMetricFields(
    executions,
    visibleMetrics,
    setVisibleMetrics
  );

  // Apply saved metric order
  const allMetricFields = useMemo(() => {
    if (metricOrder.length === 0) return rawMetricFields;

    const orderedFields = [];
    const fieldsByKey = new Map(rawMetricFields.map(f => [f.key, f]));
    
    // First add fields in saved order
    metricOrder.forEach(key => {
      if (fieldsByKey.has(key)) {
        orderedFields.push(fieldsByKey.get(key));
        fieldsByKey.delete(key);
      }
    });
    
    // Then add any new fields that weren't in saved order
    fieldsByKey.forEach(field => orderedFields.push(field));
    
    return orderedFields;
  }, [rawMetricFields, metricOrder]);
  
  // Handle metric reordering
  const handleReorderMetrics = (newFields) => {
    const newOrder = newFields.map(f => f.key);
    setMetricOrder(newOrder);
  };
  
  // Handle highlighting and navigation to specific execution
  useEffect(() => {
    if (highlightExecutionId && sessionGroups.length > 0) {
      // Update local highlight state
      setHighlightedExecId(highlightExecutionId);
      
      // Find which session contains this execution
      const targetSession = sessionGroups.find(session => 
        session.executions.some(exec => exec.id === highlightExecutionId)
      );
      
      if (targetSession) {
        // Ensure the correct session is selected
        setSelectedSessionId(targetSession.sessionId);
        
        // Wait for session to be selected and rendered, then scroll to the execution
        setTimeout(() => {
          const element = document.getElementById(`execution-${highlightExecutionId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            // If element not found, try again after a longer delay
            setTimeout(() => {
              const retryElement = document.getElementById(`execution-${highlightExecutionId}`);
              if (retryElement) {
                retryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 300);
          }
          
          // Remove highlight after animation
          setTimeout(() => {
            setHighlightedExecId(null);
          }, 3000);
        }, 200);
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

  // Auto-select first session if none selected (but don't override if highlighting is in progress)
  useEffect(() => {
    if (!selectedSessionId && filteredSessions.length > 0 && !highlightExecutionId) {
      setSelectedSessionId(filteredSessions[0].sessionId);
    }
  }, [selectedSessionId, filteredSessions, highlightExecutionId]);

  const selectedSession = useMemo(() => {
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
      <div className="conversation-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Runs
          </button>

          {/* Column Filter */}
          {allMetricFields.length > 0 && (
            <ColumnFilter
              allFields={allMetricFields}
              visibleColumns={visibleMetrics}
              onToggleColumn={toggleMetricVisibility}
              onToggleAll={toggleAllMetrics}
              onReorderColumns={handleReorderMetrics}
              storageKey="sessionConversation_visibleMetrics"
            />
          )}

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
                              {run.avgScore.toFixed(2)}
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
        </div>

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
                title={`Overall Quality: ${session.avgScore.toFixed(2)}`}
              >
                {session.avgScore.toFixed(2)}
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
                          {selectedSession.avgScore.toFixed(2)}
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
                            visibleMetrics={visibleMetrics}
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
                            {avgScore.toFixed(2)}
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
                            visibleMetrics={visibleMetrics}
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
                        {selectedSession.avgScore.toFixed(2)}
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
                          visibleMetrics={visibleMetrics}
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
