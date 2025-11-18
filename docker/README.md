# Docker Deployment

This folder contains all Docker-related files for deploying the Butler Evaluation Dashboard.

## Files

- `docker-compose.yml` - Main Docker Compose configuration
- `Dockerfile.frontend` - Frontend (React + Vite + Nginx) container
- `Dockerfile.backend` - Backend (Node.js + Express) container  
- `nginx.conf` - Nginx configuration for frontend
- `.env.example` - Environment variables template
- `.env` - Active environment configuration (create from .env.example)
- `start.sh` - Quick start script
- `DEPLOYMENT.md` - English deployment guide
- `DEPLOYMENT_DE.md` - German deployment guide (Deutsche Anleitung)

## Quick Start

1. Copy environment template:
   ```bash
   cd docker
   cp .env.example .env
   ```

2. Edit `.env` with your database credentials:
   ```bash
   nano .env
   ```

3. Run the start script:
   ```bash
   ./start.sh
   ```

   Or manually:
   ```bash
   docker-compose up --build -d
   ```

4. Access the application:
   - Frontend: http://localhost:5174
   - Backend: http://localhost:3001/api

## Important Notes

- Use `host.docker.internal` as DB_HOST to access host machine's database from Docker
- For production deployment on remote server, change DB_HOST to actual database server address
- See `DEPLOYMENT.md` for full documentation

## Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build -d
```
