````markdown
# Hierarchical Navigation Structure

## Overview

The Butler Evaluation Dashboard now has a hierarchical structure that organizes evaluation data into the following levels:

```
Projects
  └─ Main Workflows
      ├─ Workflow Runs (main workflow has its own runs to evaluate)
      │   └─ Run Details (individual questions)
      │       └─ Comparison View (compare questions across workflow runs)
      └─ Subworkflows (called within the main workflow)
          └─ Subworkflow Runs (each subworkflow has its own runs)
              └─ Run Details (individual questions)
                  └─ Comparison View (compare questions across subworkflow runs)
```

## Correct Structure

**Important:** Each level can have its own runs to evaluate:
- **Main Workflows** have runs that test the entire workflow end-to-end
- **Subworkflows** have runs that test specific components called by the main workflow

## Navigation Flow

### 1. **Projects Landing Page** (`ProjectsLandingPage.jsx`)
- **Purpose**: Select an existing project or create a new one
- **Features**:
  - List all available projects with descriptions
  - Search and filter projects
  - Create new projects with name and description
  - View project metadata (created date, workflow count)

### 2. **Workflows Overview** (`WorkflowsOverview.jsx`)
- **Purpose**: View all main workflows within a selected project
- **Features**:
  - Display workflows with run counts AND subworkflow counts
  - Two action buttons per workflow:
    - **"View Runs"** - See the main workflow's own evaluation runs
    - **"View Subworkflows"** - See the subworkflows called by this workflow
  - Breadcrumb navigation back to projects
  - Search and sort workflows

### 3A. **Workflow Runs** (`RunsOverview.jsx` with breadcrumbs)
- **Purpose**: View all runs for the main workflow itself
- **Features**:
  - Same run overview interface
  - Groups runs by version
  - Shows aggregate scores and metrics
  - Filter by model, prompt version, etc.
  - Breadcrumb: `Projects > [Project Name] > [Workflow Name] - Runs`

### 3B. **Subworkflows View** (`SubWorkflowsView.jsx`)
- **Purpose**: View all subworkflows called from the main workflow
- **Features**:
  - List subworkflows with their run counts
  - Breadcrumb navigation (Projects > Workflow > Current)
  - Search and sort subworkflows
  - Each subworkflow can have multiple runs

### 4A. **Workflow Run Details** (`RunDetails.jsx`)
- **Purpose**: View individual questions within a main workflow run
- **Features**: 
  - Shows all questions with scores
  - Can compare specific questions across workflow runs
  - Navigate back to workflow runs

### 4B. **Subworkflow Runs** (`RunsOverview.jsx` with breadcrumbs)
- **Purpose**: View all runs for a specific subworkflow
- **Features**:
  - Same as workflow runs
  - Breadcrumb: `Projects > [Project] > [Workflow] > [Subworkflow] - Runs`

### 5. **Run Details** (`RunDetails.jsx`)
- **Purpose**: View individual questions within a subworkflow run
- **Features**: 
  - Unchanged from previous version
  - Shows all questions with scores
  - Can compare specific questions across runs

### 6. **Question Comparison** (`QuestionComparison.jsx`)
- **Purpose**: Compare how different runs answered the same question
- **Features**:
  - Unchanged from previous version
  - Side-by-side comparison of outputs and scores
  - Works for both workflow runs and subworkflow runs

## Data Structure

### Project Object
```json
{
  "id": "proj-1",
  "name": "Butler Evaluation Project",
  "description": "Main evaluation project description",
  "createdAt": "2025-10-15T10:00:00",
  "updatedAt": "2025-11-06T14:30:00",
  "workflowCount": 1,
  "workflows": [...]
}
```

### Workflow Object
```json
{
  "id": "wf-1",
  "name": "Main Butler Workflow",
  "description": "Primary workflow description",
  "createdAt": "2025-10-15T10:30:00",
  "updatedAt": "2025-11-06T14:30:00",
  "runCount": 3,
  "subworkflowCount": 2,
  "runs": [...],  // Main workflow's own runs
  "subworkflows": [...]  // Subworkflows called by this workflow
}
```

### Subworkflow Object
```json
{
  "id": "subwf-1",
  "name": "Question Answering Subworkflow",
  "description": "Evaluates Butler's question answering",
  "createdAt": "2025-10-15T11:00:00",
  "updatedAt": "2025-11-06T14:30:00",
  "runCount": 2,
  "runs": [...]
}
```

### Run Object
Same structure as before - unchanged from `runs.json`

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

The PostgreSQL database implements this hierarchy with the following tables:

1. **projects** - Project metadata
2. **workflows** - Workflows linked to projects
3. **subworkflows** - Subworkflows linked to workflows
4. **runs** - Individual test runs linked to subworkflows
5. **run_questions** - Questions in each run
6. **question_evaluations** - Evaluation results and metrics

See `DATABASE_STRUCTURE.md` for complete schema details.

````