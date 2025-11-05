import React from 'react';
import CollapsibleCell from './CollapsibleCell';

const RunTable = ({ runs, selectedRuns, setSelectedRuns, visibleColumns, onExpandContent }) => {
  const handleSelect = (id) => {
    setSelectedRuns((prevSelectedRuns) => {
      if (prevSelectedRuns.includes(id)) {
        return prevSelectedRuns.filter((runId) => runId !== id);
      } else {
        return [...prevSelectedRuns, id];
      }
    });
  };

  const getScoreColorGranular = (score) => {
    // Handle null, undefined, or non-numeric values
    if (score === null || score === undefined || isNaN(score)) {
      return '#6b7280'; // Gray for invalid values
    }
    
    // Convert to number and normalize to 0-1 range if needed
    const numScore = Number(score);
    const normalizedScore = numScore > 1 ? numScore / 10 : numScore;
    
    if (normalizedScore >= 0.9) return '#059669'; // emerald-600 - excellent
    if (normalizedScore >= 0.8) return '#10b981'; // emerald-500 - very good
    if (normalizedScore >= 0.7) return '#34d399'; // emerald-400 - good
    if (normalizedScore >= 0.6) return '#fbbf24'; // amber-400 - moderate
    if (normalizedScore >= 0.5) return '#f59e0b'; // amber-500 - fair
    if (normalizedScore >= 0.4) return '#f97316'; // orange-500 - poor
    if (normalizedScore >= 0.3) return '#ef4444'; // red-500 - bad
    return '#dc2626'; // red-600 - very bad
  };

  return (
    <div className="run-table-container">
      <table className="run-table">
        <thead>
          <tr>
            {visibleColumns.compare && <th>Compare</th>}
            {visibleColumns.ID && <th>ID</th>}
            {visibleColumns.active && <th>Active</th>}
            {visibleColumns.isRunning && <th>Is Running</th>}
            {visibleColumns.gtID && <th>GT ID</th>}
            {visibleColumns.input && <th>Input</th>}
            {visibleColumns.expectedOutput && <th>Expected Output</th>}
            {visibleColumns.output && <th>Actual Output</th>}
            {visibleColumns.outputScore && <th>Output Score</th>}
            {visibleColumns.outputScoreReason && <th>Output Score Reason</th>}
            {visibleColumns.ragRelevancyScore && <th>RAG Relevancy Score</th>}
            {visibleColumns.ragRelevancyScoreReason && <th>RAG Relevancy Reason</th>}
            {visibleColumns.hallucinationRate && <th>Hallucination Rate</th>}
            {visibleColumns.hallucinationRateReason && <th>Hallucination Reason</th>}
            {visibleColumns.systemPromptScore && <th>System Prompt Score</th>}
            {visibleColumns.systemPromptScoreReason && <th>System Prompt Reason</th>}
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.ID}>
              {visibleColumns.compare && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRuns.includes(run.ID)}
                    onChange={() => handleSelect(run.ID)}
                  />
                </td>
              )}
              {visibleColumns.ID && <td>{run.ID}</td>}
              {visibleColumns.active && <td>{run.active ? 'Yes' : 'No'}</td>}
              {visibleColumns.isRunning && <td>{run.IsRunning ? 'Yes' : 'No'}</td>}
              {visibleColumns.gtID && <td>{run.GroundTruthData?.ID || '-'}</td>}
              {visibleColumns.input && (
                <td>
                  <CollapsibleCell 
                    content={run.GroundTruthData?.Input || run['Test-Input']} 
                    title="Input / Question"
                    runId={run.ID}
                    gtId={run.GroundTruthData?.ID}
                    onExpand={onExpandContent}
                  />
                </td>
              )}
              {visibleColumns.expectedOutput && (
                <td>
                  <CollapsibleCell 
                    content={run.GroundTruthData?.expectedOutput || run['Expected-Output']} 
                    title="Expected Output"
                    runId={run.ID}
                    gtId={run.GroundTruthData?.ID}
                    onExpand={onExpandContent}
                  />
                </td>
              )}
              {visibleColumns.output && (
                <td>
                  <CollapsibleCell 
                    content={run.ExecutionData?.output || run['Actual-Output']} 
                    title="Actual Output"
                    runId={run.ID}
                    gtId={run.GroundTruthData?.ID}
                    onExpand={onExpandContent}
                  />
                </td>
              )}
              {visibleColumns.outputScore && (
                <td style={{ 
                  backgroundColor: getScoreColorGranular(run.ExecutionData?.outputScore || run.Score), 
                  color: '#ffffff',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {run.ExecutionData?.outputScore || run.Score}
                </td>
              )}
              {visibleColumns.outputScoreReason && (
                <td>
                  <CollapsibleCell 
                    content={run.ExecutionData?.outputScoreReason || run.ScoreReason} 
                    title="Output Score Reason"
                    runId={run.ID}
                    gtId={run.GroundTruthData?.ID}
                    onExpand={onExpandContent}
                  />
                </td>
              )}
              {visibleColumns.ragRelevancyScore && (
                <td style={{ 
                  backgroundColor: getScoreColorGranular(run.ExecutionData?.ragRelevancyScore || run['RAG Relevancy Score']), 
                  color: '#ffffff',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {run.ExecutionData?.ragRelevancyScore || run['RAG Relevancy Score']}
                </td>
              )}
              {visibleColumns.ragRelevancyScoreReason && (
                <td>
                  <CollapsibleCell 
                    content={run.ExecutionData?.ragRelevancyScoreReason || run['RAG Relevancy Reason']} 
                    title="RAG Relevancy Reason"
                    runId={run.ID}
                    gtId={run.GroundTruthData?.ID}
                    onExpand={onExpandContent}
                  />
                </td>
              )}
              {visibleColumns.hallucinationRate && (
                <td style={{ 
                  backgroundColor: getScoreColorGranular(run.ExecutionData?.hallucinationRate || 0), 
                  color: '#ffffff',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {run.ExecutionData?.hallucinationRate?.toFixed(2) || '-'}
                </td>
              )}
              {visibleColumns.hallucinationRateReason && (
                <td>
                  <CollapsibleCell 
                    content={run.ExecutionData?.hallucinationRateReason || '-'} 
                    title="Hallucination Rate Reason"
                    runId={run.ID}
                    gtId={run.GroundTruthData?.ID}
                    onExpand={onExpandContent}
                  />
                </td>
              )}
              {visibleColumns.systemPromptScore && (
                <td style={{ 
                  backgroundColor: getScoreColorGranular(run.ExecutionData?.systemPromptAlignmentScore || 0), 
                  color: '#ffffff',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {run.ExecutionData?.systemPromptAlignmentScore?.toFixed(2) || '-'}
                </td>
              )}
              {visibleColumns.systemPromptScoreReason && (
                <td>
                  <CollapsibleCell 
                    content={run.ExecutionData?.systemPromptAlignmentScoreReason || '-'} 
                    title="System Prompt Alignment Reason"
                    runId={run.ID}
                    gtId={run.GroundTruthData?.ID}
                    onExpand={onExpandContent}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RunTable;
