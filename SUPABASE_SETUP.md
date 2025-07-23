# Supabase Setup Guide für KI-Beratungsplattform

## 🚀 Übersicht

Diese Anleitung führt Sie durch die vollständige Supabase-Integration für die KI-Beratungsplattform. Supabase bietet uns PostgreSQL-Datenbank, Authentifizierung, Realtime-Subscriptions und File Storage in einer Lösung.

## 📋 Voraussetzungen

- Node.js >= 18.0.0
- npm >= 9.0.0
- Supabase Account (kostenlos unter https://supabase.com)

## 🔧 Schritt 1: Supabase Projekt erstellen

1. **Login bei Supabase Dashboard**
   - Gehen Sie zu https://app.supabase.com
   - Erstellen Sie ein neues Projekt
   - Wählen Sie Region: Frankfurt (eu-central-1) für DSGVO

2. **Projekt-Details notieren**
   ```
   Project URL: https://[YOUR-PROJECT-REF].supabase.co
   Project API Key (anon/public): eyJ...
   Project API Key (service_role): eyJ...
   Database Password: [SECURE-PASSWORD]
   ```

## 🗄️ Schritt 2: Datenbank konfigurieren

### Connection Strings

```bash
# Für Prisma (Connection Pooling)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Für Migrations (Direct Connection)
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

### Prisma Schema Update

Das bestehende Prisma Schema ist bereits PostgreSQL-kompatibel. Fügen Sie nur die shadowDatabaseUrl hinzu:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 🔐 Schritt 3: Authentication Setup

### Supabase Auth Features

1. **Email/Password Authentication**
   - Aktivieren unter Authentication → Providers → Email
   - Email-Templates anpassen (Deutsch/Englisch)

2. **OAuth Providers**
   - Google OAuth aktivieren
   - GitHub OAuth aktivieren
   - Apple OAuth (optional)

3. **Row Level Security (RLS)**
   ```sql
   -- Beispiel RLS Policy für User-Daten
   CREATE POLICY "Users can view own profile" 
   ON users FOR SELECT 
   USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" 
   ON users FOR UPDATE 
   USING (auth.uid() = id);
   ```

## 📁 Schritt 4: Storage Setup

### Buckets erstellen

```javascript
// Supabase Dashboard → Storage → New Bucket
const buckets = [
  {
    name: 'avatars',
    public: true,
    fileSizeLimit: '5MB',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
  },
  {
    name: 'documents',
    public: false,
    fileSizeLimit: '10MB',
    allowedMimeTypes: ['application/pdf', 'application/msword']
  },
  {
    name: 'reports',
    public: false,
    fileSizeLimit: '50MB'
  }
]
```

## 🔄 Schritt 5: Realtime Configuration

### Enable Realtime für Tabellen

```sql
-- Im Supabase SQL Editor ausführen
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

## 🛠️ Schritt 6: Environment Setup

### Backend (.env)

```bash
# Supabase
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Supabase API
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJ..." # Service Role Key für Backend
SUPABASE_JWT_SECRET="your-jwt-secret" # Aus Project Settings

# NextAuth mit Supabase Adapter
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

### Frontend (.env.local)

```bash
# Public Supabase Keys
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..." # Anon Key für Frontend

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
```

## 🚀 Schritt 7: Lokale Entwicklung

### Option A: Supabase CLI (Empfohlen)

```bash
# Supabase CLI installieren
npm install -g supabase

# Projekt initialisieren
supabase init

# Mit Cloud-Projekt verknüpfen
supabase link --project-ref [YOUR-PROJECT-REF]

# Lokale Entwicklung starten
supabase start
```

### Option B: Docker Compose

```yaml
# docker-compose.supabase.yml
version: '3.8'

services:
  supabase-db:
    image: supabase/postgres:15.1.0.117
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: postgres
    volumes:
      - supabase-db-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  supabase-auth:
    image: supabase/gotrue:v2.132.3
    depends_on:
      - supabase-db
    environment:
      GOTRUE_DB_DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@supabase-db:5432/postgres
      GOTRUE_SITE_URL: http://localhost:3000
      GOTRUE_JWT_SECRET: ${SUPABASE_JWT_SECRET}

volumes:
  supabase-db-data:
```

## 📝 Schritt 8: Migration & Seed

```bash
# Prisma Client generieren
npx prisma generate

# Migration erstellen
npx prisma migrate dev --name init_supabase

# Seed-Daten einfügen
npm run db:seed
```

## 🧪 Schritt 9: Verbindung testen

### Test-Script (test-supabase.js)

```javascript
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test Database Connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) throw error
    console.log('✅ Database connection successful')

    // Test Auth
    const { data: authData } = await supabase.auth.admin.listUsers()
    console.log('✅ Auth service connected')

    // Test Storage
    const { data: buckets } = await supabase.storage.listBuckets()
    console.log('✅ Storage service connected')
    console.log('📦 Available buckets:', buckets.map(b => b.name))

  } catch (error) {
    console.error('❌ Connection failed:', error.message)
  }
}

testConnection()
```

## 🔒 Schritt 10: Security Best Practices

### 1. Row Level Security (RLS)

```sql
-- RLS für alle Tabellen aktivieren
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Policies erstellen
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);
```

### 2. API Security

```typescript
// Middleware für API Routes
export function withSupabaseAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.user = session.user
    return handler(req, res)
  }
}
```

### 3. Environment Variables

- Niemals API Keys in Frontend-Code hardcoden
- Service Role Key nur im Backend verwenden
- Anon Key nur für öffentliche Operationen

## 🚨 Troubleshooting

### Problem: Connection Refused

```bash
# Prüfen Sie die Connection URL
# Pooler Port: 6543 (für Anwendung)
# Direct Port: 5432 (für Migrations)
```

### Problem: SSL Required

```bash
# Fügen Sie SSL Mode hinzu
DATABASE_URL="...?sslmode=require"
```

### Problem: Prisma Migration Fehler

```bash
# Nutzen Sie DIRECT_URL für Migrations
npx prisma migrate dev --schema=./prisma/schema.prisma
```

### Problem: Auth Token Invalid

```bash
# JWT Secret prüfen
# Muss identisch sein in Supabase Dashboard und .env
```

## 📚 Nützliche Ressourcen

- [Supabase Docs](https://supabase.com/docs)
- [Prisma with Supabase](https://supabase.com/docs/guides/integrations/prisma)
- [NextAuth Supabase Adapter](https://authjs.dev/reference/adapter/supabase)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

## ✅ Checkliste

- [ ] Supabase Projekt erstellt
- [ ] Environment Variables konfiguriert
- [ ] Prisma Schema angepasst
- [ ] Migration ausgeführt
- [ ] RLS Policies erstellt
- [ ] Storage Buckets konfiguriert
- [ ] Auth Providers aktiviert
- [ ] Connection Test erfolgreich
- [ ] Backup-Strategie definiert

## 🎯 Nächste Schritte

1. **Authentication Implementation**
   - NextAuth.js mit Supabase Adapter
   - Login/Register Pages
   - Protected Routes

2. **Realtime Features**
   - Chat mit Realtime Subscriptions
   - Live Notifications
   - Collaborative Features

3. **File Upload**
   - Avatar Upload mit Storage
   - Document Management
   - Report Generation

---

**Erstellt am:** 2024-01-23  
**Status:** Ready for Implementation  
**Maintainer:** CEO Agent