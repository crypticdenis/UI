import { useState } from 'react';
import { getScoreColor } from '../utils/metricUtils';
import '../styles/ConversationComparison.css';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const ConversationComparison = ({ sessionId, baseRunVersion, allRuns, onClose }) => {
  // Find the base run that contains this session
  const baseRun = allRuns.find(run => run.version === baseRunVersion);
  const baseExecutions = baseRun?.runs || [];
  
  // Get all executions from the base session
  const baseSessionExecutions = baseExecutions.filter(exec => 
    (exec.sessionId || `exec_${exec.id}`) === sessionId
  ).sort((a, b) => {
    const timeA = new Date(a.executionTs || a.creationTs || 0);
    const timeB = new Date(b.executionTs || b.creationTs || 0);
    return timeA - timeB;
  });
  
  // Find all runs that have matching conversation sequences
  // Match runs by checking if they have executions with the same inputs in sequence
  const baseInputs = baseSessionExecutions.map(exec => exec.input);
  const runsWithSession = allRuns.filter(run => {
    const runExecutions = run.runs || [];
    
    // Check if this run has executions with the same inputs in sequence
    if (baseInputs.length === 0) return false;
    
    for (let i = 0; i <= runExecutions.length - baseInputs.length; i++) {
      const slice = runExecutions.slice(i, i + baseInputs.length);
      const inputsMatch = slice.every((exec, idx) => exec.input === baseInputs[idx]);
      if (inputsMatch) return true;
    }
    
    return false;
  });
  
  // State for selected comparison run
  const [selectedCompareVersion, setSelectedCompareVersion] = useState(null);
  const [showRunSelector, setShowRunSelector] = useState(false);
  const [expandedEvaluations, setExpandedEvaluations] = useState({});
  
  const toggleEvaluation = (executionId) => {
    setExpandedEvaluations(prev => ({
      ...prev,
      [executionId]: !prev[executionId]
    }));
  };
  
  // Get comparison run executions if selected
  const compareRun = runsWithSession.find(run => run.version === selectedCompareVersion);
  const compareSessionData = compareRun ? (() => {
    const runExecutions = compareRun.runs || [];
    
    // Find by matching input sequence (sessions are unique per run)
    const baseInputs = baseSessionExecutions.map(exec => exec.input);
    for (let i = 0; i <= runExecutions.length - baseInputs.length; i++) {
      const slice = runExecutions.slice(i, i + baseInputs.length);
      const inputsMatch = slice.every((exec, idx) => exec.input === baseInputs[idx]);
      if (inputsMatch) {
        const sortedExecs = slice.sort((a, b) => {
          const timeA = new Date(a.executionTs || a.creationTs || 0);
          const timeB = new Date(b.executionTs || b.creationTs || 0);
          return timeA - timeB;
        });
        // Get the session ID from the first execution in this sequence
        const compareSessionId = sortedExecs[0]?.sessionId || `exec_${sortedExecs[0]?.id}`;
        return { executions: sortedExecs, sessionId: compareSessionId };
      }
    }
    
    return { executions: [], sessionId: null };
  })() : { executions: [], sessionId: null };
  
  const compareSessionExecutions = compareSessionData.executions;
  const compareSessionId = compareSessionData.sessionId;
  
  // Calculate average score for an execution
  const calculateAvgScore = (execution) => {
    const metrics = [];
    Object.keys(execution).forEach(key => {
      const value = execution[key];
      if (value && typeof value === 'object' && 'value' in value) {
        const numValue = parseFloat(value.value);
        if (!isNaN(numValue)) {
          metrics.push(numValue);
        }
      }
    });
    return metrics.length > 0
      ? metrics.reduce((sum, val) => sum + val, 0) / metrics.length
      : 0;
  };
  
  // Render both user and assistant messages for a single execution
  const renderExecutionMessages = (execution, compareExecution, index) => {
    const avgScore = calculateAvgScore(execution);
    const compareScore = compareExecution ? calculateAvgScore(compareExecution) : null;
    const scoreDelta = compareScore !== null ? avgScore - compareScore : null;

    const showEvaluation = expandedEvaluations[execution.id];

    // Extract metrics for evaluation details
    const qualityMetrics = {};
    const performanceMetrics = {};

    Object.keys(execution).forEach(key => {
      const value = execution[key];
      if (value && typeof value === 'object' && 'value' in value) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('time') || lowerKey.includes('duration') ||
            lowerKey.includes('token') || lowerKey.includes('cost')) {
          performanceMetrics[key] = value;
        } else {
          qualityMetrics[key] = value;
        }
      }
    });

    const hasEvaluationDetails = Object.keys(qualityMetrics).length > 0 ||
                                 Object.keys(performanceMetrics).length > 0 ||
                                 execution.expectedOutput;

    return (
      <div key={execution.id} className="execution-messages-group">
        {/* User Message */}
        {execution.input && (
          <div className="chat-message user-message">
            <div className="message-header-tag">
              <span className="message-role-label">USER</span>
              <span className="message-timestamp">{formatTimestamp(execution.executionTs || execution.creationTs)}</span>
            </div>
            <div className="message-bubble">
              <div className="message-content">{execution.input}</div>
            </div>
          </div>
        )}

        {/* Assistant Message */}
        {execution.output && (
          <div className="chat-message assistant-message">
            <div className="message-header-tag">
              <span className="message-role-label">ASSISTANT</span>
              <span className="message-timestamp">{formatTimestamp(execution.executionTs || execution.creationTs)}</span>
              <div className="quality-badge-with-delta">
                <span className="quality-score-badge" style={{ backgroundColor: getScoreColor(avgScore) }}>
                  {avgScore.toFixed(2)}
                </span>
                {scoreDelta !== null && (
                  <span className={`score-delta-indicator ${scoreDelta >= 0 ? 'positive' : 'negative'}`}>
                    {scoreDelta >= 0 ? '+' : ''}{scoreDelta.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <div className="message-bubble">
              <div className={`message-bubble-content ${showEvaluation ? 'expanded' : ''}`}>
                <div className="message-text-section">
                  <div className="message-content">{execution.output}</div>
                  {execution.duration && execution.totalTokens && (
                    <div className="inline-metadata">
                      <span>{execution.duration}s</span>
                      <span>{execution.totalTokens} tokens</span>
                    </div>
                  )}
                  
                  {/* Evaluation Details Toggle */}
                  {hasEvaluationDetails && (
          <div className="evaluation-details-section">
            <button 
              className="evaluation-toggle"
              onClick={() => toggleEvaluation(execution.id)}
            >
              <span className="toggle-icon">{showEvaluation ? '▼' : '▶'}</span>
              Evaluation Details
            </button>
            
            {showEvaluation && (
              <div className="evaluation-content">
                {execution.expectedOutput && (
                  <div className="expected-output-block">
                    <div className="expected-header">Expected Output</div>
                    <div className="expected-text">{execution.expectedOutput}</div>
                  </div>
                )}
                
                <div className="metrics-grid">
                  {Object.keys(qualityMetrics).length > 0 && (
                    <div className="metrics-column">
                      <h4 className="metrics-column-title">QUALITY METRICS</h4>
                      <div className="quality-metrics-list">
                        {Object.entries(qualityMetrics).map(([name, metric]) => (
                          <div key={name} className="metric-item">
                            <div className="metric-header">
                              <span className="metric-name">{name}</span>
                              <span className="metric-value" style={{ color: getScoreColor(metric.value) }}>
                                {metric.value.toFixed(2)}
                              </span>
                            </div>
                            {metric.reason && (
                              <div className="metric-item-reason">{metric.reason}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
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
              </div>
            )}
          </div>
          )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const toggleRunSelector = () => {
    setShowRunSelector(!showRunSelector);
  };
  
  const selectCompareRun = (version) => {
    setSelectedCompareVersion(version);
    setShowRunSelector(false);
  };
  
  return (
    <div className="conversation-comparison-view">
      {/* Header */}
      <div className="comparison-header">
        <button className="btn btn-secondary" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <h1>Compare Conversations</h1>
        <div className="session-id-label">Comparing matching conversation sequences</div>
      </div>
      
      {/* Run Selector */}
      {!selectedCompareVersion && (
        <div className="run-selector-prompt">
          <p>Select a run to compare with <strong>{baseRunVersion}</strong></p>
          <button className="btn btn-primary select-run-button" onClick={toggleRunSelector}>
            Select Run to Compare
          </button>
        </div>
      )}
      
      {showRunSelector && (
        <div className="run-selector-modal">
          <div className="run-selector-content">
            <div className="run-selector-header">
              <h2>Select Run to Compare</h2>
              <button className="btn btn-ghost close-modal-button" onClick={() => setShowRunSelector(false)}>×</button>
            </div>
            <div className="run-list">
              {runsWithSession
                .filter(run => run.version !== baseRunVersion)
                .map(run => (
                  <div
                    key={run.id}
                    className="run-item"
                    onClick={() => selectCompareRun(run.version)}
                  >
                    <div className="run-version">{run.version}</div>
                    <div className="run-meta">
                      {run.model && <span className="run-model">{run.model}</span>}
                      {run.promptVersion && <span className="run-prompt">Prompt: {run.promptVersion}</span>}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Split-screen comparison */}
      {selectedCompareVersion ? (
        <div className="split-screen-container">
          {/* Base conversation */}
          <div className="conversation-panel base-panel">
            <div className="panel-header">
              <div>
                <h3>{baseRunVersion}</h3>
                <span className="panel-session-badge">{sessionId}</span>
              </div>
              <span className="message-count">{baseSessionExecutions.length} messages</span>
            </div>
            <div className="conversation-messages">
              {baseSessionExecutions.map((exec, index) =>
                renderExecutionMessages(exec, compareSessionExecutions[index], index)
              )}
            </div>
          </div>

          {/* Comparison conversation */}
          <div className="conversation-panel compare-panel">
            <div className="panel-header">
              <div>
                <h3>{selectedCompareVersion}</h3>
                <span className="panel-session-badge">{compareSessionId || 'N/A'}</span>
              </div>
              <span className="message-count">{compareSessionExecutions.length} messages</span>
              <button className="btn btn-primary change-run-button" onClick={toggleRunSelector}>
                Change
              </button>
            </div>
            <div className="conversation-messages">
              {compareSessionExecutions.map((exec, index) =>
                renderExecutionMessages(exec, baseSessionExecutions[index], index)
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="single-conversation-view">
          <div className="conversation-panel">
            <div className="panel-header">
              <h3>{baseRunVersion}</h3>
              <span className="message-count">{baseSessionExecutions.length} messages</span>
            </div>
            <div className="conversation-messages">
              {baseSessionExecutions.map((exec, index) =>
                renderExecutionMessages(exec, null, index)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationComparison;
