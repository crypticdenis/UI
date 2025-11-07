import React, { useState } from 'react';
import CollapsibleCell from './CollapsibleCell';

const RunDetails = ({ runVersion, questions, onBack, onCompareQuestion, onExpandContent }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'baseID', direction: 'ascending' });
  const [filters, setFilters] = useState({
    baseID: '',
    input: '',
    outputScore: ''
  });

  // Extract unique values for dropdowns
  const uniqueBaseIDs = [...new Set(questions.map(q => q.baseID).filter(Boolean))].sort((a, b) => a - b);
  const uniqueScoreRanges = [
    { label: '0.9 - 1.0 (Excellent)', min: 0.9, max: 1.0 },
    { label: '0.8 - 0.9 (Good)', min: 0.8, max: 0.9 },
    { label: '0.7 - 0.8 (Fair)', min: 0.7, max: 0.8 },
    { label: '0.6 - 0.7 (Average)', min: 0.6, max: 0.7 },
    { label: '0.5 - 0.6 (Below Average)', min: 0.5, max: 0.6 },
    { label: '< 0.5 (Poor)', min: 0, max: 0.5 }
  ];

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    if (filters.baseID && q.baseID !== parseInt(filters.baseID)) return false;
    if (filters.input && !(q.GroundTruthData?.Input || '').toLowerCase().includes(filters.input.toLowerCase())) return false;
    if (filters.outputScore) {
      const scoreRange = uniqueScoreRanges.find(r => r.label === filters.outputScore);
      if (scoreRange) {
        const score = q.ExecutionData?.outputScore || 0;
        if (score < scoreRange.min || score >= scoreRange.max) return false;
      }
    }
    return true;
  });

  // Sort questions
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    let aValue, bValue;

    if (sortConfig.key.startsWith('ExecutionData.')) {
      const field = sortConfig.key.split('.')[1];
      aValue = a.ExecutionData?.[field];
      bValue = b.ExecutionData?.[field];
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
    }

    // Numeric sorting
    if (['baseID', 'outputScore', 'ragRelevancyScore', 'hallucinationRate', 'systemPromptAlignmentScore'].includes(sortConfig.key) ||
        sortConfig.key.includes('Score') || sortConfig.key.includes('Rate')) {
      const aNum = parseFloat(aValue) || 0;
      const bNum = parseFloat(bValue) || 0;
      return sortConfig.direction === 'ascending' ? aNum - bNum : bNum - aNum;
    }

    // String sorting
    const aStr = String(aValue || '').toLowerCase();
    const bStr = String(bValue || '').toLowerCase();
    if (aStr < bStr) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

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

  // Calculate aggregate scores for this run
  const avgScores = questions.reduce((acc, q) => {
    if (q.ExecutionData) {
      acc.outputScore += q.ExecutionData.outputScore || 0;
      acc.ragScore += q.ExecutionData.ragRelevancyScore || 0;
      acc.hallucinationRate += q.ExecutionData.hallucinationRate || 0;
      acc.systemPromptScore += q.ExecutionData.systemPromptAlignmentScore || 0;
      acc.count++;
    }
    return acc;
  }, { outputScore: 0, ragScore: 0, hallucinationRate: 0, systemPromptScore: 0, count: 0 });

  const avgOutputScore = avgScores.count > 0 ? (avgScores.outputScore / avgScores.count).toFixed(2) : '-';
  const avgRagScore = avgScores.count > 0 ? (avgScores.ragScore / avgScores.count).toFixed(2) : '-';
  const avgHallucinationRate = avgScores.count > 0 ? (avgScores.hallucinationRate / avgScores.count).toFixed(2) : '-';
  const avgSystemPromptScore = avgScores.count > 0 ? (avgScores.systemPromptScore / avgScores.count).toFixed(2) : '-';

  const firstQuestion = questions[0] || {};

  return (
    <div className="run-details">
      <div className="run-details-header">
        <button onClick={onBack} className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Runs
        </button>
        <div className="run-details-title">
          <h2>Run: {runVersion}</h2>
          <div className="run-meta-inline">
            <span style={{ color: '#60a5fa', fontWeight: '600' }}>
              {firstQuestion.model}
            </span>
            <span style={{ color: '#fe8f0f', fontWeight: '600' }}>
              {firstQuestion.promptVersion}
            </span>
            {firstQuestion.timestamp && (
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                ⏰ {new Date(firstQuestion.timestamp).toLocaleString('de-DE', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="run-summary-stats">
        <div className="stat-card">
          <span className="stat-label">Questions</span>
          <span className="stat-value-large">{questions.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg Output Score</span>
          <span className="stat-value-large" style={{ color: getScoreColorGranular(avgOutputScore) }}>
            {avgOutputScore}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg RAG Score</span>
          <span className="stat-value-large" style={{ color: getScoreColorGranular(avgRagScore) }}>
            {avgRagScore}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg Hallucination</span>
          <span className="stat-value-large" style={{ color: getScoreColorGranular(avgHallucinationRate) }}>
            {avgHallucinationRate}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg Prompt Score</span>
          <span className="stat-value-large" style={{ color: getScoreColorGranular(avgSystemPromptScore) }}>
            {avgSystemPromptScore}
          </span>
        </div>
      </div>

      <div className="details-controls">
        <div className="details-filters">
          <select
            value={filters.baseID}
            onChange={(e) => setFilters({ ...filters, baseID: e.target.value })}
            className="filter-select"
            title="Filter by question ID"
          >
            <option value="">All Question IDs</option>
            {uniqueBaseIDs.map(id => (
              <option key={id} value={id}>Question {id}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Filter by Input text... (Ctrl+K to focus)"
            value={filters.input}
            onChange={(e) => setFilters({ ...filters, input: e.target.value })}
            className="filter-input"
          />
          <select
            value={filters.outputScore}
            onChange={(e) => setFilters({ ...filters, outputScore: e.target.value })}
            className="filter-select"
            title="Filter by score range"
          >
            <option value="">All Score Ranges</option>
            {uniqueScoreRanges.map(range => (
              <option key={range.label} value={range.label}>{range.label}</option>
            ))}
          </select>
          {(filters.baseID || filters.input || filters.outputScore) && (
            <button 
              onClick={() => setFilters({ baseID: '', input: '', outputScore: '' })}
              className="clear-filters-btn"
              title="Clear all filters"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear
            </button>
          )}
        </div>

        <div className="details-sort">
          <label>Sort By:</label>
          <select 
            value={sortConfig.key} 
            onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })}
            className="sort-select"
          >
            <option value="baseID">Question ID</option>
            <option value="ExecutionData.outputScore">Output Score</option>
            <option value="ExecutionData.ragRelevancyScore">RAG Score</option>
            <option value="ExecutionData.hallucinationRate">Hallucination Rate</option>
            <option value="ExecutionData.systemPromptAlignmentScore">Prompt Score</option>
          </select>
          <select 
            value={sortConfig.direction} 
            onChange={(e) => setSortConfig({ ...sortConfig, direction: e.target.value })}
            className="sort-select"
          >
            <option value="ascending">↑ Ascending</option>
            <option value="descending">↓ Descending</option>
          </select>
        </div>
      </div>

      <div className="questions-table-container">
        <table className="questions-table">
          <thead>
            <tr>
              <th>Q ID</th>
              <th>Input</th>
              <th>Output</th>
              <th>Output Score</th>
              <th>RAG Score</th>
              <th>Hallucination</th>
              <th>Prompt Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedQuestions.map((question) => (
              <tr 
                key={question.ID}
                onClick={() => onCompareQuestion(question.baseID, runVersion)}
                style={{ cursor: 'pointer' }}
                title="Click to compare this question across runs"
              >
                <td className="question-id">{question.baseID}</td>
                <td className="question-cell">
                  <CollapsibleCell 
                    content={question.GroundTruthData?.Input || question['Test-Input']} 
                    title="Input / Question"
                    runId={question.ID}
                    gtId={question.GroundTruthData?.ID}
                    onExpand={onExpandContent}
                  />
                </td>
                <td className="question-cell">
                  <CollapsibleCell 
                    content={question.ExecutionData?.output || question['Actual-Output']} 
                    title="Actual Output"
                    runId={question.ID}
                    gtId={question.GroundTruthData?.ID}
                    onExpand={onExpandContent}
                  />
                </td>
                <td className="score-cell" style={{ 
                  backgroundColor: getScoreColorGranular(question.ExecutionData?.outputScore),
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  {question.ExecutionData?.outputScore?.toFixed(2) || '-'}
                </td>
                <td className="score-cell" style={{ 
                  backgroundColor: getScoreColorGranular(question.ExecutionData?.ragRelevancyScore),
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  {question.ExecutionData?.ragRelevancyScore?.toFixed(2) || '-'}
                </td>
                <td className="score-cell" style={{ 
                  backgroundColor: getScoreColorGranular(question.ExecutionData?.hallucinationRate),
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  {question.ExecutionData?.hallucinationRate?.toFixed(2) || '-'}
                </td>
                <td className="score-cell" style={{ 
                  backgroundColor: getScoreColorGranular(question.ExecutionData?.systemPromptAlignmentScore),
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  {question.ExecutionData?.systemPromptAlignmentScore?.toFixed(2) || '-'}
                </td>
                <td>
                  <button 
                    className="compare-question-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompareQuestion(question.baseID, runVersion);
                    }}
                    title="Compare this question across all runs"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                      <rect x="9" y="3" width="6" height="4" rx="1"/>
                      <path d="M9 12h6M9 16h6"/>
                    </svg>
                    <span className="compare-btn-text">Compare</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedQuestions.length === 0 && (
        <div className="no-results">
          <p>No questions found matching the filters.</p>
        </div>
      )}
    </div>
  );
};

export default RunDetails;
