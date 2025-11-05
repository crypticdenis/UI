import React, { useState, useEffect } from 'react';
import FilterBar from './FilterBar.jsx';
import RunTable from './RunTable.jsx';
import ColumnSettings from './ColumnSettings.jsx';
import ContentViewer from './ContentViewer.jsx';
import Comparison from './Comparison.jsx';
import runsData from './runs.json';
import './App.css';

function App() {
  const [runs, setRuns] = useState([]);
  const [filters, setFilters] = useState({
    ID: '',
    active: false,
    IsRunning: false,
    'GroundTruthData.ID': '',
    'GroundTruthData.Input': '',
    'GroundTruthData.expectedOutput': '',
    'ExecutionData.output': '',
    'ExecutionData.outputScore': '',
    'ExecutionData.outputScoreReason': '',
    'ExecutionData.ragRelevancyScore': '',
    'ExecutionData.ragRelevancyScoreReason': '',
    'ExecutionData.hallucinationRate': '',
    'ExecutionData.hallucinationRateReason': '',
    'ExecutionData.systemPromptAlignmentScore': '',
    'ExecutionData.systemPromptAlignmentScoreReason': '',
  });
  const [selectedRuns, setSelectedRuns] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [viewerContent, setViewerContent] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState({
    compare: true,
    ID: true,
    active: true,
    isRunning: true,
    gtID: true,
    input: true,
    expectedOutput: true,
    output: true,
    outputScore: true,
    outputScoreReason: true,
    ragRelevancyScore: true,
    ragRelevancyScoreReason: true,
    hallucinationRate: true,
    hallucinationRateReason: true,
    systemPromptScore: true,
    systemPromptScoreReason: true,
  });
  const [sortConfig, setSortConfig] = useState({ key: 'ID', direction: 'ascending' });

  useEffect(() => {
    setRuns(runsData);
  }, []);

  const filteredRuns = runs.filter((run) => {
    return Object.keys(filters).every((key) => {
      if (filters[key] === '' || filters[key] === false) {
        return true;
      }
      if (key === 'active' || key === 'IsRunning') {
        return run[key] === filters[key];
      }
      
      // Handle nested GroundTruthData fields
      if (key.startsWith('GroundTruthData.')) {
        const field = key.split('.')[1];
        const value = run.GroundTruthData?.[field];
        return value && String(value).toLowerCase().includes(String(filters[key]).toLowerCase());
      }
      
      // Handle nested ExecutionData fields
      if (key.startsWith('ExecutionData.')) {
        const field = key.split('.')[1];
        const value = run.ExecutionData?.[field];
        return value && String(value).toLowerCase().includes(String(filters[key]).toLowerCase());
      }
      
      return String(run[key]).toLowerCase().includes(String(filters[key]).toLowerCase());
    });
  });

  const sortedRuns = [...filteredRuns].sort((a, b) => {
    let aValue, bValue;
    
    // Handle nested ExecutionData fields
    if (sortConfig.key.startsWith('ExecutionData.')) {
      const field = sortConfig.key.split('.')[1];
      aValue = a.ExecutionData?.[field];
      bValue = b.ExecutionData?.[field];
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
    }
    
    // Handle numeric sorting for score fields
    const numericFields = ['ID', 'Last Score', 'Score', 'RAG Relevancy Score', 'outputScore', 'ragRelevancyScore', 'hallucinationRate', 'systemPromptAlignmentScore'];
    const fieldName = sortConfig.key.includes('.') ? sortConfig.key.split('.')[1] : sortConfig.key;
    
    if (numericFields.includes(fieldName) || numericFields.includes(sortConfig.key)) {
      const aNum = parseFloat(aValue) || 0;
      const bNum = parseFloat(bValue) || 0;
      return sortConfig.direction === 'ascending' ? aNum - bNum : bNum - aNum;
    }
    
    // Handle string sorting
    const aStr = String(aValue || '').toLowerCase();
    const bStr = String(bValue || '').toLowerCase();
    
    if (aStr < bStr) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aStr > bStr) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleColumnSettings = () => {
    setShowColumnSettings(!showColumnSettings);
  };

  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  const selectedRunsData = runs.filter(run => selectedRuns.includes(run.ID));

  return (
    <div className="App dark">
      <header className="dashboard-header">
        <h1>Butler Evaluation Dashboard</h1>
        <div className="header-stats">
          <span className="stat-badge">Total Runs: {sortedRuns.length}</span>
          {selectedRuns.length > 0 && (
            <span className="stat-badge stat-badge-highlight">
              {selectedRuns.length} Selected
            </span>
          )}
        </div>
      </header>

      <div className="controls-section">
        <div className="controls-group">
          <label className="control-label">View Options</label>
          <div className="controls">
            <button onClick={toggleFilters} className="filter-toggle-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M7 12h10M11 18h2"/>
              </svg>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button onClick={toggleColumnSettings} className="filter-toggle-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              {showColumnSettings ? 'Hide Columns' : 'Column Settings'}
            </button>
            {selectedRuns.length > 0 && (
              <>
                <button onClick={toggleComparison} className="filter-toggle-btn comparison-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                    <rect x="9" y="3" width="6" height="4" rx="1"/>
                    <path d="M9 12h6M9 16h6"/>
                  </svg>
                  {showComparison ? 'Hide Comparison' : `Compare ${selectedRuns.length} Run${selectedRuns.length > 1 ? 's' : ''}`}
                </button>
                <button onClick={() => setSelectedRuns([])} className="filter-toggle-btn clear-selection-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                  Clear Selection
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="controls-group">
          <label className="control-label">Sort By</label>
          <div className="controls">
            <select onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })} value={sortConfig.key}>
              <option value="ID">ID</option>
              <option value="ExecutionData.outputScore">Output Score</option>
              <option value="ExecutionData.ragRelevancyScore">RAG Relevancy</option>
              <option value="ExecutionData.hallucinationRate">Hallucination Rate</option>
              <option value="ExecutionData.systemPromptAlignmentScore">System Prompt Score</option>
            </select>
            <select onChange={(e) => setSortConfig({ ...sortConfig, direction: e.target.value })} value={sortConfig.direction}>
              <option value="ascending">↑ Ascending</option>
              <option value="descending">↓ Descending</option>
            </select>
          </div>
        </div>
      </div>

      {showFilters && <FilterBar filters={filters} setFilters={setFilters} />}
      {showColumnSettings && <ColumnSettings visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />}
      {showComparison && selectedRuns.length > 0 && (
        <Comparison runs={selectedRunsData} />
      )}
      {viewerContent && (
        <ContentViewer 
          title={viewerContent.title} 
          content={viewerContent.content}
          runId={viewerContent.runId}
          gtId={viewerContent.gtId}
          onClose={() => setViewerContent(null)} 
        />
      )}
      <RunTable 
        runs={sortedRuns} 
        selectedRuns={selectedRuns} 
        setSelectedRuns={setSelectedRuns} 
        visibleColumns={visibleColumns}
        onExpandContent={setViewerContent}
      />
    </div>
  );
}

export default App;
