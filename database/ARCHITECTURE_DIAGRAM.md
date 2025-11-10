# Butler Eval - Database Architecture Diagrams

## Current State (As-Is Architecture)

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA SOURCES (External)                       │
│                                                                  │
│  • Evaluation Scripts                                            │
│  • Test Runners                                                  │
│  • Manual SQL Inserts                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓ INSERT scores
                             
┌─────────────────────────────────────────────────────────────────┐
│                PostgreSQL Database: butler_eval                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │         question_evaluations (85 rows) ✅ ACTIVE            │ │
│ │                                                              │ │
│ │  • id, output_score, rag_relevancy_score                    │ │
│ │  • hallucination_rate, system_prompt_alignment_score        │ │
│ │  • test_score, reasoning, evaluation_metadata               │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                             │                                     │
│                             │ Manual UPDATE (sync required!)      │
│                             ↓                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │              runs (0 rows) ⚠️ EMPTY                          │ │
│ │                                                              │ │
│ │  • Same scores + model, prompt_version, timestamp            │ │
│ │  • Should mirror evaluations but currently empty             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                             │                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │    UNUSED HIERARCHY (all 0 rows) ⚠️                          │ │
│ │                                                              │ │
│ │  projects → workflows → subworkflows → runs                  │ │
│ │     ❌         ❌            ❌          ❌                    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │    subflows (0 rows) ❌ DUPLICATE - DELETE THIS              │ │
│ └─────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓ SELECT * FROM runs
                             
┌─────────────────────────────────────────────────────────────────┐
│               Backend API (Node.js/Express)                      │
│                   Port: 3001 ✅ RUNNING                          │
│                                                                  │
│  extractExecutionData() → Pattern match field names              │
│  • _score → numeric score                                       │
│  • _rate → numeric rate                                         │
│  • _reason → text explanation                                   │
│                                                                  │
│  Converts: snake_case → camelCase                               │
│  Returns: JSON with ALL fields dynamically                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓ HTTP GET /api/projects
                             
┌─────────────────────────────────────────────────────────────────┐
│              Frontend UI (React + Vite)                          │
│                   Port: 5174 ✅ RUNNING                          │
│                                                                  │
│  metricUtils.js → Extract & categorize fields                   │
│  • extractMetrics() → scores, reasons, text                     │
│  • getScoreColor() → color-coded visualization                  │
│  • formatFieldName() → Title Case display                       │
│                                                                  │
│  Components:                                                     │
│  • RunDetails.jsx → Question-by-question view                   │
│  • Comparison.jsx → Side-by-side comparison                     │
│  • QuestionComparison.jsx → Same question, multiple runs        │
│  • RunsOverview.jsx → Grid of all runs                          │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ↓ Renders in browser
                             
                    👤 User sees dynamic metrics!
```

---

## Table Relationships (Current Schema)

```
┌──────────────┐
│   projects   │
│ id (PK)      │
│ (0 rows)     │
└──────┬───────┘
       │ 1:N
       │ ON DELETE CASCADE
       ↓
┌──────────────┐
│  workflows   │
│ id (PK)      │
│ project_id   │───────┐
│ (0 rows)     │       │
└──────┬───────┘       │
       │ 1:N           │
       │ CASCADE       │ 1:N
       ↓               │ CASCADE
┌──────────────┐       │
│ subworkflows │       │
│ id (PK)      │       │
│ workflow_id  │       │
│ (0 rows)     │       │
└──────┬───────┘       │
       │ 1:N           │
       │ CASCADE       │
       ↓               │
┌──────────────────────┴─────────┐
│            runs                │
│ id (PK)                        │
│ workflow_id (FK) ◄─────────────┘
│ OR                             │
│ subworkflow_id (FK) ◄──────────┘
│ (0 rows)                       │
│                                │
│ CHECK: Must have ONE parent    │
└────────────────────────────────┘


┌──────────────┐
│run_questions │
│ id (PK)      │
│ run_id       │
│ (0 rows)     │
└──────┬───────┘
       │ 1:1
       │ CASCADE
       ↓
┌──────────────────────────┐
│  question_evaluations    │
│  id (PK)                 │
│  question_id (FK)        │
│  ✅ 85 rows              │
│                          │
│  • output_score          │
│  • rag_relevancy_score   │
│  • hallucination_rate    │
│  • system_prompt_..._sc. │
│  • test_score            │
└──────────────────────────┘


