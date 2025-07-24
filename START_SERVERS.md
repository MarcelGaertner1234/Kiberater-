# 🚀 Server starten

## Backend Server (Port 3001)

In einem Terminal:
```bash
npm run dev:backend
```

Der Backend-Server läuft dann auf: http://localhost:3001

## Frontend Server (Port 3000)

In einem zweiten Terminal:
```bash
npm run dev:frontend
```

Die Frontend-App läuft dann auf: http://localhost:3000

## Oder beide gleichzeitig:

```bash
npm run dev
```

Dieser Befehl startet beide Server parallel.

## 🧪 Test-Accounts

Nach dem Start können Sie sich mit folgenden Test-Accounts einloggen:

- **Admin**: admin@ki-beratung.de (password: password123)
- **Berater**: berater@ki-beratung.de (password: password123)
- **User 1**: test@example.com (password: password123)
- **User 2**: demo@example.com (password: password123)

## ✅ Wichtige Endpoints zum Testen

### Backend API
- Health Check: http://localhost:3001/health
- API Docs: http://localhost:3001/api-docs (wenn Swagger konfiguriert)

### Frontend Pages
- Landing Page: http://localhost:3000
- Login: http://localhost:3000/auth/login
- Register: http://localhost:3000/auth/register
- Dashboard: http://localhost:3000/dashboard (nach Login)
- Assessment: http://localhost:3000/assessment (nach Login)

## 🔍 Troubleshooting

### Port bereits belegt?
```bash
# Backend Port 3001 freigeben
lsof -ti:3001 | xargs kill -9

# Frontend Port 3000 freigeben
lsof -ti:3000 | xargs kill -9
```

### Module nicht gefunden?
```bash
npm install
```

### Datenbank-Verbindung fehlgeschlagen?
- Überprüfen Sie die .env Dateien
- Stellen Sie sicher, dass Supabase läuft