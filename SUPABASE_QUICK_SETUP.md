# 🚀 Supabase Quick Setup Guide

## 1. Erstellen Sie ein kostenloses Supabase-Konto

1. Gehen Sie zu [app.supabase.com](https://app.supabase.com)
2. Klicken Sie auf "Start your project"
3. Melden Sie sich mit GitHub an (empfohlen) oder erstellen Sie ein Konto

## 2. Neues Projekt erstellen

1. Klicken Sie auf "New Project"
2. Wählen Sie Ihre Organisation
3. Projektdetails eingeben:
   - **Project name**: `ki-beratung-platform`
   - **Database Password**: Generieren Sie ein sicheres Passwort (WICHTIG: Notieren Sie es!)
   - **Region**: `Central EU (Frankfurt)`
   - **Pricing Plan**: Free tier

4. Klicken Sie auf "Create new project" und warten Sie ~2 Minuten

## 3. Wichtige Credentials abrufen

Nach der Erstellung finden Sie alle Credentials unter **Settings → API**:

### Database URLs (Settings → Database)
- **Connection string (Pooling Mode)**: Für die Anwendung
- **Connection string (Direct)**: Für Migrationen

### API Keys (Settings → API)
- **Project URL**: `https://[YOUR-PROJECT-REF].supabase.co`
- **anon public**: Für Frontend (öffentlich)
- **service_role**: Für Backend (GEHEIM!)
- **JWT Secret**: Für Token-Validierung

## 4. Konfiguration in .env Dateien

### Backend (.env)
```bash
# Ersetzen Sie [YOUR-PROJECT-REF] und [YOUR-PASSWORD] mit Ihren Werten
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres

# Supabase API
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... # Ihr service_role key
SUPABASE_JWT_SECRET=your-jwt-secret-from-settings
```

### Frontend (.env)
```bash
# Nur öffentliche Keys!
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... # Ihr anon key
```

## 5. Setup-Skript ausführen

Nach dem Konfigurieren der .env Dateien:

```bash
# Im Root-Verzeichnis
npm run setup:supabase
```

## 🎯 Nächste Schritte

1. Öffnen Sie [http://localhost:3000](http://localhost:3000)
2. Registrieren Sie einen Test-Account
3. Testen Sie den Login-Flow
4. Führen Sie das KI-Assessment durch

## ⚠️ Wichtige Hinweise

- **NIEMALS** den `service_role` Key im Frontend verwenden!
- Die .env Dateien sind in .gitignore - committen Sie sie nicht!
- Supabase Free Tier: 500MB Database, 2 GB Bandwidth, 50k MAUs

## 🔧 Troubleshooting

### "Cannot connect to database"
- Überprüfen Sie die DATABASE_URL
- Stellen Sie sicher, dass das Projekt fertig erstellt wurde
- Prüfen Sie ob die IP nicht geblockt ist (Settings → Database → Allowed IPs)

### "Invalid API key"
- Überprüfen Sie, ob Sie die richtigen Keys verwenden
- anon key → Frontend
- service_role key → Backend

### Migration schlägt fehl
- Nutzen Sie DIRECT_URL statt DATABASE_URL für Migrationen
- Prisma braucht die direkte Verbindung (Port 5432)