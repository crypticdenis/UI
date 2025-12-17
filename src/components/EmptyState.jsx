import '../styles/EmptyState.css';

/**
 * Reusable empty state component
 * @param {Object} props
 * @param {string} props.icon - Icon type: 'search', 'filter', 'workflow', 'run', 'data'
 * @param {string} props.title - Main heading
 * @param {string} props.description - Description text
 * @param {Object} [props.action] - Action button config {label, onClick, variant}
 * @param {React.ReactNode} [props.children] - Custom content
 */
const EmptyState = ({ 
  icon = 'data',
  title,
  description,
  action,
  children
}) => {
  const icons = {
    search: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    filter: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </svg>
    ),
    workflow: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    run: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    ),
    data: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    inbox: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
      </svg>
    )
  };

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icons[icon] || icons.data}
      </div>
      
      <h3 className="empty-state-title">{title}</h3>
      
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      
      {action && (
        <button 
          onClick={action.onClick}
          className={`btn ${action.variant || 'btn-primary'}`}
        >
          {action.icon && action.icon}
          {action.label}
        </button>
      )}
      
      {children}
    </div>
  );
};

export default EmptyState;
