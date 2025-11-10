#!/bin/bash

# Butler Eval Database Export Script
# Purpose: Export database schema and data for documentation and sharing
# Usage: ./export_database.sh

# Configuration
DB_NAME="butler_eval"
DB_USER="denis"
OUTPUT_DIR="./database/exports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Butler Eval Database Export ===${NC}"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Timestamp: $TIMESTAMP"
echo ""

# Create export directory
mkdir -p "$OUTPUT_DIR"

# =============================================================================
# 1. FULL DATABASE BACKUP
# =============================================================================
echo -e "${YELLOW}[1/7] Exporting full database backup...${NC}"
pg_dump -U "$DB_USER" -d "$DB_NAME" \
    -f "$OUTPUT_DIR/butler_eval_full_${TIMESTAMP}.sql"
echo "✓ Saved to: $OUTPUT_DIR/butler_eval_full_${TIMESTAMP}.sql"

# =============================================================================
# 2. SCHEMA ONLY (for documentation)
# =============================================================================
echo -e "${YELLOW}[2/7] Exporting schema only...${NC}"
pg_dump -U "$DB_USER" -d "$DB_NAME" --schema-only \
    -f "$OUTPUT_DIR/butler_eval_schema_${TIMESTAMP}.sql"
echo "✓ Saved to: $OUTPUT_DIR/butler_eval_schema_${TIMESTAMP}.sql"

# =============================================================================
# 3. DATA ONLY (for migration)
# =============================================================================
echo -e "${YELLOW}[3/7] Exporting data only...${NC}"
pg_dump -U "$DB_USER" -d "$DB_NAME" --data-only \
    -f "$OUTPUT_DIR/butler_eval_data_${TIMESTAMP}.sql"
echo "✓ Saved to: $OUTPUT_DIR/butler_eval_data_${TIMESTAMP}.sql"

# =============================================================================
# 4. QUESTION EVALUATIONS TABLE (CSV)
# =============================================================================
echo -e "${YELLOW}[4/7] Exporting question_evaluations as CSV...${NC}"
psql -U "$DB_USER" -d "$DB_NAME" -c \
    "COPY question_evaluations TO STDOUT WITH CSV HEADER" \
    > "$OUTPUT_DIR/question_evaluations_${TIMESTAMP}.csv"
echo "✓ Saved to: $OUTPUT_DIR/question_evaluations_${TIMESTAMP}.csv"

# =============================================================================
# 5. TABLE STATISTICS
# =============================================================================
echo -e "${YELLOW}[5/7] Generating table statistics...${NC}"
psql -U "$DB_USER" -d "$DB_NAME" > "$OUTPUT_DIR/table_stats_${TIMESTAMP}.txt" <<EOF
-- Table sizes and row counts
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Database size
SELECT 
    pg_database.datname as database_name,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = '$DB_NAME';
EOF
echo "✓ Saved to: $OUTPUT_DIR/table_stats_${TIMESTAMP}.txt"

# =============================================================================
# 6. FOREIGN KEY RELATIONSHIPS
# =============================================================================
echo -e "${YELLOW}[6/7] Exporting foreign key relationships...${NC}"
psql -U "$DB_USER" -d "$DB_NAME" > "$OUTPUT_DIR/foreign_keys_${TIMESTAMP}.txt" <<EOF
SELECT
    tc.table_name as child_table,
    kcu.column_name as child_column,
    ccu.table_name AS parent_table,
    ccu.column_name AS parent_column,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, kcu.column_name;
EOF
echo "✓ Saved to: $OUTPUT_DIR/foreign_keys_${TIMESTAMP}.txt"

# =============================================================================
# 7. CREATE LIGHTWEIGHT SCHEMA (for version control)
# =============================================================================
echo -e "${YELLOW}[7/7] Creating lightweight schema file...${NC}"
pg_dump -U "$DB_USER" -d "$DB_NAME" \
    --schema-only \
    --no-owner \
    --no-privileges \
    -f "$OUTPUT_DIR/../schema.sql"
echo "✓ Saved to: database/schema.sql (for git)"

# =============================================================================
# SUMMARY
# =============================================================================
echo ""
echo -e "${GREEN}=== Export Complete ===${NC}"
echo ""
echo "Files created in $OUTPUT_DIR:"
ls -lh "$OUTPUT_DIR" | tail -n +2 | awk '{print "  " $9 " (" $5 ")"}'
echo ""
echo "Schema (for git): database/schema.sql"
echo ""
echo -e "${YELLOW}Sharing Options:${NC}"
echo "  1. Full restore: psql -U user -d newdb -f butler_eval_full_${TIMESTAMP}.sql"
echo "  2. Schema only:  psql -U user -d newdb -f butler_eval_schema_${TIMESTAMP}.sql"
echo "  3. View in Excel: Open question_evaluations_${TIMESTAMP}.csv"
echo "  4. Documentation: Share DATABASE_ANALYSIS.md + exports folder"
echo ""
