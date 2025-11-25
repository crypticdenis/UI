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
psql -U postgres -d butler_eval -f database/schema_new.sql

# Or if using butler_user:
psql -U butler_user -d butler_eval -f database/schema_new.sql
```

**That's it!** Your database structure is ready.

---

## 📋 Verify Setup

### Check Tables Created
```bash
psql -U postgres -d butler_eval -c "\dt evaluation.*"
```

**Expected Output** (tables in evaluation schema):
```
 evaluation.test_run
 evaluation.test_execution
 evaluation.test_response
 evaluation.evaluation
```

### View Schema Details
```bash
psql -U postgres -d butler_eval -c "\d+ evaluation.test_run"
```

---

## 📊 Load Sample Data (Optional)

Load the provided mock data:
```bash
psql -U postgres -d butler_eval -f database/mock_data_new.sql
```

Or create a minimal example manually:
```sql
-- Connect to database
psql -U postgres -d butler_eval

-- Create a test run
INSERT INTO evaluation.test_run (workflow_id, start_ts)
VALUES ('RE_Butler', NOW())
RETURNING id;

-- Create a test execution (use the returned run id)
INSERT INTO evaluation.test_execution (
    run_id, workflow_id, session_id,
    input, expected_output, duration, total_tokens
) VALUES (
    1, 'RE_Butler', 'session-demo',
    'What is 2+2?', '4', 1.5, 150
) RETURNING id;

-- Create test response (use the returned execution id)
INSERT INTO evaluation.test_response (test_execution_id, actual_output)
VALUES (1, 'The answer is 4');

-- Create evaluations (use the returned execution id)
INSERT INTO evaluation.evaluation (test_execution_id, workflow_id, metric_name, metric_value, metric_reason)
VALUES
    (1, 'REG_TEST', 'output_score', 0.95, 'Correct answer provided'),
    (1, 'REG_TEST', 'relevancy_score', 0.90, 'Highly relevant to question');
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
TRUNCATE evaluation.test_run CASCADE;  -- Removes all data, keeps structure
```

---

## 📖 Additional Resources

### Useful Commands

**See all data**:
```sql
SELECT
    'test_run' as table_name, COUNT(*) FROM evaluation.test_run
UNION ALL SELECT 'test_execution', COUNT(*) FROM evaluation.test_execution
UNION ALL SELECT 'test_response', COUNT(*) FROM evaluation.test_response
UNION ALL SELECT 'evaluation', COUNT(*) FROM evaluation.evaluation;
```

**View hierarchy**:
```sql
SELECT
    tr.workflow_id,
    tr.id as run_id,
    tr.start_ts,
    COUNT(te.id) as execution_count
FROM evaluation.test_run tr
LEFT JOIN evaluation.test_execution te ON te.run_id = tr.id
WHERE te.parent_execution_id IS NULL  -- Only count root executions
GROUP BY tr.workflow_id, tr.id, tr.start_ts
ORDER BY tr.start_ts DESC;
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

- [ ] 4 tables exist in evaluation schema (`\dt evaluation.*` shows all)
- [ ] Backend connects to database
- [ ] API endpoint responds: `GET http://localhost:3001/api/workflows`
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