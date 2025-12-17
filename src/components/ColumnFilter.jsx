import { useState, useEffect } from 'react';
import '../styles/ColumnFilter.css';

/**
 * Reusable column filter component for customizing table visibility and order
 * @param {Array} allFields - Array of field objects with {key, label, type, isMetric}
 * @param {Set} visibleColumns - Set of visible column keys
 * @param {Function} onToggleColumn - Callback when a column is toggled
 * @param {Function} onToggleAll - Callback to toggle all columns
 * @param {Function} onReorderColumns - Callback when columns are reordered
 * @param {string} storageKey - Optional localStorage key for persistence
 */
const ColumnFilter = ({ 
  allFields, 
  visibleColumns, 
  onToggleColumn, 
  onToggleAll,
  onReorderColumns,
  storageKey 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (e) => {
      const filterWrapper = document.querySelector('.column-filter-wrapper');
      if (filterWrapper && !filterWrapper.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Save to localStorage when columns change
  useEffect(() => {
    if (storageKey && visibleColumns.size > 0) {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(visibleColumns)));
    }
  }, [visibleColumns, storageKey]);

  const handleToggleAll = () => {
    onToggleAll();
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, _index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newFields = [...allFields];
    const draggedField = newFields[draggedIndex];
    newFields.splice(draggedIndex, 1);
    newFields.splice(dropIndex, 0, draggedField);

    if (onReorderColumns) {
      onReorderColumns(newFields);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="column-filter-wrapper">
      <button 
        className={`btn btn-secondary column-filter-btn ${showDropdown ? 'active' : ''}`}
        onClick={() => setShowDropdown(!showDropdown)}
        title="Customize visible columns and order"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="21" x2="4" y2="14"/>
          <line x1="4" y1="10" x2="4" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12" y2="3"/>
          <line x1="20" y1="21" x2="20" y2="16"/>
          <line x1="20" y1="12" x2="20" y2="3"/>
          <line x1="1" y1="14" x2="7" y2="14"/>
          <line x1="9" y1="8" x2="15" y2="8"/>
          <line x1="17" y1="16" x2="23" y2="16"/>
        </svg>
        Columns ({visibleColumns.size}/{allFields.length})
      </button>
      
      {showDropdown && (
        <div className="column-filter-dropdown">
          <div className="column-filter-header">
            <h4>Customize Columns</h4>
            <button 
              className="btn-link"
              onClick={handleToggleAll}
            >
              {visibleColumns.size === allFields.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="column-filter-hint">
            💡 Drag to reorder columns
          </div>
          <div className="column-filter-list">
            {allFields.map((field, index) => (
              <label 
                key={field.key} 
                className={`column-filter-item ${draggedIndex === index ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="column-drag-handle">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="9" cy="5" r="2"/>
                    <circle cx="9" cy="12" r="2"/>
                    <circle cx="9" cy="19" r="2"/>
                    <circle cx="15" cy="5" r="2"/>
                    <circle cx="15" cy="12" r="2"/>
                    <circle cx="15" cy="19" r="2"/>
                  </svg>
                </div>
                <input
                  type="checkbox"
                  checked={visibleColumns.has(field.key)}
                  onChange={() => onToggleColumn(field.key)}
                />
                <span className="column-filter-label">
                  {field.label}
                  {field.isMetric && <span className="column-badge metric-badge">Metric</span>}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnFilter;
