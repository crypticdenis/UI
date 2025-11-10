# Butler Evaluation UI

A comprehensive React-based evaluation dashboard for analyzing LLM model performance across different test runs, workflows, and evaluation metrics.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UI
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database and user
   psql -U postgres
   CREATE DATABASE butler_eval;
   CREATE USER butler_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE butler_eval TO butler_user;
   \q

   # Run schema
   psql -U butler_user -d butler_eval -f database/schema.sql

   # (Optional) Load mock data
   psql -U butler_user -d butler_eval -f database/mock_data.sql
   ```

4. **Configure environment**
   
   Create `server/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=butler_eval
   DB_USER=butler_user
   DB_PASSWORD=your_password
   PORT=3001
   ```

5. **Start the application**
   ```bash
   # Terminal 1: Start backend
   cd server
   node server.js

   # Terminal 2: Start frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173` (or next available port)
   - Backend API: `http://localhost:3001`

---

## 📁 Project Structure

```
UI/
├── src/                          # Frontend source code
│   ├── App.jsx                   # Main application component
│   ├── components/
│   │   ├── NavigationSidebar.jsx # VS Code-style sidebar navigation
│   │   ├── ProjectsLandingPage.jsx # Project overview
│   │   ├── WorkflowsOverview.jsx   # Workflow listing
│   │   ├── SubWorkflowsView.jsx    # Subworkflow listing
│   │   ├── RunsOverview.jsx        # Run cards with aggregated metrics
│   │   ├── RunDetails.jsx          # Detailed run view with questions
│   │   ├── QuestionComparison.jsx  # Compare same question across runs
│   │   ├── Comparison.jsx          # Compare different runs
│   │   ├── FilterBar.jsx           # Filtering controls
│   │   ├── ColumnSettings.jsx      # Column visibility settings
│   │   ├── CollapsibleCell.jsx     # Expandable table cells
│   │   └── ContentViewer.jsx       # Modal for viewing full content
│   ├── utils/
│   │   └── metricUtils.js          # Dynamic metric detection & formatting
│   └── assets/                     # Static assets
├── server/
│   ├── server.js                   # Express backend API
│   └── package.json                # Backend dependencies
├── database/
│   ├── schema.sql                  # Database schema
│   └── mock_data.sql               # Sample data
└── public/                         # Static files

```

---

## 🏗️ Architecture

### Frontend (React + Vite)

**Technology Stack:**
- React 19.1.1
- Vite 7.2.0 (Build tool)
- CSS Modules (Styling)

**Key Features:**
- VS Code-style collapsible navigation sidebar
- Hierarchical data structure: Projects → Workflows → Subworkflows → Runs
- Dynamic metric detection and display
- Real-time filtering and sorting
- Comparison views for runs and questions
- Export functionality (CSV, JSON)

### Backend (Node.js + Express)

**Technology Stack:**
- Node.js with Express
- PostgreSQL (pg library)
- CORS enabled

**API Endpoints:**
- `GET /api/projects` - Fetch all projects
- `GET /api/projects/:id` - Fetch specific project
- `GET /api/workflows/:projectId` - Fetch workflows for a project
- `GET /api/runs/:workflowId` - Fetch runs for a workflow
- Additional endpoints for filtering and aggregations

### Database (PostgreSQL)

**Schema:**
- `projects` - Top-level projects
- `workflows` - Evaluation workflows
- `subworkflows` - Sub-components of workflows
- `ground_truth_data` - Expected inputs/outputs
- `test_runs` - Individual test executions
- `execution_data` - Run results and metrics

---

## 🎯 Core Concepts

### 1. **Hierarchical Organization**

```
Project (Butler Evaluation Project)
  └── Workflow (Main Butler Workflow)
       ├── Subworkflow (Question Answering)
       │    └── Run (run_gpt4_v1, run_claude_v1, ...)
       └── Subworkflow (RAG Performance)
            └── Run (run_gpt4_v1, run_gpt4_v2, ...)
```

### 2. **Dynamic Metrics System**

The UI automatically detects and displays any evaluation metrics in your database. No code changes needed to add new metrics!

**How it works:**
- Scans `execution_data` for numeric fields containing keywords: `score`, `rate`, `accuracy`, `precision`, `recall`, `f1`, `metric`
- Automatically formats field names (e.g., `outputScore` → "Output Score")
- Applies color coding based on score values
- Pairs metrics with their explanation fields (e.g., `outputScore` + `outputScoreReason`)

**Example:**
```json
{
  "execution_data": {
    "outputScore": 0.87,
    "outputScoreReason": "The output correctly addresses...",
    "ragRelevancyScore": 0.92,
    "hallucinationRate": 0.15,
    "customMetric": 0.78  // ✅ Automatically detected!
  }
}
```

### 3. **Color-Coded Scoring**

All numeric scores are automatically color-coded:
- **🟢 0.9-1.0**: Excellent (Dark Green)
- **🟢 0.8-0.9**: Good (Green)
- **🟡 0.7-0.8**: Fair (Light Green)
- **🟡 0.6-0.7**: Average (Yellow)
- **🟠 0.5-0.6**: Below Average (Orange)
- **🔴 0.4-0.5**: Poor (Dark Orange)
- **🔴 < 0.4**: Very Poor (Red)

---

## 🧩 Component Overview

### Navigation Components

**NavigationSidebar.jsx**
- VS Code-inspired collapsible sidebar
- Tree structure with expand/collapse functionality
- Auto-expands current navigation path
- Active state highlighting
- Resizable width (drag to resize)

