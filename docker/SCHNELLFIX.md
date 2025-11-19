# Schnellfix für https://evaluation.nextgen-test.de/

## Problem
Das Frontend versucht `http://localhost:3001/api` aufzurufen, was nur lokal funktioniert, nicht auf dem Server.

## Lösung

### 1. .env Datei auf dem Server anpassen

SSH auf den Server und bearbeite die `.env` Datei:

```bash
cd /pfad/zum/projekt/docker
nano .env
```

Ändere diese Zeile:
```bash
# ALT (funktioniert nicht):
VITE_API_URL=http://localhost:3001/api

# NEU (funktioniert):
VITE_API_URL=/api
```

Die komplette `.env` sollte so aussehen:
```bash
ENV=prod
BACKEND_PORT=3001
NODE_ENV=production
FRONTEND_PORT=5174
VITE_API_URL=/api
VITE_BASE_PATH=/

# Deine Datenbank-Konfiguration
DB_HOST=postgres-new
DB_PORT=5432
DB_NAME=n8n
DB_USER=postgres
DB_PASSWORD=zw9HHDungB5AV2DpSYPE
```

### 2. Container neu bauen (OHNE Cache!)

```bash
# Container stoppen
docker-compose down

# WICHTIG: --no-cache verwenden, damit die neue VITE_API_URL verwendet wird!
docker-compose build --no-cache

# Starten
docker-compose up -d
```

### 3. Überprüfen

```bash
# Logs prüfen
docker-compose logs -f

# Backend Health Check
curl http://localhost:3001/api/health

# Frontend prüfen
curl http://localhost:5174
```

Dann sollte https://evaluation.nextgen-test.de/ funktionieren!

## Warum funktioniert das?

1. **Frontend verwendet jetzt `/api`** statt `http://localhost:3001/api`
2. **Nginx proxied `/api/*` zum Backend-Container** (siehe `nginx.conf`)
3. Der Browser ruft also `https://evaluation.nextgen-test.de/api/...` auf
4. Nginx leitet das intern an `http://backend:3001/api/...` weiter
5. Funktioniert sowohl lokal als auch auf dem Server!

## Wichtige Hinweise

- **--no-cache** beim Build ist WICHTIG! Sonst werden die alten Werte aus dem Cache verwendet
- Die Änderung betrifft nur das Frontend (muss neu gebaut werden)
- Backend kann laufen bleiben (keine Änderungen nötig)
- Nginx-Config wurde bereits angepasst (proxied /api zu backend:3001)

## Alternative: Nur Frontend neu bauen

Falls du nur das Frontend neu bauen willst:

```bash
docker-compose stop frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```
