import { useMemo } from 'react';

/**
 * Calculate metrics and score fields from run data
 * @param {Object} run - Run object
 * @param {Array} executions - Executions/questions array
 * @param {Array} scoreFields - Predefined score fields
 * @param {Object} metrics - Predefined metrics
 * @returns {Object} - { calculatedScoreFields, calculatedMetrics, calculatedAvgScore, calculatedDuration, calculatedTotalTokens }
 */
export const useRunMetrics = (run = {}, executions = [], scoreFields = [], metrics = {}) => {
  // Calculate score fields dynamically from run data
  const calculatedScoreFields = useMemo(() => {
    if (scoreFields.length > 0) return scoreFields;

    const fieldMap = new Map();
    const dataSource = executions.length > 0 ? executions : [run];

    dataSource.forEach(item => {
      Object.keys(item).forEach(key => {
        // Skip duration and totalTokens - they're not score metrics
        if (key === 'duration' || key === 'totalTokens') return;
        
        // Identify metric fields
        if (key.startsWith('avg_') ||
            (item[key] && typeof item[key] === 'object' && 'value' in item[key]) ||
            (typeof item[key] === 'number' && item[key] <= 1 && item[key] >= 0 &&
             (key.toLowerCase().includes('score') ||
              key.toLowerCase().includes('rate') ||
              key.toLowerCase().includes('accuracy')))) {
          const fieldKey = key.startsWith('avg_') ? key.substring(4) : key;
          if (!fieldMap.has(fieldKey)) {
            fieldMap.set(fieldKey, {
              key: fieldKey,
              label: fieldKey.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()
                .replace(/\b\w/g, l => l.toUpperCase())
            });
          }
        }
      });
    });

    return Array.from(fieldMap.values());
  }, [scoreFields, run, executions]);

  // Calculate metrics from run data or executions
  const calculatedMetrics = useMemo(() => {
    if (Object.keys(metrics).length > 0) return metrics;

    const result = {};

    if (executions.length > 0) {
      // Calculate from executions
      const sums = {};
      const counts = {};

      executions.forEach(exec => {
        calculatedScoreFields.forEach(field => {
          const value = exec[field.key];
          let numValue = null;

          if (value && typeof value === 'object' && 'value' in value) {
            numValue = parseFloat(value.value);
          } else if (typeof value === 'number') {
            numValue = value;
          }

          if (!isNaN(numValue)) {
            if (!sums[field.key]) {
              sums[field.key] = 0;
              counts[field.key] = 0;
            }
            sums[field.key] += numValue;
            counts[field.key]++;
          }
        });
      });

      calculatedScoreFields.forEach(field => {
        if (counts[field.key] > 0) {
          result[`avg_${field.key}`] = (sums[field.key] / counts[field.key]).toFixed(2);
        }
      });
    } else if (run) {
      // Use existing avg_ values from run object
      calculatedScoreFields.forEach(field => {
        const avgKey = `avg_${field.key}`;
        if (run[avgKey] !== undefined) {
          result[avgKey] = run[avgKey];
        }
      });
    }

    return result;
  }, [metrics, executions, calculatedScoreFields, run]);

  // Calculate average score
  const calculatedAvgScore = useMemo(() => {
    const metricValues = calculatedScoreFields
      .map(field => parseFloat(calculatedMetrics[`avg_${field.key}`]))
      .filter(val => !isNaN(val));

    if (metricValues.length === 0) return null;
    return metricValues.reduce((sum, val) => sum + val, 0) / metricValues.length;
  }, [calculatedScoreFields, calculatedMetrics]);

  // Calculate duration
  const calculatedDuration = useMemo(() => {
    if (executions.length > 0) {
      // Calculate from executions
      const durations = executions
        .map(exec => {
          const dur = exec.duration;
          if (dur && typeof dur === 'object' && 'value' in dur) {
            return parseFloat(dur.value);
          } else if (typeof dur === 'number') {
            return dur;
          }
          return null;
        })
        .filter(d => d !== null && !isNaN(d));

      if (durations.length === 0) return '-';
      const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      return `${avgDuration.toFixed(1)}s`;
    } else if (run?.duration !== undefined) {
      return typeof run.duration === 'number' ? `${run.duration.toFixed(1)}s` : run.duration;
    }
    return null;
  }, [executions, run]);

  // Calculate total tokens
  const calculatedTotalTokens = useMemo(() => {
    if (executions.length > 0) {
      // Calculate from executions
      const tokens = executions
        .map(exec => {
          const tok = exec.totalTokens;
          if (tok && typeof tok === 'object' && 'value' in tok) {
            return parseFloat(tok.value);
          } else if (typeof tok === 'number') {
            return tok;
          }
          return null;
        })
        .filter(t => t !== null && !isNaN(t));

      if (tokens.length === 0) return 0;
      return Math.round(tokens.reduce((sum, t) => sum + t, 0) / tokens.length);
    } else if (run?.totalTokens !== undefined) {
      return typeof run.totalTokens === 'number' ? run.totalTokens : parseFloat(run.totalTokens) || 0;
    }
    return 0;
  }, [executions, run]);

  return {
    calculatedScoreFields,
    calculatedMetrics,
    calculatedAvgScore,
    calculatedDuration,
    calculatedTotalTokens
  };
};
