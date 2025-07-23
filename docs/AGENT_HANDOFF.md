# Agent Handoff Protocol

## 🎯 Zweck
Dieses Dokument definiert den standardisierten Übergabeprozess zwischen Agents bei Context-Clears im Cursor Multi-Agent Workflow.

## 📋 Übergabe-Checkliste

### VOR dem Context-Clear (Aktueller Agent)

1. **Update .agent-state.json**
   ```json
   {
     "timestamp": "2024-01-20T10:30:00Z",
     "agent": "frontend|backend|database|devops",
     "current_task": {
       "id": "task-001",
       "description": "Implement user login",
       "started_at": "2024-01-20T09:00:00Z",
       "progress_percentage": 70
     },
     "completed_steps": [
       "Created login form component",
       "Added validation schema",
       "Integrated with API"
     ],
     "next_steps": [
       "Add error handling",
       "Implement remember me",
       "Add loading states"
     ],
     "blocking_issues": [
       {
         "type": "missing_api_endpoint",
         "description": "Need /api/v1/auth/refresh endpoint",
         "for_agent": "backend"
       }
     ],
     "important_files": [
       "/frontend/src/components/auth/LoginForm.tsx",
       "/frontend/src/lib/auth.ts"
     ],
     "decisions_made": [
       "Using email instead of username for login",
       "Implementing OAuth later (not MVP)"
     ],
     "test_status": {
       "unit_tests": "pending",
       "integration_tests": "not_started"
     }
   }
   ```

2. **Update docs/CURRENT_TASK.md**
   - Aktuelle Aufgabe
   - Was wurde erreicht
   - Was fehlt noch
   - Wichtige Entscheidungen

3. **Code-Kommentare hinzufügen**
   ```typescript
   // TODO: [AGENT-FRONTEND] Add loading spinner while authenticating
   // FIXME: [AGENT-BACKEND] Rate limiting needed on this endpoint
   // NOTE: [HANDOFF] Password requirements: min 8 chars, 1 number, 1 special
   // BLOCKED: [AGENT-DATABASE] Need user_sessions table for remember me
   ```

4. **Commit mit aussagekräftiger Message**
   ```bash
   git add .
   git commit -m "feat(auth): Implement login form (70% complete)
   
   - Created LoginForm component with validation
   - Integrated with auth API
   - Added i18n support
   
   TODO: Error handling, remember me, loading states
   BLOCKED: Need refresh token endpoint"
   ```

### NACH dem Context-Clear (Neuer Agent)

1. **Kontext wiederherstellen**
   ```bash
   # 1. State lesen
   cat .agent-state.json
   
   # 2. Aktuelle Aufgabe verstehen
   cat docs/CURRENT_TASK.md
   
   # 3. TODOs im Code suchen
   grep -r "TODO: \[AGENT-" . --include="*.ts" --include="*.tsx"
   
   # 4. Letzte Commits prüfen
   git log --oneline -10
   ```

2. **Blocker identifizieren**
   - Check `.agent-state.json` → `blocking_issues`
   - Suche nach `BLOCKED:` Kommentaren
   - Prüfe failing tests

3. **Arbeit fortsetzen**
   - Mit nächsten Steps aus `.agent-state.json` beginnen
   - Blockierende Issues zuerst lösen
   - Progress in `.agent-state.json` updaten

## 🏷️ Standard-Tags für Code-Kommentare

### Priority-Level
- `CRITICAL:` - Muss sofort gelöst werden
- `HIGH:` - Wichtig für Feature-Completion
- `MEDIUM:` - Normal priority
- `LOW:` - Nice to have

### Agent-Zuweisung
- `[AGENT-FRONTEND]` - Frontend-spezifisch
- `[AGENT-BACKEND]` - Backend-spezifisch
- `[AGENT-DATABASE]` - Datenbank-Änderungen
- `[AGENT-DEVOPS]` - Infrastructure/Deployment
- `[AGENT-ANY]` - Kann von jedem Agent gemacht werden

