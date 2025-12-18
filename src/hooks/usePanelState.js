import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for managing panel state (collapse, expand, resize)
 * Reusable for NavigationSidebar and other resizable/collapsible panels
 * 
 * @param {Object} config - Configuration object
 * @param {boolean} config.defaultCollapsed - Initial collapsed state
 * @param {number} config.defaultWidth - Initial width in pixels
 * @param {number} config.minWidth - Minimum width constraint
 * @param {number} config.maxWidth - Maximum width constraint
 * @param {boolean} config.persistToLocalStorage - Whether to persist state to localStorage
 * @param {string} config.storageKey - LocalStorage key prefix
 * 
 * @returns {Object} Panel state and utilities
 */
export function usePanelState({
  defaultCollapsed = false,
  defaultWidth = 280,
  minWidth = 200,
  maxWidth = 600,
  persistToLocalStorage = false,
  storageKey = 'panel',
} = {}) {
  // Load initial state from localStorage if persistence is enabled
  const getInitialCollapsed = () => {
    if (persistToLocalStorage) {
      const stored = localStorage.getItem(`${storageKey}_collapsed`);
      return stored ? JSON.parse(stored) : defaultCollapsed;
    }
    return defaultCollapsed;
  };

  const getInitialWidth = () => {
    if (persistToLocalStorage) {
      const stored = localStorage.getItem(`${storageKey}_width`);
      return stored ? Number(stored) : defaultWidth;
    }
    return defaultWidth;
  };

  const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsed);
  const [width, setWidth] = useState(getInitialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());
  
  const panelRef = useRef(null);

  // Persist to localStorage when state changes
  useEffect(() => {
    if (persistToLocalStorage) {
      localStorage.setItem(`${storageKey}_collapsed`, JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, persistToLocalStorage, storageKey]);

  useEffect(() => {
    if (persistToLocalStorage) {
      localStorage.setItem(`${storageKey}_width`, String(width));
    }
  }, [width, persistToLocalStorage, storageKey]);

  /**
   * Toggle collapsed state
   */
  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  /**
   * Set collapsed state explicitly
   */
  const setCollapsed = useCallback((collapsed) => {
    setIsCollapsed(collapsed);
  }, []);

  /**
   * Toggle item expansion (for tree views, etc.)
   */
  const toggleItem = useCallback((itemId) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  /**
   * Expand specific item
   */
  const expandItem = useCallback((itemId) => {
    setExpandedItems(prev => new Set([...prev, itemId]));
  }, []);

  /**
   * Collapse specific item
   */
  const collapseItem = useCallback((itemId) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  }, []);

  /**
   * Expand all items
   */
  const expandAll = useCallback((itemIds) => {
    setExpandedItems(new Set(itemIds));
  }, []);

  /**
   * Collapse all items
   */
  const collapseAll = useCallback(() => {
    setExpandedItems(new Set());
  }, []);

  /**
   * Handle resize start
   */
  const startResize = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  /**
   * Handle resize
   */
  const handleResize = useCallback((e) => {
    if (!isResizing || !panelRef.current) return;

    const newWidth = e.clientX - panelRef.current.getBoundingClientRect().left;
    const constrainedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
    setWidth(constrainedWidth);
  }, [isResizing, minWidth, maxWidth]);

  /**
   * Handle resize end
   */
  const stopResize = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Attach resize listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);

      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
      };
    }
  }, [isResizing, handleResize, stopResize]);

  return {
    // Collapse State
    isCollapsed,
    setIsCollapsed,
    toggleCollapse,
    setCollapsed,

    // Resize State
    width,
    setWidth,
    isResizing,
    startResize,
    stopResize,

    // Expansion State (for tree items, etc.)
    expandedItems,
    setExpandedItems,
    toggleItem,
    expandItem,
    collapseItem,
    expandAll,
    collapseAll,
    isItemExpanded: (itemId) => expandedItems.has(itemId),

    // Ref
    panelRef,

    // Utilities
    effectiveWidth: isCollapsed ? 0 : width,
  };
}
