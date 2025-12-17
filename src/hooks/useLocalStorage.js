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
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      // Convert Set to array for JSON serialization
      const toSave = value instanceof Set ? Array.from(value) : value;
      localStorage.setItem(key, JSON.stringify(toSave));
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [key, value]);

  return [value, setValue];
};
