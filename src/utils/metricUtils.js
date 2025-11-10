/**
 * Utility functions for dynamic metric handling
 */

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
 * Extract all metric fields from ExecutionData
 */
export const extractMetrics = (executionData) => {
  if (!executionData || typeof executionData !== 'object') {
    return { scores: [], reasons: [], textFields: [] };
  }

  const scores = [];
  const reasons = [];
  const textFields = [];

  Object.entries(executionData).forEach(([key, value]) => {
    if (isReasonField(key)) {
      reasons.push({ key, value, label: formatFieldName(key) });
    } else if (isScoreField(key) && isNumericScore(value)) {
      scores.push({ key, value, label: formatFieldName(key) });
    } else if (typeof value === 'string' && key !== 'output') {
      textFields.push({ key, value, label: formatFieldName(key) });
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
  
  if (normalizedScore >= 0.9) return '#059669'; // Dark green
  if (normalizedScore >= 0.8) return '#10b981'; // Green
  if (normalizedScore >= 0.7) return '#34d399'; // Light green
  if (normalizedScore >= 0.6) return '#fbbf24'; // Yellow
  if (normalizedScore >= 0.5) return '#f59e0b'; // Orange
  if (normalizedScore >= 0.4) return '#f97316'; // Dark orange
  if (normalizedScore >= 0.3) return '#ef4444'; // Red
  return '#dc2626'; // Dark red
};

/**
 * Calculate aggregate scores from an array of questions
 */
export const calculateAggregateScores = (questions) => {
  if (!questions || questions.length === 0) {
    return { metrics: [], count: 0 };
  }

  // Collect all unique score fields
  const allScoreFields = new Set();
  questions.forEach(q => {
    if (q.ExecutionData) {
      Object.keys(q.ExecutionData).forEach(key => {
        if (isScoreField(key) && isNumericScore(q.ExecutionData[key])) {
          allScoreFields.add(key);
        }
      });
    }
  });

  // Calculate averages for each score field
  const metrics = [];
  allScoreFields.forEach(fieldKey => {
    const sum = questions.reduce((acc, q) => {
      const value = q.ExecutionData?.[fieldKey];
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
 * Get all unique score fields from runs data
 */
export const getUniqueScoreFields = (runs) => {
  const scoreFields = new Set();
  
  runs.forEach(run => {
    if (run.ExecutionData) {
      Object.keys(run.ExecutionData).forEach(key => {
        if (isScoreField(key) && isNumericScore(run.ExecutionData[key])) {
          scoreFields.add(key);
        }
      });
    }
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