### Action-Types
- `TODO:` - Muss noch implementiert werden
- `FIXME:` - Bug der gefixt werden muss
- `OPTIMIZE:` - Performance-Verbesserung möglich
- `REFACTOR:` - Code-Qualität verbessern
- `TEST:` - Tests fehlen hier
- `BLOCKED:` - Wartet auf anderen Agent/Task
- `NOTE:` - Wichtige Information für nächsten Agent
- `DECISION:` - Architektur-Entscheidung dokumentiert

## 📊 Task-Status Definitionen

### In .agent-state.json
- `not_started` - 0%
- `in_progress` - 1-99%
- `completed` - 100%
- `blocked` - Wartet auf anderen Task/Agent
- `cancelled` - Nicht mehr relevant

### Git Branch Naming
```bash
feature/auth-login-[agent-frontend]
fix/api-rate-limit-[agent-backend]
refactor/database-schema-[agent-database]
```

## 🔄 Handoff-Beispiele

### Frontend → Backend
```json
{
  "handoff_from": "frontend",
  "handoff_to": "backend",
  "reason": "API endpoint missing",
  "needs": {
    "endpoint": "/api/v1/auth/refresh",
    "method": "POST",
    "body": { "refresh_token": "string" },
    "response": { "access_token": "string", "expires_in": "number" }
  },
  "frontend_ready": true,
  "blocked_until": "endpoint implemented"
}
```

### Backend → Database
```json
{
  "handoff_from": "backend",
  "handoff_to": "database",
  "reason": "Schema update needed",
  "needs": {
    "table": "user_sessions",
    "fields": [
      "id UUID PRIMARY KEY",
      "user_id UUID REFERENCES users(id)",
      "token VARCHAR(255) UNIQUE",
      "expires_at TIMESTAMP"
    ]
  },
  "migration_required": true
}
```

## ⚡ Quick Commands

### Status Check
```bash
# Aktueller Status
cat .agent-state.json | jq '.current_task'

# Offene TODOs
grep -r "TODO: \[AGENT-$(echo $AGENT_ROLE)\]" . 

# Blockierte Tasks
cat .agent-state.json | jq '.blocking_issues'
```

### Handoff Preparation
```bash
# Script für sauberen Handoff
npm run prepare-handoff

# Checkt:
# - Uncommitted changes
# - Updates .agent-state.json
# - Runs linter
# - Creates handoff commit
```

## 🚨 Kritische Regeln

1. **NIE** einen Task beginnen ohne `.agent-state.json` zu lesen
2. **IMMER** Blocker dokumentieren bevor Context-Clear
3. **JEDE** Entscheidung in Code-Kommentaren festhalten
4. **KEINE** Assumptions - lieber im Code als NOTE: dokumentieren
5. **ALLE** Breaking Changes in CURRENT_TASK.md erwähnen

## 📝 Template für CURRENT_TASK.md

```markdown
# Current Task: [Task Name]

## Status
- Started: 2024-01-20 09:00
- Progress: 70%
- Blocked: Yes (waiting for X)

## Completed
- ✅ Component structure created
- ✅ Basic functionality implemented
- ✅ Integrated with existing code

## Remaining
- ❌ Error handling
- ❌ Loading states
- ❌ Unit tests
- ❌ Documentation update

## Decisions Made
1. Using email for login (not username)
2. Password requirements: 8+ chars
3. Session duration: 24 hours

## Blocking Issues
1. Need refresh token endpoint from backend team
2. Waiting for final design from UI team

## Next Agent Should
1. Check TODO comments in LoginForm.tsx
2. Implement refresh token endpoint
3. Add rate limiting to auth endpoints
```

Dieses Protokoll stellt sicher, dass kein Wissen verloren geht und jeder Agent nahtlos die Arbeit fortsetzen kann!