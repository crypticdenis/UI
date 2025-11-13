# Database Structure & Data Flow Guide

## Overview

RE Butler Evaluation uses a simplified database schema without project or workflow tables, relying on a single hardcoded project ("RE Butler Evaluation") and string-based workflow identifiers. This guide explains how data is structured, queried, filtered, compared, and displayed in the application.

---

## Database Schema

### Core Tables

#### 1. `test_run` - Test Run Records
The central table representing workflow executions.

```sql
CREATE TABLE test_run (
    id SERIAL PRIMARY KEY,
    workflow_id VARCHAR(255) NOT NULL,        -- String identifier (e.g., "QA_Evaluation")
    parent_run_id INTEGER REFERENCES test_run(id),  -- NULL for main workflows, set for subworkflows
    start_ts TIMESTAMP,
    finish_ts TIMESTAMP,
    creation_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Concepts:**
- **Main Workflow Run**: `parent_run_id = NULL` (e.g., QA_Evaluation runs)
- **Subworkflow Run**: `parent_run_id` references a parent run (e.g., Prompt_Tuning linked to QA_Evaluation)
- **Workflow ID**: Simple string identifier, no separate workflow table needed

**Example Data:**
```
id | workflow_id      | parent_run_id
---+------------------+--------------
1  | QA_Evaluation    | NULL          (main workflow run)
2  | QA_Evaluation    | NULL          (main workflow run)
3  | QA_Evaluation    | NULL          (main workflow run)
4  | Prompt_Tuning    | 1             (subworkflow of run 1)
5  | Prompt_Tuning    | 1             (subworkflow of run 1)
6  | Model_Comparison | 2             (subworkflow of run 2)
```

---

#### 2. `test_execution` - Individual Test Executions
Represents individual test cases/questions within a run.

```sql
CREATE TABLE test_execution (
    id SERIAL PRIMARY KEY,
    run_id INTEGER REFERENCES test_run(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    parent_execution_id INTEGER REFERENCES test_execution(id),
    subworkflow_run_id INTEGER REFERENCES test_run(id),  -- Links to spawned subworkflow
    input TEXT,
    expected_output TEXT,
    duration NUMERIC,
    total_tokens INTEGER,
    execution_ts TIMESTAMP,
    creation_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Fields:**
- **`run_id`**: Which test run this execution belongs to
- **`subworkflow_run_id`**: If this execution spawned a subworkflow, references the subworkflow's run ID
- **`input`**: The test question/prompt
- **`expected_output`**: Expected result for comparison
- **`parent_execution_id`**: For nested/hierarchical executions

**Example:**
```
id | run_id | input                   | subworkflow_run_id
---+--------+-------------------------+-------------------
1  | 1      | What is AI?             | 4    (spawned Prompt_Tuning run 4)
2  | 1      | Define Machine Learning | NULL
3  | 1      | Explain Neural Networks | NULL
4  | 2      | What is AI?             | NULL
5  | 2      | Define Machine Learning | 6    (spawned Model_Comparison run 6)
```

---

#### 3. `test_response` - Execution Outputs
Stores the actual output/response from each execution.

```sql
CREATE TABLE test_response (
    id SERIAL PRIMARY KEY,
    test_execution_id INTEGER REFERENCES test_execution(id) ON DELETE CASCADE,
    output TEXT
);
```

---

#### 4. `evaluation` - Evaluation Metrics
Stores evaluation results with flexible metric names.

```sql
CREATE TABLE evaluation (
    id SERIAL PRIMARY KEY,
    test_execution_id INTEGER REFERENCES test_execution(id) ON DELETE CASCADE,
    type VARCHAR(255),
    metric_name VARCHAR(255),      -- e.g., "accuracy", "relevance", "hallucination_rate"
    metric_value NUMERIC,          -- Numeric score
    metric_reason TEXT,            -- Explanation/reasoning
    creation_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Dynamic Metrics:**
Multiple evaluations can exist per execution with different metric names.

**Example:**
```
id | test_execution_id | metric_name | metric_value | metric_reason
---+-------------------+-------------+--------------+--------------------------------
1  | 1                 | accuracy    | 0.85         | Good coverage of key concepts
2  | 1                 | relevance   | 0.90         | Highly relevant to the question
3  | 2                 | accuracy    | 0.78         | Covers main points but lacks depth
4  | 2                 | relevance   | 0.88         | Relevant explanation
```

---

## Hierarchy & Relationships

### Workflow Hierarchy

```
Project (Hardcoded: "RE Butler Evaluation")
│
├── Workflow: QA_Evaluation (main)
│   ├── run_1 (test_run.id=1, parent_run_id=NULL)
│   │   ├── execution 1: "What is AI?" → spawned → run_4 (Prompt_Tuning)
│   │   ├── execution 2: "Define Machine Learning"
│   │   └── execution 3: "Explain Neural Networks"
│   │
│   ├── run_2 (test_run.id=2, parent_run_id=NULL)
│   │   ├── execution 4: "What is AI?"
│   │   ├── execution 5: "Define Machine Learning" → spawned → run_6 (Model_Comparison)
│   │   └── execution 6: "Explain Neural Networks"
│   │
│   └── run_3 (test_run.id=3, parent_run_id=NULL)
│       └── executions 7-9: Same questions
│
├── Subworkflow: Prompt_Tuning (linked to run_1)
│   ├── run_4 (test_run.id=4, parent_run_id=1)
│   │   └── executions 10-11: Tuned prompt variations
│   │
│   └── run_5 (test_run.id=5, parent_run_id=1)
│       └── executions 12-13: More tuned variations
│
└── Subworkflow: Model_Comparison (linked to run_2)
    └── run_6 (test_run.id=6, parent_run_id=2)
        └── execution 14: GPT-4 comparison
```

---

## Data Querying & Filtering

### 1. Get All Main Workflows

```sql
SELECT DISTINCT workflow_id 
FROM test_run 
WHERE parent_run_id IS NULL 
ORDER BY workflow_id;
```

Result: `QA_Evaluation`

---

### 2. Get All Runs for a Workflow

**Main workflow runs:**
```sql
SELECT * FROM test_run 
WHERE workflow_id = 'QA_Evaluation' 
AND parent_run_id IS NULL 
ORDER BY start_ts;
```

**Subworkflow runs:**
```sql
SELECT * FROM test_run 
WHERE workflow_id = 'Prompt_Tuning' 
AND parent_run_id IS NOT NULL 
ORDER BY start_ts;
```

---

### 3. Get Subworkflows for a Main Run

```sql
SELECT * FROM test_run 
WHERE parent_run_id = 1;
```

Result: All subworkflow runs that were spawned from run_1

---

### 4. Get Complete Run Data (with Executions & Evaluations)

```sql
SELECT 
    te.id,
    te.input,
    te.expected_output,
    tr.output,
    te.duration,
    te.total_tokens,
    te.execution_ts,
    e.metric_name,
    e.metric_value,
    e.metric_reason
FROM test_execution te
LEFT JOIN test_response tr ON tr.test_execution_id = te.id
LEFT JOIN evaluation e ON e.test_execution_id = te.id
WHERE te.run_id = 1
ORDER BY te.execution_ts, e.metric_name;
```

---

### 5. Get All Evaluations for a Run and Its Subworkflows

```sql
SELECT e.*, te.input, tr.workflow_id
FROM evaluation e
JOIN test_execution te ON e.test_execution_id = te.id
JOIN test_run tr ON te.run_id = tr.id
WHERE tr.id = 1 OR tr.parent_run_id = 1;
```

This gives you evaluations from both the main run and any spawned subworkflows.

---

### 6. Find Which Execution Spawned a Subworkflow

```sql
SELECT 
    te.id,
    te.input,
    te.run_id,
    sw.workflow_id as spawned_workflow,
    sw.id as spawned_run_id
FROM test_execution te
JOIN test_run sw ON te.subworkflow_run_id = sw.id
WHERE te.subworkflow_run_id = 4;
```

Result: Shows execution #1 from run_1 spawned Prompt_Tuning run #4

---

## Application Data Flow

### Backend API (`server/server.js`)

#### Data Transformation Pipeline

1. **Fetch Main Workflows**
   ```javascript
   SELECT DISTINCT workflow_id 
   FROM test_run 
   WHERE parent_run_id IS NULL
   ```

2. **For Each Workflow, Get Runs**
   ```javascript
   SELECT * FROM test_run 
   WHERE workflow_id = ? AND parent_run_id IS NULL
   ```

3. **For Each Run, Get Executions with Responses**
   ```javascript
   SELECT te.*, tr.output 
   FROM test_execution te
   LEFT JOIN test_response tr ON tr.test_execution_id = te.id
   WHERE te.run_id = ?
   ```

4. **For Each Execution, Get Evaluations**
   ```javascript
   SELECT * FROM evaluation 
   WHERE test_execution_id = ?
   ```

5. **Transform to Flat Structure**
   ```javascript
   {
     id: execution.id,
     input: execution.input,
     output: execution.output,
     duration: execution.duration,
     accuracy: { value: 0.85, reason: "..." },  // From evaluation
     relevance: { value: 0.90, reason: "..." }  // From evaluation
   }
   ```

---

### Frontend Display

#### 1. Navigation Sidebar

**Structure:**
```
RE Butler Evaluation (hardcoded)
├─ Workflows
   └─ QA Evaluation (3 runs)
      ├─ run_1 ←─── Main workflow runs
      ├─ run_2
      ├─ run_3
      ├─ Model Comparison (1 run) ←─── Subworkflows
      │  └─ run_6
      └─ Prompt Tuning (2 runs)
         ├─ run_4
         └─ run_5
```

**Navigation Logic:**
- Click workflow → Shows main runs as cards
- Click main run → Shows execution details table
- Click subworkflow → Shows subworkflow runs as cards
- Click subworkflow run → Shows execution details table

---

#### 2. Runs Overview (Cards)

**Data Source:** `workflow.runs[]`

**Display:**
- Each card = one test_run
- Shows: version (run_1, run_2, etc.), start/finish times, execution count
- Dynamically calculates average scores from all executions

**Filtering:**
```javascript
const filteredRuns = runs.filter(run => {
  const matchesVersion = !filters.version || run.version === filters.version;
  const matchesSearch = !searchQuery || 
    run.version.toLowerCase().includes(searchQuery) ||
    run.workflowId.toLowerCase().includes(searchQuery);
  return matchesVersion && matchesSearch;
});
```

---

#### 3. Run Details Table

**Data Source:** `run.runs[]` or `run.questions[]` (execution array)

**Dynamic Columns:**
- Fixed: ID, Input, Expected Output, Output, Duration, Tokens, Timestamp
- Dynamic: All metric fields from evaluations (accuracy, relevance, etc.)

**Column Detection:**
```javascript
// Detects all fields in execution objects
const allFields = Object.keys(executions[0] || {});

// Filters to display fields (skip internal IDs)
const displayFields = allFields.filter(field => 
  !['id', 'runId', 'workflowId', 'creationTs', 'parentExecutionId'].includes(field)
);
```

**Row Expansion:**
- Click ▶ button to expand row
- Shows ALL fields including long text and metric reasons
- Expandable text fields open in modal for full viewing

---

## Comparison Feature

### How Comparison Works

**Concept:** Compare the same question across different runs

**Matching Strategy:** By position/index within runs

```javascript
// Find base execution
const baseRun = allRuns.find(run => 
  run.runs.some(exec => exec.id === baseID)
);
const baseIndex = baseRun.runs.findIndex(exec => exec.id === baseID);

// Match executions at the same position across all runs
const matchingExecutions = allRuns.map(run => run.runs[baseIndex]);
```

**Example:**
- Position 0: "What is AI?" appears in run_1, run_2, run_3
- Click Compare on run_1's "What is AI?" → Shows all 3 versions side-by-side
- Compares: accuracy, relevance, duration, tokens, etc.

**Why position-based?**
- No `question_id` field in schema
- Input text could vary slightly (punctuation, phrasing)
- Position ensures consistent comparison of intended test cases

---

## Adding New Data

### 1. Create a New Main Workflow Run

```bash
POST /api/runs
{
  "workflow_id": "QA_Evaluation",
  "parent_run_id": null,
  "start_ts": "2025-11-13T16:00:00Z",
  "finish_ts": "2025-11-13T16:15:00Z",
  "executions": [
    {
      "input": "What is AI?",
      "expected_output": "AI is...",
      "output": "Artificial Intelligence is...",
      "duration": 2.5,
      "total_tokens": 150,
      "evaluations": [
        {
          "metric_name": "accuracy",
          "metric_value": 0.85,
          "metric_reason": "Good coverage"
        },
        {
          "metric_name": "relevance",
          "metric_value": 0.90,
          "metric_reason": "Highly relevant"
        }
      ]
    }
  ]
}
```

---

### 2. Create a Subworkflow Run

```bash
POST /api/runs
{
  "workflow_id": "Prompt_Tuning",
  "parent_run_id": 1,  // Links to main run
  "start_ts": "2025-11-13T16:20:00Z",
  "executions": [...]
}
```

---

### 3. Link Execution to Subworkflow

When inserting execution, set `subworkflow_run_id`:

```sql
INSERT INTO test_execution 
(run_id, input, subworkflow_run_id, ...) 
VALUES 
(1, 'What is AI?', 4, ...);
```

This indicates execution #1 spawned subworkflow run #4.

---

## Key Design Patterns

### 1. Dynamic Field Detection

The UI doesn't hardcode metric names. It discovers them from data:

```javascript
const allFields = executions.flatMap(exec => Object.keys(exec));
const uniqueFields = [...new Set(allFields)];
```

**Benefit:** Add new metrics (e.g., `coherence`, `factuality`) without code changes

---

### 2. Hierarchical Data Flattening

Backend flattens hierarchical structure for easy frontend consumption:

```javascript
// Database: execution → evaluations (1:many)
// API: execution with metrics as properties
{
  id: 1,
  input: "What is AI?",
  accuracy: { value: 0.85, reason: "..." },  // Flattened
  relevance: { value: 0.90, reason: "..." }  // Flattened
}
```

---

### 3. Traceability

Every relationship is traceable:

- **Run → Subworkflow:** `test_run.parent_run_id`
- **Execution → Subworkflow:** `test_execution.subworkflow_run_id`
- **Execution → Run:** `test_execution.run_id`
- **Evaluation → Execution:** `evaluation.test_execution_id`

**Use Case:** "Show me all work stemming from run_1"

```sql
-- Direct executions
SELECT * FROM test_execution WHERE run_id = 1;

-- Subworkflow runs
SELECT * FROM test_run WHERE parent_run_id = 1;

-- Subworkflow executions
SELECT te.* 
FROM test_execution te
JOIN test_run tr ON te.run_id = tr.id
WHERE tr.parent_run_id = 1;
```

---

## Common Queries

### Performance Comparison

```sql
SELECT 
    tr.workflow_id,
    tr.id as run_id,
    AVG(te.duration) as avg_duration,
    AVG(te.total_tokens) as avg_tokens,
    AVG(e.metric_value) FILTER (WHERE e.metric_name = 'accuracy') as avg_accuracy
FROM test_run tr
JOIN test_execution te ON te.run_id = tr.id
LEFT JOIN evaluation e ON e.test_execution_id = te.id
WHERE tr.workflow_id = 'QA_Evaluation' 
AND tr.parent_run_id IS NULL
GROUP BY tr.workflow_id, tr.id
ORDER BY tr.start_ts;
```

---

### Metric Distribution

```sql
SELECT 
    e.metric_name,
    MIN(e.metric_value) as min_value,
    MAX(e.metric_value) as max_value,
    AVG(e.metric_value) as avg_value,
    COUNT(*) as count
FROM evaluation e
JOIN test_execution te ON e.test_execution_id = te.id
WHERE te.run_id = 1
GROUP BY e.metric_name;
```

---

### Find Low-Scoring Executions

```sql
SELECT 
    te.id,
    te.input,
    e.metric_name,
    e.metric_value,
    e.metric_reason
FROM test_execution te
JOIN evaluation e ON e.test_execution_id = te.id
WHERE te.run_id = 1 
AND e.metric_value < 0.7
ORDER BY e.metric_value;
```

---

## Best Practices

### 1. Consistent Question Order
Keep executions in the same order across runs for position-based comparison.

### 2. Meaningful Workflow IDs
Use descriptive strings: `QA_Evaluation`, `Prompt_Tuning`, not `wf_001`.

### 3. Link Spawned Subworkflows
Always set `subworkflow_run_id` when an execution triggers deeper analysis.

### 4. Comprehensive Evaluations
Add multiple metrics per execution for richer analysis.

### 5. Timestamps
Use `execution_ts` for ordering, `creation_ts` for audit trails.

---

## Troubleshooting

### UI Not Showing Runs
- Check: `workflow.runs` array exists in API response
- Check: `parent_run_id IS NULL` for main workflow runs

### Comparison Shows Nothing
- Check: Executions at same position in different runs
- Check: `run.runs` or `run.questions` array populated

### Metrics Not Appearing
- Check: Evaluations exist for `test_execution_id`
- Check: `metric_name` is consistent across evaluations

### Subworkflows Not Linked
- Check: `parent_run_id` is set correctly
- Check: `subworkflow_run_id` references valid run

---

## API Endpoints

### GET /api/projects
Returns single hardcoded project with all workflows and runs.

### GET /api/workflows/:workflowId/runs
Returns all main runs for a workflow (parent_run_id IS NULL).

### GET /api/subworkflows/:subworkflowId/runs
Returns all subworkflow runs (parent_run_id IS NOT NULL).

### GET /api/runs/:runId
Returns single run with all executions and evaluations.

### POST /api/runs
Creates new run with executions and evaluations.

### POST /api/runs/:parentRunId/subworkflow
Creates subworkflow run linked to parent.

---

## Files Reference

- **Schema:** `/database/schema_refactored.sql`
- **Mock Data:** `/database/mock_data_refactored.sql`
- **Server:** `/server/server.js`
- **Navigation:** `/src/components/NavigationSidebar.jsx`
- **Run Cards:** `/src/views/RunsOverview.jsx`
- **Run Details:** `/src/views/RunDetails.jsx`
- **Comparison:** `/src/views/QuestionComparison.jsx`
- **App Logic:** `/src/App.jsx`

---

## Summary

The RE Butler Evaluation system uses a simplified, flexible database design:

1. **No rigid hierarchy** - Workflows are strings, not foreign keys
2. **Dynamic metrics** - Add any evaluation metric without schema changes
3. **Traceable relationships** - parent_run_id and subworkflow_run_id create clear lineage
4. **Position-based comparison** - Compares same test case across runs by index
5. **Flat API structure** - Backend flattens complex joins for easy frontend consumption
6. **Single project** - Hardcoded "RE Butler Evaluation" simplifies navigation

This design prioritizes flexibility and ease of use over strict normalization.
