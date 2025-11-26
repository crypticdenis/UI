/**
 * Utility functions for dynamic metric handling
 */

/**
 * Recursively clean metric objects by extracting values from {value, reason} structures
 * This ensures no objects are accidentally rendered in React
 */
export const cleanMetricObjects = (data) => {
  if (data === null || data === undefined) {
    return data;
  }

  // If it's an object with {value, reason} structure, extract the value
  if (typeof data === 'object' && !Array.isArray(data) && 'value' in data) {
    return data.value;
  }

  // If it's an array, recursively clean each element
  if (Array.isArray(data)) {
    return data.map(item => cleanMetricObjects(item));
  }

  // If it's an object, recursively clean each property
  if (typeof data === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(data)) {
      cleaned[key] = cleanMetricObjects(value);
    }
    return cleaned;
  }

  // Otherwise return as-is (primitives)
  return data;
};

/**
 * Determines if a value is a numeric score (float/number)
 */
export const isNumericScore = (value) => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * Determines if a field name indicates it's a score metric
 */
export const isScoreField = (fieldName) => {
  const lowerField = fieldName.toLowerCase();
  return (
    lowerField.includes('score') ||
    lowerField.includes('rate') ||
    lowerField.includes('rating') ||
    lowerField.includes('accuracy') ||
    lowerField.includes('precision') ||
    lowerField.includes('recall') ||
    lowerField.includes('f1') ||
    lowerField.includes('metric')
  );
};

/**
 * Determines if a field is a reason/explanation field
 */
export const isReasonField = (fieldName) => {
  const lowerField = fieldName.toLowerCase();
  return (
    lowerField.includes('reason') ||
    lowerField.includes('explanation') ||
    lowerField.includes('justification') ||
    lowerField.includes('rationale')
  );
};

/**
 * Extract all metric fields from execution data (flat structure)
 */
export const extractMetrics = (execution) => {
  if (!execution || typeof execution !== 'object') {
    return { scores: [], reasons: [], textFields: [] };
  }

  const scores = [];
  const reasons = [];
  const textFields = [];

  Object.entries(execution).forEach(([key, value]) => {
    // Skip core fields
    if (['id', 'runId', 'workflowId', 'sessionId', 'parentExecutionId', 
         'input', 'expectedOutput', 'output', 'duration', 'totalTokens',
         'executionTs', 'creationTs'].includes(key)) {
      return;
    }

    // Handle metric objects with {value, reason}
    if (typeof value === 'object' && value !== null && 'value' in value) {
      scores.push({ 
        key, 
        value: value.value, 
        label: formatFieldName(key),
        reason: value.reason 
      });
      if (value.reason) {
        reasons.push({ 
          key: `${key}_reason`, 
          value: value.reason, 
          label: `${formatFieldName(key)} Reason` 
        });
      }
    }
  });

  return { scores, reasons, textFields };
};

/**
 * Format field name for display (camelCase to Title Case)
 */
