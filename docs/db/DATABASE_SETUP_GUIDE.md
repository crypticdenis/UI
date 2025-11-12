````markdown
# Butler Eval - Database Setup Guide

**Prerequisites**: PostgreSQL 14+ installed

> 💡 **Using Docker?** The Docker deployment connects to your existing PostgreSQL database automatically.  
> See [`docker/README.md`](../../docker/README.md) for containerized deployment.

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Database
```bash
# Create database
createdb butler_eval

# Or using psql:
psql -U postgres -c "CREATE DATABASE butler_eval;"
```

### Step 2: Create User (Optional but Recommended)
```bash
psql -U postgres -d butler_eval <<EOF
CREATE USER butler_user WITH PASSWORD 'butler123';
GRANT ALL PRIVILEGES ON DATABASE butler_eval TO butler_user;
GRANT ALL ON SCHEMA public TO butler_user;
EOF
```

### Step 3: Load Schema
```bash
# From project root directory
psql -U postgres -d butler_eval -f database/schema.sql

# Or if using butler_user:
psql -U butler_user -d butler_eval -f database/schema.sql
```

**That's it!** Your database structure is ready.

---

## 📋 Verify Setup

### Check Tables Created
```bash
psql -U postgres -d butler_eval -c "\dt"
```

**Expected Output** (6 tables):
```
 projects
 workflows
 subworkflows
 runs
 run_questions
 question_evaluations
```

### View Schema Details
```bash
psql -U postgres -d butler_eval -c "\d+ runs"
```

---

## 📊 Load Sample Data (Optional)

If `database/mock_data.sql` is provided:
```bash
psql -U postgres -d butler_eval -f database/mock_data.sql
```

Otherwise, create a minimal example:
```sql
-- Connect to database
psql -U postgres -d butler_eval

-- Create sample project
INSERT INTO projects (id, name, description, created_at, updated_at) VALUES
('proj-demo', 'Demo Project', 'Sample evaluation project', NOW(), NOW());

-- Create sample workflow
INSERT INTO workflows (id, project_id, name, description, created_at, updated_at) VALUES
('wf-demo', 'proj-demo', 'Demo Workflow', 'Sample workflow', NOW(), NOW());

-- Create sample subworkflow
INSERT INTO subworkflows (id, workflow_id, name, description, created_at, updated_at) VALUES
('subwf-demo', 'wf-demo', 'Demo Subworkflow', 'Sample subworkflow', NOW(), NOW());

-- Create sample run
INSERT INTO runs (
    id, subworkflow_id, base_id, version, model, prompt_version, timestamp,
    input_text, expected_output, output,
    output_score, rag_relevancy_score, hallucination_rate, 
    system_prompt_alignment_score, test_score
) VALUES (
    '1-demo_v1', 'subwf-demo', 1, 'demo_v1', 'gpt-4', 'v1.0', NOW(),
    'What is 2+2?', '4', 'The answer is 4',
    0.95, 0.90, 0.05, 0.92, 0.88
);
```

---

## 🔧 Backend Configuration

### Update Connection String

Edit `server/.env` or `server/server.js`:
```javascript
const pool = new Pool({
  user: 'butler_user',     // or 'postgres'
  host: 'localhost',
  database: 'butler_eval',
  password: 'butler123',
  port: 5432,
});
```

### Start Backend
```bash
cd server
npm install     # if first time
node server.js
```

**Expected Output**:
```
🚀 Server running on http://localhost:3001
📊 API available at http://localhost:3001/api
✅ Database connected successfully
```

### Test API
```bash
curl http://localhost:3001/api/projects
```

---

## 📚 Understanding the Structure

### Key Concepts

**Hierarchy**:
```
projects → workflows → subworkflows → runs → questions
```

**Dynamic Metrics**:
- Any column with numeric scores automatically displays in UI
- Add new metric = just add column to `question_evaluations` table
- No frontend code changes needed!

**Data Flow**:
```
Evaluation Script → Database → Backend API → Frontend UI
```

### Learn More
- **Complete schema**: `docs/db/DATABASE_STRUCTURE.md`
- **Visual diagrams**: `database/VISUAL_SCHEMA.md`
- **Data hierarchy**: `docs/db/HIERARCHY_STRUCTURE.md`

---

## 🆘 Troubleshooting

### "Database does not exist"
```bash
createdb butler_eval
```

### "Permission denied"
```bash
# Grant permissions
psql -U postgres -d butler_eval -c "GRANT ALL ON SCHEMA public TO butler_user;"
```

### "Cannot connect to server"
```bash
# Check PostgreSQL is running
pg_isready

# Start if needed (macOS):
brew services start postgresql@14

# Start if needed (Linux):
sudo systemctl start postgresql
```

---

## 🔄 Resetting Database

### Drop and Recreate
```bash
dropdb butler_eval
createdb butler_eval
psql -U postgres -d butler_eval -f database/schema.sql
```

### Or Just Truncate Data
```sql
TRUNCATE projects CASCADE;  -- Removes all data, keeps structure
```

---

## 📖 Additional Resources

### Useful Commands

**See all data**:
```sql
SELECT 
    'projects' as table_name, COUNT(*) FROM projects
UNION ALL SELECT 'workflows', COUNT(*) FROM workflows
UNION ALL SELECT 'subworkflows', COUNT(*) FROM subworkflows
UNION ALL SELECT 'runs', COUNT(*) FROM runs;
```

**View hierarchy**:
```sql
SELECT 
    p.name as project,
    w.name as workflow,
    sw.name as subworkflow,
    COUNT(r.id) as run_count
FROM projects p
LEFT JOIN workflows w ON w.project_id = p.id
LEFT JOIN subworkflows sw ON sw.workflow_id = w.id
LEFT JOIN runs r ON r.subworkflow_id = sw.id
GROUP BY p.name, w.name, sw.name;
```

**Backup database**:
```bash
pg_dump -U postgres -d butler_eval -f backup_$(date +%Y%m%d).sql
```

**Restore database**:
```bash
psql -U postgres -d butler_eval -f backup_20251110.sql
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] 6 tables exist (`\dt` shows all)
- [ ] Backend connects to database
- [ ] API endpoint responds: `GET http://localhost:3001/api/projects`
- [ ] No errors in backend logs
- [ ] Can insert sample data successfully

---

## 🎯 Next Steps

1. ✅ Database setup complete
2. 📖 Read `DATABASE_STRUCTURE.md` for detailed schema information
3. 🔧 Configure backend connection
4. 🚀 Start backend and test API
5. 💻 Run frontend and verify UI displays data

**Questions?** See `DATABASE_STRUCTURE.md` for detailed table documentation and query examples.

````