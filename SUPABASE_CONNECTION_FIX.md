# 🔧 Supabase Verbindungsproblem beheben

## Problem
Die Migration schlägt fehl mit "Tenant or user not found". Dies bedeutet normalerweise:

1. **Falsches Datenbank-Passwort** in der Connection URL
2. **Projekt noch nicht vollständig initialisiert** in Supabase

## Lösung

### Option 1: Passwort überprüfen
1. Gehen Sie zu [app.supabase.com](https://app.supabase.com)
2. Öffnen Sie Ihr Projekt
3. Gehen Sie zu **Settings → Database**
4. Kopieren Sie die **Connection string** (beide Versionen)
5. Aktualisieren Sie `backend/.env`:

```bash
# Direct connection für Migrationen (wichtig!)
DIRECT_URL=postgresql://postgres.[project-ref]:[IHR-DB-PASSWORT]@db.[project-ref].supabase.co:5432/postgres

# Pooled connection für Anwendung
DATABASE_URL=postgresql://postgres.[project-ref]:[IHR-DB-PASSWORT]@db.[project-ref].supabase.co:6543/postgres
```

### Option 2: Neues Passwort generieren
Falls Sie das Passwort vergessen haben:
1. Settings → Database
2. "Reset database password"
3. Neues Passwort generieren und notieren
4. URLs aktualisieren

### Option 3: Connection Pooler deaktivieren (für Tests)
Verwenden Sie temporär nur die Direct URL für beide:
```bash
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@db.[project-ref].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres.[project-ref]:[password]@db.[project-ref].supabase.co:5432/postgres
```

## Wichtige Hinweise
- Das Passwort ist NICHT "postgres" - es ist ein zufällig generiertes Passwort
- Die URL-Struktur hat sich geändert: `db.[project-ref].supabase.co` statt `aws-0-eu-central-1.pooler.supabase.com`
- Port 5432 für direkte Verbindung, 6543 für Pooling

## Test der Verbindung
```bash
# Testen Sie die Verbindung
npx prisma db pull

# Wenn das funktioniert, dann:
npm run migrate
```