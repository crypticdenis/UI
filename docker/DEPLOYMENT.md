# Deployment Guide

## Docker Compose Deployment

This application can be deployed using Docker Compose with configurable database parameters for both test and production environments.

### Prerequisites

- Docker and Docker Compose installed
- PostgreSQL database (can be local or remote)
- Database schema already set up (see `database/schema.sql`)

### Quick Start

1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your database connection:**
   Edit `.env` file with your database details:
   ```bash
   DB_HOST=your_db_host
   DB_PORT=5432
   DB_NAME=butler_eval
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   ```

3. **Start the application:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:3001/api

### Environment-Specific Deployment

#### Production Environment

```bash
# Use production environment file
cp .env.prod .env

# Edit .env with your production database credentials
nano .env

# Start production containers
docker-compose up -d
```

#### Test Environment

```bash
# Use test environment file
cp .env.test .env

# Edit .env with your test database credentials
nano .env

# Start test containers (on different ports)
docker-compose up -d
```

### Configuration Parameters

| Parameter | Description | Default | Example |
|-----------|-------------|---------|---------|
| `ENV` | Environment name (prod/test) | `prod` | `test` |
| `BACKEND_PORT` | Backend server port | `3001` | `3002` |
| `FRONTEND_PORT` | Frontend server port | `5174` | `5175` |
| `DB_HOST` | Database host | `localhost` | `192.168.1.100` |
| `DB_PORT` | Database port | `5432` | `5432` |
| `DB_NAME` | Database name | `butler_eval` | `butler_eval_test` |
| `DB_USER` | Database user | `postgres` | `db_user` |
| `DB_PASSWORD` | Database password | - | `secure_password` |
| `VITE_API_URL` | API URL for frontend | `http://localhost:3001/api` | `http://api.example.com/api` |

### Running Both Test and Production

To run both environments simultaneously, use separate compose files:

1. **Create docker-compose.prod.yml:**
   ```bash
   cp docker-compose.yml docker-compose.prod.yml
   ```

2. **Create docker-compose.test.yml:**
   ```bash
   cp docker-compose.yml docker-compose.test.yml
   ```

3. **Start production:**
   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
   ```

4. **Start test:**
   ```bash
   docker-compose -f docker-compose.test.yml --env-file .env.test up -d
   ```

### Useful Commands

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Stop services:**
```bash
docker-compose down
```

**Rebuild containers:**
```bash
docker-compose up -d --build
```

**Check service health:**
```bash
docker-compose ps
```

**Access backend container:**
```bash
docker exec -it butler-eval-backend-prod sh
```

### Database Setup

If you need to initialize the database, connect to your PostgreSQL server and run:

```bash
# Create database
psql -U postgres -c "CREATE DATABASE butler_eval;"

# Import schema
psql -U postgres -d butler_eval -f database/schema.sql

# (Optional) Import mock data
psql -U postgres -d butler_eval -f database/mock_data.sql
```

### Troubleshooting

**Database connection issues:**
- Verify database is running and accessible
- Check firewall rules if using remote database
- Ensure credentials in `.env` are correct

**Backend health check failing:**
- Check backend logs: `docker-compose logs backend`
- Verify database connection string
- Ensure database schema is properly set up

**Frontend can't connect to backend:**
- Check `VITE_API_URL` in `.env`
- If using remote deployment, update with your server's IP/domain
- Verify backend is running: `curl http://localhost:3001/api/health`

### Production Considerations

1. **Use strong passwords** for database access
2. **Configure proper network security** if exposing ports
3. **Set up SSL/TLS** for production deployments
4. **Regular backups** of the database
5. **Monitor logs** for errors and performance issues
6. **Use environment-specific `.env` files** and never commit them to version control

### GitHub Pages + Docker Backend

If you want to keep the frontend on GitHub Pages but run the backend via Docker:

1. Keep frontend deployed on GitHub Pages as-is
2. Deploy only the backend using Docker:
   ```bash
   docker-compose up -d backend
   ```
3. Update your GitHub Pages environment variable to point to your backend server
4. Ensure CORS is properly configured in `server/server.js`

### Notes for Your Colleague

Um die Anwendung zu deployen:

1. `.env` Datei erstellen und Datenbankverbindung eintragen
2. `docker-compose up -d` ausführen
3. Frontend läuft auf Port 5174 (oder konfigurierter Port)
4. Backend läuft auf Port 3001 (oder konfigurierter Port)

Für Test- und Produktionsumgebung einfach verschiedene `.env` Dateien verwenden und unterschiedliche Ports konfigurieren.
