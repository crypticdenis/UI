import React, { useState } from 'react';
import { extractMetrics, getScoreColor, formatNumber } from '../utils/metricUtils';

const Comparison = ({ runs = [] }) => {
  const [modalContent, setModalContent] = useState(null);

  if (!runs || runs.length === 0) {
    return (
      <div className="comparison-container">
        <div className="comparison-card">
          <p>No runs selected for comparison.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comparison-container">
      {runs && runs.length > 0 ? runs.map((run) => (
        <div key={run.id} className="comparison-card">
          <h3>Execution {run.id}</h3>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(96, 165, 250, 0.2)',
            flexWrap: 'wrap'
          }}>
            {run.timestamp && (
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                <strong>Zeitstempel:</strong> {new Date(run.timestamp).toLocaleString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            )}
            {run.model && (
              <span style={{ fontSize: '13px', color: '#60a5fa', fontWeight: '600' }}>
                <strong>Model:</strong> {run.model}
              </span>
            )}
            {run.promptVersion && (
              <span style={{ fontSize: '13px', color: '#fe8f0f', fontWeight: '600' }}>
                <strong>Prompt:</strong> {run.promptVersion}
              </span>
            )}
          </div>
          
          <h4 style={{ marginTop: '16px', marginBottom: '8px', color: '#60a5fa' }}>Test Data</h4>
          <p>
            <strong>ID:</strong> {run.id || '-'}
          </p>
          <div style={{ marginBottom: '10px' }}>
            <strong>Input:</strong>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1 }}>
                {(run.input || '').substring(0, 200)}
                {(run.input || '').length > 200 && '...'}
              </div>
              {(run.input || '').length > 200 && (
                <button
                  className="comparison-expand-icon"
                  onClick={() => setModalContent({ title: `Run ${run.id} - Input`, content: run.input })}
                  title="View full content"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Expected Output:</strong>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1 }}>
                {(run.expectedOutput || '').substring(0, 200)}
                {(run.expectedOutput || '').length > 200 && '...'}
              </div>
              {(run.expectedOutput || '').length > 200 && (
                <button
                  className="comparison-expand-icon"
                  onClick={() => setModalContent({ title: `Run ${run.id} - Expected Output`, content: run.expectedOutput })}
                  title="View full content"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <h4 style={{ marginTop: '16px', marginBottom: '8px', color: '#60a5fa' }}>Execution Results</h4>
          <div style={{ marginBottom: '10px' }}>
            <strong>Output:</strong>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1 }}>
                {(run.output || '').substring(0, 200)}
                {(run.output || '').length > 200 && '...'}
              </div>
              {(run.output || '').length > 200 && (
                <button
                  className="comparison-expand-icon"
                  onClick={() => setModalContent({ title: `Run ${run.id} - Actual Output`, content: run.output })}
                  title="View full content"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {/* Dynamic Metrics Rendering */}
          {(() => {
            const { scores, reasons } = extractMetrics(run);
            
            return (
              <>
                {/* Render all score metrics with their reasons */}
                {scores.map(score => {
                  // Find corresponding reason field
                  const reasonField = reasons.find(r => 
                    r.key.toLowerCase().replace('reason', '').replace('_', '') === 
                    score.key.toLowerCase().replace('score', '').replace('_', '')
                  );
                  
                  return (
                    <div key={score.key}>
                      <p style={{ 
                        backgroundColor: getScoreColor(score.value),
                        color: '#ffffff',
                        fontWeight: '600',
                        borderRadius: '6px'
                      }}>
                        <strong>{score.label}:</strong> {formatNumber(score.value)}
                      </p>
                      {reasonField && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>{reasonField.label}:</strong>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1 }}>
                              {(reasonField.value || '').substring(0, 200)}
                              {(reasonField.value || '').length > 200 && '...'}
                            </div>
                            {(reasonField.value || '').length > 200 && (
                              <button
                                className="comparison-expand-icon"
                                onClick={() => setModalContent({ 
                                  title: `Run ${run.ID} - ${reasonField.label}`, 
                                  content: reasonField.value 
                                })}
                                title="View full content"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Render other text fields */}
                {textFields.map(field => (
                  <div key={field.key} style={{ marginBottom: '10px' }}>
                    <strong>{field.label}:</strong>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1 }}>
                        {(field.value || '').substring(0, 200)}
                        {(field.value || '').length > 200 && '...'}
                      </div>
                      {(field.value || '').length > 200 && (
                        <button
                          className="comparison-expand-icon"
                          onClick={() => setModalContent({ 
                            title: `Run ${run.ID} - ${field.label}`, 
                            content: field.value 
                          })}
                          title="View full content"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      )) : (
        <div className="comparison-card">
          <p>Please select runs to compare</p>
        </div>
      )}
      
      {modalContent && (
        <div className="comparison-modal-overlay" onClick={() => setModalContent(null)}>
          <div className="comparison-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="comparison-modal-header">
              <h3>{modalContent.title}</h3>
              <button className="comparison-modal-close" onClick={() => setModalContent(null)}>✕</button>
            </div>
            <div className="comparison-modal-body">
              {modalContent.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comparison;
