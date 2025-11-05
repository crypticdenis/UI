import React, { useState } from 'react';

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

  const getScoreColorGranular = (score) => {
    // Handle null, undefined, or non-numeric values
    if (score === null || score === undefined || isNaN(score)) {
      return '#6b7280'; // Gray for invalid values
    }
    
    // Convert to number and normalize to 0-1 range if needed
    const numScore = Number(score);
    const normalizedScore = numScore > 1 ? numScore / 10 : numScore;
    
    if (normalizedScore >= 0.9) return '#059669'; // Dark green
    if (normalizedScore >= 0.8) return '#10b981'; // Green
    if (normalizedScore >= 0.7) return '#34d399'; // Light green
    if (normalizedScore >= 0.6) return '#fbbf24'; // Yellow
    if (normalizedScore >= 0.5) return '#f59e0b'; // Orange
    if (normalizedScore >= 0.4) return '#f97316'; // Dark orange
    if (normalizedScore >= 0.3) return '#ef4444'; // Red
    return '#dc2626'; // Dark red
  };

  return (
    <div className="comparison-container">
      {runs && runs.length > 0 ? runs.map((run) => (
        <div key={run.ID} className="comparison-card">
          <h3>Run {run.ID}</h3>
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
          
          <h4 style={{ marginTop: '16px', marginBottom: '8px', color: '#60a5fa' }}>Ground Truth Data</h4>
          <p>
            <strong>GT ID:</strong> {run.GroundTruthData?.ID || '-'}
          </p>
          <div style={{ marginBottom: '10px' }}>
            <strong>Input:</strong>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1 }}>
                {(run.GroundTruthData?.Input || run['Test-Input'] || '').substring(0, 200)}
                {(run.GroundTruthData?.Input || run['Test-Input'] || '').length > 200 && '...'}
              </div>
              {(run.GroundTruthData?.Input || run['Test-Input'] || '').length > 200 && (
                <button
                  className="comparison-expand-icon"
                  onClick={() => setModalContent({ title: `Run ${run.ID} - Input`, content: run.GroundTruthData?.Input || run['Test-Input'] })}
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
                {(run.GroundTruthData?.expectedOutput || run['Expected-Output'] || '').substring(0, 200)}
                {(run.GroundTruthData?.expectedOutput || run['Expected-Output'] || '').length > 200 && '...'}
              </div>
              {(run.GroundTruthData?.expectedOutput || run['Expected-Output'] || '').length > 200 && (
                <button
                  className="comparison-expand-icon"
                  onClick={() => setModalContent({ title: `Run ${run.ID} - Expected Output`, content: run.GroundTruthData?.expectedOutput || run['Expected-Output'] })}
                  title="View full content"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <h4 style={{ marginTop: '16px', marginBottom: '8px', color: '#60a5fa' }}>Execution Data</h4>
          <p>
            <strong>Active:</strong> {run.active ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Is Running:</strong> {run.IsRunning ? 'Yes' : 'No'}
          </p>
          <div style={{ marginBottom: '10px' }}>
            <strong>Output:</strong>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1 }}>
                {(run.ExecutionData?.output || run['Actual-Output'] || '').substring(0, 200)}
                {(run.ExecutionData?.output || run['Actual-Output'] || '').length > 200 && '...'}
              </div>
              {(run.ExecutionData?.output || run['Actual-Output'] || '').length > 200 && (
                <button
                  className="comparison-expand-icon"
                  onClick={() => setModalContent({ title: `Run ${run.ID} - Actual Output`, content: run.ExecutionData?.output || run['Actual-Output'] })}
                  title="View full content"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p style={{ 
            backgroundColor: getScoreColorGranular(run.ExecutionData?.outputScore || run.Score),
            color: '#ffffff',
            fontWeight: '600',
            borderRadius: '6px'
          }}>
            <strong>Output Score:</strong> {run.ExecutionData?.outputScore || run.Score}
          </p>
          <div style={{ marginBottom: '10px' }}>
            <strong>Output Score Reason:</strong>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1 }}>
                {(run.ExecutionData?.outputScoreReason || run.ScoreReason || '').substring(0, 200)}
                {(run.ExecutionData?.outputScoreReason || run.ScoreReason || '').length > 200 && '...'}
              </div>
              {(run.ExecutionData?.outputScoreReason || run.ScoreReason || '').length > 200 && (
                <button
                  className="comparison-expand-icon"
                  onClick={() => setModalContent({ title: `Run ${run.ID} - Output Score Reason`, content: run.ExecutionData?.outputScoreReason || run.ScoreReason })}
                  title="View full content"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p style={{ 
            backgroundColor: getScoreColorGranular(run.ExecutionData?.ragRelevancyScore || run['RAG Relevancy Score']),
            color: '#ffffff',
            fontWeight: '600',
            borderRadius: '6px'
          }}>
            <strong>RAG Relevancy Score:</strong> {run.ExecutionData?.ragRelevancyScore || run['RAG Relevancy Score']}
          </p>
          <div style={{ marginBottom: '10px' }}>
            <strong>RAG Relevancy Reason:</strong>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1 }}>
                {(run.ExecutionData?.ragRelevancyScoreReason || run['RAG Relevancy Reason'] || '').substring(0, 200)}
                {(run.ExecutionData?.ragRelevancyScoreReason || run['RAG Relevancy Reason'] || '').length > 200 && '...'}
              </div>
              {(run.ExecutionData?.ragRelevancyScoreReason || run['RAG Relevancy Reason'] || '').length > 200 && (
                <button
                  className="comparison-expand-icon"
                  onClick={() => setModalContent({ title: `Run ${run.ID} - RAG Relevancy Reason`, content: run.ExecutionData?.ragRelevancyScoreReason || run['RAG Relevancy Reason'] })}
                  title="View full content"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p style={{ 
            backgroundColor: getScoreColorGranular(run.ExecutionData?.hallucinationRate || 0),
            color: '#ffffff',
            fontWeight: '600',
            borderRadius: '6px'
          }}>
            <strong>Hallucination Rate:</strong> {run.ExecutionData?.hallucinationRate?.toFixed(2) || '-'}
          </p>
          <div style={{ marginBottom: '10px' }}>
            <strong>Hallucination Reason:</strong>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1 }}>
                {(run.ExecutionData?.hallucinationRateReason || '-').substring(0, 200)}
                {(run.ExecutionData?.hallucinationRateReason || '-').length > 200 && '...'}
              </div>
              {(run.ExecutionData?.hallucinationRateReason || '-').length > 200 && (
                <button
                  className="comparison-expand-icon"
                  onClick={() => setModalContent({ title: `Run ${run.ID} - Hallucination Rate Reason`, content: run.ExecutionData?.hallucinationRateReason })}
                  title="View full content"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p style={{ 
            backgroundColor: getScoreColorGranular(run.ExecutionData?.systemPromptAlignmentScore || 0),
            color: '#ffffff',
            fontWeight: '600',
            borderRadius: '6px'
          }}>
            <strong>System Prompt Alignment:</strong> {run.ExecutionData?.systemPromptAlignmentScore?.toFixed(2) || '-'}
          </p>
          <div style={{ marginBottom: '10px' }}>
            <strong>System Prompt Reason:</strong>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1 }}>
                {(run.ExecutionData?.systemPromptAlignmentScoreReason || '-').substring(0, 200)}
                {(run.ExecutionData?.systemPromptAlignmentScoreReason || '-').length > 200 && '...'}
              </div>
              {(run.ExecutionData?.systemPromptAlignmentScoreReason || '-').length > 200 && (
                <button
                  className="comparison-expand-icon"
                  onClick={() => setModalContent({ title: `Run ${run.ID} - System Prompt Alignment Reason`, content: run.ExecutionData?.systemPromptAlignmentScoreReason })}
                  title="View full content"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
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
