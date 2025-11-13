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
    'SELECT * FROM project WHERE id = $1',
    [projectId]
  );
  
  if (projectResult.rows.length === 0) {
    return null;
  }
  
  const project = projectResult.rows[0];
  
  // Get workflows for this project (including both parent and child workflows)
  const workflowsResult = await pool.query(
    'SELECT * FROM workflow WHERE project_id = $1 ORDER BY created_ts',
    [projectId]
  );
  
  // Separate parent workflows from child workflows
  const parentWorkflows = workflowsResult.rows.filter(w => !w.parent_workflow_id);
  const childWorkflows = workflowsResult.rows.filter(w => w.parent_workflow_id);
  
  // Build workflows with their runs and subworkflows
  const workflows = await Promise.all(parentWorkflows.map(async (workflow) => {
    // Get test runs for this workflow
    const testRunsResult = await pool.query(
      `SELECT * FROM test_run WHERE workflow_id = $1 ORDER BY start_ts`,
      [workflow.id]
    );
    
    // Get child workflows (subworkflows)
    const subworkflows = childWorkflows.filter(w => w.parent_workflow_id === workflow.id);
    
    // Build subworkflows with their runs
    const subworkflowsData = await Promise.all(subworkflows.map(async (subworkflow) => {
      const subworkflowRunsResult = await pool.query(
        `SELECT * FROM test_run WHERE workflow_id = $1 ORDER BY start_ts`,
        [subworkflow.id]
      );
      
      const runsWithExecutions = await Promise.all(subworkflowRunsResult.rows.map(run => formatTestRun(run)));
      
      return {
        id: subworkflow.id,
        name: subworkflow.name,
        description: subworkflow.meta_info?.description || '',
        createdAt: subworkflow.created_ts,
        updatedAt: subworkflow.created_ts,
        runCount: subworkflowRunsResult.rows.length,
        runs: runsWithExecutions
      };
    }));
    
    const runsWithExecutions = await Promise.all(testRunsResult.rows.map(run => formatTestRun(run)));
    
    return {
      id: workflow.id,
      name: workflow.name,
      description: workflow.meta_info?.description || '',
      createdAt: workflow.created_ts,
      updatedAt: workflow.created_ts,
      runCount: testRunsResult.rows.length,
      subworkflowCount: subworkflowsData.length,
      runs: runsWithExecutions,
      subworkflows: subworkflowsData
    };
  }));
  
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    createdAt: project.created_ts,
    updatedAt: project.created_ts,
    workflowCount: workflows.length,
    workflows: workflows
  };
}

// Helper function to format test run data to match frontend expectations
async function formatTestRun(testRun) {
  // Get all executions for this run with their responses
  const executionsResult = await pool.query(
    `SELECT te.*, tr.output 
     FROM test_execution te
     LEFT JOIN test_response tr ON tr.test_execution_id = te.id
     WHERE te.run_id = $1
     ORDER BY te.execution_ts`,
    [testRun.id]
  );
  
  // For each execution, get its evaluations
  const executionsWithEvaluations = await Promise.all(executionsResult.rows.map(async (execution) => {
    const evaluationsResult = await pool.query(
      'SELECT * FROM evaluation WHERE test_execution_id = $1',
      [execution.id]
    );
    
    // Build evaluation metrics object - each metric becomes a property
    const metrics = {};
    evaluationsResult.rows.forEach(evalRow => {
      if (evalRow.metric_name) {
        metrics[evalRow.metric_name] = {
          value: parseFloat(evalRow.metric_value) || 0,
          reason: evalRow.metric_reason || ''
        };
      }
    });
    
    // Return execution data that matches actual DB schema
    return {
      id: execution.id,
      runId: execution.run_id,
      workflowId: execution.workflow_id,
      sessionId: execution.session_id,
      parentExecutionId: execution.parent_execution_id,
      input: execution.input,
      expectedOutput: execution.expected_output,
      output: execution.output,
      duration: parseFloat(execution.duration) || 0,
      totalTokens: execution.total_tokens || 0,
      executionTs: execution.execution_ts,
      creationTs: execution.creation_ts,
      ...metrics  // Add all evaluation metrics as top-level properties
    };
  }));
  
  return {
    id: testRun.id,
    workflowId: testRun.workflow_id,
    startTs: testRun.start_ts,
    finishTs: testRun.finish_ts,
    creationTs: testRun.creation_ts,
    version: `run_${testRun.id}`,
    questionCount: executionsWithEvaluations.length,
    runs: executionsWithEvaluations,
    questions: executionsWithEvaluations  // Keep both for backwards compatibility
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

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// Get all projects with full hierarchy
app.get('/api/projects', async (req, res) => {
  try {
    const projectsResult = await pool.query('SELECT * FROM project ORDER BY created_ts');
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
      'SELECT * FROM test_run WHERE workflow_id = $1 ORDER BY start_ts',
      [req.params.workflowId]
    );
    const runs = await Promise.all(result.rows.map(run => formatTestRun(run)));
    res.json(runs);
  } catch (error) {
    console.error('Error fetching workflow runs:', error);
    res.status(500).json({ error: 'Failed to fetch workflow runs' });
  }
});

// Get all runs for a specific subworkflow
app.get('/api/subworkflows/:subworkflowId/runs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM test_run WHERE workflow_id = $1 ORDER BY start_ts',
      [req.params.subworkflowId]
    );
    const runs = await Promise.all(result.rows.map(run => formatTestRun(run)));
    res.json(runs);
  } catch (error) {
    console.error('Error fetching subworkflow runs:', error);
    res.status(500).json({ error: 'Failed to fetch subworkflow runs' });
  }
});

