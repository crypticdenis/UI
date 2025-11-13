-- ==========================================================
-- Evaluations Database Schema - Simplified (No Project/Workflow tables)
-- ==========================================================

DROP TABLE IF EXISTS evaluation CASCADE;
DROP TABLE IF EXISTS test_response CASCADE;
DROP TABLE IF EXISTS test_execution CASCADE;
DROP TABLE IF EXISTS test_run CASCADE;

-- ==========================================================
-- TEST RUNS
-- ==========================================================
-- Each run represents a workflow execution
-- Main workflows have parent_run_id = NULL
-- Subworkflow runs reference their parent run via parent_run_id
CREATE TABLE test_run (
    id SERIAL PRIMARY KEY,
    workflow_id VARCHAR(255) NOT NULL,  -- Logical workflow name (e.g., "QA_Evaluation", "Prompt_Tuning")
    parent_run_id INTEGER REFERENCES test_run(id) ON DELETE CASCADE,  -- NULL for main workflows, set for subworkflows
    start_ts TIMESTAMP,
    finish_ts TIMESTAMP,
    creation_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- TEST EXECUTIONS
-- ==========================================================
CREATE TABLE test_execution (
    id SERIAL PRIMARY KEY,
    run_id INTEGER REFERENCES test_run(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    parent_execution_id INTEGER REFERENCES test_execution(id),
    subworkflow_run_id INTEGER REFERENCES test_run(id),  -- Optional: links execution to spawned subworkflow
    input TEXT,
    expected_output TEXT,
    duration NUMERIC,
    total_tokens INTEGER,
    execution_ts TIMESTAMP,
    creation_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- TEST RESPONSES
-- ==========================================================
CREATE TABLE test_response (
    id SERIAL PRIMARY KEY,
    test_execution_id INTEGER REFERENCES test_execution(id) ON DELETE CASCADE,
    output TEXT
);

-- ==========================================================
-- EVALUATIONS
-- ==========================================================
CREATE TABLE evaluation (
    id SERIAL PRIMARY KEY,
    test_execution_id INTEGER REFERENCES test_execution(id) ON DELETE CASCADE,
    type VARCHAR(255),
    metric_name VARCHAR(255),
    metric_value NUMERIC,
    metric_reason TEXT,
    creation_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- INDEXES
-- ==========================================================
CREATE INDEX idx_test_run_workflow_id ON test_run(workflow_id);
CREATE INDEX idx_test_run_parent_run_id ON test_run(parent_run_id);
CREATE INDEX idx_test_execution_run_id ON test_execution(run_id);
CREATE INDEX idx_test_execution_subworkflow_run_id ON test_execution(subworkflow_run_id);
CREATE INDEX idx_evaluation_test_execution_id ON evaluation(test_execution_id);
