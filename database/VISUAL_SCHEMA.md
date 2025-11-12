# Butler Eval - Database Visual Diagram

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────┐
│         projects            │
│─────────────────────────────│
│ • id (PK) varchar(50)       │
│   name                      │
│   description               │
│   created_at                │
│   updated_at                │
└──────────────┬──────────────┘
               │
               │ 1:N (CASCADE)
               │
┌──────────────▼──────────────┐
│         workflows           │
│─────────────────────────────│
│ • id (PK) varchar(50)       │
│   project_id (FK)           │
│   name                      │
│   description               │
│   created_at                │
│   updated_at                │
└──────────────┬──────────────┘
               │
               │ 1:N (CASCADE)
               │
┌──────────────▼──────────────┐
│       subworkflows          │
│─────────────────────────────│
│ • id (PK) varchar(50)       │
│   workflow_id (FK)          │
│   name                      │
│   description               │
│   created_at                │
│   updated_at                │
└──────────────┬──────────────┘
               │
               │ 1:N (CASCADE)
               │
┌──────────────▼───────────────────────────────────────────┐
│                       runs                               │
│  (Denormalized - each row is a question/answer pair)     │
│──────────────────────────────────────────────────────────│
│ • id (PK) varchar(100) - "{base_id}-{version}"           │
│   subworkflow_id (FK) OR workflow_id (FK)                │
│   base_id - Question identifier (for comparison)         │
│   version - Run version (e.g., "v1.0", "v2.0")           │
│   model, prompt_version, timestamp                       │
│                                                          │
│ Ground Truth Data:                                       │
│   ground_truth_id, input_text, expected_output           │
│                                                          │
│ Execution Data:                                          │
│   execution_id, output                                   │
│                                                          │
│ Evaluation Scores (dynamic):                             │
│   output_score, output_score_reason                      │
│   rag_relevancy_score, rag_relevancy_score_reason        │
│   hallucination_rate, hallucination_rate_reason          │
│   system_prompt_alignment_score, ..._reason              │
│   test_score (example custom metric)                     │
│   ...any *_score or *_rate field will be detected...     │
│                                                          │
│ Status:                                                  │
│   active, is_running                                     │
└──────────────────────────────────────────────────────────┘

Note: run_questions and question_evaluations tables exist in schema 
      but are EMPTY and UNUSED. All data flows through runs table.
```

## Current Data Distribution

```
Butler Evaluation Project
  └─ Main Butler Workflow
      ├─ Question Answering Subworkflow
      │   ├─ v1.0 (multiple questions, same version)
      │   ├─ v2.0 (same questions, different version)
      │   └─ v3.0 (same questions, different version)
      │
      └─ RAG Performance Subworkflow
          ├─ v1.0 (different set of questions)
          ├─ v2.0 (same questions, different version)
          └─ v3.0 (same questions, different version)

Example: 
- Question with base_id=7 exists in v1.0, v2.0, v3.0
- Each is a separate row in runs table
- All can be compared side-by-side in UI
```

## Data Flow

```
┌──────────────────────────────────────────────────────┐
│ Test Script / Data Import                            │
└──────┬───────────────────────────────────────────────┘
       │
       ↓ INSERT INTO runs (all data in one table)
       │
┌──────▼───────────────────────────────────────────────┐
│  Database (PostgreSQL)                                │
│                                                       │
│  runs table contains:                                 │
│  • Each row = 1 question/answer with scores           │
│  • base_id = question identifier                      │
│  • version = run version (v1.0, v2.0, etc.)           │
│  • All ground truth, execution, and evaluation data   │
│                                                       │
│  Example: Question 7 across 3 versions = 3 rows       │
│    - {7, "v1.0", model, prompt, scores...}            │
│    - {7, "v2.0", model, prompt, scores...}            │
│    - {7, "v3.0", model, prompt, scores...}            │
└──────┬───────────────────────────────────────────────┘
       │
       ↓ SELECT * FROM runs WHERE...
       │
┌──────▼───────────────────────────────────────────────┐
│  Backend API (Node.js/Express)                        │
│                                                       │
│  GET /api/projects                                    │
│  buildProjectHierarchy()                              │
│    - JOIN projects → workflows → subworkflows → runs  │
│    - Returns nested JSON hierarchy                    │
│                                                       │
│  GET /api/health                                      │
│    - Database connection check                        │
└──────┬───────────────────────────────────────────────┘
       │
       ↓ JSON API response
       │
