# Butler Eval Database - Quick Start Guide

**For**: New developers joining the project  
**Date**: November 10, 2025  
**Status**: Backend ✅ Running | Frontend ✅ Running | Database ✅ Connected

---

## 🚀 What You Need to Know in 5 Minutes

### The System Works Like This:

1. **Data Source**: 85 evaluation records in `question_evaluations` table
2. **Backend**: Node.js server reads from database, serves via API
3. **Dynamic System**: Any `*_score` or `*_rate` column automatically shows in UI
4. **Frontend**: React app with color-coded metric visualization

### Current Situation:

✅ **What's Working**:
- Evaluations stored and accessible
- Backend API serving data dynamically
- UI displaying 5 metrics per question
- New metrics appear automatically

⚠️ **What's Messy**:
- 7 tables exist, but only 1 has data
- Duplicate table (`subflows`) should be deleted
- Hierarchical structure defined but unused

---

## 💻 How to Run Locally

### Start Backend:
```bash
cd /Users/denis/Documents/UI/server
node server.js
```
**Should see**: `🚀 Server running on http://localhost:3001`

### Start Frontend:
```bash
cd /Users/denis/Documents/UI
npm run dev
```
**Should see**: `Local: http://localhost:5174`

### Access Database:
```bash
psql -U denis -d butler_eval
```

---

## 🔍 Quick Database Checks

### See Your Data:
```sql
-- Count evaluations
SELECT COUNT(*) FROM question_evaluations;
-- Should return: 85

-- View sample data
SELECT id, output_score, rag_relevancy_score, test_score 
FROM question_evaluations 
LIMIT 5;

-- Average scores
SELECT 
    ROUND(AVG(output_score)::numeric, 2) as avg_output,
    ROUND(AVG(rag_relevancy_score)::numeric, 2) as avg_rag,
    ROUND(AVG(test_score)::numeric, 2) as avg_test
FROM question_evaluations;
```

### Check Table Status:
```sql
SELECT 
    tablename,
    n_live_tup as rows,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

---

## ➕ How to Add a New Evaluation Metric

Let's say you want to add "coherence_score":

### Step 1: Add to Database
```sql
-- Connect to database
psql -U denis -d butler_eval

-- Add column
ALTER TABLE question_evaluations 
ADD COLUMN coherence_score numeric(3,2);

-- Populate with test data
UPDATE question_evaluations 
SET coherence_score = 0.92 
WHERE id IN (1, 2, 3);
```

### Step 2: Sync to Runs Table (if using denormalized approach)
```sql
-- Add to runs table
ALTER TABLE runs 
ADD COLUMN coherence_score numeric(5,4);

-- Copy data
UPDATE runs r 
SET coherence_score = (
    SELECT qe.coherence_score 
    FROM question_evaluations qe 
    WHERE qe.question_id = r.base_id
);
```

### Step 3: Restart Backend
```bash
# Kill the running server (Ctrl+C)
# Then restart:
cd server && node server.js
```

### Step 4: Refresh Frontend
Just reload your browser - **the new metric appears automatically!**

No React code changes needed. The dynamic system detects:
- Field name ends in `_score` → Display as metric
- Convert `coherence_score` → "Coherence Score"
- Apply color coding based on value
- Show in all views (RunDetails, Comparison, etc.)

---

## 🗂️ Understanding the Database Structure

### Tables and Their Status:

| Table | Rows | Purpose | Status |
|-------|------|---------|--------|
| `question_evaluations` | 85 | **Evaluation scores** | ✅ Active |
| `runs` | 0 | Denormalized view | ⚠️ Empty |
| `run_questions` | 0 | Individual questions | ⚠️ Empty |
| `projects` | 0 | Top-level org | ⚠️ Empty |
| `workflows` | 0 | Eval pipelines | ⚠️ Empty |
| `subworkflows` | 0 | Sub-tasks | ⚠️ Empty |
| `subflows` | 0 | **DUPLICATE** | ❌ Delete |

### The Intended Hierarchy:
```
Projects
  └─ Workflows
      └─ Subworkflows
          └─ Runs
              └─ Questions
                  └─ Evaluations (✅ only this level has data)
