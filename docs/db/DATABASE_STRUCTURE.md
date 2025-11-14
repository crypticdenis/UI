# Butler Eval - Database Structure Guide

**Database**: `butler_eval`  
**Schema Namespace**: `evaluation`  
**Purpose**: Store and manage AI evaluation test runs with hierarchical execution tracking  
**Last Updated**: January 2025

---

## 📊 Quick Overview

### Current Schema
- **Schema**: `evaluation` (all tables namespaced)
- **4 Core Tables**: test_run, test_execution, test_response, evaluation
- **Dynamic Metrics**: Flexible metric_name/metric_value system
- **Hierarchical Executions**: Parent-child tracking via parent_execution_id

### Key Features
- **No Project/Workflow Tables**: Simplified flat structure
- **Independent Testing**: Each workflow tested separately
- **Sub-Execution Tracking**: For debugging subworkflow calls
- **Dynamic Metrics**: Add new metrics without schema changes
- **Timezone Support**: All timestamps use `TIMESTAMP WITH TIME ZONE`

---

## 🏗️ Table Structure

### Schema Organization

All tables use the `evaluation` namespace:
```
evaluation.test_run           -- Test run metadata
evaluation.test_execution     -- Individual executions (with hierarchy)
evaluation.test_response      -- Actual outputs
evaluation.evaluation         -- Dynamic metrics
```

### Hierarchy

```
evaluation.test_run (workflow test runs)
   ↓ 1:N
evaluation.test_execution (questions/tests)
   ├─→ 1:1 → evaluation.test_response (outputs)
   ├─→ 1:N → evaluation.evaluation (metrics)
   └─→ 0:N → evaluation.test_execution (sub-executions via parent_execution_id)
```

---

## 📋 Table Details

### 1. `evaluation.test_run` - Test Run Records

**Purpose**: Store test run metadata for workflows

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `workflow_id` | VARCHAR(255) | Workflow identifier (e.g., "RE_Butler", "RAG_Search") |
| `start_ts` | TIMESTAMP | Run start time |
| `finish_ts` | TIMESTAMP | Run completion time |
| `creation_ts` | TIMESTAMP WITH TIME ZONE | Creation timestamp (default NOW()) |

**Example Data**:
```sql
id | workflow_id  | start_ts             | finish_ts
---+--------------+----------------------+----------------------
1  | RE_Butler    | 2025-01-13 10:00:00  | 2025-01-13 10:15:00
2  | RE_Butler    | 2025-01-13 11:00:00  | 2025-01-13 11:18:00
3  | RAG_Search   | 2025-01-13 14:00:00  | 2025-01-13 14:10:00
```

**Key Points**:
- Each workflow tested independently
- No parent_run_id - all runs are top-level
- workflow_id is a simple string identifier

---

### 2. `evaluation.test_execution` - Test Executions

**Purpose**: Store individual test cases/questions and their execution details

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `run_id` | INTEGER | FK → evaluation.test_run(id) |
| `workflow_id` | VARCHAR(255) | Workflow identifier |
| `session_id` | VARCHAR(255) | Session identifier |
| `parent_execution_id` | INTEGER | FK → evaluation.test_execution(id) (NULL for direct tests) |
| `input` | TEXT | Test question/prompt |
| `expected_output` | TEXT | Expected result |
| `duration` | NUMERIC(7,2) | Execution time (seconds) |
| `total_tokens` | INTEGER | Token count |
| `creation_ts` | TIMESTAMP WITH TIME ZONE | Creation timestamp (default NOW()) |

**Key Points**:
- `parent_execution_id` = NULL for direct test questions (shown in dashboard)
- `parent_execution_id` = <id> for sub-executions (debugging only, hidden from UI)
- Supports hierarchical execution tracking

**Example Data**:
```sql
id | run_id | input               | parent_execution_id | Notes
---+--------+---------------------+---------------------+---------------------------
1  | 1      | What is AI?         | NULL                | Direct test (shown in UI)
2  | 1      | Explain ML          | NULL                | Direct test (shown in UI)
20 | 1      | RAG: Find ML defs   | 2                   | Sub-exec (hidden from UI)
```

---

### 3. `evaluation.test_response` - Execution Outputs

**Purpose**: Store actual outputs/responses from executions

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `test_execution_id` | INTEGER | FK → evaluation.test_execution(id) |
| `actual_output` | TEXT | The actual response/output |
| `creation_ts` | TIMESTAMP WITH TIME ZONE | Creation timestamp (default NOW()) |

**Key Points**:
- One response per execution
- Separated from execution table for clarity
- Note field name is `actual_output` not just `output`

