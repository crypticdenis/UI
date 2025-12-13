import { useState, useMemo, useRef } from 'react';
import { getGradeInfo } from '../utils/metricUtils';

/**
 * Performance Trends Chart Component
 * Displays a line chart showing performance trends over time
 */
const PerformanceTrendsChart = ({ runs, scoreFields, onViewRunDetails }) => {
  const [selectedMetric, setSelectedMetric] = useState('combined');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // '7d', '14d', '30d', 'all'
  const svgRef = useRef(null);

  // Sort runs chronologically by start time
  const chronologicalRuns = useMemo(() => {
    const sorted = [...runs]
      .filter(run => run.startTs) // Only include runs with timestamps
      .sort((a, b) => new Date(a.startTs) - new Date(b.startTs));

    // Filter by time range
    if (timeRange === 'all') {
      return sorted;
    }

    const now = new Date();
    const daysMap = { '7d': 7, '14d': 14, '30d': 30 };
    const days = daysMap[timeRange];
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

    return sorted.filter(run => new Date(run.startTs) >= cutoffDate);
  }, [runs, timeRange]);

  // Get data for selected metric
  const chartData = useMemo(() => {
    if (!selectedMetric) return [];
    return chronologicalRuns.map(run => {
      let value;
      if (selectedMetric === 'combined') {
        // Calculate average across all metrics
        const scores = scoreFields
          .map(f => parseFloat(run[`avg_${f.key}`]))
          .filter(v => !isNaN(v));
        value = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      } else {
        value = parseFloat(run[`avg_${selectedMetric}`]) || 0;
      }
      
      return {
        version: run.version,
        id: run.id,
        runs: run.runs,
        value,
        timestamp: run.startTs,
        date: new Date(run.startTs).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: new Date(run.startTs).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
    });
  }, [chronologicalRuns, selectedMetric, scoreFields]);

  // Calculate chart dimensions and scaling
  const maxValue = Math.max(...chartData.map(d => d.value), 1);
  const minValue = Math.min(...chartData.map(d => d.value), 0);
  const valueRange = maxValue - minValue || 1;
  
  // Chart dimensions
  const chartWidth = 1000; // viewBox width
  const chartHeight = 300; // viewBox height (increased for better aspect ratio)
  const padding = { left: 50, right: 50, top: 20, bottom: 40 };
  
  // Calculate points for the line
  const points = chartData.map((d, i) => {
    const usableWidth = chartWidth - padding.left - padding.right;
    const x = chartData.length === 1 
      ? chartWidth / 2 
      : padding.left + (i / (chartData.length - 1)) * usableWidth;
    const y = chartHeight - padding.bottom - ((d.value - minValue) / valueRange) * (chartHeight - padding.top - padding.bottom);
    return { x, y, ...d };
  });

  // Create SVG path
  const linePath = points.length > 0
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';

  return (
    <div className="performance-trends-chart">
      <div className="chart-header">
        <div>
          <h3>Performance Trends Over Time</h3>
          <div className="time-range-chips">
            <button
              className={`time-chip ${timeRange === '7d' ? 'active' : ''}`}
              onClick={() => setTimeRange('7d')}
            >
              7D
            </button>
            <button
              className={`time-chip ${timeRange === '14d' ? 'active' : ''}`}
              onClick={() => setTimeRange('14d')}
            >
              14D
            </button>
            <button
              className={`time-chip ${timeRange === '30d' ? 'active' : ''}`}
              onClick={() => setTimeRange('30d')}
            >
              30D
            </button>
            <button
              className={`time-chip ${timeRange === 'all' ? 'active' : ''}`}
              onClick={() => setTimeRange('all')}
            >
              ALL
            </button>
          </div>
        </div>
        <div className="chart-controls">
          <label>Metric:</label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="metric-select"
          >
            <option value="combined">Combined Score</option>
            {scoreFields.map(field => (
              <option key={field.key} value={field.key}>
                {field.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="chart-empty-state">
          <p>No data available for the selected timeframe</p>
          <p className="empty-state-hint">Try selecting a different time range or "ALL" to view all available data</p>
        </div>
      ) : (
      <div className="chart-container">
        <svg ref={svgRef} width="100%" height="300px" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="trends-svg">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight - padding.bottom - (ratio * (chartHeight - padding.top - padding.bottom));
            const value = minValue + (ratio * valueRange);
            return (
              <g key={i}>
                <line
                  x1={0}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="rgba(96, 165, 250, 0.1)"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y={y - 4}
                  fill="rgba(148, 163, 184, 0.6)"
                  fontSize="10"
                  className="chart-label"
                >
                  {value.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Line path */}
          <path 
            d={linePath} 
            fill="none" 
            stroke="#ff900c" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#ff900c"
                stroke="#0f172a"
                strokeWidth="1"
                className="data-point cursor-pointer"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => onViewRunDetails(point.version, point.runs, point)}
              />
            </g>
          ))}

        </svg>

        {/* Tooltip */}
        {hoveredPoint && svgRef.current && (() => {
          const gradeInfo = getGradeInfo(hoveredPoint.value);
          const svgRect = svgRef.current.getBoundingClientRect();

          // Calculate position relative to the container
          const xPercent = (hoveredPoint.x / chartWidth) * 100;
          const yPixel = (hoveredPoint.y / chartHeight) * svgRect.height;

          return (
            <div
              className="chart-tooltip"
              style={{
                left: `${xPercent}%`,
                top: `${yPixel}px`,
                transform: 'translate(-50%, calc(-100% - 12px))'
              }}
            >
              <div className="tooltip-title">{hoveredPoint.version}</div>
              <div className="tooltip-value">{hoveredPoint.value.toFixed(3)}</div>
              <div
                className="tooltip-grade"
                style={{
                  backgroundColor: gradeInfo.bgColor,
                  color: gradeInfo.color
                }}
              >
                {hoveredPoint.value.toFixed(2)}
              </div>
              <div className="tooltip-date">{hoveredPoint.date} at {hoveredPoint.time}</div>
              <div className="tooltip-hint">Click to view details</div>
            </div>
          );
        })()}
      </div>
      )}
    </div>
  );
};

export default PerformanceTrendsChart;
