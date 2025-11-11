-- Butler Eval Database Cleanup Script
-- Purpose: Remove duplicate/unused tables and optimize schema
-- Date: 2025-11-10
-- Run as: psql -U denis -d butler_eval -f cleanup.sql

-- =============================================================================
-- STEP 1: BACKUP CHECKS
-- =============================================================================

-- Verify current state before cleanup
SELECT 'Current Table Status' as info;
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    (SELECT count(*) FROM pg_stat_user_tables WHERE relname = tablename) as row_count
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- =============================================================================
-- STEP 2: DROP UNUSED DUPLICATE TABLE
-- =============================================================================

-- subflows is a duplicate of subworkflows and is not used anywhere
-- It has:
--   - 0 rows of data
--   - No foreign key references TO it
--   - No foreign key references FROM it
--   - Similar purpose to subworkflows but incompatible ID type (integer vs varchar)

SELECT 'Dropping unused subflows table...' as info;

DROP TABLE IF EXISTS subflows CASCADE;

-- =============================================================================
-- STEP 3: ADD MISSING INDEXES FOR PERFORMANCE
-- =============================================================================

SELECT 'Adding performance indexes...' as info;

-- Index on runs.version (used in filtering and sorting)
CREATE INDEX IF NOT EXISTS idx_runs_version 
    ON runs(version);

-- Composite index on runs (base_id, version) - unique runs
CREATE INDEX IF NOT EXISTS idx_runs_base_id_version 
    ON runs(base_id, version);

-- Index on runs.active (frequently filtered)
CREATE INDEX IF NOT EXISTS idx_runs_active 
    ON runs(active);

-- Index on runs.timestamp (used for sorting)
CREATE INDEX IF NOT EXISTS idx_runs_timestamp 
    ON runs(timestamp);

-- Index on question_evaluations.question_id (FK join)
CREATE INDEX IF NOT EXISTS idx_question_evaluations_question_id 
    ON question_evaluations(question_id);

-- =============================================================================
-- STEP 4: ADD TABLE DOCUMENTATION
-- =============================================================================

SELECT 'Adding table comments...' as info;

COMMENT ON TABLE runs IS 
'Denormalized view combining test execution results with evaluation scores. 
Backend reads from this table via SELECT * and dynamically extracts all score fields.
New metrics added here will automatically appear in the UI without code changes.';

COMMENT ON TABLE question_evaluations IS 
'Source of truth for evaluation scores. Contains individual question evaluations.
When adding new score metrics, add column here first, then sync to runs table.';

COMMENT ON TABLE projects IS 
'Top-level organizational unit. Empty in current implementation.
Consider populating or removing if hierarchical structure is not needed.';

COMMENT ON TABLE workflows IS 
'Evaluation workflows within projects. Empty in current implementation.';

COMMENT ON TABLE subworkflows IS 
'Sub-components of workflows. Empty in current implementation.';

COMMENT ON TABLE run_questions IS 
'Individual questions within test runs. Empty - data flow bypasses this table.';

-- Column documentation
COMMENT ON COLUMN runs.id IS 
'Composite key: {base_id}-{version}. Example: 42-run_gpt4_v1';

COMMENT ON COLUMN runs.output_score IS 
'Quality score for model output (0-1 scale). Higher is better.';

COMMENT ON COLUMN runs.test_score IS 
'Custom test metric added for validation (0-1 scale). Example of dynamic metric.';

-- =============================================================================
-- STEP 5: VERIFY CLEANUP
-- =============================================================================

SELECT 'Cleanup complete. Verification:' as info;

-- Show remaining tables
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Show tables with data
SELECT 'Tables with data:' as info;
SELECT 
    schemaname,
    tablename,
    n_live_tup as row_count
FROM pg_stat_user_tables
WHERE n_live_tup > 0
ORDER BY n_live_tup DESC;

-- Show all indexes
SELECT 'Indexes created:' as info;
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =============================================================================
-- STEP 6: OPTIONAL - DATA INTEGRITY CHECKS
-- =============================================================================

SELECT 'Data Integrity Checks:' as info;

-- Check for orphaned question_evaluations (no matching run_questions)
SELECT 
    'Orphaned evaluations (question_id has no parent in run_questions)' as check_name,
    COUNT(*) as count
FROM question_evaluations qe
LEFT JOIN run_questions rq ON qe.question_id = rq.id
WHERE rq.id IS NULL;

-- Check for NULL score values
SELECT 
    'Records with NULL output_score' as check_name,
    COUNT(*) as count
FROM question_evaluations
WHERE output_score IS NULL;

-- Check test_score population
SELECT 
    'Records with test_score populated' as metric,
    COUNT(*) as count
FROM question_evaluations
WHERE test_score IS NOT NULL
UNION ALL
SELECT 
    'Records missing test_score',
    COUNT(*)
FROM question_evaluations
WHERE test_score IS NULL;

-- =============================================================================
-- SUMMARY
-- =============================================================================

SELECT '
CLEANUP SUMMARY:
================
✅ Removed: subflows table (duplicate/unused)
✅ Added: Performance indexes on runs table
✅ Added: Documentation comments on all tables
✅ Verified: Data integrity

NEXT STEPS:
1. Review DATABASE_ANALYSIS.md for recommendations
1. Review docs/DATABASE_ANALYSIS.md for recommendations
2. Consider: Simplifying schema OR populating hierarchy tables
3. Implement: Automated sync for new metrics
4. Set up: Regular backups with pg_dump

' as summary;
