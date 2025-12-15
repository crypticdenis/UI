import { useMemo } from 'react';

/**
 * Group executions by sessionId and calculate session metadata
 * @param {Array} executions - Array of execution objects
 * @returns {Array} - Array of session objects with grouped executions and metadata
 */
export const useSessionGroups = (executions) => {
  const sessionGroups = useMemo(() => {
    if (!executions || executions.length === 0) return [];
    
    // First, deduplicate executions by ID
    const uniqueExecs = Array.from(
      new Map(executions.map(exec => [exec.id, exec])).values()
    );
    
    const groups = {};
    uniqueExecs.forEach(exec => {
      const sessionId = exec.sessionId || `exec_${exec.id}`;
      if (!groups[sessionId]) {
        groups[sessionId] = [];
      }
      groups[sessionId].push(exec);
    });
    
    // Convert to array and sort by timestamp
    return Object.entries(groups).map(([sessionId, execs]) => {
      const sortedExecs = execs.sort((a, b) => {
        const timeA = new Date(a.executionTs || a.creationTs || 0);
        const timeB = new Date(b.executionTs || b.creationTs || 0);
        return timeA - timeB;
      });
      
      // Calculate average score
      const metrics = [];
      sortedExecs.forEach(exec => {
        Object.keys(exec).forEach(key => {
          const value = exec[key];
          if (value && typeof value === 'object' && 'value' in value) {
            metrics.push(value.value);
          }
        });
      });
      
      const avgScore = metrics.length > 0
        ? metrics.reduce((sum, val) => sum + val, 0) / metrics.length
        : 0;
      
      return {
        sessionId,
        executions: sortedExecs,
        avgScore,
        messageCount: sortedExecs.length,
        firstMessage: sortedExecs[0]?.input || 'No input',
        timestamp: sortedExecs[0]?.executionTs || sortedExecs[0]?.creationTs
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [executions]);

  return sessionGroups;
};
