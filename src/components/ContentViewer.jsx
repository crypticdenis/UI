import React from 'react';

const ContentViewer = ({ title, content, runId, gtId, onClose }) => {
  if (!content) return null;

  return (
    <div className="content-viewer">
      <div className="content-viewer-header">
        <div className="content-viewer-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <div>{title}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Run ID: {runId || 'N/A'} {gtId && `• GT ID: ${gtId}`}
            </div>
          </div>
        </div>
        <button className="content-viewer-close" onClick={onClose} title="Close viewer">
          ✕
        </button>
      </div>
      <div className="content-viewer-body">
        {content}
      </div>
    </div>
  );
};

export default ContentViewer;
