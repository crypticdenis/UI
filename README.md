# Butler Evaluation UI

A comprehensive React-based evaluation dashboard for analyzing LLM model performance across different test runs, workflows, and evaluation metrics.

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

The easiest way to run the application is using Docker:

```bash
cd docker
cp .env.example .env
# Edit .env with your database credentials
./start.sh
```

Access at:
- Frontend: http://localhost:5174
- Backend: http://localhost:3001/api

📖 **Full Docker documentation:** See [`docker/README.md`](docker/README.md) and [`docker/DEPLOYMENT_DE.md`](docker/DEPLOYMENT_DE.md)

### Option 2: Manual Setup

#### Prerequisites

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
│   ├── main.jsx                  # Application entry point
│   │
│   ├── components/               # Reusable UI components
│   │   ├── AuthWrapper.jsx
│   │   ├── CollapsibleCell.jsx
│   │   ├── ColumnSettings.jsx
│   │   ├── ContentViewer.jsx
│   │   ├── EvaluationTrigger.jsx
│   │   ├── FilterBar.jsx
│   │   ├── Modal.jsx
│   │   ├── NavigationSidebar.jsx
│   │   └── RunTable.jsx
│   │
│   ├── views/                    # Page-level components
│   │   ├── Comparison.jsx
│   │   ├── ProjectsLandingPage.jsx
│   │   ├── QuestionComparison.jsx
│   │   ├── RunDetails.jsx
│   │   ├── RunsOverview.jsx
│   │   ├── SubWorkflowsView.jsx
│   │   └── WorkflowsOverview.jsx
│   │
│   ├── styles/                   # CSS stylesheets
│   │   ├── App.css
│   │   ├── NavigationSidebar.css
│   │   └── index.css
│   │
│   ├── utils/                    # Utility functions
│   │   └── metricUtils.js        # Dynamic metric detection
│   │
│   └── assets/                   # Static assets
│
├── server/                       # Backend API
│   ├── server.js                 # Express server
│   └── package.json              # Backend dependencies
│
├── database/                     # Database files
│   ├── schema.sql                # Database schema
│   ├── mock_data.sql             # Sample data
│   ├── cleanup.sql               # Maintenance scripts
│   ├── export_database.sh        # Backup scripts
│   ├── ARCHITECTURE_DIAGRAM.md   # Schema diagrams
│   └── VISUAL_SCHEMA.md          # ERD visualizations
│
├── docs/                         # Documentation
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── GITHUB_DEPLOYMENT.md      # GitHub Pages guide
│   └── db/                       # Database documentation
│       ├── DATABASE_SETUP.md
│       ├── DATABASE_SETUP_GUIDE.md
│       ├── DATABASE_STRUCTURE.md
│       ├── DYNAMIC_METRICS.md
│       └── HIERARCHY_STRUCTURE.md
│
└── public/                       # Static files
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
- `GET /api/projects` - Fetch all projects with full hierarchy
- Additional endpoints for workflows, runs, and metrics

### Database (PostgreSQL)

**Schema:**
- `projects` - Top-level organization
- `workflows` - Evaluation workflows
- `subworkflows` - Workflow components
- `runs` - Test run metadata
- `run_questions` - Questions in each run
- `question_evaluations` - Evaluation results and metrics

See `docs/db/DATABASE_STRUCTURE.md` for complete schema details.

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

### View Components (`src/views/`)

**ProjectsLandingPage.jsx** - Main landing page showing all projects

**WorkflowsOverview.jsx** - Workflows within a selected project

**SubWorkflowsView.jsx** - Subworkflows and their runs

**RunsOverview.jsx** - All runs with filtering, sorting, and metrics

**RunDetails.jsx** - Detailed view of a single run with all questions

**Comparison.jsx** - Side-by-side comparison of multiple runs

**QuestionComparison.jsx** - Compare the same question across different runs

### UI Components (`src/components/`)

**NavigationSidebar.jsx** - VS Code-style collapsible navigation

**RunTable.jsx** - Reusable table component for displaying runs

**FilterBar.jsx** - Dynamic filtering controls

**ColumnSettings.jsx** - Show/hide table columns

**CollapsibleCell.jsx** - Expandable table cells for long content

**ContentViewer.jsx** - Modal viewer for full content

**Modal.jsx** - Reusable modal dialog

**AuthWrapper.jsx** - Authentication wrapper

**EvaluationTrigger.jsx** - Trigger evaluation component

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

See `database/schema.sql` for the complete database schema or `docs/db/DATABASE_STRUCTURE.md` for detailed documentation.

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

- **Database Setup**: `docs/db/DATABASE_SETUP_GUIDE.md` - Quick start guide
- **Database Structure**: `docs/db/DATABASE_STRUCTURE.md` - Complete schema documentation
- **Dynamic Metrics**: `docs/db/DYNAMIC_METRICS.md` - How the metrics system works
- **Data Hierarchy**: `docs/db/HIERARCHY_STRUCTURE.md` - Understanding the data structure
- **Deployment**: `docs/DEPLOYMENT.md` - Production deployment guide
- **GitHub Pages**: `docs/GITHUB_DEPLOYMENT.md` - Deploy to GitHub Pages

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
