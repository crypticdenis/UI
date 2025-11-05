import React from 'react';

const CollapsibleCell = ({ content, title = "Content", runId, gtId, onExpand }) => {
  if (!content || content === '-') return <span>-</span>;

  const isLong = content.length > 100 || content.includes('\n');

  return (
    <div className="compact-cell">
      <div className="cell-preview">
        {content.length > 80 ? `${content.substring(0, 80)}...` : content}
      </div>
      {isLong && (
        <button
          className="expand-icon"
          onClick={() => onExpand(content, title, runId, gtId)}
          title="View full content"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CollapsibleCell;
