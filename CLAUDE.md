# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 Project: KI-Beratungsplattform
MVP für KI-Beratung: Assessment → Roadmap → Projekte → Beratung

## 🛠 Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express, PostgreSQL, Prisma
- **Auth**: NextAuth.js (OAuth + Email)
- **i18n**: next-i18next (de/en)

## 📋 Commands (Copy & Paste)
```bash
npm install              # Setup
npm run dev              # Start development
npm run db:migrate       # Database migrations
npm run test             # Run tests
npm run lint             # Check code
npm run build            # Production build
```

## ⚠️ KRITISCHE ENTWICKLUNGSPRINZIPIEN

### 🚫 Code-Duplikation VERBOTEN
```markdown
VOR jeder neuen Funktion:
1. Suche in: /lib, /utils, /hooks, /components
2. Nutze existierende Funktionen
3. Extrahiere gemeinsame Logik SOFORT
4. Ein Util = Ein Ort = Eine Wahrheit
```

### 🚨 JavaScript/Event-Handler NIEMALS DUPLIZIEREN
```markdown
KRITISCH - Häufigster Fehler:
- NIEMALS denselben Event-Listener mehrfach registrieren
- NIEMALS Scripts mehrfach laden
- IMMER prüfen ob Handler bereits existiert
- useEffect IMMER mit cleanup function

// ✅ RICHTIG
useEffect(() => {
  const handler = () => console.log('click');
  element.addEventListener('click', handler);
  return () => element.removeEventListener('click', handler);
}, []);

// ❌ FALSCH - wird bei jedem Render dupliziert!
element.addEventListener('click', handler);
```

### 🤔 IMMER NACHFRAGEN - Keine Annahmen!
```markdown
Bei JEDEM Feature MUSS der Agent fragen:
1. Datenbank-Schema: "Welche Felder speichern?"
2. Navigation: "Wohin nach Erfolg/Fehler?"
3. Validierung: "Welche Felder sind Pflicht?"
4. Error Handling: "Wie Fehler anzeigen?"
5. Berechtigungen: "Wer darf das sehen?"

Beispiel Login:
❌ NICHT: "Ich baue dir ein Login"
✅ RICHTIG: 
   - "Nur Email/Password oder auch Social Login?"
   - "Username oder Email als Login?"
   - "Wohin nach erfolgreichem Login?"
   - "Passwort-Vergessen Funktion?"
   - "Remember Me Option?"
```

### 📝 Dokumentations-UPDATE PFLICHT
```markdown
Feature geändert? → Docs SOFORT updaten:
- API geändert → /docs/API_ENDPOINTS.md
- DB geändert → /docs/DATABASE_MVP.md  
- Components → /docs/COMPONENTS_HIERARCHY.md
- KEINE veralteten Docs!
```

### 🏗️ Utility-Struktur (NUTZE DIESE!)
```
/frontend/src/lib/
├── api.ts         # useApi() hook für ALLE API calls
├── auth.ts        # useAuth() für ALLE Auth-Checks
├── format.ts      # formatDate(), formatCurrency()
└── validation.ts  # Zod schemas für Forms

/backend/src/utils/
├── ApiError.ts    # IMMER für Errors verwenden
├── auth.ts        # generateToken(), verifyToken()
└── db.ts          # withTransaction() wrapper
```

## 🎨 Common Patterns (KOPIERE DIESE!)

### Event Handling (KRITISCH!)
```typescript
// ✅ RICHTIG - Cleanup verhindert Duplikate
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// ✅ RICHTIG - Event Handler nur einmal
const handleSubmit = useCallback((e: FormEvent) => {
  e.preventDefault();
  // logic here
}, [dependencies]);

// ❌ FALSCH - Wird mehrfach registriert!
window.addEventListener('click', () => {});
```

### API Calls (Frontend)
```typescript
// IMMER useApi verwenden - NIE direkt fetch/axios!
const { data, error, loading } = useApi<ProjectData>('/projects')
const { mutate } = useApiMutation('/projects', {
  onSuccess: () => router.push('/dashboard')
})
```

### Form Handling
```typescript
// IMMER diese Struktur für Forms
const schema = z.object({ name: z.string().min(1) })
const form = useForm<FormData>({ 
  resolver: zodResolver(schema) 
})
```

### Error Handling (Backend)
```typescript
// IMMER ApiError verwenden
throw new ApiError(400, 'Validation failed', { field: 'email' })
// NIE: res.status(400).json({...})
```

### Database Transactions
```typescript
// IMMER withTransaction für multiple DB ops
const result = await withTransaction(async (tx) => {
  const user = await tx.user.create({...})
  const profile = await tx.profile.create({...})
  return { user, profile }
})
```