┌──────────────┐
│   subflows   │ ❌ ORPHANED - No references
│ id (PK)      │    Nobody uses this table
│ (0 rows)     │    Should be deleted!
└──────────────┘
```

---

## Option 1: Simplified Architecture

### Recommended for: Simple evaluation workflows without hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    Evaluation Scripts                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓ Direct INSERT
                             
┌─────────────────────────────────────────────────────────────────┐
│                PostgreSQL: butler_eval                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        question_evaluations (ONLY TABLE)                 │  │
│  │                                                           │  │
│  │  • id, question_text, expected_answer, actual_output     │  │
│  │  • model, prompt_version, timestamp                      │  │
│  │  • output_score, rag_relevancy_score, hallucination_rate │  │
│  │  • test_score, coherence_score, (any future metrics)     │  │
│  │  • reasoning, metadata (jsonb)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ALL OTHER TABLES DELETED ✅                                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓ SELECT * (one query, no joins!)
                             
┌─────────────────────────────────────────────────────────────────┐
│                     Backend API                                  │
│  const { rows } = await client.query(                           │
│    'SELECT * FROM question_evaluations'                         │
│  );                                                              │
│  // That's it! All data in one table                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
                    Frontend (unchanged)
```

**Advantages**:
- ✅ One source of truth
- ✅ No synchronization
- ✅ Fastest queries
- ✅ Easiest to understand
- ✅ Simple backups

**Disadvantages**:
- ❌ No project/workflow organization
- ❌ All evaluations in one flat table
- ❌ Harder to scale to enterprise

---

## Option 2: Full Hierarchy Architecture

### Recommended for: Multi-team, multi-project organizations

```
┌─────────────────────────────────────────────────────────────────┐
│                    Evaluation Scripts                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓ INSERT through hierarchy
                             
┌─────────────────────────────────────────────────────────────────┐
│                PostgreSQL: butler_eval                           │
│                                                                  │
│  ┌─────────────┐                                                │
│  │  projects   │ ✅ Team/department level                       │
│  └──────┬──────┘                                                │
│         │ 1:N                                                   │
│         ↓                                                        │
│  ┌─────────────┐                                                │
│  │  workflows  │ ✅ Evaluation pipelines                        │
│  └──────┬──────┘                                                │
│         │ 1:N                                                   │
│         ↓                                                        │
│  ┌──────────────┐                                               │
│  │ subworkflows │ ✅ Sub-tasks                                  │
│  └──────┬───────┘                                               │
│         │ 1:N                                                   │
│         ↓                                                        │
│  ┌─────────────┐                                                │
│  │    runs     │ ✅ Test executions (denormalized!)            │
│  │             │    Contains all data + scores                  │
│  └─────────────┘                                                │
│         │                                                        │
│         │ Trigger (auto-sync)                                  │
│         ↓                                                        │
│  ┌──────────────────────┐                                       │
│  │ question_evaluations │ ✅ Source of truth for scores         │
│  └──────────────────────┘                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓ SELECT with optional JOINs
                             
┌─────────────────────────────────────────────────────────────────┐
│                     Backend API                                  │
│  // Get all runs for a project:                                 │
│  SELECT r.* FROM runs r                                          │
│  JOIN subworkflows sw ON r.subworkflow_id = sw.id               │
│  JOIN workflows w ON sw.workflow_id = w.id                      │
│  WHERE w.project_id = 'proj-ml-team';                           │
│                                                                  │
│  // Or just get everything:                                     │
│  SELECT * FROM runs;                                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
                    Frontend (unchanged)
```

**Advantages**:
- ✅ Full organizational hierarchy
- ✅ Filter by project/workflow/team
- ✅ Automated sync with triggers
- ✅ Scales to enterprise
- ✅ Proper data normalization

**Disadvantages**:
- ❌ More complex setup
- ❌ Slower queries (need JOINs)
- ❌ More maintenance
- ❌ Must populate all levels

---

## Option 3: View-Based Architecture

### Recommended for: Transitional or uncertain requirements

