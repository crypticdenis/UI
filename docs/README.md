# Documentation

Complete documentation for the Butler Evaluation UI project.

## 🐳 Deployment

**Start here for deployment:**

- **[Docker Deployment Guide](../docker/README.md)** - Quick start with Docker Compose (Recommended)
- **[Docker Deployment (German)](../docker/DEPLOYMENT_DE.md)** - Detaillierte Anleitung auf Deutsch

## 🧪 Testing

**Test suite and documentation:**

- **[Testing Guide](TESTING.md)** - Comprehensive testing documentation

## 📊 Database

**Database setup and schema documentation:**

- **[Database Setup Guide](db/DATABASE_SETUP_GUIDE.md)** - Quick database setup (3 steps)
- **[Database Structure](db/DATABASE_STRUCTURE.md)** - Complete schema documentation with examples
- **[Database Guide](../database/DATABASE_GUIDE.md)** - Comprehensive database documentation

## 📈 Features & Concepts

**Understanding the application:**

- **[Dynamic Metrics System](db/DYNAMIC_METRICS.md)** - How automatic metric detection works
- **[Data Hierarchy](db/HIERARCHY_STRUCTURE.md)** - Projects → Workflows → Subworkflows → Runs

## 🗂️ Folder Structure

### Active Documentation
- `db/` - Database setup, schema, and structure documentation
- `legacy/` - Archived documentation from development process

### Project Files
- `../docker/` - Docker deployment files and guides
- `../database/` - SQL schema, mock data, and database utilities
- `../src/` - Frontend React application source code
- `../server/` - Backend Express API server

## 🚀 Quick Links

### For Deployment
1. [Docker Quick Start](../docker/README.md#quick-start) - Get running in 3 steps
2. [Database Setup](db/DATABASE_SETUP_GUIDE.md#-quick-setup-3-steps) - Initialize database
3. [Environment Configuration](../docker/.env.example) - Configuration template

### For Development
1. [Main README](../README.md) - Project overview and manual setup
2. [Database Structure](db/DATABASE_STRUCTURE.md) - Schema reference
3. [Dynamic Metrics](db/DYNAMIC_METRICS.md) - Adding new metrics

### For Understanding
1. [Data Hierarchy](db/HIERARCHY_STRUCTURE.md) - How data is organized
2. [Database Guide](../database/DATABASE_GUIDE.md) - Database documentation and examples
3. [Dynamic Metrics](db/DYNAMIC_METRICS.md) - How the metrics system works

## 📦 What's Included

### Database Documentation
- Complete schema with all tables, columns, and relationships
- Setup instructions for PostgreSQL
- Sample data and mock data examples
- Backup and restore procedures
- Query examples and troubleshooting

### Deployment Documentation
- Docker Compose setup with multi-container architecture
- Environment variable configuration
- Network and port configuration
- Health checks and monitoring
- Both development and production configurations

### Feature Documentation
- Dynamic metric detection system
- Hierarchical data organization
- Color-coded scoring system
- Filtering and comparison tools

## 🆘 Common Tasks

### First Time Setup
```bash
# 1. Set up database
createdb butler_eval
psql -U postgres -d butler_eval -f database/schema_new.sql

# 2. Deploy with Docker
cd docker
cp .env.example .env
# Edit .env with your database credentials
./start.sh
```

### Access Application
- Frontend: http://localhost:5174
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/api/health

### Troubleshooting
See [Database Setup Guide](db/DATABASE_SETUP_GUIDE.md#-troubleshooting) for common issues.

---

**Need help?** Check the specific documentation files above or refer to the [main README](../README.md).
