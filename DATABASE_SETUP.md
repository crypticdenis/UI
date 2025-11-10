# PostgreSQL Database Setup Guide

This guide will help you set up the PostgreSQL database for the Butler Evaluation project.

## Prerequisites

- PostgreSQL installed on your system
- Node.js and npm installed

## Step 1: Install PostgreSQL

### macOS (using Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Windows:
Download and install from: https://www.postgresql.org/download/windows/

## Step 2: Create Database and User

Open PostgreSQL terminal:
```bash
psql postgres
```

Run the following SQL commands:
```sql
-- Create user
CREATE USER butler_user WITH PASSWORD 'butler123';

-- Create database
CREATE DATABASE butler_eval OWNER butler_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE butler_eval TO butler_user;

-- Exit
\q
```

## Step 3: Initialize Database Schema

From the project root directory:
```bash
PGPASSWORD=butler123 psql -U butler_user -d butler_eval -f database/schema.sql
```

## Step 4: Load Mock Data

```bash
PGPASSWORD=butler123 psql -U butler_user -d butler_eval -f database/mock_data.sql
```

## Step 5: Install Server Dependencies

Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

## Step 6: Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` if you need to change any database credentials.

## Step 7: Start the Backend Server

```bash
npm start
```

The server will start on http://localhost:3001

## Step 8: Start the Frontend

In a new terminal, from the project root:
```bash
npm run dev
```

The frontend will start on http://localhost:5173

## Verify Setup

1. Check database connection:
   ```bash
   curl http://localhost:3001/health
   ```

2. Fetch projects:
   ```bash
   curl http://localhost:3001/api/projects
   ```

## Troubleshooting

### Connection Issues
If you can't connect to PostgreSQL:
- Verify PostgreSQL is running: `brew services list` (macOS) or `systemctl status postgresql` (Linux)
- Check your credentials in `.env`
- Ensure the database exists: `psql -U butler_user -d butler_eval -c "SELECT 1;"`

### Port Already in Use
If port 3001 is already in use:
- Change `PORT` in `server/.env`
- Update API calls in frontend code accordingly

### Permission Issues
If you get permission errors:
```sql
-- Connect to database
psql -U butler_user -d butler_eval

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO butler_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO butler_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO butler_user;
```

## API Endpoints

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

### Health
- `GET /health` - Check server and database health

## Database Schema

The database has the following structure:
- **projects** - Top level projects
- **workflows** - Workflows belonging to projects
- **subworkflows** - Subworkflows belonging to workflows
- **runs** - Evaluation runs (can belong to either workflows or subworkflows)

Each run contains:
- Ground truth data (input, expected output)
- Execution data (actual output, scores, reasons)
- Model and prompt version information
- Timestamps and metadata

## Adding New Data

You can add new data through:
1. The API endpoints (POST requests)
2. Direct SQL inserts
3. Importing from external sources

Example: Add a new run via API:
```bash
curl -X POST http://localhost:3001/api/runs \
  -H "Content-Type: application/json" \
  -d '{
    "id": "new-run-1",
    "workflow_id": "wf-1",
    "base_id": 7,
    "version": "v3.0",
    "model": "gpt-4-turbo",
    "prompt_version": "v3.0",
    "timestamp": "2025-11-07T10:00:00",
    "input_text": "Test question",
    "expected_output": "Expected answer",
    "output": "Actual answer",
    "output_score": 0.85
  }'
```
