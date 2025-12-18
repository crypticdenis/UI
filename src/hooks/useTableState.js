import { useState } from 'react';

/**
 * Custom hook for managing table state (sort, filter, search)
 * Reusable across RunsOverview, RunDetails, WorkflowsOverview, QuestionComparison
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.defaultSortKey - Default sort key
 * @param {string} config.defaultSortDirection - Default sort direction ('ascending' | 'descending')
 * @param {Function} config.filterFn - Optional custom filter function (item, searchQuery) => boolean
 * @param {Function} config.sortFn - Optional custom sort function (a, b, sortConfig) => number
 * 
 * @returns {Object} Table state and utilities
 */
export function useTableState({
  defaultSortKey = 'id',
  defaultSortDirection = 'ascending',
  filterFn = null,
  sortFn = null,
} = {}) {
  const [sortConfig, setSortConfig] = useState({
    key: defaultSortKey,
    direction: defaultSortDirection,
  });
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Handle sort column click
   */
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  /**
   * Default filter function - searches across common string fields
   */
  const defaultFilterFn = (item, query) => {
    if (!query) return true;
    
    const searchLower = query.toLowerCase();
    const searchableFields = [
      item.id,
      item.name,
      item.version,
      item.description,
      item.workflowId,
      item.sessionId,
    ].filter(Boolean);

    return searchableFields.some(field =>
      String(field).toLowerCase().includes(searchLower)
    );
  };

  /**
   * Default sort function - handles common data types
   */
  const defaultSortFn = (a, b, config) => {
    const aValue = a[config.key];
    const bValue = b[config.key];

    // Handle null/undefined
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Handle numbers
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return config.direction === 'ascending' ? aValue - bValue : bValue - aValue;
    }

    // Handle strings
    const comparison = String(aValue).localeCompare(String(bValue));
    return config.direction === 'ascending' ? comparison : -comparison;
  };

  /**
   * Filter and sort data
   */
  const processData = (data) => {
    if (!Array.isArray(data)) return [];

    const filterFunction = filterFn || defaultFilterFn;
    const sortFunction = sortFn || defaultSortFn;

    // Filter
    const filtered = data.filter(item => filterFunction(item, searchQuery));

    // Sort
    const sorted = [...filtered].sort((a, b) => sortFunction(a, b, sortConfig));

    return sorted;
  };

  /**
   * Reset all state
   */
  const reset = () => {
    setSortConfig({
      key: defaultSortKey,
      direction: defaultSortDirection,
    });
    setSearchQuery('');
  };

  return {
    // State
    sortConfig,
    setSortConfig,
    searchQuery,
    setSearchQuery,

    // Actions
    handleSort,
    processData,
    reset,

    // Utilities
    isSorted: (key) => sortConfig.key === key,
    getSortDirection: (key) => sortConfig.key === key ? sortConfig.direction : null,
  };
}
