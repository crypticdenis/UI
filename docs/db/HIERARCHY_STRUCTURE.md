# Data Hierarchy Structure

## Overview

The Butler Evaluation Dashboard uses a simplified, flat hierarchical structure optimized for workflow-based evaluations:

```
Single Project (Hardcoded: "RE Butler Evaluation")
  └─ Workflows (e.g., RE_Butler, RAG_Search, etc.)
      └─ Test Runs (independent test executions)
          └─ Test Executions (individual questions/tests)
              └─ Sub-Executions (optional, for subworkflow calls)
```

## Current Structure

**Key Simplifications:**
- **No Projects Table**: Single hardcoded project ("RE Butler Evaluation")
- **No Subworkflows Table**: Workflows are flat, not hierarchical
- **Workflow IDs**: Used as identifiers (e.g., "RE_Butler", "RAG_Search")
- **Sub-executions**: Tracked via parent_execution_id for debugging only

## Navigation Flow

### 1. **Workflows Overview** (`WorkflowsOverview.jsx`)
- **Purpose**: View all workflows in the project
- **Features**:
  - Auto-loaded on app start (single project)
  - Display workflows with run counts
  - Search and sort workflows
  - Click workflow to view its runs

### 2. **Runs Overview** (`RunsOverview.jsx`)
- **Purpose**: View all test runs for a specific workflow
- **Features**:
  - Display runs grouped by version
  - Aggregate metrics and performance trends
  - Filter and sort capabilities
  - Compare multiple runs
  - Breadcrumb: `Projects > [Workflow Name] - Runs`

### 3. **Run Details** (`RunDetails.jsx`)
- **Purpose**: View individual test executions within a run
- **Features**:
  - Dynamic table showing all executions
  - Expandable rows for detailed metrics
  - Sub-execution navigation (if applicable)
  - Compare specific questions across runs
  - Aggregate statistics at the top
  - Search and sort by any metric

### 4. **Session Conversation View** (`SessionConversationView.jsx`)
- **Purpose**: View executions grouped by session_id as chat conversations
- **Features**:
  - Chat-style message display (user/assistant format)
  - Session grouping and sidebar navigation
  - Inline metrics display with expandable details
  - Sub-execution tracking
  - Search and filter sessions
  - Breadcrumb: `Projects > [Workflow Name] > [Run Version] - Conversation View`

### 5. **Question Comparison** (`QuestionComparison.jsx`)
- **Purpose**: Compare the same execution position across different runs
- **Features**:
  - Side-by-side comparison (up to 2 runs)
  - Percentage deltas from baseline
  - All dynamic metrics included
  - Export to JSON/CSV

### 6. **Run Comparison** (`RunComparison.jsx`)
- **Purpose**: Compare complete runs side-by-side
- **Features**:
  - Detailed metrics comparison
  - Performance trends
  - Percentage improvements/regressions

### 7. **Conversation Comparison** (`ConversationComparison.jsx`)
- **Purpose**: Compare conversations/sessions side-by-side
- **Features**:
  - Side-by-side chat comparison
  - Message-level metric comparison
  - Session performance analytics
  - Navigation between conversations

## Data Structure

### Project Object (Hardcoded)
```javascript
{
  id: 1,
  name: "RE Butler Evaluation",
  description: "Evaluation results and testing workflows",
  workflowCount: workflows.length,
  workflows: [...] // Array of workflows
}
```

### Workflow Object (Built from database)
```javascript
{
  id: "RE_Butler",  // workflow_id from database
  name: "RE Butler", // Formatted from workflow_id
  runCount: runs.length,
  runs: [...] // Array of test runs
}
```

### Run Object (Formatted from test_run)
```javascript
{
  id: 123,  // test_run.id
  workflowId: "RE_Butler",
  startTs: "2025-11-15T10:00:00",
  finishTs: "2025-11-15T10:05:00",
  version: "run_123",
  questionCount: 5,  // Count of root executions
  runs: [...],  // Root-level test executions
  questions: [...] // Same as runs (for compatibility)
}
```

### Execution Object (From test_execution)
```javascript
{
  id: "exec-uuid",
  runId: 123,
  workflowId: "RE_Butler",
  sessionId: "session-abc",
  parentExecutionId: null,  // or parent ID if sub-execution
  input: "Question text",
  expectedOutput: "Expected answer",
  output: "Actual answer",
  duration: 1.5,
  totalTokens: 150,
  // Dynamic metrics from evaluation table
  output_score: { value: 0.95, reason: "Correct answer" },
  relevancy_score: { value: 0.90, reason: "Highly relevant" },
  // ... other metrics
  subExecutions: [...] // Nested sub-executions if any
}
```

## Key Features

### Breadcrumb Navigation
- Shows current location in the hierarchy
- Click any breadcrumb level to navigate back
- Example: `Projects / Butler Evaluation / Main Workflow`

### Keyboard Shortcuts
- `ESC` - Navigate back one level or close modals
- `Ctrl/Cmd + K` - Focus search input
- `?` - Show help modal

### Consistent UI/UX
All levels use the same design patterns:
- Grid layout with cards
- Search and filter capabilities
- Sort controls
- Consistent color scheme and styling
- Smooth animations and transitions

## Database Schema

The PostgreSQL database uses the `evaluation` schema with these tables:

1. **evaluation.test_run** - Test run metadata per workflow
2. **evaluation.test_execution** - Individual test executions with hierarchical tracking
3. **evaluation.test_response** - Actual output/responses
4. **evaluation.evaluation** - Dynamic evaluation metrics (metric_name, metric_value)

**Key Features:**
- No projects or subworkflows tables needed
- Dynamic metrics via flexible evaluation table
- Hierarchical executions via parent_execution_id
- Workflow identification via workflow_id string field

See `DATABASE_STRUCTURE.md` for complete schema details.