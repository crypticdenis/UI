# Docker Setup Guide

## Prerequisites

- Docker and Docker Compose installed
- PostgreSQL database running locally with existing `butler_eval` database
- Database schema already set up with your data

## Quick Start

### 1. Configure Database Connection

Create a `.env` file in the `docker/` directory:

```bash
cd docker
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_HOST=host.docker.internal
DB_PORT=5432
DB_NAME=butler_eval
DB_USER=your-username
DB_PASSWORD=your-password
```

**Important**: Use `host.docker.internal` as the DB_HOST so Docker containers can connect to your local PostgreSQL instance.

### 2. Install Dependencies and Build

```bash
cd ..
npm install
npm run build
```

### 3. Start the Application

```bash
cd docker
./start.sh
```

The application will be available at:
- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:3001

## What the Setup Does

- Connects to your existing `butler_eval` database
- Preserves all your existing data
- Runs the frontend and backend in Docker containers
- No database migrations or data imports needed

## Stopping the Application

```bash
cd docker
docker-compose down
```

## Troubleshooting

### Can't connect to database
- Verify PostgreSQL is running on your host machine
- Check that `DB_HOST=host.docker.internal` in your `.env` file
- Ensure your database user has the correct permissions
- Test connection: `psql -U your-username -d butler_eval`

### Port conflicts
If ports 3001 or 5174 are already in use, you can modify them in `docker-compose.yml`.
