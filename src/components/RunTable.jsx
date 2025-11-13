import React, { useMemo } from 'react';
import CollapsibleCell from './CollapsibleCell';

const RunTable = ({ runs, selectedRuns, setSelectedRuns, visibleColumns, onExpandContent }) => {
  const handleSelect = (id) => {
    setSelectedRuns?.((prevSelectedRuns) => {
      if (prevSelectedRuns.includes(id)) {
        return prevSelectedRuns.filter((runId) => runId !== id);
      } else {
        return [...prevSelectedRuns, id];
      }
    });
  };

  const getScoreColorGranular = (score) => {
    if (score === null || score === undefined || isNaN(score)) {
      return '#6b7280';
    }
    
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

  // Extract all columns dynamically from flat database structure
  const allColumns = useMemo(() => {
    if (!runs || runs.length === 0) return [];
    
    const cols = [];
    const seen = new Set();
    
    runs.forEach(run => {
      Object.keys(run).forEach(key => {
        if (seen.has(key)) return;
        
        const value = run[key];
        
        // Skip null/undefined
        if (value === null || value === undefined) return;
        
        // Skip system fields
        if (['runId', 'creationTs', 'executionTs'].includes(key)) return;
        
        seen.add(key);
        
        // Determine display name
        let display = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/_/g, ' ')
          .trim()
          .replace(/\b\w/g, l => l.toUpperCase());
        
        cols.push({ key, display });
      });
    });
    
    // Sort columns: id first, then input/output fields, then metrics, then others
    return cols.sort((a, b) => {
      const order = {
        'id': 0,
        'input': 1,
        'expectedOutput': 2,
        'output': 3,
      };
      
      const aOrder = order[a.key] ?? (a.key.toLowerCase().includes('score') || 
                                      a.key.toLowerCase().includes('accuracy') ||
                                      a.key.toLowerCase().includes('rate') ? 100 : 200);
      const bOrder = order[b.key] ?? (b.key.toLowerCase().includes('score') || 
                                      b.key.toLowerCase().includes('accuracy') ||
                                      b.key.toLowerCase().includes('rate') ? 100 : 200);
      
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.key.localeCompare(b.key);
    });
  }, [runs]);

  const getCellValue = (run, colKey) => {
    const value = run[colKey];
    // If it's a metric object with {value, reason}, extract the value
    if (value && typeof value === 'object' && 'value' in value) {
      return value.value;
    }
    return value;
  };

  const isNumeric = (value) => {
    return typeof value === 'number' && !isNaN(value);
  };

  const isLongText = (value) => {
    return typeof value === 'string' && value.length > 50;
  };

  const isMetricField = (key) => {
    const lower = key.toLowerCase();
    return lower.includes('score') || 
           lower.includes('rate') || 
           lower.includes('accuracy') ||
           lower.includes('precision') ||
           lower.includes('recall');
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toFixed(2);
    if (typeof value === 'string') return value;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="run-table-container">
      <table className="run-table">
        <thead>
          <tr>
            {visibleColumns?.compare && <th>Compare</th>}
            {allColumns.map(col => (
              <th key={col.key}>{col.display}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id}>
              {visibleColumns?.compare && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRuns?.includes(run.id)}
                    onChange={() => handleSelect(run.id)}
                  />
                </td>
              )}
              {allColumns.map(col => {
                const value = getCellValue(run, col.key);
                
                // Handle ID
                if (col.key === 'id') {
                  return (
                    <td key={col.key} style={{ fontWeight: '600', color: '#60a5fa' }}>
                      {value}
                    </td>
                  );
                }
                
                // Handle timestamps
                if (col.key.toLowerCase().includes('timestamp') || col.key.toLowerCase().includes('ts')) {
                  return (
                    <td key={col.key} style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {value ? new Date(value).toLocaleString('de-DE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                    </td>
                  );
                }
                
                // Handle numeric metrics with color coding
                if (isNumeric(value) && isMetricField(col.key)) {
                  const metricObj = run[col.key];
                  const reason = metricObj?.reason || '';
                  
                  return (
                    <td 
                      key={col.key} 
                      style={{ 
                        backgroundColor: getScoreColorGranular(value), 
                        color: '#ffffff',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}
                      title={reason}
                    >
                      {value.toFixed(2)}
                    </td>
                  );
                }
                
                // Handle long text with collapsible cell
                if (isLongText(value)) {
                  return (
                    <td key={col.key}>
                      <CollapsibleCell 
                        content={value} 
                        title={col.display}
                        runId={run.id}
                        gtId={run.id}
                        onExpand={onExpandContent}
                      />
                    </td>
                  );
                }
                
                // Default rendering
                return (
                  <td key={col.key}>{formatValue(value)}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RunTable;
