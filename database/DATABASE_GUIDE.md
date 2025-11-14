# Database Structure & Data Flow Guide

## Overview

RE Butler Evaluation uses a simplified 4-table database schema without project or workflow tables. Each workflow is tested independently with its own test runs, and subworkflow calls during execution are tracked via `parent_execution_id` for debugging purposes only. The dashboard displays only direct test runs (where `parent_execution_id IS NULL`).

**Key Principles:**
- **Separate Testing**: Each workflow (e.g., "RE_Butler", "RAG_Search") has its own independent test runs
- **No Workflow Hierarchy in Runs**: There is no `parent_run_id` - all runs are top-level
- **Sub-Executions for Debugging**: When a workflow calls a subworkflow during execution, the spawned execution has `parent_execution_id` set
- **Dashboard Shows Direct Tests Only**: Sub-executions are hidden from the UI, used only for technical analysis

---

## Database Schema

**Namespace**: All tables use the `evaluation` schema namespace for organization.

### Core Tables

#### 1. `evaluation.test_run` - Test Run Records
The central table representing independent workflow test runs.

```sql
CREATE TABLE evaluation.test_run (
    id SERIAL PRIMARY KEY,
    workflow_id VARCHAR(255),
    start_ts TIMESTAMP,
    finish_ts TIMESTAMP,
    creation_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Concepts:**
- **Independent Runs**: Each workflow is tested separately with its own dedicated test questions
- **No Hierarchy**: All runs are top-level; no `parent_run_id` field
- **Workflow ID**: Simple string identifier (e.g., "RE_Butler", "RAG_Search")

**Example Data:**
```
id | workflow_id  | start_ts             
---+--------------+----------------------
1  | RE_Butler    | 2025-11-13 10:00:00  (7 test questions)
2  | RE_Butler    | 2025-11-13 11:00:00  (7 test questions, different model)
3  | RAG_Search   | 2025-11-13 14:00:00  (5 test questions)
```

**Important**: "RE_Butler" and "RAG_Search" are tested independently. If RE_Butler *calls* RAG_Search during execution, that's tracked in `test_execution.parent_execution_id`, NOT here.

---

#### 2. `evaluation.test_execution` - Individual Test Executions
Represents individual test cases/questions within a run.

```sql
CREATE TABLE evaluation.test_execution (
    id SERIAL PRIMARY KEY,
    run_id INTEGER REFERENCES evaluation.test_run(id) ON DELETE CASCADE,
    workflow_id VARCHAR(255),
    session_id VARCHAR(255),
    parent_execution_id INTEGER REFERENCES evaluation.test_execution(id),  -- For sub-executions (debugging only)
    input TEXT,
    expected_output TEXT,
    duration NUMERIC(7,2),
    total_tokens INTEGER,
    creation_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Fields:**
- **`run_id`**: Which test run this execution belongs to
- **`parent_execution_id`**: If this execution was triggered by another execution (e.g., RAG call during RE_Butler execution). **NULL for direct tests**
- **`input`**: The test question/prompt
- **`expected_output`**: Expected result for comparison

**Example - Run 1 (RE_Butler, 7 direct test questions):**
```
id | run_id | input                          | parent_execution_id
---+--------+--------------------------------+--------------------
1  | 1      | What is AI?                    | NULL  (direct test)
2  | 1      | Explain machine learning       | NULL  (direct test)
3  | 1      | What are neural networks?      | NULL  (direct test)
...
```

**Example - Sub-Execution (triggered during Run 1, hidden from dashboard):**
```
id | run_id | input                          | parent_execution_id
---+--------+--------------------------------+--------------------
20 | 1      | RAG: Find ML definitions       | 2     (spawned by execution #2, NOT shown in UI)
```

**Example - Run 3 (RAG_Search, 5 direct test questions):**
```
id | run_id | input                          | parent_execution_id
---+--------+--------------------------------+--------------------
15 | 3      | Find ML documents              | NULL  (direct test of RAG_Search)
16 | 3      | Search neural network papers   | NULL  (direct test of RAG_Search)
...
```

---

#### 3. `evaluation.test_response` - Execution Outputs
Stores the actual output/response from each execution.

```sql
CREATE TABLE evaluation.test_response (
    id SERIAL PRIMARY KEY,
    test_execution_id INTEGER REFERENCES evaluation.test_execution(id) ON DELETE CASCADE,
    actual_output TEXT,
    creation_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

#### 4. `evaluation.evaluation` - Evaluation Metrics
Stores evaluation results with flexible metric names.

```sql
CREATE TABLE evaluation.evaluation (
    id SERIAL PRIMARY KEY,
    test_execution_id INTEGER REFERENCES evaluation.test_execution(id) ON DELETE CASCADE,
    workflow_id VARCHAR(32) DEFAULT 'REG_TEST',
    metric_name VARCHAR(64),       -- e.g., "accuracy", "relevance", "hallucination_rate"
    metric_value NUMERIC(7,2),     -- Numeric score
    metric_reason TEXT,            -- Explanation/reasoning
    creation_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

### Application Structure

```
Project (Hardcoded: "RE Butler Evaluation")
│
├── Workflow: RE_Butler (Independent Testing)
│   ├── run_1 (test_run.id=1) - 7 test questions
│   │   ├── execution 1: "What is AI?" (parent_execution_id=NULL) ← Shown in dashboard
│   │   ├── execution 2: "Explain ML" (parent_execution_id=NULL) ← Shown in dashboard
│   │   │   └── execution 20: "RAG: Find ML defs" (parent_execution_id=2) ← Hidden (debugging only)
│   │   ├── execution 3-7: More questions (parent_execution_id=NULL) ← Shown in dashboard
│   │
│   ├── run_2 (test_run.id=2) - 7 test questions (different model)
│       ├── executions 8-13: (parent_execution_id=NULL) ← Shown in dashboard
│       └── execution 21: "RAG: Search CV" (parent_execution_id=13) ← Hidden (debugging only)
│
└── Workflow: RAG_Search (Separate Independent Testing)
    └── run_3 (test_run.id=3) - 5 dedicated RAG test questions
        ├── execution 15: "Find ML documents" (parent_execution_id=NULL) ← Shown in dashboard
        ├── execution 16: "Search NN papers" (parent_execution_id=NULL) ← Shown in dashboard
        └── executions 17-19: More RAG tests (parent_execution_id=NULL) ← Shown in dashboard
```

**Key Points:**
1. **RE_Butler** and **RAG_Search** are tested independently with their own test runs
2. When RE_Butler **execution #2** needs RAG during runtime, it creates **execution #20** with `parent_execution_id=2`
3. Execution #20 is **NOT shown in the dashboard** - it's for debugging only
4. RAG_Search is properly tested in **run_3** with 5 dedicated test questions
5. Dashboard shows only `WHERE parent_execution_id IS NULL`

---

## Data Querying & Filtering

### 1. Get All Workflows

```sql
SELECT DISTINCT workflow_id 
FROM evaluation.test_run 
ORDER BY workflow_id;
```

Result: `RAG_Search`, `RE_Butler`

---

### 2. Get All Runs for a Workflow

```sql
SELECT * FROM evaluation.test_run 
WHERE workflow_id = 'RE_Butler' 
ORDER BY start_ts;
```

Result: All test runs for RE_Butler workflow

---

### 3. Get Direct Test Executions (Shown in Dashboard)

```sql
SELECT te.*, tr.output 
FROM test_execution te
LEFT JOIN test_response tr ON tr.test_execution_id = te.id
WHERE te.run_id = 1 
AND te.parent_execution_id IS NULL
ORDER BY te.execution_ts;
```

Result: Only the 7 direct test questions for run_1 (execution #20 is excluded)

---

### 4. Get Complete Run Data (ONLY Direct Tests for Dashboard)

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
WHERE te.run_id = 1 AND te.parent_execution_id IS NULL
ORDER BY te.execution_ts, e.metric_name;
```

**Important**: `WHERE te.parent_execution_id IS NULL` excludes sub-executions from dashboard.

---

### 5. Find Sub-Executions (For Debugging, Not Shown in UI)

```sql
SELECT 
    te.id,
    te.input,
    te.run_id,
    parent_te.id as parent_execution_id,
    parent_te.input as parent_input
FROM test_execution te
JOIN test_execution parent_te ON te.parent_execution_id = parent_te.id
WHERE te.parent_execution_id IS NOT NULL;
```

Result: Shows which executions were spawned during other executions (e.g., RAG calls)

---

### 6. Count Direct vs Sub-Executions

```sql
SELECT 
    run_id,
    COUNT(*) FILTER (WHERE parent_execution_id IS NULL) as direct_tests,
    COUNT(*) FILTER (WHERE parent_execution_id IS NOT NULL) as sub_executions
FROM test_execution
GROUP BY run_id;
```

Result: 
```
run_id | direct_tests | sub_executions
-------+--------------+----------------
1      | 7            | 1              (7 shown in UI, 1 hidden)
2      | 7            | 1
3      | 5            | 0              (RAG_Search has no sub-executions)
```

---

## Application Data Flow

### Backend API (`server/server.js`)

#### Data Transformation Pipeline

1. **Fetch All Workflows**
   ```javascript
   SELECT DISTINCT workflow_id 
   FROM test_run 
   ORDER BY workflow_id
   ```

2. **For Each Workflow, Get All Runs**
   ```javascript
   SELECT * FROM test_run 
   WHERE workflow_id = ? 
   ORDER BY start_ts
   ```

3. **For Each Run, Get ONLY Direct Executions (Dashboard Display)**
   ```javascript
   SELECT te.*, tr.output 
   FROM test_execution te
   LEFT JOIN test_response tr ON tr.test_execution_id = te.id
   WHERE te.run_id = ? AND te.parent_execution_id IS NULL
   ORDER BY te.execution_ts
   ```
   
   **Critical**: `AND te.parent_execution_id IS NULL` filters out sub-executions

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
   ├─ RAG Search (1 run)
   │  └─ run_3
   └─ RE Butler (2 runs)
      ├─ run_1
      └─ run_2
```

**Navigation Logic:**
- Click workflow → Shows test runs as cards
- Click run → Shows execution details table (only executions where parent_execution_id IS NULL)

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