┌──────▼───────────────────────────────────────────────┐
│  Frontend (React + Vite)                              │
│                                                       │
│  1. RunsOverview.jsx                                  │
│     • Groups runs by version                          │
│     • Calculates aggregate scores                     │
│     • Displays run cards with filters                 │
│                                                       │
│  2. RunDetails.jsx                                    │
│     • Shows all questions in a specific run version   │
│     • Each row = one question with scores             │
│     • Click row → triggers comparison                 │
│                                                       │
│  3. QuestionComparison.jsx                            │
│     • Filters: allRuns.filter(run => run.baseID === X)│
│     • Shows same question across different versions   │
│     • Calculates deltas (↑5%, ↓3%)                    │
│     • Side-by-side comparison cards                   │
│                                                       │
│  metricUtils.js                                       │
│     • getUniqueScoreFields() - detects all *_score    │
│     • getScoreColor() - color codes 0-1 values        │
│     • Dynamic metric system (no hardcoding!)          │
└──────┬───────────────────────────────────────────────┘
       │
       ↓
┌──────▼───────────────────────────────────────────────┐
│  User Interface                                       │
│                                                       │
│  • Hierarchical navigation (Projects → Runs)          │
│  • Color-coded scores (green=good, red=poor)          │
│  • Filter by model, prompt version, score range       │
│  • Compare same question across multiple versions     │
│  • Export to CSV/JSON                                 │
└───────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Denormalized `runs` Table
**Why**: Performance - no joins needed for main display
**Trade-off**: Some data duplication vs. fast queries

### 2. Hierarchical Structure
**Why**: Organizational flexibility for teams/projects
**Benefit**: Filter/group runs by project or workflow

### 3. Dynamic Metric System
**How**: Backend pattern-matches `*_score`, `*_rate` fields
**Benefit**: Add new metrics without code changes

### 4. CASCADE Deletes
**Why**: Maintain referential integrity automatically
**Safety**: Deleting parent removes all children

## Table Relationships Summary

| Parent → Child | Type | Delete Behavior | Status |
|----------------|------|-----------------|--------|
| projects → workflows | 1:N | CASCADE | ✅ Active |
| workflows → subworkflows | 1:N | CASCADE | ✅ Active |
| subworkflows → runs | 1:N | CASCADE | ✅ Active |
| workflows → runs | 1:N | CASCADE | ✅ Active |
| run_questions → question_evaluations | 1:1 | CASCADE | ⚠️ Tables exist but UNUSED |

**Important Notes:**
- A run can belong to EITHER a workflow OR a subworkflow (CHECK constraint enforced)
- `run_questions` and `question_evaluations` tables exist for schema compatibility but contain no data
- All actual data flows through the `runs` table
- Each row in `runs` = one question/answer pair with complete evaluation data

## Question Comparison Logic

**How the UI compares questions across runs:**

1. **Identification**: Questions are identified by `base_id` field
2. **Versioning**: Same question exists in multiple rows with different `version` values
3. **Filtering**: `allRuns.filter(run => run.baseID === selectedQuestionBaseID)`
4. **Grouping**: Group filtered runs by `version` to get one row per version
5. **Comparison**: Display side-by-side with delta calculations
6. **Metrics**: Dynamically detect all `*_score` and `*_rate` fields

**Example:**
```
Question "What is the capital of France?" (base_id = 7)

runs table:
┌────┬─────────┬─────────┬────────┬───────┬──────────────┬───────────────┐
│ id │ base_id │ version │ model  │ output│ output_score │ rag_..._score │
├────┼─────────┼─────────┼────────┼───────┼──────────────┼───────────────┤
│7-v1│    7    │  v1.0   │ gpt-4  │ Paris │    0.95      │     0.88      │
│7-v2│    7    │  v2.0   │ gpt-4  │ Paris │    0.98      │     0.92      │
│7-v3│    7    │  v3.0   │ claude │ Paris │    0.97      │     0.90      │
└────┴─────────┴─────────┴────────┴───────┴──────────────┴───────────────┘

Comparison UI shows:
• v1.0: 0.95 score
• v2.0: 0.98 score (+3% vs v1.0) ↑
• v3.0: 0.97 score (+2% vs v1.0) ↑
```