```
┌─────────────────────────────────────────────────────────────────┐
│                    Evaluation Scripts                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓ Direct INSERT (simple!)
                             
┌─────────────────────────────────────────────────────────────────┐
│                PostgreSQL: butler_eval                           │
│                                                                  │
│  ┌──────────────────────┐                                       │
│  │ question_evaluations │ ✅ ONLY REAL TABLE WITH DATA          │
│  │  (source of truth)   │                                       │
│  └──────────────────────┘                                       │
│             │                                                    │
│             │ VIEW (computed, not stored)                       │
│             ↓                                                    │
│  ┌─────────────────────────────┐                                │
│  │        runs_view            │ ⚡ Virtual table               │
│  │                             │                                │
│  │  CREATE VIEW runs_view AS   │  Looks like a table            │
│  │  SELECT                     │  Acts like a table             │
│  │    id,                      │  But queries source            │
│  │    model,                   │  No data duplication!          │
│  │    output_score,            │                                │
│  │    test_score,              │  Auto-updates when             │
│  │    ...                      │  source changes!               │
│  │  FROM question_evaluations; │                                │
│  └─────────────────────────────┘                                │
│                                                                  │
│  HIERARCHY TABLES (empty but ready for future use)              │
│  • projects, workflows, subworkflows                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓ SELECT * FROM runs_view
                             
┌─────────────────────────────────────────────────────────────────┐
│                     Backend API                                  │
│  const { rows } = await client.query(                           │
│    'SELECT * FROM runs_view'  // Thinks it's a table!           │
│  );                                                              │
│  // Backend doesn't know it's a view                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
                    Frontend (unchanged)
```

**Advantages**:
- ✅ Single source of truth
- ✅ No manual synchronization (auto-updates!)
- ✅ Can add hierarchy later without breaking
- ✅ Backend code unchanged
- ✅ Fast for simple views

**Disadvantages**:
- ❌ Views can be slower than tables
- ❌ Can't INSERT into views (read-only)
- ❌ Still need to populate hierarchy tables eventually

**Materialized View Option**:
```sql
-- For better performance, use materialized view:
CREATE MATERIALIZED VIEW runs_mv AS
SELECT ... FROM question_evaluations;

-- Refresh when data changes:
REFRESH MATERIALIZED VIEW runs_mv;

-- Or auto-refresh with trigger:
CREATE TRIGGER auto_refresh ...
```

---

## Data Sync Patterns

### Current (Manual Sync) ❌

```
Add new metric "coherence_score":

Step 1: ALTER TABLE question_evaluations
        ADD COLUMN coherence_score numeric(3,2);
        
Step 2: UPDATE question_evaluations 
        SET coherence_score = 0.92;
        
Step 3: ALTER TABLE runs 
        ADD COLUMN coherence_score numeric(5,4);
        
Step 4: UPDATE runs r 
        SET coherence_score = (
          SELECT qe.coherence_score 
          FROM question_evaluations qe 
          WHERE qe.question_id = r.base_id
        );
        
Step 5: Restart backend

PROBLEM: 5 steps, easy to forget, risk of inconsistency
```

### With Trigger (Automated) ✅

```
Add new metric "coherence_score":

Step 1: ALTER TABLE question_evaluations
        ADD COLUMN coherence_score numeric(3,2);
        
Step 2: UPDATE question_evaluations 
        SET coherence_score = 0.92;
        
Step 3: Trigger auto-fires:
        - Detects change to question_evaluations
        - Automatically updates runs table
        - Maintains consistency
        
Step 4: Restart backend

BENEFIT: 4 steps (removed manual sync), guaranteed consistency
```

### With View (Zero Sync) ✅✅

```
Add new metric "coherence_score":

Step 1: ALTER TABLE question_evaluations
        ADD COLUMN coherence_score numeric(3,2);
        
Step 2: UPDATE question_evaluations 
        SET coherence_score = 0.92;
        
Step 3: Restart backend

BENEFIT: 3 steps, view auto-includes new column, zero sync!
```

---

## Performance Comparison

| Approach | Read Speed | Write Speed | Sync Required | Complexity |
|----------|-----------|-------------|---------------|------------|
| **Current (2 tables)** | ⚡⚡⚡ Fast (no JOIN) | ⚡ Slow (manual copy) | ❌ Yes (manual) | ⭐⭐⭐ High |
| **Option 1 (1 table)** | ⚡⚡⚡ Fastest | ⚡⚡⚡ Fastest | ✅ None | ⭐ Low |
| **Option 2 (hierarchy)** | ⚡ Slow (JOINs) | ⚡⚡ Medium | ✅ Auto (trigger) | ⭐⭐⭐⭐⭐ High |
| **Option 3 (view)** | ⚡⚡ Fast | ⚡⚡⚡ Fast | ✅ None | ⭐⭐ Medium |
| **Option 3 (mat. view)** | ⚡⚡⚡ Fastest | ⚡⚡ Medium | ⚡ Auto (trigger) | ⭐⭐⭐ Medium |

