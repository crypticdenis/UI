import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3001;

// Hardcoded project name
const PROJECT_NAME = 'RE Butler Evaluation';

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

// Helper function to format test run data
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
    
    // Return execution data
    return {
      id: execution.id,
      runId: execution.run_id,
      sessionId: execution.session_id,
      parentExecutionId: execution.parent_execution_id,
      subworkflowRunId: execution.subworkflow_run_id,
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
    parentRunId: testRun.parent_run_id,
    startTs: testRun.start_ts,
    finishTs: testRun.finish_ts,
    creationTs: testRun.creation_ts,
    version: `run_${testRun.id}`,
    questionCount: executionsWithEvaluations.length,
    runs: executionsWithEvaluations,
    questions: executionsWithEvaluations  // Keep both for backwards compatibility
  };
}

// Helper function to build workflow hierarchy
async function buildWorkflowHierarchy(workflowId) {
  // Get all runs for this workflow (where parent_run_id is NULL for main runs)
  const mainRunsResult = await pool.query(
    'SELECT * FROM test_run WHERE workflow_id = $1 AND parent_run_id IS NULL ORDER BY start_ts',
    [workflowId]
  );
  
  // Format each run with its executions
  const runsWithExecutions = await Promise.all(mainRunsResult.rows.map(run => formatTestRun(run)));
  
  // Get subworkflow runs (runs where parent_run_id points to any of the main runs)
  const mainRunIds = mainRunsResult.rows.map(r => r.id);
  
  let subworkflows = [];
  if (mainRunIds.length > 0) {
    const subRunsResult = await pool.query(
      'SELECT DISTINCT workflow_id FROM test_run WHERE parent_run_id = ANY($1::int[])',
      [mainRunIds]
    );
    
    // For each unique subworkflow_id, get its runs
    subworkflows = await Promise.all(subRunsResult.rows.map(async (subRow) => {
      const subworkflowId = subRow.workflow_id;
      const subRunsForWorkflow = await pool.query(
        'SELECT * FROM test_run WHERE workflow_id = $1 AND parent_run_id = ANY($2::int[]) ORDER BY start_ts',
        [subworkflowId, mainRunIds]
      );
      
      const subRunsFormatted = await Promise.all(subRunsForWorkflow.rows.map(run => formatTestRun(run)));
      
      return {
        id: subworkflowId,
        name: subworkflowId.replace(/_/g, ' '),  // Format workflow name
        runCount: subRunsFormatted.length,
        runs: subRunsFormatted
      };
    }));
  }
  
  return {
    id: workflowId,
    name: workflowId.replace(/_/g, ' '),  // Format workflow name
    runCount: runsWithExecutions.length,
    subworkflowCount: subworkflows.length,
    runs: runsWithExecutions,
    subworkflows: subworkflows
  };
}

// Helper function to build full project structure
async function buildProjectStructure() {
  // Get all unique main workflow IDs (runs with no parent)
  const workflowsResult = await pool.query(
    'SELECT DISTINCT workflow_id FROM test_run WHERE parent_run_id IS NULL ORDER BY workflow_id'
  );
  
  // Build each workflow with its hierarchy
  const workflows = await Promise.all(
    workflowsResult.rows.map(row => buildWorkflowHierarchy(row.workflow_id))
  );
  
  return {
    id: 1,
    name: PROJECT_NAME,
    description: 'Evaluation results and testing workflows',
    workflowCount: workflows.length,
    workflows: workflows
  };
}

// API Routes

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
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

// Get all projects (returns single hardcoded project with all workflows)
app.get('/api/projects', async (req, res) => {
  try {
    const project = await buildProjectStructure();
    res.json([project]);  // Return as array for compatibility
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project (always returns the hardcoded project)
app.get('/api/projects/:projectId', async (req, res) => {
  try {
    const project = await buildProjectStructure();
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
      'SELECT * FROM test_run WHERE workflow_id = $1 AND parent_run_id IS NULL ORDER BY start_ts',
      [req.params.workflowId]
    );
    const runs = await Promise.all(result.rows.map(run => formatTestRun(run)));
    res.json(runs);
  } catch (error) {
    console.error('Error fetching workflow runs:', error);
    res.status(500).json({ error: 'Failed to fetch workflow runs' });
  }
});

// Get all runs for a specific subworkflow (filtered by parent_run_id)
app.get('/api/subworkflows/:subworkflowId/runs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM test_run WHERE workflow_id = $1 AND parent_run_id IS NOT NULL ORDER BY start_ts',
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

// Create a new run (with optional parent_run_id for subworkflows)
app.post('/api/runs', async (req, res) => {
  try {
    const {
      workflow_id, parent_run_id, start_ts, finish_ts, executions
    } = req.body;
    
    // Create test_run
    const runResult = await pool.query(
      `INSERT INTO test_run (workflow_id, parent_run_id, start_ts, finish_ts) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [workflow_id, parent_run_id || null, start_ts || new Date(), finish_ts]
    );
    
    const runId = runResult.rows[0].id;
    
    // Create test_executions if provided
    if (executions && executions.length > 0) {
      for (const exec of executions) {
        const execResult = await pool.query(
          `INSERT INTO test_execution (
            run_id, session_id, parent_execution_id, subworkflow_run_id,
            input, expected_output, duration, total_tokens, execution_ts
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          [
            runId, exec.session_id, exec.parent_execution_id, exec.subworkflow_run_id,
            exec.input, exec.expected_output, exec.duration, exec.total_tokens,
            exec.execution_ts || new Date()
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

// Create a subworkflow run (convenience endpoint)
app.post('/api/runs/:parentRunId/subworkflow', async (req, res) => {
  try {
    const { parentRunId } = req.params;
    const { workflow_id, start_ts, finish_ts, executions } = req.body;
    
    // Create test_run with parent_run_id set
    const runResult = await pool.query(
      `INSERT INTO test_run (workflow_id, parent_run_id, start_ts, finish_ts) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [workflow_id, parentRunId, start_ts || new Date(), finish_ts]
    );
    
    const runId = runResult.rows[0].id;
    
    // Create executions if provided (same logic as above)
    if (executions && executions.length > 0) {
      for (const exec of executions) {
        const execResult = await pool.query(
          `INSERT INTO test_execution (
            run_id, session_id, parent_execution_id, subworkflow_run_id,
            input, expected_output, duration, total_tokens, execution_ts
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          [
            runId, exec.session_id, exec.parent_execution_id, exec.subworkflow_run_id,
            exec.input, exec.expected_output, exec.duration, exec.total_tokens,
            exec.execution_ts || new Date()
          ]
        );
        
        const execId = execResult.rows[0].id;
        
        if (exec.output) {
          await pool.query(
            'INSERT INTO test_response (test_execution_id, output) VALUES ($1, $2)',
            [execId, exec.output]
          );
        }
        
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
    console.error('Error creating subworkflow run:', error);
    res.status(500).json({ error: 'Failed to create subworkflow run', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`📁 Project: ${PROJECT_NAME}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end();
  process.exit(0);
});
