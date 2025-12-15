import { useState, useMemo } from 'react';

/**
 * Custom hook for sortable data
 * @param {Array} data - Array of items to sort
 * @param {string} defaultKey - Default sort key
 * @param {string} defaultDirection - Default sort direction ('ascending' | 'descending')
 * @returns {Object} - { sortedData, sortConfig, handleSort, setSortConfig }
 */
export const useSortable = (data, defaultKey = 'id', defaultDirection = 'ascending') => {
  const [sortConfig, setSortConfig] = useState({ 
    key: defaultKey, 
    direction: defaultDirection 
  });

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sorted = [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle numeric comparisons (scores, counts, etc.)
      if (sortConfig.key === 'avgScore' ||
          sortConfig.key === 'questionCount' ||
          sortConfig.key === 'subworkflowCount' ||
          sortConfig.key.startsWith('avg_') ||
          typeof aValue === 'number' && typeof bValue === 'number') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
        return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      // Handle date/timestamp comparisons
      if (sortConfig.key === 'startTs' || 
          sortConfig.key === 'finishTs' || 
          sortConfig.key === 'createdAt' || 
          sortConfig.key === 'updatedAt') {
        const aTime = new Date(aValue).getTime();
        const bTime = new Date(bValue).getTime();
        return sortConfig.direction === 'ascending' ? aTime - bTime : bTime - aTime;
      }

      // Handle metric objects with value property
      if (aValue && typeof aValue === 'object' && 'value' in aValue) {
        aValue = parseFloat(aValue.value) || 0;
      }
      if (bValue && typeof bValue === 'object' && 'value' in bValue) {
        bValue = parseFloat(bValue.value) || 0;
      }

      // String comparison (default)
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      if (aStr < bStr) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  return {
    sortedData,
    sortConfig,
    handleSort,
    setSortConfig
  };
};
