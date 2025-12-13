/**
 * SubExecution Component
 * Displays information about a sub-execution within a chat exchange
 */
const SubExecution = ({ subExec }) => {
  return (
    <div className="sub-execution">
      <div className="sub-execution-header">
        <span className="sub-execution-id">{subExec.id}</span>
        <span className="sub-execution-meta">
          {subExec.duration && `${subExec.duration}s`}
          {subExec.totalTokens && ` • ${subExec.totalTokens} tokens`}
        </span>
      </div>
      {subExec.input && (
        <div className="sub-execution-content">{subExec.input}</div>
      )}
      {subExec.output && (
        <div className="sub-execution-output">→ {subExec.output}</div>
      )}
    </div>
  );
};

export default SubExecution;
