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
┌──────────────▼──────────────────────────────┐
│                  runs                       │
│─────────────────────────────────────────────│
│ • id (PK) varchar(100)                      │
│   subworkflow_id (FK) OR workflow_id (FK)   │
│   base_id, version                          │
│   model, prompt_version, timestamp          │
│   input_text, expected_output, output       │
│   output_score, rag_relevancy_score         │
│   hallucination_rate, test_score            │
│   system_prompt_alignment_score             │
│   ...all score reason fields...            │
└─────────────────────────────────────────────┘


┌─────────────────────────────┐
│       run_questions         │
│─────────────────────────────│
│ • id (PK) integer           │
│   run_id                    │
│   question_number           │
│   question_text             │
│   ground_truth_answer       │
│   expected_sources          │
│   execution_answer          │
│   execution_sources         │
│   created_at                │
└──────────────┬──────────────┘
               │
               │ 1:1 (CASCADE)
               │
┌──────────────▼──────────────┐
│    question_evaluations     │
│─────────────────────────────│
│ • id (PK) integer           │
│   question_id (FK)          │
│   output_score              │
│   rag_relevancy_score       │
│   hallucination_rate        │
│   system_prompt_..._score   │
│   test_score                │
│   reasoning                 │
│   evaluation_metadata       │
│   created_at, updated_at    │
└─────────────────────────────┘
```

## Current Data Distribution

```
Butler Evaluation Project (1)
  └─ Main Butler Workflow (1)
      ├─ Question Answering Subworkflow (5 runs)
      │   ├─ run_gpt4_v1
      │   ├─ run_gpt4_v2
      │   ├─ run_claude_v1
      │   ├─ run_claude_v2
      │   └─ ...
      │
      └─ RAG Performance Subworkflow (4 runs)
          ├─ rag_test_v1
          ├─ rag_test_v2
          ├─ ...
          └─ ...

Total: 15 runs, 85 questions, 85 evaluations
```

## Data Flow

```
┌──────────────┐
│ Test Script  │
└──────┬───────┘
       │
       ↓ Executes tests
       │
┌──────▼─────────────────────────┐
│   Populates Database           │
│                                │
│  runs (execution + scores)     │
│  run_questions (Q&A details)   │
│  question_evaluations (scores) │
└──────┬─────────────────────────┘
       │
       ↓ Backend queries
       │
┌──────▼──────────────────────────┐
│  GET /api/projects               │
│                                  │
│  buildProjectHierarchy()         │
│  - SELECT projects               │
│  - JOIN workflows                │
│  - JOIN subworkflows             │
│  - JOIN runs                     │
│  - Format nested JSON            │
└──────┬───────────────────────────┘
       │
       ↓ Returns hierarchy
       │
┌──────▼──────────────────────────┐
│  Frontend React App              │
│                                  │
│  - RunsOverview.jsx              │
│  - RunDetails.jsx                │
│  - Comparison.jsx                │
│  - QuestionComparison.jsx        │
│                                  │
│  metricUtils.js extracts         │
│  dynamic metrics                 │
└──────┬───────────────────────────┘
       │
       ↓ Renders
       │
┌──────▼──────────────────────────┐
│  User sees color-coded metrics  │
│  organized by hierarchy          │
└──────────────────────────────────┘
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

| Parent → Child | Type | Delete Behavior |
|----------------|------|-----------------|
| projects → workflows | 1:N | CASCADE |
| workflows → subworkflows | 1:N | CASCADE |
| subworkflows → runs | 1:N | CASCADE |
| workflows → runs | 1:N | CASCADE |
| run_questions → question_evaluations | 1:1 | CASCADE |

**Note**: A run can belong to EITHER a workflow OR a subworkflow (constraint enforced)