---

### 4. `evaluation.evaluation` - Dynamic Metrics

**Purpose**: Store evaluation metrics with flexible naming

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `test_execution_id` | INTEGER | FK → evaluation.test_execution(id) |
| `workflow_id` | VARCHAR(32) | Workflow identifier (default 'REG_TEST') |
| `metric_name` | VARCHAR(64) | Metric name (e.g., "accuracy", "relevance") |
| `metric_value` | NUMERIC(7,2) | Numeric score |
| `metric_reason` | TEXT | Explanation/reasoning |
| `creation_ts` | TIMESTAMP WITH TIME ZONE | Creation timestamp (default NOW()) |

**Key Features**:
- **Multiple metrics per execution**: Unlimited evaluation criteria
- **Dynamic metric names**: Add new metrics without schema changes
- **Flexible values**: Supports any numeric range

**Example Data**:
```sql
id | test_execution_id | metric_name        | metric_value | metric_reason
---+-------------------+--------------------+--------------+-------------------------------
1  | 1                 | accuracy           | 0.85         | Correctly addresses main points
2  | 1                 | relevance          | 0.90         | Highly relevant to query
3  | 1                 | hallucination_rate | 0.15         | Minor factual inconsistencies
4  | 2                 | accuracy           | 0.78         | Covers basics but lacks depth
```

---

## 🔄 Data Flow

### How Data Flows Through the System

```
1. Test Execution
   ↓
2. Creates evaluation.test_run
   (workflow_id, timestamps)
   ↓
3. Creates evaluation.test_execution
   (input, expected_output, parent_execution_id)
   ↓
4. Creates evaluation.test_response
   (actual_output)
   ↓
5. Creates evaluation.evaluation (multiple rows)
   (accuracy, relevance, custom metrics)
   ↓
6. Backend queries and joins tables
   GET /api/workflows
   GET /api/runs/:workflowId
   GET /api/run-details/:id
   ↓
7. Frontend displays with dynamic metrics
```

---

## 🎯 How Backend Works

### Key Query Pattern

The backend uses `formatTestRun()` to build hierarchical structures:

```javascript
// Query execution with all related data
const execution = await pool.query(`
  SELECT 
    te.*,
    tr.actual_output,
    COALESCE(
      json_agg(
        json_build_object(
          'metric_name', e.metric_name,
          'metric_value', e.metric_value,
          'metric_reason', e.metric_reason
        )
      ) FILTER (WHERE e.id IS NOT NULL),
      '[]'
    ) as metrics
  FROM evaluation.test_execution te
  LEFT JOIN evaluation.test_response tr ON tr.test_execution_id = te.id
  LEFT JOIN evaluation.evaluation e ON e.test_execution_id = te.id
  WHERE te.parent_execution_id IS NULL
  GROUP BY te.id, tr.actual_output
`);

// Build nested subExecutions
for (const execution of executions) {
  execution.subExecutions = await getSubExecutions(execution.id);
}
```

### Dashboard Filtering

**Critical**: Only direct tests shown in UI:
```sql
WHERE parent_execution_id IS NULL
```

Sub-executions (where `parent_execution_id` is set) are used for debugging only.

---

## ➕ Adding New Metrics

### Step-by-Step Process

1. **Insert new metric rows**:
```sql
INSERT INTO evaluation.evaluation (test_execution_id, metric_name, metric_value, metric_reason)
VALUES 
  (1, 'coherence', 0.92, 'Logical flow and consistency'),
  (1, 'fluency', 0.88, 'Natural language quality');
```

2. **Frontend automatically detects**:
- No code changes needed
- UI reads metrics dynamically
- Formats names (e.g., `coherence` → "Coherence")
- Applies color coding for 0-1 scaled values

3. **Refresh frontend** - New metrics appear automatically!

---

## 🔍 Useful Queries

### View All Workflows
```sql
SELECT DISTINCT workflow_id 
FROM evaluation.test_run 
ORDER BY workflow_id;
```

### Get Runs for Workflow
```sql
SELECT * 
FROM evaluation.test_run 
WHERE workflow_id = 'RE_Butler' 
ORDER BY start_ts DESC;
```

### Get Executions with Metrics
```sql
SELECT 
    te.id,
    te.input,
    tr.actual_output,
    e.metric_name,
    e.metric_value,
    e.metric_reason
FROM evaluation.test_execution te
LEFT JOIN evaluation.test_response tr ON tr.test_execution_id = te.id
LEFT JOIN evaluation.evaluation e ON e.test_execution_id = te.id
WHERE te.run_id = 1 
  AND te.parent_execution_id IS NULL
ORDER BY te.id, e.metric_name;
```

