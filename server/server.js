import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'butler_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'butler_eval',
  password: process.env.DB_PASSWORD || 'butler123',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Database connected successfully at:', res.rows[0].now);
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Helper function to build hierarchical project structure
async function buildProjectHierarchy(projectId) {
  // Get project
  const projectResult = await pool.query(
    'SELECT * FROM projects WHERE id = $1',
    [projectId]
  );
  
  if (projectResult.rows.length === 0) {
    return null;
  }
  
  const project = projectResult.rows[0];
  
  // Get workflows for this project
  const workflowsResult = await pool.query(
    'SELECT * FROM workflows WHERE project_id = $1 ORDER BY created_at',
    [projectId]
  );
  
  // Build workflows with their runs and subworkflows
  const workflows = await Promise.all(workflowsResult.rows.map(async (workflow) => {
    // Get workflow runs
    const workflowRunsResult = await pool.query(
      `SELECT * FROM runs WHERE workflow_id = $1 ORDER BY timestamp`,
      [workflow.id]
    );
    
    // Get subworkflows
    const subworkflowsResult = await pool.query(
      'SELECT * FROM subworkflows WHERE workflow_id = $1 ORDER BY created_at',
      [workflow.id]
    );
    
    // Build subworkflows with their runs
    const subworkflows = await Promise.all(subworkflowsResult.rows.map(async (subworkflow) => {
      const subworkflowRunsResult = await pool.query(
        `SELECT * FROM runs WHERE subworkflow_id = $1 ORDER BY timestamp`,
        [subworkflow.id]
      );
      
      return {
        id: subworkflow.id,
        name: subworkflow.name,
        description: subworkflow.description,
        createdAt: subworkflow.created_at,
        updatedAt: subworkflow.updated_at,
        runCount: subworkflowRunsResult.rows.length,
        runs: subworkflowRunsResult.rows.map(formatRun)
      };
    }));
    
    return {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      createdAt: workflow.created_at,
      updatedAt: workflow.updated_at,
      runCount: workflowRunsResult.rows.length,
      subworkflowCount: subworkflows.length,
      runs: workflowRunsResult.rows.map(formatRun),
      subworkflows: subworkflows
    };
  }));
  
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    workflowCount: workflows.length,
    workflows: workflows
  };
}

// Helper function to dynamically extract all score and evaluation fields
function extractExecutionData(run) {
  const executionData = {
    ID: run.execution_id,
    output: run.output
  };
  
  // Dynamically add all fields that end with _score, _rate, _reason, etc.
  const fieldPatterns = ['_score', '_rate', '_rating', '_accuracy', '_precision', '_recall', '_f1', '_metric'];
  const reasonPatterns = ['_reason', '_explanation', '_justification'];
  
  Object.keys(run).forEach(key => {
    // Skip fields that are already mapped or are metadata
    if (['id', 'workflow_id', 'subworkflow_id', 'base_id', 'version', 'active', 'is_running', 
         'model', 'prompt_version', 'timestamp', 'ground_truth_id', 'input_text', 'expected_output',
         'execution_id', 'output'].includes(key)) {
      return;
    }
    
    // Convert snake_case to camelCase and add to ExecutionData
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Check if it's a numeric field (score, rate, etc.)
    const isNumericField = fieldPatterns.some(pattern => key.includes(pattern));
    const isReasonField = reasonPatterns.some(pattern => key.includes(pattern));
    
    if (run[key] !== null && run[key] !== undefined) {
      if (isNumericField) {
        executionData[camelKey] = parseFloat(run[key]);
      } else if (isReasonField || typeof run[key] === 'string') {
        executionData[camelKey] = run[key];
      }
    }
  });
  
  return executionData;
}

// Helper function to format run data to match frontend expectations
function formatRun(run) {
  return {
    ID: run.id,
    baseID: run.base_id,
    version: run.version,
    active: run.active,
    IsRunning: run.is_running,
    GroundTruthData: {
      ID: run.ground_truth_id,
      Input: run.input_text,
      expectedOutput: run.expected_output
    },
    timestamp: run.timestamp,
    model: run.model,
    promptVersion: run.prompt_version,
    ExecutionData: extractExecutionData(run)
  };
}

// API Routes