export const formatFieldName = (fieldName) => {
  // Handle common abbreviations
  const abbreviations = {
    'rag': 'RAG',
    'llm': 'LLM',
    'ai': 'AI',
    'api': 'API',
    'id': 'ID',
    'url': 'URL',
    'http': 'HTTP',
    'json': 'JSON'
  };

  // Convert camelCase/snake_case to words
  const words = fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capitals
    .replace(/_/g, ' ') // Replace underscores with spaces
    .trim()
    .split(/\s+/);

  // Capitalize each word and handle abbreviations
  return words
    .map(word => {
      const lower = word.toLowerCase();
      return abbreviations[lower] || word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

/**
 * Get color for score value (0-1 scale or 0-10 scale)
 */
export const getScoreColor = (score) => {
  if (score === null || score === undefined || isNaN(score)) {
    return '#6b7280'; // Gray for invalid values
  }
  
  const numScore = Number(score);
  // Normalize to 0-1 range if needed (handles both 0-1 and 0-10 scales)
  const normalizedScore = numScore > 1 ? numScore / 10 : numScore;
  
  if (normalizedScore >= 0.9) return '#10b981'; // Excellent - Green (matches --success-color)
  if (normalizedScore >= 0.8) return '#22c55e'; // Very Good - Light green
  if (normalizedScore >= 0.7) return '#84cc16'; // Good - Lime green
  if (normalizedScore >= 0.6) return '#eab308'; // Fair - Yellow
  if (normalizedScore >= 0.5) return '#f59e0b'; // Below Avg - Orange
  return '#ef4444'; // Poor - Red (matches --error-color)
};

/**
 * Calculate aggregate scores from an array of questions (flat structure)
 */
export const calculateAggregateScores = (questions) => {
  if (!questions || questions.length === 0) {
    return { metrics: [], count: 0 };
  }

  // Collect all unique metric fields (those with {value, reason} structure)
  const allScoreFields = new Set();
  questions.forEach(q => {
    Object.keys(q).forEach(key => {
      const value = q[key];
      // Find metric objects with {value, reason}
      if (typeof value === 'object' && value !== null && 'value' in value) {
        allScoreFields.add(key);
      }
    });
  });

  // Calculate averages for each metric field
  const metrics = [];
  allScoreFields.forEach(fieldKey => {
    const sum = questions.reduce((acc, q) => {
      const data = q[fieldKey];
      const value = (typeof data === 'object' && data !== null) ? data.value : data;
      return acc + (isNumericScore(value) ? value : 0);
    }, 0);
    
    const avg = questions.length > 0 ? sum / questions.length : 0;
    
    metrics.push({
      key: fieldKey,
      label: formatFieldName(fieldKey),
      average: avg,
      formatted: avg.toFixed(2)
    });
  });

  return { metrics, count: questions.length };
};

/**
 * Get all unique metric fields from runs data (flat structure)
 */
export const getUniqueScoreFields = (runs) => {
  const scoreFields = new Set();
  
  runs.forEach(run => {
    Object.keys(run).forEach(key => {
      const value = run[key];
      // Find metric objects with {value, reason} structure
      if (typeof value === 'object' && value !== null && 'value' in value) {
        scoreFields.add(key);
      }
    });
  });

  return Array.from(scoreFields).map(key => ({
    key,
    label: formatFieldName(key)
  }));
};

/**
 * Format a number value for display
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '-';
  }
  return Number(value).toFixed(decimals);
};

/**
 * Categorize metrics into quality and performance metrics
 */
export const categorizeMetrics = (execution) => {
  const qualityMetrics = {};
  const performanceMetrics = {};
  
  Object.keys(execution).forEach(key => {
    const value = execution[key];
    if (value && typeof value === 'object' && 'value' in value) {
      // Categorize metrics
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('time') || lowerKey.includes('duration') || 
          lowerKey.includes('token') || lowerKey.includes('cost')) {
        performanceMetrics[key] = value;
      } else {
        qualityMetrics[key] = value;
      }
    }
  });
  
  // Also add direct properties like duration and totalTokens as performance metrics
  if (execution.duration) {
    performanceMetrics['Response Time'] = { value: execution.duration, reason: '' };
  }
  if (execution.totalTokens) {
    performanceMetrics['Token Count'] = { value: execution.totalTokens, reason: '' };
  }
  
  return { qualityMetrics, performanceMetrics };
};

/**
 * Calculate average score from quality metrics
 */
export const calculateAvgScore = (qualityMetrics) => {
  const metricKeys = Object.keys(qualityMetrics);
  if (metricKeys.length === 0) return 0;
  
  return Object.values(qualityMetrics).reduce((sum, m) => sum + m.value, 0) / metricKeys.length;
};

/**
 * Get grade information based on score (0-1 scale)
 */
export const getGradeInfo = (score) => {
  if (score >= 0.9) {
    return { grade: 'Excellent', color: '#ffffff', bgColor: '#10b981' };
  } else if (score >= 0.8) {
    return { grade: 'Very Good', color: '#ffffff', bgColor: '#22c55e' };
  } else if (score >= 0.7) {
    return { grade: 'Good', color: '#ffffff', bgColor: '#84cc16' };
  } else if (score >= 0.6) {
    return { grade: 'Fair', color: '#000000', bgColor: '#eab308' };
  } else if (score >= 0.5) {
    return { grade: 'Below Avg', color: '#ffffff', bgColor: '#f59e0b' };
  } else {
    return { grade: 'Poor', color: '#ffffff', bgColor: '#ef4444' };
  }
};
