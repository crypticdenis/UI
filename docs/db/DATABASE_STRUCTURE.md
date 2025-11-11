````markdown
# Butler Eval - Database Structure Guide

**Database**: `butler_eval`  
**Purpose**: Store and manage AI evaluation test runs with hierarchical organization  
**Last Updated**: November 10, 2025

---

## 📊 Quick Overview

### Current Data
- **1 Project**: "Butler Evaluation Project"
- **1 Workflow**: "Main Butler Workflow"
- **2 Subworkflows**: Question Answering + RAG Performance
- **15 Runs**: Test executions across subworkflows
- **85 Questions**: Individual test cases
- **85 Evaluations**: Scores for each question

### Database Size
- Total: ~600 KB
- Most data in: `runs`, `run_questions`, `question_evaluations`

---

## 🏗️ Table Structure

### Hierarchy (Top → Bottom)

```
projects (1 row)
   ↓ 1:N
workflows (1 row)
   ↓ 1:N
subworkflows (2 rows)
   ↓ 1:N
runs (15 rows)
   ↓ 1:1
run_questions (85 rows)
   ↓ 1:1
question_evaluations (85 rows)
```

---

## 📋 Table Details

### 1. `projects` - Top Level Organization
**Purpose**: Group related evaluation workflows (teams, departments, products)

| Column | Type | Description |
|--------|------|-------------|
| `id` | varchar(50) | Primary key (e.g., "proj-butler") |
| `name` | varchar(255) | Display name |
| `description` | text | Purpose/notes |
| `created_at` | timestamp | Creation time |
| `updated_at` | timestamp | Last modification |

**Current Data**: 1 project ("Butler Evaluation Project")

---

### 2. `workflows` - Evaluation Pipelines
**Purpose**: Different evaluation approaches within a project

| Column | Type | Description |
|--------|------|-------------|
| `id` | varchar(50) | Primary key (e.g., "wf-butler-v1") |
| `project_id` | varchar(50) | FK → projects.id |
| `name` | varchar(255) | Display name |
| `description` | text | Pipeline details |
| `created_at` | timestamp | Creation time |
| `updated_at` | timestamp | Last modification |

**Current Data**: 1 workflow ("Main Butler Workflow")

---

### 3. `subworkflows` - Task Components
**Purpose**: Break workflows into specific task types

| Column | Type | Description |
|--------|------|-------------|
| `id` | varchar(50) | Primary key (e.g., "subwf-qa") |
| `workflow_id` | varchar(50) | FK → workflows.id |
| `name` | varchar(255) | Display name |
| `description` | text | Task details |
| `created_at` | timestamp | Creation time |
| `updated_at` | timestamp | Last modification |

**Current Data**: 
- "Question Answering Subworkflow" (5 runs)
- "RAG Performance Subworkflow" (4 runs)

---

### 4. `runs` ⭐ - Test Executions
**Purpose**: Store complete test run data (denormalized for performance)

**Key Columns**:

| Column | Type | Description |
|--------|------|-------------|
| `id` | varchar(100) | PK: "{base_id}-{version}" |
| `base_id` | integer | Question/test identifier |
| `version` | varchar(100) | Run version (e.g., "run_gpt4_v1") |
| `subworkflow_id` | varchar(50) | FK → subworkflows.id |
| `model` | varchar(100) | LLM used (gpt-4, claude, etc.) |
| `prompt_version` | varchar(100) | Prompt version identifier |
| `timestamp` | timestamp | When run executed |

**Input/Output**:
| Column | Type | Description |
|--------|------|-------------|
| `input_text` | text | Question/prompt |
| `expected_output` | text | Ground truth answer |
| `output` | text | Actual model response |

**Evaluation Scores** (All nullable numeric(5,4), range 0-1):
- `output_score` - Quality of output
- `rag_relevancy_score` - RAG retrieval quality
- `hallucination_rate` - Factual accuracy
- `system_prompt_alignment_score` - Prompt adherence
- `test_score` - Custom test metric

**Score Reasons** (All text):
- `output_score_reason`
- `rag_relevancy_score_reason`
- `hallucination_rate_reason`
- `system_prompt_alignment_score_reason`

**Constraint**: 
```sql
CHECK (
  (workflow_id IS NOT NULL AND subworkflow_id IS NULL) OR 
  (workflow_id IS NULL AND subworkflow_id IS NOT NULL)
)
```
*Each run belongs to EITHER workflow OR subworkflow, not both*