// Get all projects with full hierarchy
app.get('/api/projects', async (req, res) => {
  try {
    const projectsResult = await pool.query('SELECT * FROM projects ORDER BY created_at');
    const projects = await Promise.all(
      projectsResult.rows.map(project => buildProjectHierarchy(project.id))
    );
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project with full hierarchy
app.get('/api/projects/:projectId', async (req, res) => {
  try {
    const project = await buildProjectHierarchy(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Get all runs for a specific workflow
app.get('/api/workflows/:workflowId/runs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM runs WHERE workflow_id = $1 ORDER BY timestamp',
      [req.params.workflowId]
    );
    res.json(result.rows.map(formatRun));
  } catch (error) {
    console.error('Error fetching workflow runs:', error);
    res.status(500).json({ error: 'Failed to fetch workflow runs' });
  }
});

// Get all runs for a specific subworkflow
app.get('/api/subworkflows/:subworkflowId/runs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM runs WHERE subworkflow_id = $1 ORDER BY timestamp',
      [req.params.subworkflowId]
    );
    res.json(result.rows.map(formatRun));
  } catch (error) {
    console.error('Error fetching subworkflow runs:', error);
    res.status(500).json({ error: 'Failed to fetch subworkflow runs' });
  }
});

// Get a specific run by ID
app.get('/api/runs/:runId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM runs WHERE id = $1',
      [req.params.runId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Run not found' });
    }
    res.json(formatRun(result.rows[0]));
  } catch (error) {
    console.error('Error fetching run:', error);
    res.status(500).json({ error: 'Failed to fetch run' });
  }
});

// Create a new project
app.post('/api/projects', async (req, res) => {
  try {
    const { id, name, description } = req.body;
    const now = new Date();
    
    const result = await pool.query(
      'INSERT INTO projects (id, name, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, name, description, now, now]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Create a new workflow
app.post('/api/workflows', async (req, res) => {
  try {
    const { id, project_id, name, description } = req.body;
    const now = new Date();
    
    const result = await pool.query(
      'INSERT INTO workflows (id, project_id, name, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, project_id, name, description, now, now]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// Create a new subworkflow
app.post('/api/subworkflows', async (req, res) => {
  try {
    const { id, workflow_id, name, description } = req.body;
    const now = new Date();
    
    const result = await pool.query(
      'INSERT INTO subworkflows (id, workflow_id, name, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, workflow_id, name, description, now, now]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating subworkflow:', error);
    res.status(500).json({ error: 'Failed to create subworkflow' });
  }
});

// Create a new run
app.post('/api/runs', async (req, res) => {
  try {
    const {
      id, workflow_id, subworkflow_id, base_id, version, active, is_running,
      model, prompt_version, timestamp, ground_truth_id, input_text,
      expected_output, execution_id, output, output_score, output_score_reason,
      rag_relevancy_score, rag_relevancy_score_reason, hallucination_rate,
      hallucination_rate_reason, system_prompt_alignment_score,
      system_prompt_alignment_score_reason
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO runs (
        id, workflow_id, subworkflow_id, base_id, version, active, is_running,
        model, prompt_version, timestamp, ground_truth_id, input_text,
        expected_output, execution_id, output, output_score, output_score_reason,
        rag_relevancy_score, rag_relevancy_score_reason, hallucination_rate,
        hallucination_rate_reason, system_prompt_alignment_score,
        system_prompt_alignment_score_reason
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING *`,
      [
        id, workflow_id, subworkflow_id, base_id, version, active, is_running,
        model, prompt_version, timestamp, ground_truth_id, input_text,
        expected_output, execution_id, output, output_score, output_score_reason,
        rag_relevancy_score, rag_relevancy_score_reason, hallucination_rate,
        hallucination_rate_reason, system_prompt_alignment_score,
        system_prompt_alignment_score_reason
      ]
    );
    
    res.status(201).json(formatRun(result.rows[0]));
  } catch (error) {
    console.error('Error creating run:', error);
    res.status(500).json({ error: 'Failed to create run', details: error.message });
  }
});

// Update a run
app.put('/api/runs/:runId', async (req, res) => {
  try {
    const { runId } = req.params;
    const updates = req.body;
    
    // Build dynamic update query
    const fields = [];
    const values = [];
    let paramCounter = 1;
    
    Object.keys(updates).forEach(key => {
      fields.push(`${key} = $${paramCounter}`);
      values.push(updates[key]);
      paramCounter++;
    });
    
    values.push(runId);
    
    const result = await pool.query(
      `UPDATE runs SET ${fields.join(', ')} WHERE id = $${paramCounter} RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Run not found' });
    }
    
    res.json(formatRun(result.rows[0]));
  } catch (error) {
    console.error('Error updating run:', error);
    res.status(500).json({ error: 'Failed to update run' });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end();
  process.exit(0);
});
