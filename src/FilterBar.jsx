import React from 'react';

const FilterBar = ({ filters, setFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters({
      ...filters,
      [name]: checked,
    });
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        name="ID"
        placeholder="Filter by ID"
        value={filters.ID}
        onChange={handleInputChange}
      />
      <label>
        Active:
        <input
          type="checkbox"
          name="active"
          checked={filters.active}
          onChange={handleCheckboxChange}
        />
      </label>
      <label>
        Is Running:
        <input
          type="checkbox"
          name="IsRunning"
          checked={filters.IsRunning}
          onChange={handleCheckboxChange}
        />
      </label>
      
      {/* Ground Truth Data Filters */}
      <input
        type="text"
        name="GroundTruthData.ID"
        placeholder="Filter by GT ID"
        value={filters['GroundTruthData.ID']}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="GroundTruthData.Input"
        placeholder="Filter by Input"
        value={filters['GroundTruthData.Input']}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="GroundTruthData.expectedOutput"
        placeholder="Filter by Expected Output"
        value={filters['GroundTruthData.expectedOutput']}
        onChange={handleInputChange}
      />
      
      {/* Execution Data Filters */}
      <input
        type="text"
        name="ExecutionData.output"
        placeholder="Filter by Output"
        value={filters['ExecutionData.output']}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="ExecutionData.outputScore"
        placeholder="Filter by Output Score"
        value={filters['ExecutionData.outputScore']}
        onChange={handleInputChange}
        step="0.1"
      />
      <input
        type="text"
        name="ExecutionData.outputScoreReason"
        placeholder="Filter by Output Score Reason"
        value={filters['ExecutionData.outputScoreReason']}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="ExecutionData.ragRelevancyScore"
        placeholder="Filter by RAG Score"
        value={filters['ExecutionData.ragRelevancyScore']}
        onChange={handleInputChange}
        step="0.01"
      />
      <input
        type="text"
        name="ExecutionData.ragRelevancyScoreReason"
        placeholder="Filter by RAG Reason"
        value={filters['ExecutionData.ragRelevancyScoreReason']}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="ExecutionData.hallucinationRate"
        placeholder="Filter by Hallucination Rate"
        value={filters['ExecutionData.hallucinationRate']}
        onChange={handleInputChange}
        step="0.01"
      />
      <input
        type="text"
        name="ExecutionData.hallucinationRateReason"
        placeholder="Filter by Hallucination Reason"
        value={filters['ExecutionData.hallucinationRateReason']}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="ExecutionData.systemPromptAlignmentScore"
        placeholder="Filter by System Prompt Score"
        value={filters['ExecutionData.systemPromptAlignmentScore']}
        onChange={handleInputChange}
        step="0.01"
      />
      <input
        type="text"
        name="ExecutionData.systemPromptAlignmentScoreReason"
        placeholder="Filter by System Prompt Reason"
        value={filters['ExecutionData.systemPromptAlignmentScoreReason']}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default FilterBar;
