# Butler Evaluation System - PostgreSQL Database Integration

This project has been successfully integrated with a PostgreSQL database backend. All evaluation data is now stored in and retrieved from the database instead of static JSON files.

## 🎯 What Was Set Up

### Database Structure
- **PostgreSQL Database**: `butler_eval`
- **Database User**: `butler_user` (password: `butler123`)
- **Tables**:
  - `projects` - Top-level evaluation projects
  - `workflows` - Workflows belonging to projects
  - `subworkflows` - Subworkflows belonging to workflows
  - `runs` - Individual evaluation runs with all metrics and scores

### Backend API Server
- **Technology**: Node.js + Express
- **Port**: 3001
- **Location**: `/server` directory
- **Features**:
  - RESTful API for all CRUD operations
  - Hierarchical data structure matching the frontend needs
  - CORS enabled for local development

### Frontend Updates
- Updated to fetch data from API instead of JSON files
- Loading and error states added
- Environment-based API URL configuration

## 🚀 Quick Start

### 1. Ensure PostgreSQL is Running
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# If not running, start it
brew services start postgresql@15
```

### 2. Start the Backend Server
```bash
cd server
node server.js &
```

The server will start on http://localhost:3001

### 3. Start the Frontend
```bash
# From the project root
npm run dev
```

The frontend will start on http://localhost:5173

### 4. Access the Application
Open your browser to http://localhost:5173

## 📊 Current Data

The database is populated with all your existing mock data:
- 1 Project: "Butler Evaluation Project"
- 1 Main Workflow: "Main Butler Workflow" with 6 runs
- 2 Subworkflows:
  - "Question Answering Subworkflow" with 5 runs
  - "RAG Performance Subworkflow" with 4 runs
- **Total**: 15 evaluation runs

## 🔌 API Endpoints

### Projects
- `GET /api/projects` - Get all projects with full hierarchy
- `GET /api/projects/:projectId` - Get a specific project
- `POST /api/projects` - Create a new project

### Workflows
- `GET /api/workflows/:workflowId/runs` - Get all runs for a workflow
- `POST /api/workflows` - Create a new workflow

### Subworkflows
- `GET /api/subworkflows/:subworkflowId/runs` - Get all runs for a subworkflow
- `POST /api/subworkflows` - Create a new subworkflow

### Runs
- `GET /api/runs/:runId` - Get a specific run
- `POST /api/runs` - Create a new run
- `PUT /api/runs/:runId` - Update a run

### Health Check
- `GET /health` - Check server and database health

## 💾 Adding New Data

### Option 1: Via API (Recommended)
You can add new evaluation runs through the API:

```bash
curl -X POST http://localhost:3001/api/runs \
  -H "Content-Type: application/json" \
  -d '{
    "id": "new-run-123",
    "workflow_id": "wf-1",
    "base_id": 7,
    "version": "v3.0",
    "active": false,
    "is_running": false,
    "model": "gpt-4-turbo",
    "prompt_version": "v3.0",
    "timestamp": "2025-11-07T10:00:00",
    "ground_truth_id": "GT007",
    "input_text": "What is the benefit of Smart Immo+?",
    "expected_output": "Expected answer here...",
    "execution_id": "EX007",
    "output": "Actual AI output here...",
    "output_score": 0.85,
    "output_score_reason": "Good answer quality",
    "rag_relevancy_score": 0.90,
    "rag_relevancy_score_reason": "Excellent context retrieval",
    "hallucination_rate": 0.15,
    "hallucination_rate_reason": "Low hallucination",
    "system_prompt_alignment_score": 0.88,
    "system_prompt_alignment_score_reason": "Strong alignment"
  }'
```

### Option 2: Direct SQL
Connect to the database and insert data:

```bash
PGPASSWORD=butler123 psql -U butler_user -d butler_eval

INSERT INTO runs (id, workflow_id, base_id, version, ...) VALUES (...);
```

### Option 3: External Tools
You can use any PostgreSQL-compatible tool to connect and manage data:
- **pgAdmin**: https://www.pgadmin.org/
- **DBeaver**: https://dbeaver.io/
- **DataGrip**: https://www.jetbrains.com/datagrip/

**Connection Details**:
- Host: localhost
- Port: 5432
- Database: butler_eval
- Username: butler_user
- Password: butler123

## 🔧 Maintenance

### View Database Content
```bash
# Connect to database
PGPASSWORD=butler123 psql -U butler_user -d butler_eval

# List all runs
SELECT id, model, prompt_version, output_score FROM runs;

# Count runs by version
SELECT version, COUNT(*) FROM runs GROUP BY version;

# Exit
\q
```

### Backup Database
```bash
PGPASSWORD=butler123 pg_dump -U butler_user butler_eval > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
PGPASSWORD=butler123 psql -U butler_user -d butler_eval < backup_20251107.sql
```

### Reset Database (Clean Start)
```bash
# Drop and recreate
PGPASSWORD=butler123 psql -U butler_user -d butler_eval -f database/schema.sql

# Load mock data
PGPASSWORD=butler123 psql -U butler_user -d butler_eval -f database/mock_data.sql
```

## 📁 File Structure

```
/Users/denis/Documents/UI/
├── database/
│   ├── schema.sql           # Database schema definition
│   └── mock_data.sql        # Initial mock data
├── server/
│   ├── server.js            # Express API server
│   ├── package.json         # Server dependencies
│   ├── .env                 # Server configuration
│   └── .env.example         # Example configuration
├── src/
│   ├── App.jsx             # Updated to use API
│   └── ... (other components)
├── .env                     # Frontend API configuration
└── DATABASE_SETUP.md       # Detailed setup guide
```

## 🐛 Troubleshooting

### Server Won't Start
1. Check if port 3001 is available:
   ```bash
   lsof -i :3001
   ```
2. Kill any process using the port:
   ```bash
   kill -9 $(lsof -t -i:3001)
   ```

### Database Connection Error
1. Verify PostgreSQL is running:
   ```bash
   brew services list | grep postgresql
   ```
2. Test connection:
   ```bash
   PGPASSWORD=butler123 psql -U butler_user -d butler_eval -c "SELECT 1;"
   ```

### Frontend Shows Error
1. Ensure backend is running:
   ```bash
   curl http://localhost:3001/health
   ```
2. Check browser console for detailed errors
3. Verify `.env` has correct API URL

## 🔐 Security Notes

**For Production**:
1. Change database password
2. Use environment variables for all credentials
3. Add authentication/authorization to API
4. Use HTTPS
5. Restrict CORS to specific domains
6. Use connection pooling limits
7. Implement rate limiting

## 📈 Next Steps

You can now:
1. ✅ View existing evaluation data from the database
2. ✅ Add new runs through the API
3. ✅ Modify data from external tools (pgAdmin, etc.)
4. ✅ Integrate with CI/CD pipelines
5. ✅ Export data for analysis
6. ✅ Build automated evaluation workflows

## 📞 Support

For issues or questions:
1. Check `DATABASE_SETUP.md` for detailed setup instructions
2. Review server logs in `server/server.log`
3. Check database with: `PGPASSWORD=butler123 psql -U butler_user -d butler_eval`

---

**Setup completed on**: November 7, 2025
**Database**: PostgreSQL 15.x
**Backend**: Node.js + Express
**Frontend**: React + Vite
