import React, { useState, useMemo } from 'react';
import { getUniqueScoreFields, getScoreColor, formatNumber } from './utils/metricUtils';

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
              backgroundColor: getScoreColor(score)
            }}
          >
            <span className="score-bar-value">{formatNumber(score)}</span>
          </div>
        </div>
      </div>
    );
  };

  // Get all unique score fields dynamically
  const scoreFields = useMemo(() => getUniqueScoreFields(allRuns), [allRuns]);

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
      const headers = ['Version', 'Base ID', 'Model', 'Prompt Version', 'Timestamp', ...scoreFields.map(f => f.label)];
      const rows = selectedQuestions.map(q => [
        q.version,
        q.baseID,
        q.model,
        q.promptVersion,
        q.timestamp,
        ...scoreFields.map(f => formatNumber(q.ExecutionData?.[f.key]))
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
            <div className="version-selection-grid">
              {availableVersions.map(version => {
                const run = runsByVersion[version];
                const isSelected = selectedVersions.includes(version);
                // Calculate average score dynamically from all numeric score fields
                const avgScore = run.ExecutionData ? (() => {
                  const scores = scoreFields
                    .map(f => run.ExecutionData[f.key])
                    .filter(v => v != null && !isNaN(v));
                  return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
                })() : 0;
                
                return (
                  <div
                    key={version}
                    className={`version-selection-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleVersion(version)}
                  >
                    <div className="version-card-header">
                      <div className="version-checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="version-card-title">
                        <h4>{version}</h4>
                        <div className="version-score-badge" style={{ backgroundColor: getScoreColor(avgScore) }}>
                          {formatNumber(avgScore)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="version-card-meta">
                      <div className="meta-row">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <span className="meta-label">Model:</span>
                        <span className="meta-value">{run.model}</span>
                      </div>
                      <div className="meta-row">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span className="meta-label">Prompt:</span>
                        <span className="meta-value">{run.promptVersion}</span>
                      </div>
                      {run.timestamp && (
                        <div className="meta-row">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <span className="meta-label">Date:</span>
                          <span className="meta-value">
                            {new Date(run.timestamp).toLocaleDateString('de-DE', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="version-card-scores">
                      {scoreFields.slice(0, 4).map(field => (
                        <div key={field.key} className="mini-score">
                          <span className="mini-score-label">{field.label.split(' ')[0]}</span>
                          <span className="mini-score-value" style={{ color: getScoreColor(run.ExecutionData?.[field.key]) }}>
                            {formatNumber(run.ExecutionData?.[field.key])}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
                    {scoreFields.map(field => 
                      renderScoreWithDelta(
                        question.ExecutionData?.[field.key],
                        selectedQuestions[0]?.ExecutionData?.[field.key],
                        field.label
                      )
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
