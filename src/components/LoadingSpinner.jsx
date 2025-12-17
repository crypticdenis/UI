import '../styles/LoadingSpinner.css';

/**
 * Reusable loading spinner component
 * @param {Object} props
 * @param {string} [props.size='medium'] - Size of spinner: 'small', 'medium', 'large'
 * @param {string} [props.text] - Optional loading text to display
 * @param {boolean} [props.fullScreen=false] - Whether to display fullscreen overlay
 * @param {string} [props.variant='spinner'] - Variant: 'spinner', 'dots', 'pulse'
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  text = '', 
  fullScreen = false,
  variant = 'spinner'
}) => {
  const containerClass = fullScreen 
    ? 'loading-spinner-fullscreen' 
    : 'loading-spinner-container';

  return (
    <div className={containerClass}>
      <div className="loading-spinner-content">
        {variant === 'spinner' && (
          <div className={`loading-spinner loading-spinner-${size}`}>
            <svg viewBox="0 0 50 50" className="spinner-svg">
              <circle 
                className="spinner-circle" 
                cx="25" 
                cy="25" 
                r="20" 
                fill="none" 
                strokeWidth="4"
              />
            </svg>
          </div>
        )}
        
        {variant === 'dots' && (
          <div className={`loading-dots loading-dots-${size}`}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
        
        {variant === 'pulse' && (
          <div className={`loading-pulse loading-pulse-${size}`}>
            <div className="pulse-ring"></div>
            <div className="pulse-ring"></div>
            <div className="pulse-ring"></div>
          </div>
        )}
        
        {text && <p className="loading-text">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
