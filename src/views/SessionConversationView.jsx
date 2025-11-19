import { useState, useMemo, useEffect } from 'react';
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
        <span className="sub-execution-icon">🔍</span>
        <span className="sub-execution-workflow">{subExec.workflowId}</span>
        <span className="sub-execution-meta">
          {subExec.duration && `⏱️ ${subExec.duration}s`}
          {subExec.totalTokens && ` • 💬 ${subExec.totalTokens} tokens`}
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
          <div className="message-icon">🙋</div>
          <div className="message-content">
            <div className="message-label">
              User
              {(execution.executionTs || execution.creationTs) && (
                <span style={{ marginLeft: 'auto', fontWeight: '400', fontSize: '10px' }}>
                  {formatTimestamp(execution.executionTs || execution.creationTs)}
                </span>
              )}
            </div>
            <div className="message-text">{execution.input}</div>
          </div>
        </div>
      )}
      
      {/* Assistant Message */}
      {execution.output && (
        <div className={`chat-message assistant-message ${highlighted ? 'highlighted' : ''}`}>
          <div className="message-content">
            {/* Actual Output Section */}
            <div className="output-section">
              <div className="output-header">
                <span className="output-icon">🤖</span>
                <span className="output-label">Actual Output (LLM)</span>
                {(execution.executionTs || execution.creationTs) && (
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#94a3b8', fontWeight: '400' }}>
                    {formatTimestamp(execution.executionTs || execution.creationTs)}
                  </span>
                )}
              </div>
              <div className="output-text">{execution.output}</div>
              {execution.duration && execution.totalTokens && (
                <div className="output-meta">
                  {execution.totalTokens} Tokens | {execution.duration}s Response Time
                </div>
              )}
            </div>
            
            {/* Expected Output Section */}
            {execution.expectedOutput && (
              <div className="expected-section">
                <div className="expected-header">
                  <span className="expected-icon">✓</span>
                  <span className="expected-label">Expected Output (Ground Truth)</span>
                </div>
                <div className="expected-text">{execution.expectedOutput}</div>
              </div>
            )}
            
            {/* Evaluation Details (Collapsible) */}
            {(Object.keys(qualityMetrics).length > 0 || Object.keys(performanceMetrics).length > 0) && (
              <div className="evaluation-details-section">
                <button 
                  className="evaluation-toggle"
                  onClick={() => setShowEvaluationDetails(!showEvaluationDetails)}
                >
                  <span className="toggle-icon">{showEvaluationDetails ? '▲' : '▼'}</span>
                  Evaluation Details
                </button>
                
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
                              let icon = '⏱️';
                              let displayValue = metric.value;
                              
                              if (lowerName.includes('time') || lowerName.includes('duration')) {
                                icon = '⏱️';
                                displayValue = `${metric.value}s`;
                              } else if (lowerName.includes('token')) {
                                icon = '💬';
                                displayValue = Math.round(metric.value);
                              } else if (lowerName.includes('cost')) {
                                icon = '💰';
                                displayValue = `$${metric.value.toFixed(4)}`;
                              }
                              
                              return (
                                <div key={name} className="performance-metric-item">
                                  <span className="perf-icon">{icon}</span>
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
      )}
    </>
  );
};

const SessionConversationView = ({ runVersion, executions, onBack, onToggleViewMode, highlightExecutionId }) => {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [highlightedExecId, setHighlightedExecId] = useState(highlightExecutionId);
  
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
  
  // Auto-select first session if none selected
  const selectedSession = useMemo(() => {
    if (!selectedSessionId && filteredSessions.length > 0) {
      setSelectedSessionId(filteredSessions[0].sessionId);
      return filteredSessions[0];
    }
    return filteredSessions.find(s => s.sessionId === selectedSessionId);
  }, [selectedSessionId, filteredSessions]);
  
  return (
    <div className="session-conversation-view">
      {/* Header */}
      <div className="conversation-header">
        <button className="back-button" onClick={onToggleViewMode || onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Table View
        </button>
        <h1>Run: {runVersion}</h1>
        <div className="conversation-stats">
          {filteredSessions.length} {filteredSessions.length === 1 ? 'conversation' : 'conversations'}
        </div>
      </div>
      
      <div className="conversation-container">
        {/* Sessions Sidebar */}
        <div className="sessions-sidebar">
          <div className="sessions-sidebar-header">
            <h2>Conversations</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
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
                    <span className="session-score" style={{ color: getScoreColor(session.avgScore) }}>
                      ⭐ {session.avgScore.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="session-card-preview">
                  {session.firstMessage.substring(0, 60)}{session.firstMessage.length > 60 ? '...' : ''}
                </div>
                <div className="session-card-meta">
                  {session.messageCount} {session.messageCount === 1 ? 'message' : 'messages'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Conversation Area */}
        <div className="conversation-area">
          {selectedSession ? (
            <>
              <div className="conversation-area-header">
                <h2>{selectedSession.sessionId}</h2>
                <div className="conversation-meta">
                  {selectedSession.messageCount} {selectedSession.messageCount === 1 ? 'execution' : 'executions'}
                </div>
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