**Current Data**: 15 runs across 2 subworkflows

---

### 5. `run_questions` - Question Details
**Purpose**: Store detailed question information per run

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | Primary key |
| `run_id` | integer | Run identifier |
| `question_number` | integer | Position in test |
| `question_text` | text | The actual question |
| `ground_truth_answer` | text | Expected answer |
| `expected_sources` | text[] | Expected reference docs |
| `execution_answer` | text | Model's answer |
| `execution_sources` | text[] | Model's retrieved docs |
| `created_at` | timestamp | Creation time |

**Current Data**: 85 questions

---

### 6. `question_evaluations` - Evaluation Scores
**Purpose**: Store individual question evaluation results

| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | Primary key |
| `question_id` | integer | FK → run_questions.id |
| `output_score` | numeric(3,2) | 0-1 score |
| `rag_relevancy_score` | numeric(3,2) | 0-1 score |
| `hallucination_rate` | numeric(3,2) | 0-1 score |
| `system_prompt_alignment_score` | numeric(3,2) | 0-1 score |
| `test_score` | numeric(3,2) | 0-1 score |
| `reasoning` | text | Evaluation explanation |
| `evaluation_metadata` | jsonb | Additional data |
| `created_at` | timestamp | Creation time |
| `updated_at` | timestamp | Last modification |

**Current Data**: 85 evaluations (one per question)

---

## 🔄 Data Flow

### How Data Flows Through the System

```
1. Test Script Runs
   ↓
2. Creates/Updates runs table
   (Stores execution + scores)
   ↓
3. Creates run_questions
   (Detailed question info)
   ↓
4. Creates question_evaluations
   (Individual scores + reasoning)
   ↓
5. Backend queries projects
   GET /api/projects
   ↓
6. Backend builds hierarchy
   buildProjectHierarchy()
   - Joins projects → workflows
   - Joins workflows → subworkflows
   - Joins subworkflows → runs
   ↓
7. Returns nested JSON
   {
     project: { workflows: [ { subworkflows: [ { runs: [...] } ] } ] }
   }
   ↓
8. Frontend displays hierarchy
   Projects → Workflows → Runs
```

---

## 🎯 How Backend Works

### Key API Endpoint

**`GET /api/projects`** - Returns full hierarchy

```javascript
// 1. Query all projects
SELECT * FROM projects

// 2. For each project, get workflows
SELECT * FROM workflows WHERE project_id = $1

// 3. For each workflow, get subworkflows  
SELECT * FROM subworkflows WHERE workflow_id = $1

// 4. For each subworkflow, get runs
SELECT * FROM runs WHERE subworkflow_id = $1

// 5. Build nested structure
{
  id: "proj-butler",
  name: "Butler Evaluation Project",
  workflows: [
    {
      id: "wf-1",
      name: "Main Butler Workflow",
      subworkflows: [
        {
          id: "subwf-1",
          name: "Question Answering",
          runs: [...]
        }
      ]
    }
  ]
}
```

### Dynamic Metric Extraction

The backend automatically extracts **any** column matching these patterns:

```javascript
// Pattern matching in extractExecutionData()
const patterns = [
  '_score',      // output_score, coherence_score
  '_rate',       // hallucination_rate, error_rate
  '_rating',     // quality_rating
  '_accuracy',   // answer_accuracy
  '_precision',  // rag_precision
  '_recall',     // rag_recall
  '_f1',         // f1_score
  '_metric'      // custom_metric
];

// Converts: hallucination_rate → hallucinationRate
// Returns: { hallucinationRate: 0.15 }
```

**This means**: Add any column with these suffixes → it automatically appears in UI!

---

## ➕ Adding New Metrics

### Step-by-Step Process

1. **Add column to runs table**:
```sql
ALTER TABLE runs 
ADD COLUMN coherence_score numeric(5,4);
```

2. **Populate with data**:
```sql
UPDATE runs 
SET coherence_score = 0.92 
WHERE id = '1-run_gpt4_v1';
```

3. **Restart backend**:
```bash
cd server && node server.js
```

4. **Refresh frontend** - New metric appears automatically!

### Why It Works

- Backend uses `SELECT * FROM runs`
- `extractExecutionData()` finds `coherence_score`
- Matches `_score` pattern → extracts as numeric
- Converts to camelCase → `coherenceScore`
- Frontend's `metricUtils.js` detects it
- Displays as "Coherence Score" with color coding

**No React code changes needed!**

---

## 🔍 Useful Queries

