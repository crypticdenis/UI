import { useState } from 'react';

/**
 * Custom hook to manage comparison view states
 * Consolidates question comparison, run comparison, and conversation comparison states
 * 
 * @returns {Object} Comparison state and setters
 */
export function useComparisonState() {
  // Question Comparison State
  const [comparisonBaseID, setComparisonBaseID] = useState(null);
  const [comparisonRunVersion, setComparisonRunVersion] = useState(null);

  // Run Comparison State
  const [runComparisonWorkflowId, setRunComparisonWorkflowId] = useState(null);
  const [runComparisonRunIds, setRunComparisonRunIds] = useState([]);

  // Conversation Comparison State
  const [conversationComparisonSessionId, setConversationComparisonSessionId] = useState(null);
  const [conversationComparisonRunVersion, setConversationComparisonRunVersion] = useState(null);

  /**
   * Start question comparison
   */
  const startQuestionComparison = (baseId, runVersion) => {
    setComparisonBaseID(baseId);
    setComparisonRunVersion(runVersion);
  };

  /**
   * Clear question comparison
   */
  const clearQuestionComparison = () => {
    setComparisonBaseID(null);
    setComparisonRunVersion(null);
  };

  /**
   * Start run comparison
   */
  const startRunComparison = (workflowId, runIds) => {
    setRunComparisonWorkflowId(workflowId);
    setRunComparisonRunIds(runIds);
  };

  /**
   * Clear run comparison
   */
  const clearRunComparison = () => {
    setRunComparisonWorkflowId(null);
    setRunComparisonRunIds([]);
  };

  /**
   * Start conversation comparison
   */
  const startConversationComparison = (sessionId, runVersion) => {
    setConversationComparisonSessionId(sessionId);
    setConversationComparisonRunVersion(runVersion);
  };

  /**
   * Clear conversation comparison
   */
  const clearConversationComparison = () => {
    setConversationComparisonSessionId(null);
    setConversationComparisonRunVersion(null);
  };

  /**
   * Clear all comparison states
   */
  const clearAllComparisons = () => {
    clearQuestionComparison();
    clearRunComparison();
    clearConversationComparison();
  };

  return {
    // Question Comparison
    comparisonBaseID,
    setComparisonBaseID,
    comparisonRunVersion,
    setComparisonRunVersion,
    startQuestionComparison,
    clearQuestionComparison,

    // Run Comparison
    runComparisonWorkflowId,
    setRunComparisonWorkflowId,
    runComparisonRunIds,
    setRunComparisonRunIds,
    startRunComparison,
    clearRunComparison,

    // Conversation Comparison
    conversationComparisonSessionId,
    setConversationComparisonSessionId,
    conversationComparisonRunVersion,
    setConversationComparisonRunVersion,
    startConversationComparison,
    clearConversationComparison,

    // Utility
    clearAllComparisons,
  };
}
