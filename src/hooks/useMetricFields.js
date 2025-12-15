import { useMemo } from 'react';

/**
 * Extract metric fields from executions and provide visibility management
 * @param {Array} executions - Array of execution objects
 * @param {Set} visibleMetrics - Set of currently visible metric keys
 * @param {Function} setVisibleMetrics - Function to update visible metrics
 * @returns {Object} - { allMetricFields, toggleMetricVisibility, toggleAllMetrics }
 */
export const useMetricFields = (executions, visibleMetrics, setVisibleMetrics) => {
  // Extract all available metrics from executions
  const allMetricFields = useMemo(() => {
    if (!executions || executions.length === 0) return [];
    
    const fieldMap = new Map();
    
    executions.forEach(exec => {
      Object.keys(exec).forEach(key => {
        const val = exec[key];
        // Check if it's a metric object with value/reason structure
        if (val && typeof val === 'object' && 'value' in val) {
          if (!fieldMap.has(key)) {
            fieldMap.set(key, {
              key,
              label: key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()
                .replace(/\b\w/g, l => l.toUpperCase()),
              isMetric: true
            });
          }
        }
      });
    });
    
    const fields = Array.from(fieldMap.values());
    
    // Initialize visible metrics on first render if empty
    if (visibleMetrics.size === 0 && fields.length > 0) {
      const defaultVisible = new Set(fields.map(f => f.key));
      setVisibleMetrics(defaultVisible);
    }
    
    return fields;
  }, [executions, visibleMetrics.size, setVisibleMetrics]);

  // Toggle metric visibility
  const toggleMetricVisibility = (metricKey) => {
    setVisibleMetrics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(metricKey)) {
        newSet.delete(metricKey);
      } else {
        newSet.add(metricKey);
      }
      return newSet;
    });
  };

  // Select/deselect all metrics
  const toggleAllMetrics = () => {
    if (visibleMetrics.size === allMetricFields.length) {
      // Deselect all - but keep at least one metric visible
      setVisibleMetrics(new Set([allMetricFields[0]?.key]));
    } else {
      // Select all
      setVisibleMetrics(new Set(allMetricFields.map(f => f.key)));
    }
  };

  return {
    allMetricFields,
    toggleMetricVisibility,
    toggleAllMetrics
  };
};