### View Your Hierarchy
```sql
SELECT 
    p.name as project,
    w.name as workflow,
    sw.name as subworkflow,
    COUNT(r.id) as run_count
FROM projects p
LEFT JOIN workflows w ON w.project_id = p.id
LEFT JOIN subworkflows sw ON sw.workflow_id = w.id
LEFT JOIN runs r ON r.subworkflow_id = sw.id
GROUP BY p.name, w.name, sw.name;
```

### Check Table Row Counts
```sql
SELECT 
    'projects' as table_name, COUNT(*) FROM projects
UNION ALL SELECT 'workflows', COUNT(*) FROM workflows
UNION ALL SELECT 'subworkflows', COUNT(*) FROM subworkflows
UNION ALL SELECT 'runs', COUNT(*) FROM runs
UNION ALL SELECT 'run_questions', COUNT(*) FROM run_questions
UNION ALL SELECT 'question_evaluations', COUNT(*) FROM question_evaluations;
```

### View Average Scores
```sql
SELECT 
    version,
    ROUND(AVG(output_score)::numeric, 2) as avg_output,
    ROUND(AVG(rag_relevancy_score)::numeric, 2) as avg_rag,
    ROUND(AVG(hallucination_rate)::numeric, 2) as avg_hallucination,
    ROUND(AVG(test_score)::numeric, 2) as avg_test,
    COUNT(*) as question_count
FROM runs
WHERE output_score IS NOT NULL
GROUP BY version
ORDER BY version;
```

### Find Runs by Model
```sql
SELECT 
    model,
    version,
    COUNT(*) as run_count,
    ROUND(AVG(output_score)::numeric, 2) as avg_score
FROM runs
GROUP BY model, version
ORDER BY model, version;
```

---

## 🔐 Foreign Key Relationships

All relationships use **CASCADE DELETE** - deleting parent deletes children:

```
projects.id ← workflows.project_id
workflows.id ← subworkflows.workflow_id  
subworkflows.id ← runs.subworkflow_id
run_questions.id ← question_evaluations.question_id
```

**Example**:
```sql
DELETE FROM projects WHERE id = 'proj-butler';
-- Also deletes:
--   - All workflows in that project
--   - All subworkflows in those workflows
--   - All runs in those subworkflows
```

---

## 📦 Backup & Restore

### Quick Backup
```bash
pg_dump -U denis -d butler_eval -f backup.sql
```

### Restore
```bash
psql -U denis -d butler_eval -f backup.sql
```

### Export to CSV
```bash
psql -U denis -d butler_eval -c "COPY runs TO STDOUT CSV HEADER" > runs.csv
```

---

## 🎨 Color Coding (Frontend)

Scores are color-coded in UI:

| Score Range | Color | Meaning |
|-------------|-------|---------|
| 0.90 - 1.00 | Dark Green | Excellent |
| 0.80 - 0.89 | Medium Green | Good |
| 0.70 - 0.79 | Light Green | Satisfactory |
| 0.60 - 0.69 | Yellow-Green | Acceptable |
| 0.50 - 0.59 | Yellow | Warning |
| 0.40 - 0.49 | Orange | Poor |
| 0.30 - 0.39 | Red-Orange | Bad |
| 0.00 - 0.29 | Dark Red | Critical |

---

## 🛠️ Maintenance

### Clean Up Old Runs
```sql
DELETE FROM runs 
WHERE timestamp < NOW() - INTERVAL '90 days';
```

### Vacuum Database
```sql
VACUUM ANALYZE;
```

### Check Database Size
```sql
SELECT 
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = 'butler_eval';
```

---

## 🚀 Quick Reference

### Connection
```bash
psql -U denis -d butler_eval
```

### Backend
```bash
cd server && node server.js
# Runs on: http://localhost:3001
```

### Frontend
```bash
npm run dev
# Runs on: http://localhost:5174
```

### API Endpoint
```
GET http://localhost:3001/api/projects
```

---

## 📝 Summary

**Architecture**: Hierarchical (Projects → Workflows → Subworkflows → Runs)  
**Design Pattern**: Denormalized `runs` table for performance  
**Dynamic System**: Any `*_score` or `*_rate` column auto-displays in UI  
**Current State**: Fully populated and operational  
**Maintenance**: Delete unused tables, keep hierarchy clean

**Key Insight**: The `runs` table stores everything needed for display (denormalized), while `run_questions` and `question_evaluations` provide detailed drill-down data.

````