### Average Metrics by Run
```sql
SELECT 
    tr.id as run_id,
    tr.workflow_id,
    e.metric_name,
    ROUND(AVG(e.metric_value)::numeric, 3) as avg_value,
    COUNT(*) as execution_count
FROM evaluation.test_run tr
JOIN evaluation.test_execution te ON te.run_id = tr.id
JOIN evaluation.evaluation e ON e.test_execution_id = te.id
WHERE te.parent_execution_id IS NULL
GROUP BY tr.id, tr.workflow_id, e.metric_name
ORDER BY tr.id, e.metric_name;
```

### Find Sub-Executions
```sql
SELECT 
    parent.id as parent_id,
    parent.input as parent_input,
    child.id as child_id,
    child.input as child_input,
    child.workflow_id as called_workflow
FROM evaluation.test_execution parent
JOIN evaluation.test_execution child ON child.parent_execution_id = parent.id
WHERE parent.run_id = 1;
```

---

## 🔐 Foreign Key Relationships

All relationships use **CASCADE DELETE**:

```
evaluation.test_run.id 
  ← evaluation.test_execution.run_id
     ← evaluation.test_response.test_execution_id
     ← evaluation.evaluation.test_execution_id

evaluation.test_execution.id 
  ← evaluation.test_execution.parent_execution_id (self-referencing)
```

**Example**:
```sql
DELETE FROM evaluation.test_run WHERE id = 1;
-- Also deletes:
--   - All test_execution rows with run_id = 1
--   - All test_response rows for those executions
--   - All evaluation rows for those executions
--   - All child executions (via parent_execution_id)
```

---

## 📦 Indexes

Optimized for common query patterns:

```sql
CREATE INDEX idx_test_run_workflow ON evaluation.test_run(workflow_id);
CREATE INDEX idx_test_execution_run ON evaluation.test_execution(run_id);
CREATE INDEX idx_test_execution_workflow ON evaluation.test_execution(workflow_id);
CREATE INDEX idx_test_execution_parent ON evaluation.test_execution(parent_execution_id);
CREATE INDEX idx_test_response_execution ON evaluation.test_response(test_execution_id);
CREATE INDEX idx_evaluation_execution ON evaluation.evaluation(test_execution_id);
CREATE INDEX idx_evaluation_metric ON evaluation.evaluation(metric_name);
```

---

## 🎨 Frontend Integration

### Dynamic Metric Detection

The frontend uses `metricUtils.js` to:
- Detect numeric fields (excluding IDs, duration, tokens)
- Format metric names (snake_case → Title Case)
- Apply color coding to 0-1 scaled metrics
- Display metric reasons when available

### Color Coding

| Score Range | Color | CSS Class |
|-------------|-------|-----------|
| 0.90 - 1.00 | Dark Green | `.metric-excellent` |
| 0.80 - 0.89 | Green | `.metric-good` |
| 0.70 - 0.79 | Light Green | `.metric-satisfactory` |
| 0.60 - 0.69 | Yellow | `.metric-acceptable` |
| 0.50 - 0.59 | Orange | `.metric-warning` |
| < 0.50 | Red | `.metric-poor` |

### Comparison Features

1. **Run Comparison** (`RunComparison.jsx`):
   - Compare multiple complete runs
   - Shows aggregate metrics
   - Percentage differences from baseline

2. **Question Comparison** (`QuestionComparison.jsx`):
   - Compare same execution across runs
   - Percentage differences for duration, tokens, metrics
   - Green = improvement, Red = decline

---

## 🛠️ Maintenance

### Clean Up Old Data
```sql
DELETE FROM evaluation.test_run 
WHERE creation_ts < NOW() - INTERVAL '90 days';
```

### Vacuum Database
```sql
VACUUM ANALYZE evaluation.test_run;
VACUUM ANALYZE evaluation.test_execution;
VACUUM ANALYZE evaluation.test_response;
VACUUM ANALYZE evaluation.evaluation;
```

### Check Schema Size
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'evaluation'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 📝 Summary

**Architecture**: Flat workflow structure with hierarchical execution tracking  
**Schema Namespace**: All tables in `evaluation` schema  
**Design Pattern**: Normalized tables with dynamic metrics  
**Key Feature**: Flexible metric system - add metrics without code changes  
**Sub-Executions**: Track subworkflow calls for debugging (hidden from UI)  
**Current State**: Production-ready with comprehensive documentation

**Key Insight**: The `evaluation.evaluation` table with flexible `metric_name`/`metric_value` allows unlimited evaluation criteria without schema migrations.
