# Butler Evaluation UI

A comprehensive React-based evaluation dashboard for analyzing LLM model performance across different test runs, workflows, and evaluation metrics.

## 🚀 Quick Start

### Docker Deployment (Recommended) 🐳

The easiest and recommended way to run the application:

```bash
cd docker
cp .env.example .env
# Edit .env with your database credentials
./start.sh
```

**Access at:**
- Frontend: http://localhost:5174
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/api/health

**Features:**
- ✅ Automatic setup with Docker Compose
- ✅ Frontend (React + Vite + Nginx)
- ✅ Backend (Node.js + Express)
- ✅ Configurable environment variables
- ✅ Works with existing PostgreSQL database

📖 **Full Docker documentation:** See [`docker/README.md`](docker/README.md) and [`docker/DEPLOYMENT_DE.md`](docker/DEPLOYMENT_DE.md)

---

### Manual Setup (Development)

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
   
   📖 See [`docs/db/DATABASE_SETUP_GUIDE.md`](docs/db/DATABASE_SETUP_GUIDE.md) for detailed instructions.
   
   Quick setup:
   ```bash
   # Create database
   createdb butler_eval
   
   # Load schema
   psql -U postgres -d butler_eval -f database/schema_new.sql
   
   # (Optional) Load mock data
   psql -U postgres -d butler_eval -f database/mock_data_new.sql
   ```

4. **Configure environment**
   
   Create `server/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=butler_eval
   DB_USER=postgres
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
│   │   ├── CollapsibleCell.jsx
│   │   ├── ContentViewer.jsx
│   │   ├── EvaluationTrigger.jsx
│   │   └── NavigationSidebar.jsx
│   │
│   ├── views/                    # Page-level components
│   │   ├── ProjectsLandingPage.jsx
│   │   ├── QuestionComparison.jsx    # Compare same execution across runs
│   │   ├── RunComparison.jsx         # Compare multiple complete runs
│   │   ├── RunDetails.jsx
│   │   ├── RunsOverview.jsx
│   │   └── WorkflowsOverview.jsx
│   │
│   ├── styles/                   # CSS stylesheets
│   │   ├── App.css               # Main styles with CSS variables
│   │   ├── NavigationSidebar.css
│   │   └── index.css
│   │
│   ├── utils/                    # Utility functions
│   │   └── metricUtils.js        # Dynamic metric detection & formatting
│   │
│   └── assets/                   # Static assets
│
├── server/                       # Backend API
│   ├── server.js                 # Express server with PostgreSQL
│   └── package.json              # Backend dependencies
│
├── database/                     # Database files
│   ├── schema_new.sql            # Current database schema (evaluation.*)
│   ├── mock_data_new.sql         # Sample data
│   └── DATABASE_GUIDE.md         # Database structure documentation
│
├── docs/                         # Documentation
│   ├── README.md                 # Documentation overview
│   └── db/                       # Database documentation
│       ├── DATABASE_SETUP_GUIDE.md
│       ├── DATABASE_STRUCTURE.md
│       ├── DYNAMIC_METRICS.md
│       └── HIERARCHY_STRUCTURE.md
│
├── docker/                       # Docker deployment
│   ├── docker-compose.yml        # Container orchestration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── start.sh                  # Quick start script
│   └── README.md                 # Docker documentation
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

**Schema:** Uses `evaluation` namespace for all tables

- `evaluation.test_run` - Test run metadata per workflow
- `evaluation.test_execution` - Individual test executions (with hierarchical parent tracking)
- `evaluation.test_response` - Actual output/responses
- `evaluation.evaluation` - Dynamic evaluation metrics

See `database/DATABASE_GUIDE.md` and `docs/db/DATABASE_STRUCTURE.md` for complete schema details.

---

## 🎯 Core Concepts

### 1. **Hierarchical Organization**

```
Workflow (e.g., "RE_Butler", "RAG_Search")
  └── Test Runs (independent test executions)
       └── Test Executions (individual questions/tests)
            └── Sub-Executions (optional, for subworkflow calls)
```

**Key Concepts:**
- Each workflow has independent test runs
- Sub-executions track subworkflow calls (debugging only, hidden from UI)
- No project/workflow tables - simplified flat structure

### 2. **Dynamic Metrics System**

The UI automatically detects and displays any evaluation metrics in your database. No code changes needed to add new metrics!

**How it works:**
- Reads metrics from `evaluation.evaluation` table with flexible `metric_name` and `metric_value` fields
- Automatically formats metric names (e.g., `output_score` → "Output Score")
- Applies color coding based on score values (0-1 scaled metrics only)
- Displays metric reasons when available

**Example:**
```sql
INSERT INTO evaluation.evaluation (test_execution_id, metric_name, metric_value, metric_reason)
VALUES 
  (1, 'accuracy', 0.87, 'The output correctly addresses...'),
  (1, 'relevance', 0.92, 'Highly relevant to the query'),
  (1, 'custom_metric', 0.78, 'Custom evaluation criteria met');
  -- ✅ All automatically detected and displayed!
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

