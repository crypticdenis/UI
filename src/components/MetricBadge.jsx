import { getScoreColor } from '../utils/metricUtils';

/**
 * MetricBadge Component
 * Displays a compact metric with name and colored value
 */
const MetricBadge = ({ name, value, reason }) => {
  const color = getScoreColor(value);
  return (
    <div 
      className="metric-badge" 
      style={{ borderColor: color }}
      title={reason || `${name}: ${value.toFixed(2)}`}
    >
      <span className="metric-name">{name}</span>
      <span className="metric-value" style={{ color }}>{value.toFixed(2)}</span>
    </div>
  );
};

export default MetricBadge;