## 📁 Wichtige Dokumentation
- **User Journey**: `/docs/USER_JOURNEY.md`
- **API Endpoints**: `/docs/API_ENDPOINTS.md`
- **Database Schema**: `/docs/DATABASE_MVP.md`
- **Components**: `/docs/COMPONENTS_HIERARCHY.md`
- **i18n Strategy**: `/docs/I18N_STRATEGY.md`
- **Agent Handoff**: `/docs/AGENT_HANDOFF.md`

## 🔄 Multi-Agent Workflow (WICHTIG!)
```markdown
VOR Context-Clear:
- IMMER .agent-state.json updaten
- IMMER docs/CURRENT_TASK.md updaten
- Git commit mit aussagekräftiger Message

NACH Context-Clear:
- IMMER .agent-state.json lesen
- IMMER docs/CURRENT_TASK.md lesen
- TODOs im Code suchen: grep -r "TODO: \[AGENT-"

Bei Blockern:
- Als BLOCKED: [AGENT-XXX] im Code markieren
- In .agent-state.json unter blocking_issues
- Klare Beschreibung was gebraucht wird

Automatische Checks:
- npm run check:duplicates (keine Code-Duplikate)
- npm run check:docs (Docs aktuell?)
- Pre-commit hooks laufen automatisch
```

## 🚀 MVP Fokus
- Quick Assessment → Roadmap → Projekte → Chat
- 3 Subscription Tiers (49€/199€/499€)
- REST API (kein WebSocket im MVP)
- Mobile-first responsive
- DE/EN von Anfang an

## 🎨 FRONTEND DESIGN SYSTEM - PFLICHT!

### Notion-Style ist VERBINDLICH
```markdown
ALLE Frontend-Entwickler MÜSSEN:
- Komponenten aus /components/ui verwenden
- useNotionStyles Hook für ALLE Styles
- Design System Dokumentation folgen
- Konsistenz über alles!
```

### ✅ RICHTIGE Verwendung:
```typescript
// Komponenten importieren
import { NotionButton, NotionCard, NotionSidebar } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'

// Styles nutzen
const styles = useNotionStyles()

// Komponenten verwenden
<NotionCard title="Feature" clickable>
  <p className={styles.text('body')}>Content</p>
  <NotionButton variant="primary">Action</NotionButton>
</NotionCard>
```

### ❌ FALSCH - NIEMALS SO:
```typescript
// KEINE inline Tailwind ohne Design System
<button className="bg-blue-500 text-white px-4 py-2">

// KEINE custom Farben
<div style={{ backgroundColor: '#123456' }}>

// KEINE eigenen Hover-Effekte
<div className="hover:shadow-lg hover:scale-110">
```

### Style-Hierarchie:
1. **Vordefinierte Komponenten** (NotionButton, NotionCard, etc.)
2. **useNotionStyles() Hook** für Style-Klassen
3. **Tailwind mit notion-* Prefix** (nur wenn nötig)
4. **globals.css Klassen** (.notion-card, .notion-button, etc.)

### Verfügbare Komponenten:
- `NotionButton` - Buttons mit 5 Varianten
- `NotionCard` - Cards mit Hover-Effekten
- `NotionSidebar` - Collapsible Navigation
- `ThemeToggle` - Dark/Light Mode Switch

### Design Tokens:
- Farben: `/lib/design-system/colors.ts`
- Styles: `/lib/design-system/notion-styles.ts`
- Animationen: `/lib/design-system/animations.ts`

### Theme:
- IMMER ThemeProvider wrappen
- useTheme() für Theme-Zugriff
- Automatic Dark/Light Mode

## ❓ Feature-Entwicklung: FRAGEN CHECKLISTE

### Bei Login/Register:
```markdown
□ Email oder Username als Login?
□ Welche Felder bei Registrierung? (Name, Firma, etc.)
□ Social Login gewünscht? (Google, GitHub, Apple)
□ Email-Verifizierung erforderlich?
□ Wohin nach Login navigieren?
□ Remember Me Funktion?
□ Passwort-Anforderungen?
□ Terms & Conditions Checkbox?
```

### Bei Forms allgemein:
```markdown
□ Welche Felder sind Pflicht?
□ Validierungs-Regeln für jedes Feld?
□ Wohin nach Submit navigieren?
□ Erfolgs-/Fehler-Meldungen wie anzeigen?
□ Speichern als Draft möglich?
□ Bestätigungs-Dialog vor Submit?
```

### Bei Listen/Tabellen:
```markdown
□ Welche Spalten anzeigen?
□ Sortierung möglich? Nach welchen Feldern?
□ Filter-Optionen?
□ Pagination oder Infinite Scroll?
□ Bulk Actions gewünscht?
□ Export-Funktion (CSV, PDF)?
```

### Bei neuen Features:
```markdown
□ Wer darf das sehen/nutzen? (Rollen)
□ In welchem Menü-Punkt einordnen?
□ Mobile Ansicht berücksichtigt?
□ Offline-Funktionalität nötig?
□ Analytics/Tracking gewünscht?
□ Notifications bei Aktionen?
```