import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SubExecution from './SubExecution';
import { getScoreColor, categorizeMetrics, calculateAvgScore } from '../utils/metricUtils';

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

/**
 * ChatExchange Component
 * Displays a user-assistant conversation exchange with evaluation metrics
 */
const ChatExchange = ({ execution, highlighted, visibleMetrics, metricOrder = [] }) => {
  const [showEvaluationDetails, setShowEvaluationDetails] = useState(false);
  
  // Extract and categorize metrics using utility function
  const { qualityMetrics, performanceMetrics } = categorizeMetrics(execution);
  
  // Calculate overall score from ALL quality metrics (not filtered)
  const avgScore = calculateAvgScore(qualityMetrics);
  
  // Filter metrics based on visibility for display only
  const visibleQualityMetrics = Object.fromEntries(
    Object.entries(qualityMetrics).filter(([key]) => visibleMetrics.has(key))
  );
  
  const visiblePerformanceMetrics = Object.fromEntries(
    Object.entries(performanceMetrics).filter(([key]) => visibleMetrics.has(key))
  );
  
  // Order quality metrics according to metricOrder if provided
  const orderedQualityMetrics = metricOrder.length > 0
    ? metricOrder
        .filter(key => {
          const exists = visibleQualityMetrics[key] !== undefined;
          if (!exists) {
            console.log(`Metric key "${key}" from metricOrder not found in visibleQualityMetrics:`, Object.keys(visibleQualityMetrics));
          }
          return exists;
        })
        .map(key => [key, visibleQualityMetrics[key]])
    : Object.entries(visibleQualityMetrics);
  
  console.log('ChatExchange Debug:');
  console.log('- metricOrder:', metricOrder);
  console.log('- qualityMetrics keys:', Object.keys(qualityMetrics));
  console.log('- visibleQualityMetrics keys:', Object.keys(visibleQualityMetrics));
  console.log('- orderedQualityMetrics:', orderedQualityMetrics.map(([k]) => k));
  
  // Order performance metrics according to metricOrder if provided
  const orderedPerformanceMetrics = metricOrder.length > 0
    ? metricOrder
        .filter(key => visiblePerformanceMetrics[key] !== undefined)
        .map(key => [key, visiblePerformanceMetrics[key]])
    : Object.entries(visiblePerformanceMetrics);
  
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
                {avgScore.toFixed(2)}
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

                {/* Groundtruth Section - shown when evaluation is expanded */}
                {showEvaluationDetails && execution.groundtruth && (
                  <div className="expected-output-block groundtruth-block">
                    <div className="expected-header">
                      <span className="expected-icon">📋</span>
                      <span className="expected-label">Ground Truth</span>
                    </div>
                    <div className="expected-text">{execution.groundtruth}</div>
                  </div>
                )}

                {/* Toggle Button underneath message */}
                {(Object.keys(visibleQualityMetrics).length > 0 || Object.keys(visiblePerformanceMetrics).length > 0 || execution.expectedOutput || execution.groundtruth) && (
                  <button
                    className="evaluation-toggle-button"
                    onClick={() => setShowEvaluationDetails(!showEvaluationDetails)}
                  >
                    {showEvaluationDetails ? 'Hide Evaluation Details' : 'Show Evaluation Details'}
                  </button>
                )}
              </div>

              {/* Evaluation Details Section - Metrics on the right */}
              {(Object.keys(visibleQualityMetrics).length > 0 || Object.keys(visiblePerformanceMetrics).length > 0) && (
                <div className="evaluation-details-section">
                  {showEvaluationDetails && (
                    <div className="evaluation-content">
                  <div className="evaluation-grid">
                      {/* Quality Metrics Column */}
                      {Object.keys(visibleQualityMetrics).length > 0 && (
                        <div className="metrics-column">
                          <h4 className="metrics-column-title">QUALITY METRICS</h4>
                          <div className="quality-metrics-list">
                            {orderedQualityMetrics.map(([name, metric]) => (
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
                                  <div className="metric-item-reason">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {metric.reason}
                                    </ReactMarkdown>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Performance Metrics Column */}
                      {Object.keys(visiblePerformanceMetrics).length > 0 && (
                        <div className="metrics-column">
                          <h4 className="metrics-column-title">PERFORMANCE METRICS</h4>
                          <div className="performance-metrics-list">
                            {orderedPerformanceMetrics.map(([name, metric]) => {
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
                          {avgScore.toFixed(2)}
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

export default ChatExchange;
