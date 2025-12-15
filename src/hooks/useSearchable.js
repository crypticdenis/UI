import { useState, useMemo } from 'react';

/**
 * Custom hook for searchable/filterable data
 * @param {Array} data - Array of items to search
 * @param {Array|string} searchKeys - Keys to search in (e.g., ['name', 'description'] or single key)
 * @returns {Object} - { filteredData, searchQuery, setSearchQuery, clearSearch, hasActiveSearch }
 */
export const useSearchable = (data, searchKeys = []) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!searchQuery) return data;

    const searchLower = searchQuery.toLowerCase();
    const keysArray = Array.isArray(searchKeys) ? searchKeys : [searchKeys];

    return data.filter(item => {
      // If no keys specified, search all string values
      if (keysArray.length === 0) {
        return Object.values(item).some(value => 
          value && String(value).toLowerCase().includes(searchLower)
        );
      }

      // Search specific keys
      return keysArray.some(key => {
        const value = item[key];
        if (value == null) return false;
        
        // Handle nested values (e.g., metric.value)
        if (typeof value === 'object' && 'value' in value) {
          return String(value.value).toLowerCase().includes(searchLower);
        }
        
        return String(value).toLowerCase().includes(searchLower);
      });
    });
  }, [data, searchQuery, searchKeys]);

  const clearSearch = () => setSearchQuery('');
  const hasActiveSearch = Boolean(searchQuery);

  return {
    filteredData,
    searchQuery,
    setSearchQuery,
    clearSearch,
    hasActiveSearch
  };
};
