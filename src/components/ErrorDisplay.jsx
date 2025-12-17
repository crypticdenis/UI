import '../styles/ErrorDisplay.css';

/**
 * Reusable error display component
 * @param {Object} props
 * @param {string|Error} props.error - Error message or Error object
 * @param {Function} [props.onRetry] - Optional retry callback
 * @param {string} [props.title='Error'] - Error title
 * @param {string} [props.description] - Additional description or help text
 * @param {boolean} [props.fullScreen=false] - Whether to display fullscreen
 */
const ErrorDisplay = ({ 
  error, 
  onRetry, 
  title = 'Error',
  description,
  fullScreen = false
}) => {
  const errorMessage = error instanceof Error ? error.message : error;
  const containerClass = fullScreen 
    ? 'error-display-fullscreen' 
    : 'error-display-container';

  return (
    <div className={containerClass}>
      <div className="error-display-content">
        <div className="error-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        
        <h3 className="error-title">{title}</h3>
        
        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}
        
        {description && (
          <p className="error-description">{description}</p>
        )}
        
        {onRetry && (
          <button onClick={onRetry} className="error-retry-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
