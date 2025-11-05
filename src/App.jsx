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
  const [showHelp, setShowHelp] = useState(false);
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
          <button 
            onClick={() => setShowHelp(true)} 
            className="help-button"
            title="Anleitung zur Nutzung des Dashboards"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Hilfe
          </button>
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
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal-content help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📘 Anleitung zur Nutzung</h3>
              <button className="modal-close" onClick={() => setShowHelp(false)}>✕</button>
            </div>
            <div className="modal-body help-content">
              <section>
                <h4>🎯 Überblick</h4>
                <p>Dieses Dashboard hilft Ihnen, KI-Modell-Testläufe zu evaluieren und zu vergleichen. Jede Zeile stellt einen Testfall mit Soll-Daten und Ausführungsergebnissen dar.</p>
              </section>

              <section>
                <h4>📊 Datenverständnis</h4>
                <ul>
                  <li><strong>Ground Truth Data:</strong> Die erwarteten Eingaben und Ausgaben für jeden Test</li>
                  <li><strong>Execution Data:</strong> Die tatsächlichen KI-Modell-Ausgaben und Leistungsmetriken</li>
                  <li><strong>Bewertungen:</strong> Farbcodierte Leistungsindikatoren:
                    <ul>
                      <li>🟢 Grün (0.9-1.0): Hervorragend</li>
                      <li>🟡 Gelb (0.6-0.8): Gut</li>
                      <li>🟠 Orange (0.4-0.6): Ausreichend</li>
                      <li>🔴 Rot (0.0-0.4): Mangelhaft</li>
                    </ul>
                  </li>
                </ul>
              </section>

              <section>
                <h4>🔍 Hauptfunktionen</h4>
                <ul>
                  <li><strong>Filter:</strong> Klicken Sie auf "Show Filters", um Testläufe nach beliebigen Feldern zu suchen und zu filtern</li>
                  <li><strong>Spalteneinstellungen:</strong> Wählen Sie aus, welche Spalten in der Tabelle sichtbar sein sollen</li>
                  <li><strong>Sortierung:</strong> Klicken Sie auf Spaltenüberschriften oder verwenden Sie das Sortier-Dropdown zur Datenorganisation</li>
                  <li><strong>Testläufe vergleichen:</strong> Wählen Sie mehrere Läufe aus (Checkbox) und klicken Sie auf "Compare" für eine Gegenüberstellung</li>
                  <li><strong>Inhalt erweitern:</strong> Klicken Sie auf das Erweitern-Symbol (⤢), um den vollständigen Text eines Feldes anzuzeigen</li>
                </ul>
              </section>

              <section>
                <h4>📈 Bewertungsmetriken</h4>
                <ul>
                  <li><strong>Output Score:</strong> Gesamtqualität der KI-Antwort (0-1)</li>
                  <li><strong>RAG Relevancy Score:</strong> Wie relevant der abgerufene Kontext war (0-1)</li>
                  <li><strong>Hallucination Rate:</strong> Anteil an fehlerhaften/unbelegten Informationen (0-1)</li>
                  <li><strong>System Prompt Alignment:</strong> Wie gut die Ausgabe den Anweisungen folgt (0-1)</li>
                </ul>
              </section>

              <section>
                <h4>💡 Tipps</h4>
                <ul>
                  <li>Beginnen Sie mit der Filterung, um bestimmte Testfälle zu finden</li>
                  <li>Verwenden Sie den Vergleichsmodus, um Unterschiede zwischen Läufen zu analysieren</li>
                  <li>Klicken Sie auf Bewertungsgründe, um Evaluierungsdetails zu verstehen</li>
                  <li>Exportieren Sie Daten oder erstellen Sie Screenshots für Berichte</li>
                </ul>
              </section>

              <section>
                <h4>🔄 Mehrere Versionen desselben Tests vergleichen</h4>
                <p>Um verschiedene Läufe desselben Tests zu vergleichen:</p>
                <ul>
                  <li>Strukturieren Sie IDs mit Versionen: <code>1-v1.0</code>, <code>1-v2.0</code>, <code>1-v3.0</code></li>
                  <li>Oder mit Datum: <code>1-2025-11-01</code>, <code>1-2025-11-05</code></li>
                  <li>Filtern Sie nach der Basis-ID (z.B. "1-") um alle Versionen zu finden</li>
                  <li>Wählen Sie die Versionen aus und klicken Sie auf "Compare"</li>
                </ul>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                  Siehe <code>COMPARING_RUNS.md</code> für detaillierte Anleitung
                </p>
              </section>
            </div>
          </div>
        </div>
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
