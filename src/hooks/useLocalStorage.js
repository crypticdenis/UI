import { useState, useEffect } from 'react';

/**
 * Custom hook for syncing state with localStorage
 * Handles Set objects by converting to/from arrays
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - Default value if no saved value exists
 * @returns {[*, Function]} - [value, setValue] tuple
 */
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        // Convert array back to Set if default value is a Set
        if (defaultValue instanceof Set && Array.isArray(parsed)) {
          return new Set(parsed);
        }
        return parsed;
      }
      return defaultValue;
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      // Convert Set to array for JSON serialization
      const toSave = value instanceof Set ? Array.from(value) : value;
      localStorage.setItem(key, JSON.stringify(toSave));
    } catch (error) {
      console.warn(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
};
