import React, { useMemo } from 'react';

const ColumnSettings = ({ visibleColumns, setVisibleColumns, runs }) => {
  const handleToggle = (columnKey) => {
    setVisibleColumns({
      ...visibleColumns,
      [columnKey]: !visibleColumns[columnKey],
    });
  };

  // Dynamically extract all available columns from runs data
  const columns = useMemo(() => {
    if (!runs || runs.length === 0) return [];
    
    const columnsSet = new Map(); // Use Map to preserve order and avoid duplicates
    
    // Always include these standard columns first
    columnsSet.set('compare', 'Compare Checkbox');
    columnsSet.set('ID', 'ID');
    columnsSet.set('timestamp', 'Timestamp');
    columnsSet.set('model', 'Model');
    columnsSet.set('promptVersion', 'Prompt Version');
    
    runs.forEach(run => {
      // Add top-level fields
      Object.keys(run).forEach(key => {
        if (!['ID', 'baseID', 'version', 'GroundTruthData', 'ExecutionData', 'questions', 'runs', 'timestamp', 'model', 'promptVersion'].includes(key)) {
          columnsSet.set(key, formatLabel(key));
        }
      });
      
      // Add GroundTruthData fields
      if (run.GroundTruthData) {
        Object.keys(run.GroundTruthData).forEach(key => {
          if (key !== 'ID') {
            columnsSet.set(`gt_${key}`, `GT: ${formatLabel(key)}`);
          }
        });
      }
      
      // Add ExecutionData fields
      if (run.ExecutionData) {
        Object.keys(run.ExecutionData).forEach(key => {
          if (key !== 'ID') {
            columnsSet.set(`exec_${key}`, formatLabel(key));
          }
        });
      }
    });
    
    return Array.from(columnsSet.entries()).map(([key, label]) => ({ key, label }));
  }, [runs]);

  // Helper to format field name for display
  const formatLabel = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

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
              checked={visibleColumns[col.key] !== false}
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
