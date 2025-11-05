import React, { useState } from 'react';

const QuestionComparison = ({ baseID, currentRunVersion, allRuns, onClose }) => {
  // Get all runs that have this question (same baseID)
  const questionsWithSameID = allRuns.filter(run => run.baseID === baseID);
  
  // Group by version
  const runsByVersion = questionsWithSameID.reduce((acc, q) => {
    if (!acc[q.version]) {
      acc[q.version] = q;
    }
    return acc;
  }, {});

  const availableVersions = Object.keys(runsByVersion);
  
  // Initialize with current run selected
  const [selectedVersions, setSelectedVersions] = useState([currentRunVersion]);

  const toggleVersion = (version) => {
    if (selectedVersions.includes(version)) {
      setSelectedVersions(selectedVersions.filter(v => v !== version));
    } else {
      setSelectedVersions([...selectedVersions, version]);
    }
  };

  const selectedQuestions = selectedVersions
    .map(v => runsByVersion[v])
    .filter(Boolean)
    .sort((a, b) => {
      // Sort by timestamp
      if (a.timestamp && b.timestamp) {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      return 0;
    });

  // Calculate score deltas for comparison
  const calculateDelta = (currentScore, prevScore) => {
    if (!prevScore || isNaN(prevScore) || !currentScore || isNaN(currentScore)) return null;
    return ((currentScore - prevScore) / prevScore * 100).toFixed(1);
  };

  const renderScoreWithDelta = (score, prevScore, label) => {
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
              backgroundColor: getScoreColorGranular(score)
            }}
          >
            <span className="score-bar-value">{score?.toFixed(2) || '-'}</span>
          </div>
        </div>
      </div>
    );
  };

  const getScoreColorGranular = (score) => {
    if (score === null || score === undefined || isNaN(score)) return '#6b7280';
    const numScore = Number(score);
    const normalizedScore = numScore > 1 ? numScore / 10 : numScore;
    if (normalizedScore >= 0.9) return '#059669';
    if (normalizedScore >= 0.8) return '#10b981';
    if (normalizedScore >= 0.7) return '#34d399';
    if (normalizedScore >= 0.6) return '#fbbf24';
    if (normalizedScore >= 0.5) return '#f59e0b';
    if (normalizedScore >= 0.4) return '#f97316';
    if (normalizedScore >= 0.3) return '#ef4444';
    return '#dc2626';
  };

  const [expandedContent, setExpandedContent] = useState(null);

  const exportComparison = (format) => {
    if (format === 'json') {
      const exportData = selectedQuestions.map(q => ({
        version: q.version,
        baseID: q.baseID,
        model: q.model,
        promptVersion: q.promptVersion,
        timestamp: q.timestamp,
        input: q.GroundTruthData?.Input || q['Test-Input'],
        output: q.ExecutionData?.output || q['Actual-Output'],
        scores: {
          outputScore: q.ExecutionData?.outputScore,
          ragRelevancyScore: q.ExecutionData?.ragRelevancyScore,
          hallucinationRate: q.ExecutionData?.hallucinationRate,
          systemPromptAlignmentScore: q.ExecutionData?.systemPromptAlignmentScore
        }
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
      const headers = ['Version', 'Base ID', 'Model', 'Prompt Version', 'Timestamp', 'Output Score', 'RAG Score', 'Hallucination', 'Prompt Alignment'];
      const rows = selectedQuestions.map(q => [
        q.version,
        q.baseID,
        q.model,
        q.promptVersion,
        q.timestamp,
        q.ExecutionData?.outputScore?.toFixed(2) || '',
        q.ExecutionData?.ragRelevancyScore?.toFixed(3) || '',
        q.ExecutionData?.hallucinationRate?.toFixed(2) || '',
        q.ExecutionData?.systemPromptAlignmentScore?.toFixed(2) || ''
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
      <div className="comparison-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="comparison-modal-header">
          <h2>Compare Question {baseID} Across Runs</h2>
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

        <div className="comparison-modal-body">
          <div className="comparison-selector">
            <h3>Select Runs to Compare:</h3>
            <div className="version-checkboxes">
              {availableVersions.map(version => (
                <label key={version} className="version-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedVersions.includes(version)}
                    onChange={() => toggleVersion(version)}
                  />
                  <span className="version-name">{version}</span>
                  <span className="version-meta">
                    {runsByVersion[version].model} | {runsByVersion[version].promptVersion}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {selectedQuestions.length === 0 && (
            <div className="no-selection">
              <p>Please select at least one run to compare.</p>
            </div>
          )}

          {selectedQuestions.length > 0 && (
            <div className="comparison-container">
              {selectedQuestions.map((question) => (
                <div key={question.ID} className="comparison-card">
                  <h3>Run: {question.version}</h3>
                  <div style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    marginBottom: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid rgba(96, 165, 250, 0.2)',
                    flexWrap: 'wrap'
                  }}>
                    {question.timestamp && (
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                        <strong>⏰ Zeitstempel:</strong> {new Date(question.timestamp).toLocaleString('de-DE', {
                          year: 'numeric',
                          month: 'long',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    )}
                    {question.model && (
                      <span style={{ fontSize: '13px', color: '#60a5fa', fontWeight: '600' }}>
                        <strong>Model:</strong> {question.model}
                      </span>
                    )}
                    {question.promptVersion && (
                      <span style={{ fontSize: '13px', color: '#fe8f0f', fontWeight: '600' }}>
                        <strong>Prompt:</strong> {question.promptVersion}
                      </span>
                    )}
                  </div>
                  
                  <h4 style={{ marginTop: '16px', marginBottom: '8px', color: '#60a5fa' }}>Question Input</h4>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1, fontSize: '14px', color: '#cbd5e1' }}>
                        {(question.GroundTruthData?.Input || question['Test-Input'] || '').substring(0, 200)}
                        {(question.GroundTruthData?.Input || question['Test-Input'] || '').length > 200 && '...'}
                      </div>
                      {(question.GroundTruthData?.Input || question['Test-Input'] || '').length > 200 && (
                        <button
                          className="comparison-expand-icon"
                          onClick={() => setExpandedContent({ 
                            title: `${question.version} - Input`, 
                            content: question.GroundTruthData?.Input || question['Test-Input'] 
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

                  <h4 style={{ marginTop: '16px', marginBottom: '8px', color: '#fe8f0f' }}>Actual Output</h4>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1, fontSize: '14px', color: '#cbd5e1' }}>
                        {(question.ExecutionData?.output || question['Actual-Output'] || '').substring(0, 300)}
                        {(question.ExecutionData?.output || question['Actual-Output'] || '').length > 300 && '...'}
                      </div>
                      {(question.ExecutionData?.output || question['Actual-Output'] || '').length > 300 && (
                        <button
                          className="comparison-expand-icon"
                          onClick={() => setExpandedContent({ 
                            title: `${question.version} - Output`, 
                            content: question.ExecutionData?.output || question['Actual-Output'] 
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

                  <h4 style={{ marginTop: '16px', marginBottom: '12px', color: '#34d399' }}>Evaluation Scores</h4>
                  <div className="comparison-scores-enhanced">
                    {renderScoreWithDelta(
                      question.ExecutionData?.outputScore,
                      selectedQuestions[0]?.ExecutionData?.outputScore,
                      'Output Score'
                    )}
                    {renderScoreWithDelta(
                      question.ExecutionData?.ragRelevancyScore,
                      selectedQuestions[0]?.ExecutionData?.ragRelevancyScore,
                      'RAG Relevancy'
                    )}
                    {renderScoreWithDelta(
                      question.ExecutionData?.hallucinationRate,
                      selectedQuestions[0]?.ExecutionData?.hallucinationRate,
                      'Hallucination Rate'
                    )}
                    {renderScoreWithDelta(
                      question.ExecutionData?.systemPromptAlignmentScore,
                      selectedQuestions[0]?.ExecutionData?.systemPromptAlignmentScore,
                      'Prompt Alignment'
                    )}
                  </div>
                </div>
              ))}
            </div>
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
