import React from 'react';

const ColumnSettings = ({ visibleColumns, setVisibleColumns }) => {
  const handleToggle = (columnKey) => {
    setVisibleColumns({
      ...visibleColumns,
      [columnKey]: !visibleColumns[columnKey],
    });
  };

  const columns = [
    { key: 'compare', label: 'Compare Checkbox' },
    { key: 'ID', label: 'ID' },
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'active', label: 'Active' },
    { key: 'isRunning', label: 'Is Running' },
    { key: 'gtID', label: 'Ground Truth ID' },
    { key: 'input', label: 'Input' },
    { key: 'expectedOutput', label: 'Expected Output' },
    { key: 'output', label: 'Actual Output' },
    { key: 'outputScore', label: 'Output Score' },
    { key: 'outputScoreReason', label: 'Output Score Reason' },
    { key: 'ragRelevancyScore', label: 'RAG Relevancy Score' },
    { key: 'ragRelevancyScoreReason', label: 'RAG Relevancy Reason' },
    { key: 'hallucinationRate', label: 'Hallucination Rate' },
    { key: 'hallucinationRateReason', label: 'Hallucination Reason' },
    { key: 'systemPromptScore', label: 'System Prompt Score' },
    { key: 'systemPromptScoreReason', label: 'System Prompt Reason' },
  ];

  const toggleAll = (show) => {
    const newColumns = {};
    columns.forEach(col => {
      newColumns[col.key] = show;
    });
    setVisibleColumns(newColumns);
  };

  return (
    <div className="column-settings">
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <button onClick={() => toggleAll(true)} className="column-btn">Show All</button>
        <button onClick={() => toggleAll(false)} className="column-btn">Hide All</button>
      </div>
      <div className="column-settings-grid">
        {columns.map((col) => (
          <label key={col.key} className="column-setting-item">
            <input
              type="checkbox"
              checked={visibleColumns[col.key]}
              onChange={() => handleToggle(col.key)}
            />
            <span>{col.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColumnSettings;
