# Database Schema - MVP Version

## Übersicht
Vereinfachtes Datenbank-Schema für das MVP der KI-Beratungsplattform. Fokus auf essenzielle Features ohne überflüssige Komplexität.

## Design-Prinzipien
- **Keep it Simple**: Nur notwendige Felder und Relationen
- **Erweiterbar**: Struktur erlaubt spätere Ergänzungen
- **Multi-Role Users**: Ein User kann mehrere Rollen haben
- **Soft Deletes**: Daten werden markiert statt gelöscht

## Core Tables

### 1. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255), -- NULL für OAuth users
  company_name VARCHAR(255),
  company_size ENUM('freelancer', 'startup', 'small', 'medium', 'large'),
  industry VARCHAR(100),
  role ENUM('user', 'advisor', 'admin') DEFAULT 'user',
  avatar_url TEXT,
  locale VARCHAR(5) DEFAULT 'de',
  timezone VARCHAR(50) DEFAULT 'Europe/Berlin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  last_login_at TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2. auth_providers
```sql
CREATE TABLE auth_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider ENUM('google', 'github', 'apple', 'email') NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_user_id)
);
```

### 3. assessments
```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type ENUM('quick', 'detailed') DEFAULT 'quick',
  responses JSONB NOT NULL, -- Flexible für verschiedene Frage-Sets
  score INTEGER, -- 0-100
  maturity_level ENUM('beginner', 'intermediate', 'advanced'),
  recommendations JSONB, -- Generierte Empfehlungen
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessments_user_id ON assessments(user_id);
```

### 4. roadmaps
```sql
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  milestones JSONB, -- Array von Meilensteinen
  estimated_duration_weeks INTEGER,
  status ENUM('draft', 'active', 'completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES roadmaps(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('planning', 'active', 'on_hold', 'completed') DEFAULT 'planning',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  start_date DATE,
  due_date DATE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
```

### 6. tasks
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in_progress', 'done') DEFAULT 'todo',
  position INTEGER NOT NULL, -- Für Kanban-Sortierung
  assignee_id UUID REFERENCES users(id),
  due_date DATE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

### 7. messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id), -- Optional: Projekt-Kontext
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
```

### 8. subscriptions
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan ENUM('starter', 'professional', 'enterprise') NOT NULL,
  status ENUM('trialing', 'active', 'cancelled', 'past_due') DEFAULT 'trialing',
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### 9. advisor_assignments
```sql
CREATE TABLE advisor_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  advisor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status ENUM('active', 'paused', 'ended') DEFAULT 'active',
  notes TEXT,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP
);

CREATE INDEX idx_advisor_assignments_user_id ON advisor_assignments(user_id);
CREATE INDEX idx_advisor_assignments_advisor_id ON advisor_assignments(advisor_id);
```

### 10. activity_log
```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL, -- 'assessment_completed', 'project_created', etc.
  entity_type VARCHAR(50), -- 'project', 'task', etc.
  entity_id UUID,
  metadata JSONB, -- Zusätzliche Kontext-Informationen
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_action ON activity_log(action);
```

## Vereinfachungen gegenüber Full-Version

### Was wir NICHT haben:
1. **Keine separate profiles Tabelle** - Alles in users
2. **Keine komplexe Permissions** - Einfaches role-based System
3. **Keine separaten question/answer Tabellen** - JSONB für Flexibilität
4. **Kein komplexes Learning System** - Erstmal nur externe Links
5. **Keine Gamification Tabellen** - Punkte in user.metadata später
6. **Keine Team/Organization Struktur** - Single User Focus

### JSONB Struktur-Beispiele

#### assessments.responses
```json
{
  "questions": [
    {
      "id": "q1",
      "question": "Wie groß ist Ihr Unternehmen?",
      "answer": "10-50 Mitarbeiter",
      "score": 3
    }
  ],
  "completion_time_seconds": 240,
  "version": "1.0"
}
```

#### roadmaps.milestones
```json
{
  "milestones": [
    {
      "id": "m1",
      "title": "KI-Strategie definieren",
      "description": "Ziele und Use Cases identifizieren",
      "week": 1,
      "status": "completed",
      "tasks": ["Ist-Analyse", "Zieldefinition"]
    }
  ]
}
```

## Migrations-Strategie

### Initial Migration
```sql
-- 001_initial_schema.sql
-- Alle CREATE TABLE statements von oben

-- Seed Data für Development
INSERT INTO users (email, name, role, password_hash) VALUES
  ('admin@ki-beratung.de', 'Admin User', 'admin', '$2b$10$...');
```

### Indexes für Performance
```sql
-- Zusätzliche Indexes basierend auf Query-Patterns
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_projects_user_status ON projects(user_id, status);
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
```

## Backup & Recovery

### Backup-Strategie
- **Täglich**: Vollbackup der Datenbank
- **Stündlich**: Incremental Backups
- **Retention**: 30 Tage

### Critical Data
1. users & auth_providers (Zugang)
2. subscriptions (Zahlungen)
3. messages (Kommunikation)
4. projects & tasks (Kundenarbeit)

## Performance-Überlegungen

### Query-Optimierung
1. **Pagination** für alle Listen-Queries
2. **Eager Loading** für Relations
3. **Caching** für User-Profile und Subscriptions
4. **Read Replicas** für Analytics (später)

### Erwartete Größenordnung (Year 1)
- Users: ~1,000
- Projects: ~5,000
- Tasks: ~50,000
- Messages: ~100,000

## Security

### Verschlüsselung
- Passwords: bcrypt (minimum 10 rounds)
- Sensitive JSONB fields: Application-level encryption
- Backups: Encrypted at rest

### Zugriffskontrolle
- Row Level Security (RLS) für Multi-Tenancy
- API-Level Permission Checks
- Audit Log für alle kritischen Aktionen

## Nächste Schritte

1. **Prisma Schema** aus diesem SQL generieren
2. **Migrations** erstellen und testen
3. **Seed Data** für Entwicklung vorbereiten
4. **TypeScript Types** aus Schema generieren
5. **API Endpoints** basierend auf Entities planen