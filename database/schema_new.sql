-- Drop existing tables
DROP TABLE IF EXISTS evaluation.evaluation CASCADE;
DROP TABLE IF EXISTS evaluation.test_response CASCADE;
DROP TABLE IF EXISTS evaluation.test_execution CASCADE;
DROP TABLE IF EXISTS evaluation.test_run CASCADE;
DROP SCHEMA IF EXISTS evaluation CASCADE;

-- Create schema
CREATE SCHEMA IF NOT EXISTS evaluation;

-- Test Run Table
-- Represents a complete test run for a workflow
CREATE TABLE evaluation.test_run (
    id SERIAL PRIMARY KEY,
    workflow_id VARCHAR(255),
    start_ts TIMESTAMP,
    finish_ts TIMESTAMP,
    creation_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Execution Table
-- Represents individual test executions within a run
-- parent_execution_id links sub-executions (when workflow calls subworkflow)
CREATE TABLE evaluation.test_execution (
    id SERIAL PRIMARY KEY,
    run_id INTEGER REFERENCES evaluation.test_run(id) ON DELETE CASCADE,
    workflow_id VARCHAR(255),
    session_id VARCHAR(255),
    parent_execution_id INTEGER REFERENCES evaluation.test_execution(id),
    input TEXT,
    expected_output TEXT,
    duration NUMERIC(7,2),
    total_tokens INTEGER,
    creation_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Response Table
-- Stores the actual output from each execution
CREATE TABLE evaluation.test_response (
    id SERIAL PRIMARY KEY,
    test_execution_id INTEGER REFERENCES evaluation.test_execution(id) ON DELETE CASCADE,
    actual_output TEXT,
    creation_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluation Table
-- Stores evaluation metrics for each execution
-- Supports dynamic metrics (accuracy, relevance, etc.)
CREATE TABLE evaluation.evaluation (
    id SERIAL PRIMARY KEY,
    test_execution_id INTEGER REFERENCES evaluation.test_execution(id) ON DELETE CASCADE,
    workflow_id VARCHAR(32) DEFAULT 'REG_TEST',
    metric_name VARCHAR(64),
    metric_value NUMERIC(7,2),
    metric_reason TEXT,
    creation_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_test_run_workflow ON evaluation.test_run(workflow_id);
CREATE INDEX idx_test_execution_run ON evaluation.test_execution(run_id);
CREATE INDEX idx_test_execution_workflow ON evaluation.test_execution(workflow_id);
CREATE INDEX idx_test_execution_parent ON evaluation.test_execution(parent_execution_id);
CREATE INDEX idx_test_response_execution ON evaluation.test_response(test_execution_id);
CREATE INDEX idx_evaluation_execution ON evaluation.evaluation(test_execution_id);
CREATE INDEX idx_evaluation_metric ON evaluation.evaluation(metric_name);

-- Add comments for documentation
COMMENT ON TABLE evaluation.test_run IS 'Stores test run information for workflows';
COMMENT ON TABLE evaluation.test_execution IS 'Stores individual test executions. parent_execution_id is set when a workflow calls a subworkflow (for debugging only, not shown in dashboard)';
COMMENT ON TABLE evaluation.test_response IS 'Stores the output/response from each execution';
COMMENT ON TABLE evaluation.evaluation IS 'Stores evaluation metrics with flexible metric names';

COMMENT ON COLUMN evaluation.test_execution.parent_execution_id IS 'Links to parent execution when this execution was triggered by a subworkflow call. Used for debugging only, not displayed in dashboard.';
