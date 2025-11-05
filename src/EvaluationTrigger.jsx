import React, { useState } from 'react';

const EvaluationTrigger = ({ onEvaluationComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState({
    model: 'gpt-4',
    promptVersion: 'v2.0',
    testSet: 'full'
  });

  const models = [
    'gpt-4',
    'gpt-4-turbo',
    'gpt-4o',
    'claude-3-opus',
    'claude-3-sonnet',
    'claude-3-haiku'
  ];

  const promptVersions = ['v1.0', 'v1.1', 'v2.0', 'v2.1', 'v3.0'];
  const testSets = [
    { value: 'full', label: 'Full Test Set (All Questions)' },
    { value: 'quick', label: 'Quick Test (5 Questions)' },
    { value: 'sample', label: 'Sample Test (3 Questions)' }
  ];

  const handleRunEvaluation = async () => {
    setIsRunning(true);
    
    // Mock webhook call
    console.log('Triggering evaluation with config:', config);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const mockResponse = {
        status: 'success',
        evaluationId: `eval-${Date.now()}`,
        config: config,
        message: 'Evaluation started successfully'
      };
      
      console.log('Evaluation triggered:', mockResponse);
      
      // Simulate loading results after a delay
      setTimeout(() => {
        // Call the callback to load dummy results
        if (onEvaluationComplete) {
          onEvaluationComplete(config);
        }
        setIsRunning(false);
        setIsOpen(false);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to trigger evaluation:', error);
      setIsRunning(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="run-evaluation-button"
        title="Start a new evaluation run"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        Run Evaluation
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => !isRunning && setIsOpen(false)}>
          <div className="modal-content evaluation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🚀 Run New Evaluation</h2>
              {!isRunning && (
                <button className="modal-close" onClick={() => setIsOpen(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            <div className="modal-body">
              {isRunning ? (
                <div className="evaluation-running">
                  <div className="spinner"></div>
                  <h3>Evaluation Running...</h3>
                  <p>This may take a few moments. Please wait.</p>
                  <div className="evaluation-status">
                    <p>✓ Webhook triggered</p>
                    <p>⏳ Processing evaluation...</p>
                    <p>⏳ Loading results...</p>
                  </div>
                </div>
              ) : (
                <div className="evaluation-config">
                  <div className="config-section">
                    <label>
                      <strong>Model</strong>
                      <select 
                        value={config.model} 
                        onChange={(e) => setConfig({...config, model: e.target.value})}
                        className="config-select"
                      >
                        {models.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="config-section">
                    <label>
                      <strong>Prompt Version</strong>
                      <select 
                        value={config.promptVersion} 
                        onChange={(e) => setConfig({...config, promptVersion: e.target.value})}
                        className="config-select"
                      >
                        {promptVersions.map(version => (
                          <option key={version} value={version}>{version}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="config-section">
                    <label>
                      <strong>Test Set</strong>
                      <select 
                        value={config.testSet} 
                        onChange={(e) => setConfig({...config, testSet: e.target.value})}
                        className="config-select"
                      >
                        {testSets.map(set => (
                          <option key={set.value} value={set.value}>{set.label}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="config-summary">
                    <h4>Configuration Summary:</h4>
                    <ul>
                      <li><strong>Model:</strong> {config.model}</li>
                      <li><strong>Prompt Version:</strong> {config.promptVersion}</li>
                      <li><strong>Test Set:</strong> {testSets.find(s => s.value === config.testSet)?.label}</li>
                    </ul>
                  </div>

                  <div className="modal-actions">
                    <button onClick={() => setIsOpen(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button onClick={handleRunEvaluation} className="btn-primary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      Start Evaluation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EvaluationTrigger;