```

**Reality**: Only the leaf level (`question_evaluations`) has data. The rest is defined but unused.

---

## 📚 Important Files

### Documentation:
- **DATABASE_ANALYSIS.md**: Full analysis with 3 architecture options
- **ARCHITECTURE_DIAGRAM.md**: Visual diagrams and data flow
- **README.md**: Project overview
- **This file**: Quick start guide

### Database Scripts:
- **database/schema.sql**: Table definitions
- **database/cleanup.sql**: Remove duplicates, add indexes
- **database/export_database.sh**: Backup script

### Application Code:
- **server/server.js**: Backend API with dynamic extraction
- **src/metricUtils.js**: Dynamic metric utilities
- **src/RunDetails.jsx**: Main evaluation view
- **src/Comparison.jsx**: Side-by-side comparison

---

## 🎯 Common Tasks

### Backup Database:
```bash
./database/export_database.sh
# Creates timestamped backups in database/exports/
```

### Restore from Backup:
```bash
psql -U denis -d butler_eval -f database/exports/butler_eval_full_TIMESTAMP.sql
```

### Add an Index (for performance):
```sql
CREATE INDEX idx_question_evaluations_output_score 
ON question_evaluations(output_score);
```

### View All Columns in a Table:
```sql
\d question_evaluations
```

### Export to CSV:
```sql
\copy question_evaluations TO '/path/to/export.csv' WITH CSV HEADER
```

---

## 🚨 Common Issues

### Issue: "Backend not returning new metric"
**Solution**: 
1. Verify column exists: `\d question_evaluations`
2. Check column has data: `SELECT coherence_score FROM question_evaluations LIMIT 5;`
3. Restart backend: `cd server && node server.js`

### Issue: "Frontend shows old data"
**Solution**: 
- Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Check backend is serving new data: `curl http://localhost:3001/api/projects`

### Issue: "Can't connect to database"
**Solution**:
```bash
# Check if PostgreSQL is running
pg_isready

# Start if needed
brew services start postgresql@14
```

### Issue: "Port 3001 already in use"
**Solution**:
```bash
# Find process using port
lsof -i :3001

# Kill it
kill -9 <PID>

# Or use different port in server.js
```

---

## 🎓 Learning Resources

### Understanding Dynamic Metrics:

The backend's "magic" is in `extractExecutionData()`:

```javascript
// Pattern matching for score fields
if (key.match(/_(score|rate|rating|accuracy)$/)) {
    // Converts: hallucination_rate → hallucinationRate
    const camelKey = toCamelCase(key);
    
    // Parses: "0.85" → 0.85 (number)
    execution[camelKey] = parseFloat(row[key]);
}
```

Frontend receives:
```json
{
  "outputScore": 0.85,
  "ragRelevancyScore": 0.92,
  "hallucinationRate": 0.15,
  "testScore": 0.88,
  "coherenceScore": 0.92  // ← New metric auto-included!
}
```

UI automatically:
1. Detects field is a score
2. Converts to Title Case: "Coherence Score"
3. Applies color coding: Green if > 0.8
4. Renders in all views

**No React code changes needed!**

---

## 🔧 Architecture Decision Needed

The database has 3 possible futures:

### Option 1: Simplify ⭐ Recommended for Now
- Keep only `question_evaluations` table
- Delete unused hierarchy tables
- **Pros**: Simple, fast, easy to maintain
- **Cons**: No project/workflow organization
- **Time**: 5 minutes

### Option 2: Full Hierarchy
- Populate all tables (projects → workflows → runs)
- Use complete organizational structure
- **Pros**: Enterprise-grade, full features
- **Cons**: Complex, requires setup
- **Time**: 2-3 hours

### Option 3: View-Based
- Keep `question_evaluations` as source
- Create view that looks like `runs` table
- **Pros**: Zero sync, can add hierarchy later
- **Cons**: Slightly slower queries
- **Time**: 30 minutes

**See DATABASE_ANALYSIS.md for detailed comparison and decision matrix.**

---

## ✅ Next Steps

1. **Read**: DATABASE_ANALYSIS.md (10 minutes)
2. **Decide**: Which architecture option fits your needs
3. **Execute**: Run cleanup script or chosen migration
4. **Test**: Verify everything still works
5. **Document**: Update team on new structure

---

## 🆘 Need Help?

### Database Issues:
- Check logs: `tail -f /usr/local/var/log/postgres.log`
- View connections: `SELECT * FROM pg_stat_activity;`

### Backend Issues:
- Check server logs in terminal
- Test API: `curl http://localhost:3001/api/projects`
- Verify env vars: `printenv | grep DB`

### Frontend Issues:
- Check browser console (F12)
- Verify API calls in Network tab
- Check React DevTools

---

**Remember**: The system works! The database structure is just confusing, not broken. You can clean it up anytime without losing functionality.

**Questions?** See detailed documentation in DATABASE_ANALYSIS.md or ARCHITECTURE_DIAGRAM.md.
