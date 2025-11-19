# Docker Deployment Anleitung

## Schnellstart

### 1. Environment-Datei erstellen

```bash
cp .env.example .env
```

### 2. Datenbank-Verbindungsdetails eingeben

Bearbeite die `.env` Datei und trage deine Datenbankverbindung ein:

```bash
# Environment
ENV=prod

# Backend Port
BACKEND_PORT=3001
NODE_ENV=production

# Frontend Port  
FRONTEND_PORT=5174

# WICHTIG: Für Production verwende /api (Nginx proxied zu Backend Container)
# Nicht http://localhost:3001/api verwenden!
VITE_API_URL=/api

# Datenbank-Verbindung
DB_HOST=dein_db_server
DB_PORT=5432
DB_NAME=butler_eval
DB_USER=dein_db_benutzer
DB_PASSWORD=dein_db_passwort
```

**WICHTIG:** `VITE_API_URL=/api` verwendet einen relativen Pfad. Nginx leitet dann `/api/*` Anfragen automatisch an den Backend-Container weiter. Dies funktioniert sowohl lokal als auch auf dem Server!

### 3. Anwendung starten

```bash
docker-compose up -d --build
```

**Hinweis:** Das `--build` Flag ist wichtig, um sicherzustellen, dass die Images mit den neuen Umgebungsvariablen neu gebaut werden!

Die Anwendung ist dann erreichbar unter:
- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:3001/api

### 4. Bei bestehender Deployment aktualisieren

Wenn die App bereits läuft und du die Konfiguration änderst:

```bash
# Container stoppen
docker-compose down

# .env Datei aktualisieren
nano .env

# Neu bauen OHNE Cache (wichtig!)
docker-compose build --no-cache

# Starten
docker-compose up -d
```

## Test- und Produktionsumgebung

### Produktionsumgebung

```bash
# .env.prod Datei verwenden
cp .env.prod .env

# Datenbankverbindung eintragen
nano .env

# Starten
docker-compose up -d
```

### Testumgebung

```bash
# .env.test Datei verwenden  
cp .env.test .env

# Datenbankverbindung eintragen (andere Ports!)
nano .env

# Starten
docker-compose up -d
```

**Hinweis:** Für Test und Prod gleichzeitig müssen unterschiedliche Ports verwendet werden:
- Prod: Backend 3001, Frontend 5174
- Test: Backend 3002, Frontend 5175

## Konfigurierbare Parameter

| Parameter | Beschreibung | Standard | Beispiel |
|-----------|--------------|----------|----------|
| `ENV` | Umgebung (prod/test) | `prod` | `test` |
| `BACKEND_PORT` | Backend Server Port | `3001` | `3002` |
| `FRONTEND_PORT` | Frontend Server Port | `5174` | `5175` |
| `DB_HOST` | Datenbank Host | `localhost` | `192.168.1.100` |
| `DB_PORT` | Datenbank Port | `5432` | `5432` |
| `DB_NAME` | Datenbank Name | `butler_eval` | `butler_eval_test` |
| `DB_USER` | Datenbank Benutzer | `postgres` | `db_user` |
| `DB_PASSWORD` | Datenbank Passwort | - | `sicheres_passwort` |
| `VITE_API_URL` | API URL für Frontend | `http://localhost:3001/api` | `http://api.beispiel.de/api` |

## Nützliche Befehle

**Logs anzeigen:**
```bash
# Alle Services
docker-compose logs -f

# Nur Backend
docker-compose logs -f backend

# Nur Frontend  
docker-compose logs -f frontend
```

**Services stoppen:**
```bash
docker-compose down
```

**Container neu bauen:**
```bash
docker-compose up -d --build
```

**Status prüfen:**
```bash
docker-compose ps
```

**Health Check:**
```bash
curl http://localhost:3001/api/health
```

## Datenbank-Setup

Falls die Datenbank noch nicht eingerichtet ist:

```bash
# Datenbank erstellen
psql -h ihr_db_server -U postgres -c "CREATE DATABASE butler_eval;"

# Schema importieren
psql -h ihr_db_server -U postgres -d butler_eval -f database/schema.sql

# (Optional) Beispieldaten importieren
psql -h ihr_db_server -U postgres -d butler_eval -f database/mock_data.sql
```

## Troubleshooting

**Datenbank-Verbindungsfehler:**
- Prüfe ob die Datenbank läuft und erreichbar ist
- Firewall-Regeln überprüfen (besonders bei Remote-Datenbank)
- Credentials in `.env` überprüfen

**Backend Health Check schlägt fehl:**
- Backend Logs prüfen: `docker-compose logs backend`
- Datenbank-Verbindung überprüfen
- Schema in der Datenbank vorhanden?

**Frontend kann Backend nicht erreichen:**
- `VITE_API_URL` in `.env` prüfen
- Bei Remote-Deployment die Server-IP/Domain eintragen
- Backend läuft? `curl http://localhost:3001/api/health`

## Beide Umgebungen parallel laufen lassen

### Option 1: Verschiedene Compose-Dateien

```bash
# Prod starten
docker-compose -f docker-compose.yml --env-file .env.prod up -d

# Test starten (in anderem Terminal)
docker-compose -f docker-compose.yml --env-file .env.test up -d
```

### Option 2: Mit Docker Compose Projektnamen

```bash
# Prod
docker-compose -p butler-eval-prod --env-file .env.prod up -d

# Test  
docker-compose -p butler-eval-test --env-file .env.test up -d
```

## Produktiv-Hinweise

1. **Sichere Passwörter** für Datenbankzugriff verwenden
2. **Netzwerksicherheit** konfigurieren
3. **SSL/TLS** für Produktiv-Umgebung einrichten
4. **Regelmäßige Backups** der Datenbank
5. **Logs überwachen**
6. **Environment-spezifische `.env` Dateien** verwenden und niemals committen

## GitHub Pages + Docker Backend

Falls das Frontend auf GitHub Pages bleiben soll:

1. Frontend bleibt auf GitHub Pages deployed
2. Nur Backend per Docker deployen:
   ```bash
   docker-compose up -d backend
   ```
3. GitHub Pages Environment Variable auf Backend-Server zeigen lassen
4. CORS in `server/server.js` muss richtig konfiguriert sein

## Support

Bei Fragen oder Problemen:
- Logs prüfen: `docker-compose logs -f`
- Health Check: `curl http://localhost:3001/api/health`
- Database connectivity: `docker exec -it butler-eval-backend-prod sh` und dann `node` Console für manuelle DB-Tests
