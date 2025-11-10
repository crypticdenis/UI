#!/bin/bash

# Butler Eval - Export Package for Team
# Creates a zip file with all necessary database documentation and setup files

OUTPUT_DIR="butler_eval_db_package"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ZIP_NAME="butler_eval_db_${TIMESTAMP}.zip"

echo "📦 Creating Butler Eval Database Package..."
echo ""

# Create temporary directory
mkdir -p "$OUTPUT_DIR"

# Copy essential files
echo "📄 Copying documentation..."
cp DATABASE_STRUCTURE.md "$OUTPUT_DIR/"
cp DATABASE_SETUP_GUIDE.md "$OUTPUT_DIR/"
cp database/VISUAL_SCHEMA.md "$OUTPUT_DIR/"

echo "🗄️  Copying database schema..."
cp database/schema.sql "$OUTPUT_DIR/"

# Copy mock data if exists
if [ -f "database/mock_data.sql" ]; then
    echo "📊 Copying sample data..."
    cp database/mock_data.sql "$OUTPUT_DIR/"
fi

# Create README for the package
cat > "$OUTPUT_DIR/README.txt" << 'EOF'
BUTLER EVAL - DATABASE PACKAGE
================================

This package contains everything needed to set up the Butler Eval database.

📦 CONTENTS:
------------
1. DATABASE_SETUP_GUIDE.md  - Start here! Setup instructions (5-10 min)
2. DATABASE_STRUCTURE.md     - Complete database documentation
3. VISUAL_SCHEMA.md          - Visual diagrams and relationships
4. schema.sql                - Database table definitions
5. mock_data.sql             - Sample data (optional)

🚀 QUICK START:
---------------
1. Install PostgreSQL 14+
2. Run: createdb butler_eval
3. Run: psql -U postgres -d butler_eval -f schema.sql
4. Read: DATABASE_STRUCTURE.md

📖 READ FIRST:
--------------
DATABASE_SETUP_GUIDE.md - Complete setup instructions with troubleshooting

⏱️ ESTIMATED TIME:
------------------
- Database setup: 5 minutes
- Reading documentation: 20 minutes
- Total: ~30 minutes to full understanding

🆘 NEED HELP?
-------------
See DATABASE_SETUP_GUIDE.md for troubleshooting section

Generated: $(date)
EOF

# Create a quick setup script
cat > "$OUTPUT_DIR/quick_setup.sh" << 'EOF'
#!/bin/bash

# Quick Setup Script for Butler Eval Database
# Run this after installing PostgreSQL

echo "🚀 Butler Eval Database Quick Setup"
echo "===================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found. Please install PostgreSQL 14+ first."
    exit 1
fi

echo "✅ PostgreSQL found"
echo ""

# Database name
DB_NAME="butler_eval"

# Check if database exists
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "⚠️  Database '$DB_NAME' already exists."
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing database..."
        dropdb -U postgres $DB_NAME
    else
        echo "❌ Setup cancelled."
        exit 0
    fi
fi

# Create database
echo "📦 Creating database '$DB_NAME'..."
createdb -U postgres $DB_NAME

if [ $? -ne 0 ]; then
    echo "❌ Failed to create database. Try running:"
    echo "   createdb butler_eval"
    exit 1
fi

echo "✅ Database created"
echo ""

# Load schema
echo "📊 Loading schema..."
psql -U postgres -d $DB_NAME -f schema.sql > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Failed to load schema. Try running:"
    echo "   psql -U postgres -d butler_eval -f schema.sql"
    exit 1
fi

echo "✅ Schema loaded"
echo ""

# Verify
echo "🔍 Verifying setup..."
TABLE_COUNT=$(psql -U postgres -d $DB_NAME -tAc "SELECT COUNT(*) FROM pg_tables WHERE schemaname='public';")

if [ "$TABLE_COUNT" -eq "6" ]; then
    echo "✅ All 6 tables created successfully!"
    echo ""
    echo "📋 Tables:"
    psql -U postgres -d $DB_NAME -c "\dt"
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "📖 Next steps:"
    echo "   1. Read DATABASE_STRUCTURE.md"
    echo "   2. Configure backend connection"
    echo "   3. Start backend server"
else
    echo "⚠️  Expected 6 tables, found $TABLE_COUNT"
    echo "   Check schema.sql file"
fi
EOF

chmod +x "$OUTPUT_DIR/quick_setup.sh"

echo "📝 Creating package info..."

# Create a manifest file
cat > "$OUTPUT_DIR/MANIFEST.txt" << EOF
Butler Eval Database Package
Generated: $(date)

Files included:
---------------
DATABASE_SETUP_GUIDE.md     - Setup instructions with troubleshooting
DATABASE_STRUCTURE.md       - Complete database documentation  
VISUAL_SCHEMA.md            - Visual diagrams and ERD
schema.sql                  - Database table definitions (6 tables)
quick_setup.sh              - Automated setup script (Linux/Mac)
README.txt                  - This package overview

Database Structure:
-------------------
Tables: 6 (projects, workflows, subworkflows, runs, run_questions, question_evaluations)
Design: Hierarchical with dynamic metric support
Pattern: Denormalized runs table for performance

Key Features:
-------------
- Full hierarchical organization (projects → workflows → subworkflows → runs)
- Dynamic metric system (any *_score or *_rate column auto-displays)
- CASCADE delete relationships for data integrity
- 15 runs with 85 question evaluations (in production)

Requirements:
-------------
- PostgreSQL 14 or higher
- 10 MB disk space
- 5-10 minutes setup time

Package Size: ~$(du -sh "$OUTPUT_DIR" | cut -f1)
EOF

# Create the zip file
echo "🗜️  Creating zip archive..."
zip -r "$ZIP_NAME" "$OUTPUT_DIR" > /dev/null 2>&1

# Cleanup
rm -rf "$OUTPUT_DIR"

echo ""
echo "✅ Package created: $ZIP_NAME"
echo ""
echo "📦 Package contents:"
echo "   - Setup guide with step-by-step instructions"
echo "   - Complete database documentation"
echo "   - Visual schema diagrams"
echo "   - Clean database schema (6 tables)"
echo "   - Quick setup script (automated)"
echo ""
echo "📧 Send this file to your colleagues:"
echo "   $ZIP_NAME"
echo ""
echo "🎯 They should:"
echo "   1. Unzip the package"
echo "   2. Read DATABASE_SETUP_GUIDE.md"
echo "   3. Run quick_setup.sh (or follow manual steps)"
echo "   4. Read DATABASE_STRUCTURE.md for details"
echo ""
