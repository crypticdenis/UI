import '../styles/SkeletonLoader.css';

/**
 * Reusable skeleton loader component for table rows
 * @param {Object} props
 * @param {number} [props.rows=5] - Number of skeleton rows to display
 * @param {number} [props.columns=6] - Number of columns per row
 * @param {string} [props.variant='table'] - Variant: 'table', 'card', 'text'
 */
const SkeletonLoader = ({ rows = 5, columns = 6, variant = 'table' }) => {
  if (variant === 'table') {
    return (
      <div className="skeleton-table">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="skeleton-row">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="skeleton-cell">
                <div className="skeleton-box"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="skeleton-cards">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-card-header">
              <div className="skeleton-box" style={{ width: '60%', height: '24px' }}></div>
              <div className="skeleton-box" style={{ width: '80px', height: '32px' }}></div>
            </div>
            <div className="skeleton-card-body">
              <div className="skeleton-box" style={{ width: '100%', height: '16px' }}></div>
              <div className="skeleton-box" style={{ width: '80%', height: '16px' }}></div>
            </div>
            <div className="skeleton-card-footer">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-box" style={{ width: '60px', height: '28px' }}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className="skeleton-text-container">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="skeleton-text-line">
            <div className="skeleton-box" style={{ width: index % 3 === 0 ? '90%' : '100%' }}></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
