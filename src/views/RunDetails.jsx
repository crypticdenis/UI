import React, { useState, useMemo } from 'react';
import CollapsibleCell from '../components/CollapsibleCell';

const getScoreColor = (score) => {
  if (score >= 0.9) return '#10b981';
  if (score >= 0.8) return '#22c55e';
  if (score >= 0.7) return '#84cc16';
  if (score >= 0.6) return '#eab308';
  if (score >= 0.5) return '#f97316';
  return '#ef4444';
};

const RunDetails = ({ runVersion, questions, onBack, onCompareQuestion, onExpandContent }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [searchInput, setSearchInput] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());

  console.log('RunDetails received:', { runVersion, questionsCount: questions?.length, questions });
  
  const toggleRowExpansion = (questionId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Define field display order helper first
  const getFieldOrder = (key) => {
    const orderMap = {
      'id': 1,
      'sessionId': 5,
      'input': 10,
      'expectedOutput': 11,
      'output': 12,
      'duration': 100,
      'totalTokens': 101,
      'executionTs': 102,
    };
    
    // Metrics get 200+, everything else gets 300+
    if (orderMap[key] !== undefined) return orderMap[key];
    return key.toLowerCase().includes('score') || 
           key.toLowerCase().includes('rate') || 
           key.toLowerCase().includes('accuracy') ||
           key.toLowerCase().includes('metric') ? 200 : 300;
  };

  // Extract ALL fields dynamically from the data
  const allFields = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    
    const fieldMap = new Map();
    const skipFields = new Set(['runId', 'workflowId', 'parentExecutionId', 'creationTs']);
    
    questions.forEach(q => {
      Object.keys(q).forEach(key => {
        if (skipFields.has(key)) return; // Skip internal fields
        
        const val = q[key];
        if (!fieldMap.has(key)) {
          // Determine field type
          let type = 'text';
          let isMetric = false;
          
          if (val && typeof val === 'object' && 'value' in val) {
            // Metric object with {value, reason}
            type = typeof val.value === 'number' ? 'metric' : 'text';
            isMetric = true;
          } else if (typeof val === 'number') {
            type = 'number';
          } else if (typeof val === 'string' && val.length > 50) {
            type = 'longtext';
          }
          
          fieldMap.set(key, {
            key,
            label: key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase()),
            type,
            isMetric,
            order: getFieldOrder(key)
          });
        } else {
          // Update field type if we find a longer value
          const existingField = fieldMap.get(key);
          if (existingField.type === 'text' && typeof val === 'string' && val.length > 50) {
            existingField.type = 'longtext';
          }
        }
      });
    });
    
    // Sort fields by order
    return Array.from(fieldMap.values()).sort((a, b) => a.order - b.order);
  }, [questions]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    if (!questions) return [];
    
    return questions.filter(q => {
      if (!searchInput) return true;
      const search = searchInput.toLowerCase();
      return (
        (q.input || '').toLowerCase().includes(search) ||
        (q.output || '').toLowerCase().includes(search) ||
        (q.expectedOutput || '').toLowerCase().includes(search)
      );
    });
  }, [questions, searchInput]);

  // Sort questions
  const sortedQuestions = useMemo(() => {
    return [...filteredQuestions].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle metric objects - extract value
      if (aValue && typeof aValue === 'object' && 'value' in aValue) {
        aValue = aValue.value;
      }
      if (bValue && typeof bValue === 'object' && 'value' in bValue) {
        bValue = bValue.value;
      }

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [filteredQuestions, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const getCellValue = (question, field) => {
    const value = question[field.key];
    
    if (value == null || value === undefined) return '-';
    
    // Handle metric objects
    if (field.isMetric && typeof value === 'object' && 'value' in value) {
      return value.value;
    }
    
    return value;
  };

  const getCellReason = (question, field) => {
    if (!field.isMetric) return null;
    const value = question[field.key];
    if (value && typeof value === 'object' && 'reason' in value) {
      return value.reason;
    }
    return null;
  };

  return (
    <div className="run-details">
      <div className="details-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1>Run: {runVersion}</h1>
        <div className="details-stats">
          <span>{sortedQuestions.length} execution{sortedQuestions.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search input, output, or expected output..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="questions-table-container">
        <table className="questions-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              {allFields.map(field => (
                <th key={field.key} onClick={() => handleSort(field.key)} style={{ cursor: 'pointer' }}>
                  {field.label} {sortConfig.key === field.key && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedQuestions.length === 0 ? (
              <tr>
                <td colSpan={allFields.length + 1} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  No executions found
                </td>
              </tr>
            ) : (
              sortedQuestions.map((question) => {
                const isExpanded = expandedRows.has(question.id);
                return (
                  <React.Fragment key={question.id}>
                    <tr>
                      <td style={{ width: '40px', textAlign: 'center', padding: '8px' }}>
                        <button
                          onClick={() => toggleRowExpansion(question.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#3b82f6',
                            fontSize: '18px',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title={isExpanded ? "Collapse row" : "Expand row"}
                        >
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      </td>
                      {allFields.map(field => {
                        const cellValue = getCellValue(question, field);
                        const reason = getCellReason(question, field);
                    
                        // Handle different field types
                        if (field.type === 'longtext' && typeof cellValue === 'string') {
                          return (
                            <td key={field.key} className="question-cell" style={{ maxWidth: '300px' }}>
                              <div style={{ wordBreak: 'break-word' }}>
                                {isExpanded ? cellValue : (cellValue.length > 100 ? cellValue.substring(0, 100) + '...' : cellValue)}
                              </div>
                            </td>
                          );
                        }
                    
                        if (field.type === 'metric' && typeof cellValue === 'number') {
                          return (
                            <td 
                              key={field.key} 
                              className="metric-cell" 
                              style={{ 
                                backgroundColor: getScoreColor(cellValue),
                                color: '#ffffff',
                                padding: '8px',
                                textAlign: 'center',
                                fontWeight: '700',
                                fontSize: '16px'
                              }}
                              title={reason && !isExpanded ? reason : ''}
                            >
                              {cellValue.toFixed(2)}
                            </td>
                          );
                        }
                    
                    if (field.type === 'number' && typeof cellValue === 'number') {
                      return (
                        <td key={field.key} style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                          {cellValue.toFixed(2)}
                        </td>
                      );
                    }
                    
                        // Default text rendering
                        const textValue = String(cellValue);
                        const displayValue = isExpanded || textValue.length <= 100 ? textValue : textValue.substring(0, 100) + '...';
                        
                        return (
                          <td key={field.key} style={{ maxWidth: '300px' }}>
                            <div style={{ wordBreak: 'break-word' }}>
                              {displayValue}
                            </div>
                          </td>
                        );
                      })}
                      <td>
                        {onCompareQuestion && (
                          <button 
                            className="compare-question-btn"
                            onClick={() => onCompareQuestion(question.id, runVersion)}
                            title="Compare this execution across all runs"
                          >
                            Compare
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr style={{ backgroundColor: '#1e293b' }}>
                        <td colSpan={allFields.length + 2} style={{ padding: '16px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                            {allFields.map(field => {
                              const cellValue = getCellValue(question, field);
                              const reason = getCellReason(question, field);
                              
                              return (
                                <div key={field.key} style={{ borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
                                  <div style={{ fontWeight: '600', color: '#60a5fa', marginBottom: '8px', fontSize: '13px' }}>
                                    {field.label}
                                  </div>
                                  <div style={{ color: '#e2e8f0', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '14px', lineHeight: '1.6' }}>
                                    {field.type === 'metric' && typeof cellValue === 'number' ? (
                                      <div>
                                        <span style={{ 
                                          padding: '4px 12px',
                                          borderRadius: '4px',
                                          backgroundColor: getScoreColor(cellValue),
                                          color: 'white',
                                          fontWeight: '700',
                                          fontSize: '16px'
                                        }}>
                                          {cellValue.toFixed(2)}
                                        </span>
                                        {reason && (
                                          <div style={{ marginTop: '8px', fontStyle: 'italic', color: '#cbd5e1' }}>
                                            {reason}
                                          </div>
                                        )}
                                      </div>
                                    ) : String(cellValue)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RunDetails;
