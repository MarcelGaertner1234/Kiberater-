# Supabase Setup für KI-Beratungsplattform

## 🚀 Quick Start

Die Plattform ist bereits für Supabase konfiguriert. Du musst nur die echten Credentials eintragen.

### SCHRITT 1: Supabase Credentials holen

1. **Gehe zu [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Wähle dein Projekt**: `cbjghsuleyvsgmqugask` (oder erstelle ein neues)

### SCHRITT 2: Database Password

1. Gehe zu **Settings → Database** 
2. Kopiere das **Database Password**
3. Ersetze `[DEIN-SUPABASE-PASSWORD]` in beiden .env Dateien

### SCHRITT 3: API Keys

1. Gehe zu **Settings → API**
2. Kopiere den **anon public** Key
3. Ersetze `[HOLEN-AUS-SUPABASE-DASHBOARD-API-SETTINGS]` in `frontend/.env.local`

### SCHRITT 4: Migration ausführen

```bash
cd backend

# Prisma Client generieren
npx prisma generate

# Migration auf Supabase ausführen
npx prisma migrate dev --name init_supabase

# Seed Data erstellen  
npm run seed
```

### SCHRITT 5: Verbindung testen

```bash
cd backend
node test-supabase.js
```

## 📝 Aktuelle Konfiguration

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres.cbjghsuleyvsgmqugask:[PASSWORT]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORT]@db.cbjghsuleyvsgmqugask.supabase.co:5432/postgres"
```

### Frontend (.env.local)  
```env
NEXT_PUBLIC_SUPABASE_URL="https://cbjghsuleyvsgmqugask.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY]"
```

## 🎯 Nach dem Setup

### Test Users (nach Migration + Seed)
- **Admin**: admin@ki-beratung.de / Admin123!
- **Test User**: test@ki-beratung.de / Test123!

### Features Ready
- ✅ PostgreSQL Schema (10 Tabellen)
- ✅ User Authentication (bcrypt)
- ✅ Sample Data (Projects, Tasks, Assessments)
- ✅ Connection Pooling
- ✅ Prisma ORM

## 🛠 Troubleshooting

### "Can't reach database server"
- ✅ Prüfe das Database Password
- ✅ Stelle sicher dass Supabase Projekt läuft
- ✅ Checke die URLs in .env

### "Prepared statement does not exist" 
- ✅ Nutze Connection Pooler URL (Port 6543)
- ✅ Parameter `?pgbouncer=true` ist gesetzt

### Migration Fehler
- ✅ Nutze DIRECT_URL für Migrations (Port 5432)
- ✅ Lösche prisma/migrations und starte neu

## 📋 Nächste Schritte

Nach erfolgreichem Setup:
1. **NextAuth.js** für Frontend-Authentication
2. **API Routes** für Login/Register  
3. **Protected Routes** mit Session Guards
4. **Notion-Style Components** für UI

---

🎉 **Das Foundation Setup ist ready für Supabase!**