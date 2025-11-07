-- Butler Evaluation Database Schema
-- Hierarchical structure: Projects -> Workflows -> Subworkflows -> Runs

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTA1
);

-- Main Workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, name)
);

-- Subworkflows table (workflows can have multiple subworkflows)
CREATE TABLE IF NOT EXISTS subworkflows (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workflow_id, name)
);

-- Runs table (both workflows and subworkflows have runs)
CREATE TABLE IF NOT EXISTS runs (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES workflows(id) ON DELETE CASCADE,
    subworkflow_id INTEGER REFERENCES subworkflows(id) ON DELETE CASCADE,
    run_name VARCHAR(255),
    model VARCHAR(100),
    prompt_version VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    
    -- Ensure run belongs to either workflow or subworkflow
    CONSTRAINT check_parent CHECK (
        (workflow_id IS NOT NULL AND subworkflow_id IS NULL) OR
        (workflow_id IS NULL AND subworkflow_id IS NOT NULL)
    )
);

-- Questions/Results table (stores individual question results for each run)
CREATE TABLE IF NOT EXISTS run_results (
    id SERIAL PRIMARY KEY,
    run_id INTEGER NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
    base_id VARCHAR(255),
    question_id VARCHAR(255),
    input_text TEXT,
    output_text TEXT,
    ground_truth TEXT,
    
    -- Scores
    coherence_score DECIMAL(5, 4),
    relevance_score DECIMAL(5, 4),
    fluency_score DECIMAL(5, 4),
    consistency_score DECIMAL(5, 4),
    
    -- Evaluations/Reasoning
    coherence_evaluation TEXT,
    relevance_evaluation TEXT,
    fluency_evaluation TEXT,
    consistency_evaluation TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workflows_project_id ON workflows(project_id);
CREATE INDEX IF NOT EXISTS idx_subworkflows_workflow_id ON subworkflows(workflow_id);
CREATE INDEX IF NOT EXISTS idx_runs_workflow_id ON runs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_runs_subworkflow_id ON runs(subworkflow_id);
CREATE INDEX IF NOT EXISTS idx_run_results_run_id ON run_results(run_id);
CREATE INDEX IF NOT EXISTS idx_run_results_base_id ON run_results(base_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subworkflows_updated_at BEFORE UPDATE ON subworkflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for initial setup
INSERT INTO projects (name, description) 
VALUES ('Default Project', 'Initial evaluation project')
ON CONFLICT (name) DO NOTHING;