### View Components

**ProjectsLandingPage.jsx**
- Grid of project cards
- Project creation functionality
- Project statistics

**WorkflowsOverview.jsx**
- List of workflows within a project
- Workflow metadata and run counts

**SubWorkflowsView.jsx**
- Display subworkflows for a workflow
- Navigate to subworkflow runs

**RunsOverview.jsx**
- Run cards with aggregated metrics
- Filtering by model, prompt version, version
- Search functionality
- Sort by any metric
- Overall grade calculation

**RunDetails.jsx**
- Detailed view of a single run
- Table of all questions with results
- Dynamic metric columns
- Filtering and sorting
- Click to compare questions

### Comparison Components

**QuestionComparison.jsx**
- Compare the same question across different runs
- Side-by-side view of inputs, outputs, and scores
- Delta calculations showing improvements/regressions
- Export to CSV/JSON

**Comparison.jsx**
- Compare different runs side-by-side
- Full execution data comparison
- Expandable content sections

### Utility Components

**CollapsibleCell.jsx**
- Expandable table cells for long content
- Preview with character limit
- Expand button for full view

**ContentViewer.jsx**
- Modal for viewing full content
- Syntax highlighting
- Copy to clipboard functionality

**FilterBar.jsx**
- Dynamic filtering controls
- Multiple filter types (dropdowns, search, range)

**ColumnSettings.jsx**
- Show/hide table columns
- Save preferences

---

## 📊 Key Features

### 1. **Dynamic Metrics**
- ✅ Add new evaluation metrics without code changes
- ✅ Automatic detection of numeric scores
- ✅ Smart field name formatting
- ✅ Color-coded visualization
- ✅ Reason/explanation pairing

### 2. **Powerful Filtering & Sorting**
- Filter by model, prompt version, run version
- Search across multiple fields
- Sort by any metric (ascending/descending)
- Filter question IDs and score ranges

### 3. **Comparison Tools**
- Compare same question across runs
- Compare different runs side-by-side
- Delta calculations with visual indicators
- Export comparisons

### 4. **Data Export**
- Export to CSV format
- Export to JSON format
- Include all metrics dynamically
- Comparison exports

### 5. **Responsive UI**
- Collapsible navigation sidebar
- Resizable sidebar width
- Expandable content cells
- Modal viewers for long content

---

## 🔧 Configuration

### Adding New Metrics

Simply add numeric fields to `execution_data` in your database:

```sql
INSERT INTO execution_data (test_run_id, output, 
  outputScore, outputScoreReason,
  coherenceScore, coherenceScoreReason,  -- ✅ New metric
  fluencyRating, fluencyRatingReason      -- ✅ New metric
) VALUES (...);
```

The UI will automatically:
- Display the new metrics
- Add them to sort/filter dropdowns
- Include them in exports
- Calculate aggregates
- Apply color coding

### Database Schema

See `database/schema.sql` for the complete database schema.

**Key tables:**
- `projects`: Top-level organization
- `workflows`: Evaluation workflows
- `subworkflows`: Workflow components
- `ground_truth_data`: Expected test data
- `test_runs`: Individual test executions
- `execution_data`: Results and metrics

---

## 🛠️ Development

### Running in Development Mode

```bash
# Frontend (with hot reload)
npm run dev

# Backend (with nodemon for auto-restart)
cd server
npx nodemon server.js
```

### Building for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📖 Usage Guide

### Viewing Evaluation Results

1. **Navigate to Projects** - See all available projects
2. **Select a Workflow** - Choose the workflow to analyze
3. **View Runs** - See all test runs with aggregated metrics
4. **Drill Down** - Click a run card to see detailed question results
5. **Compare** - Click "Compare" to analyze questions across runs

### Filtering Data

- Use the **search bar** to search across versions, models, and prompts
- Use **dropdown filters** for specific models or prompt versions
- Use **score range filters** to find questions in specific performance ranges

### Comparing Runs

**Option 1: Question Comparison**
- Open any run in detail view
- Click on a question row OR click the "Compare" button
- Select which runs to compare
- View side-by-side with delta calculations

**Option 2: Run Comparison**
- Navigate to comparison view from the main menu
- Select runs to compare
- See full execution data side-by-side

### Exporting Data

- **From Question Comparison**: Click "CSV" or "JSON" button
- **From Run Details**: Use export functionality in the toolbar
- Exports include all metrics dynamically

---

## 🐛 Troubleshooting

### Frontend won't start
- Check if port 5173 is available
- Vite will automatically try ports 5174, 5175, etc.
- Check `npm install` completed successfully

### Backend won't connect to database
- Verify PostgreSQL is running: `psql -U postgres`
- Check credentials in `server/.env`
- Verify database exists: `psql -U butler_user -d butler_eval`

### No data showing
- Check if database has data: Run queries from `database/mock_data.sql`
- Check browser console for API errors
- Verify backend is running on `http://localhost:3001`

### Metrics not showing
- Verify `execution_data` has numeric score fields
- Field names must contain keywords: score, rate, accuracy, etc.
- Check browser console for errors in `metricUtils.js`

---

## 📚 Additional Documentation

- **Database Setup**: See `DATABASE_SETUP.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Dynamic Metrics**: See `DYNAMIC_METRICS.md`
- **Comparing Runs**: See `COMPARING_RUNS.md`

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📝 License

[Your License Here]

---

## 👥 Authors

[Your Name/Team]

---

## 🙏 Acknowledgments

Built with React, Vite, Express, and PostgreSQL.