// Get a specific run by ID
app.get('/api/runs/:runId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM test_run WHERE id = $1',
      [req.params.runId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Run not found' });
    }
    const run = await formatTestRun(result.rows[0]);
    res.json(run);
  } catch (error) {
    console.error('Error fetching run:', error);
    res.status(500).json({ error: 'Failed to fetch run' });
  }
});

// Create a new project
app.post('/api/projects', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const result = await pool.query(
      'INSERT INTO project (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
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
    const { project_id, parent_workflow_id, name, meta_info } = req.body;
    
    const result = await pool.query(
      'INSERT INTO workflow (project_id, parent_workflow_id, name, meta_info) VALUES ($1, $2, $3, $4) RETURNING *',
      [project_id, parent_workflow_id, name, meta_info]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// Create a new subworkflow (handled as a child workflow in new schema)
app.post('/api/subworkflows', async (req, res) => {
  try {
    const { workflow_id, name, description } = req.body;
    
    const result = await pool.query(
      'INSERT INTO workflow (project_id, parent_workflow_id, name, meta_info) SELECT project_id, $1, $2, $3 FROM workflow WHERE id = $1 RETURNING *',
      [workflow_id, name, JSON.stringify({ description })]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating subworkflow:', error);
    res.status(500).json({ error: 'Failed to create subworkflow' });
  }
});

// Create a new run (test_run with executions)
app.post('/api/runs', async (req, res) => {
  try {
    const {
      workflow_id, start_ts, finish_ts, executions
    } = req.body;
    
    // Create test_run
    const runResult = await pool.query(
      `INSERT INTO test_run (workflow_id, start_ts, finish_ts) 
       VALUES ($1, $2, $3) RETURNING *`,
      [workflow_id, start_ts || new Date(), finish_ts]
    );
    
    const runId = runResult.rows[0].id;
    
    // Create test_executions if provided
    if (executions && executions.length > 0) {
      for (const exec of executions) {
        const execResult = await pool.query(
          `INSERT INTO test_execution (
            run_id, workflow_id, session_id, parent_execution_id,
            input, expected_output, duration, total_tokens, execution_ts
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          [
            runId, exec.workflow_id || workflow_id, exec.session_id,
            exec.parent_execution_id, exec.input, exec.expected_output,
            exec.duration, exec.total_tokens, exec.execution_ts || new Date()
          ]
        );
        
        const execId = execResult.rows[0].id;
        
        // Create test_response if output provided
        if (exec.output) {
          await pool.query(
            'INSERT INTO test_response (test_execution_id, output) VALUES ($1, $2)',
            [execId, exec.output]
          );
        }
        
        // Create evaluations if provided
        if (exec.evaluations) {
          for (const evalData of exec.evaluations) {
            await pool.query(
              `INSERT INTO evaluation (
                test_execution_id, type, metric_name, metric_value, metric_reason
              ) VALUES ($1, $2, $3, $4, $5)`,
              [execId, evalData.type, evalData.metric_name, evalData.metric_value, evalData.metric_reason]
            );
          }
        }
      }
    }
    
    const formattedRun = await formatTestRun(runResult.rows[0]);
    res.status(201).json(formattedRun);
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