**RunsOverview.jsx** - All runs with filtering, sorting, metrics, and comparison selection

**RunDetails.jsx** - Detailed view of a single run with all executions and aggregate statistics

**RunComparison.jsx** - Side-by-side comparison of multiple complete runs with percentage differences

**QuestionComparison.jsx** - Compare the same execution across different runs with percentage tracking

### UI Components (`src/components/`)

**NavigationSidebar.jsx** - Collapsible navigation with dual-mode sub-execution handling (expand vs navigate)

**CollapsibleCell.jsx** - Expandable table cells for long content

**ContentViewer.jsx** - Modal viewer for full content display

**EvaluationTrigger.jsx** - Trigger evaluation workflows

---

## 📊 Key Features

### 1. **Dynamic Metrics**
- ✅ Add new evaluation metrics without code changes
- ✅ Automatic detection of numeric scores
- ✅ Smart field name formatting
- ✅ Color-coded visualization
- ✅ Reason/explanation pairing

### 2. **Powerful Filtering & Sorting**
- Search with Ctrl+K keyboard shortcut
- Filter by workflow, run ID, session
- Sort by any metric (ascending/descending)
- Dynamic field detection and display

### 3. **Comparison Tools**
- **Run Comparison**: Compare multiple complete runs side-by-side
- **Question Comparison**: Compare same execution across runs
- **Percentage Differences**: Shows % change from baseline (green=improvement, red=decline)
- **Sticky Compare Button**: Floating button when 2+ runs selected
- **Smart Metric Filtering**: Only applies color coding to 0-1 scaled metrics

### 4. **Sub-Execution Navigation**
- **Dual Navigation Modes**: Expand in-place or navigate to standalone view
- **Circle Indicators**: Click circles to expand sub-executions inline
- **View Workflow Buttons**: Navigate to dedicated sub-execution view
- **Hierarchical Display**: Parent-child execution tracking

### 5. **Responsive UI**
- Collapsible navigation sidebar
- Orange accent color (#ff900c) throughout
- Consistent border-radius (12px) and spacing
- Expandable content cells
- Modal viewers for long content
- Smooth animations and transitions

---

## 🔧 Configuration

### Adding New Metrics

Simply add rows to the `evaluation.evaluation` table:

```sql
INSERT INTO evaluation.evaluation (test_execution_id, metric_name, metric_value, metric_reason)
VALUES 
  (1, 'coherence', 0.85, 'Output is coherent and logical'),
  (1, 'fluency', 0.92, 'Natural language flow');
  -- ✅ UI automatically detects and displays these
```

The UI will automatically:
- Display the new metrics with formatted names
- Apply color coding for 0-1 scaled values
- Show metric reasons when available
- Calculate aggregates across runs
- Include in comparison views with percentage differences

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
- **Docker**: Set `DB_HOST=host.docker.internal` in `docker/.env`
- **Manual**: Verify PostgreSQL is running: `psql -U postgres`
- Check credentials in `server/.env` or `docker/.env`
- Verify database exists: `psql -U postgres -d butler_eval`

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

### Deployment
- **Docker Setup**: [`docker/README.md`](docker/README.md) - Docker deployment guide (English)
- **Docker Deployment**: [`docker/DEPLOYMENT_DE.md`](docker/DEPLOYMENT_DE.md) - Detailed deployment guide (German)
- **Documentation Hub**: [`docs/README.md`](docs/README.md) - Complete documentation overview

### Database
- **Database Setup**: [`docs/db/DATABASE_SETUP_GUIDE.md`](docs/db/DATABASE_SETUP_GUIDE.md) - Quick start guide
- **Database Structure**: [`docs/db/DATABASE_STRUCTURE.md`](docs/db/DATABASE_STRUCTURE.md) - Complete schema documentation
- **Dynamic Metrics**: [`docs/db/DYNAMIC_METRICS.md`](docs/db/DYNAMIC_METRICS.md) - How the metrics system works
- **Data Hierarchy**: [`docs/db/HIERARCHY_STRUCTURE.md`](docs/db/HIERARCHY_STRUCTURE.md) - Understanding the data structure

---