---

## Migration Paths

```
                    ┌──────────────┐
                    │   CURRENT    │
                    │  (Confused   │
                    │   State)     │
                    └───────┬──────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ↓ 5 min          ↓ 30 min         ↓ 2-3 hrs
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │ OPTION 1 │      │ OPTION 3 │      │ OPTION 2 │
    │ Simplify │      │   View   │      │   Full   │
    └──────────┘      └────┬─────┘      └──────────┘
                           │
                           │ 1-2 hrs
                           │ (populate tables)
                           ↓
                      ┌──────────┐
                      │ OPTION 2 │
                      │   Full   │
                      └──────────┘
```

**Key Decision Point**: Option 3 → Option 2 is easy, but Option 1 → Option 2 is hard

---

## Backend Dynamic Extraction Flow

```
Database Column         Backend Processing        Frontend Display
================       ====================      =================

output_score     →     1. Pattern match:         → Output Score
(numeric)              "output" + "_score"       
                       
                       2. Convert case:          → Color-coded card
                       output_score              → 0.85 (green)
                       ↓
                       outputScore               
                       
                       3. Parse type:            
                       "0.85" → 0.85 (float)     
                       
                       4. Add to response:       
                       { outputScore: 0.85 }     


rag_relevancy_   →     Same process:             → RAG Relevancy
score                  rag_relevancy_score       → Score
                       ↓                         → 0.92 (dark green)
                       ragRelevancyScore
                       

test_score       →     NEW METRIC!               → Test Score
(added recently)       Auto-detected             → 0.88 (green)
                       No code changes           → Appears automatically!
                       

coherence_score  →     FUTURE METRIC             → Coherence Score
(doesn't exist          Just add column to DB    → Will auto-appear
yet)                    Restart backend          → Zero code changes
                        Frontend auto-displays!
```

---

## Color Coding Logic

```
Score Value         Color              RGB              Use Case
===========        =======            =====            =========

0.90 - 1.00   →   Dark Green      rgb(0,100,0)      Excellent
0.80 - 0.89   →   Medium Green    rgb(34,139,34)    Good
0.70 - 0.79   →   Light Green     rgb(144,238,144)  Satisfactory
0.60 - 0.69   →   Yellow-Green    rgb(154,205,50)   Acceptable
0.50 - 0.59   →   Yellow          rgb(255,255,0)    Warning
0.40 - 0.49   →   Orange          rgb(255,165,0)    Poor
0.30 - 0.39   →   Red-Orange      rgb(255,69,0)     Bad
0.00 - 0.29   →   Dark Red        rgb(139,0,0)      Critical

Applied to:
• Score cards in RunDetails
• Mini scores in Comparison view
• Delta indicators in QuestionComparison
• Run cards in RunsOverview
```

---

## File Structure Map

```
/Users/denis/Documents/UI/
│
├── database/
│   ├── schema.sql                  ← Full table definitions
│   ├── mock_data.sql               ← Sample data (if any)
│   ├── cleanup.sql                 ← Remove duplicates, add indexes
│   ├── export_database.sh          ← Backup script
│   ├── ARCHITECTURE_DIAGRAM.md     ← This file
│   └── exports/                    ← Timestamped backups
│       ├── butler_eval_full_*.sql
│       ├── butler_eval_schema_*.sql
│       └── question_evaluations_*.csv
│
├── server/
│   ├── server.js                   ← Backend API
│   └── package.json                ← Node dependencies
│
├── src/
│   ├── metricUtils.js              ← Dynamic metric utilities
│   ├── RunDetails.jsx              ← Detailed run view
│   ├── Comparison.jsx              ← Side-by-side comparison
│   ├── QuestionComparison.jsx      ← Question across runs
│   └── RunsOverview.jsx            ← Grid of all runs
│
├── DATABASE_ANALYSIS.md            ← Comprehensive analysis
├── README.md                       ← Project overview
└── README_DATABASE.md              ← Database docs
```

---

**Last Updated**: November 10, 2025  
**Backend Status**: ✅ Running on port 3001  
**Frontend Status**: ✅ Running on port 5174  
**Database Status**: ✅ Connected, 85 evaluations stored
