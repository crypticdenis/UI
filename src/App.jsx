import React, { useState, useEffect } from 'react';
import RunsOverview from './RunsOverview.jsx';
import RunDetails from './RunDetails.jsx';
import QuestionComparison from './QuestionComparison.jsx';
import ContentViewer from './ContentViewer.jsx';
import EvaluationTrigger from './EvaluationTrigger.jsx';
import runsData from './runs.json';
import './App.css';

function App() {
  const [runs, setRuns] = useState([]);
  const [currentView, setCurrentView] = useState('overview'); // 'overview', 'details', 'comparison'
  const [selectedRunVersion, setSelectedRunVersion] = useState(null);
  const [selectedRunQuestions, setSelectedRunQuestions] = useState([]);
  const [comparisonBaseID, setComparisonBaseID] = useState(null);
  const [comparisonRunVersion, setComparisonRunVersion] = useState(null);
  const [viewerContent, setViewerContent] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setRuns(runsData);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC key - go back or close modals
      if (e.key === 'Escape') {
        if (viewerContent) {
          setViewerContent(null);
        } else if (showHelp) {
          setShowHelp(false);
        } else if (currentView === 'comparison') {
          handleCloseComparison();
        } else if (currentView === 'details') {
          handleBackToOverview();
        }
      }
      
      // Ctrl/Cmd + K - focus search (if on overview)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (currentView === 'overview') {
          const searchInput = document.querySelector('.search-input');
          if (searchInput) searchInput.focus();
        }
      }
      
      // ? key - show help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setShowHelp(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, viewerContent, showHelp]);

  const handleEvaluationComplete = async (config) => {
    console.log('Loading evaluation results with config:', config);
    
    try {
      // Load dummy results from public folder
      const response = await fetch('/UI/dummy-evaluation-results.json');
      const newResults = await response.json();
      
      // Update the config in the results
      const updatedResults = newResults.map(result => ({
        ...result,
        model: config.model,
        promptVersion: config.promptVersion,
        timestamp: new Date().toISOString()
      }));
      
      // Merge with existing runs
      setRuns(prevRuns => [...prevRuns, ...updatedResults]);
      
      console.log('Successfully loaded', updatedResults.length, 'new evaluation results');
      alert(`✓ Evaluation complete! ${updatedResults.length} new results loaded.`);
    } catch (error) {
      console.error('Failed to load evaluation results:', error);
      alert('❌ Failed to load evaluation results. Check console for details.');
    }
  };

  const handleViewRunDetails = (version, questions) => {
    setSelectedRunVersion(version);
    setSelectedRunQuestions(questions);
    setCurrentView('details');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedRunVersion(null);
    setSelectedRunQuestions([]);
  };

  const handleCompareQuestion = (baseID, runVersion) => {
    setComparisonBaseID(baseID);
    setComparisonRunVersion(runVersion);
    setCurrentView('comparison');
  };

  const handleCloseComparison = () => {
    setCurrentView('details');
    setComparisonBaseID(null);
    setComparisonRunVersion(null);
  };

  const handleExpandContent = (content, title, runId, gtId) => {
    setViewerContent({ content, title, runId, gtId });
  };

  return (
    <div className="App dark">
      <header className="dashboard-header">
        <h1>Butler Evaluation Dashboard</h1>
        <div className="header-stats">
          <div className="keyboard-shortcuts-hint" title="Press ? for help">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h8"/>
            </svg>
            <span className="shortcut-key">?</span>
          </div>
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
          <EvaluationTrigger onEvaluationComplete={handleEvaluationComplete} />
        </div>
      </header>

      <div className="main-content">
        {currentView === 'overview' && (
          <RunsOverview 
            runs={runs} 
            onViewRunDetails={handleViewRunDetails}
          />
        )}

        {currentView === 'details' && (
          <RunDetails
            runVersion={selectedRunVersion}
            questions={selectedRunQuestions}
            onBack={handleBackToOverview}
            onCompareQuestion={handleCompareQuestion}
            onExpandContent={handleExpandContent}
          />
        )}

        {currentView === 'comparison' && (
          <QuestionComparison
            baseID={comparisonBaseID}
            currentRunVersion={comparisonRunVersion}
            allRuns={runs}
            onClose={handleCloseComparison}
          />
        )}
      </div>

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
                <p>
                  Das Butler Evaluation Dashboard ermöglicht es Ihnen, verschiedene Test-Runs von KI-Modellen zu vergleichen
                  und die Qualität der Antworten zu bewerten.
                </p>
              </section>

              <section>
                <h4>📊 Runs Übersicht</h4>
                <p>
                  Die Hauptansicht zeigt alle verfügbaren Test-Runs mit ihren wichtigsten Kennzahlen:
                </p>
                <ul>
                  <li><strong>Model & Prompt Version:</strong> Welches KI-Modell und welche Prompt-Version verwendet wurde</li>
                  <li><strong>Durchschnittswerte:</strong> Aggregierte Scores über alle Fragen eines Runs</li>
                  <li><strong>Anzahl Fragen:</strong> Wie viele Test-Fragen in diesem Run ausgewertet wurden</li>
                </ul>
              </section>

              <section>
                <h4>🔍 Run Details</h4>
                <p>
                  Klicken Sie auf "View Details" um alle Fragen eines Runs zu sehen:
                </p>
                <ul>
                  <li><strong>Fragen-Liste:</strong> Alle Testfragen mit individuellen Scores</li>
                  <li><strong>Vergleichen:</strong> Klicken Sie auf das Vergleichs-Icon um dieselbe Frage über mehrere Runs zu vergleichen</li>
                  <li><strong>Filter & Sortierung:</strong> Filtern Sie nach Frage-ID oder Score-Werten</li>
                </ul>
              </section>

              <section>
                <h4>⚖️ Fragen Vergleich</h4>
                <p>
                  Vergleichen Sie wie unterschiedliche Modelle oder Prompt-Versionen dieselbe Frage beantworten:
                </p>
                <ul>
                  <li><strong>Run-Auswahl:</strong> Wählen Sie welche Runs Sie vergleichen möchten</li>
                  <li><strong>Side-by-Side:</strong> Sehen Sie Eingabe, Ausgabe und Scores nebeneinander</li>
                  <li><strong>Unterschiede:</strong> Erkennen Sie welches Modell/Prompt bessere Ergebnisse liefert</li>
                </ul>
              </section>

              <section>
                <h4>🚀 Neue Evaluation starten</h4>
                <p>
                  Mit dem "Run Evaluation" Button können Sie neue Test-Runs starten:
                </p>
                <ul>
                  <li><strong>Model wählen:</strong> Wählen Sie das KI-Modell (GPT-4, Claude, etc.)</li>
                  <li><strong>Prompt Version:</strong> Wählen Sie die Prompt-Version</li>
                  <li><strong>Test-Set:</strong> Voll, Quick oder Sample Test</li>
                </ul>
              </section>

              <section>
                <h4>📈 Score-Interpretation</h4>
                <ul>
                  <li><strong>Grün (0.8-1.0):</strong> Sehr gute Qualität</li>
                  <li><strong>Gelb (0.6-0.8):</strong> Moderate Qualität</li>
                  <li><strong>Orange (0.4-0.6):</strong> Verbesserungsbedarf</li>
                  <li><strong>Rot (&lt;0.4):</strong> Schlechte Qualität</li>
                </ul>
              </section>

              <section>
                <h4>⌨️ Keyboard Shortcuts</h4>
                <div className="keyboard-shortcuts-list">
                  <div className="shortcut-item">
                    <kbd>ESC</kbd>
                    <span>Go back / Close modals</span>
                  </div>
                  <div className="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>K</kbd>
                    <span>Focus search</span>
                  </div>
                  <div className="shortcut-item">
                    <kbd>?</kbd>
                    <span>Show this help</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
