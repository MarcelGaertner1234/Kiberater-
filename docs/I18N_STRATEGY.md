# i18n (Internationalization) Strategy

## Übersicht
Mehrsprachigkeits-Strategie für die KI-Beratungsplattform. Start mit Deutsch und Englisch, vorbereitet für weitere Sprachen.

## Tech Stack
- **Next.js**: Built-in i18n routing
- **next-i18next**: Übersetzungs-Management
- **TypeScript**: Type-safe Übersetzungen
- **Locale**: de (Deutsch), en (English)

## Ordner-Struktur

```
/frontend/
├── public/
│   └── locales/
│       ├── de/
│       │   ├── common.json
│       │   ├── landing.json
│       │   ├── dashboard.json
│       │   ├── assessment.json
│       │   ├── projects.json
│       │   ├── auth.json
│       │   └── errors.json
│       └── en/
│           ├── common.json
│           ├── landing.json
│           ├── dashboard.json
│           ├── assessment.json
│           ├── projects.json
│           ├── auth.json
│           └── errors.json
├── src/
│   └── lib/
│       └── i18n/
│           ├── config.ts
│           ├── types.ts
│           └── utils.ts
```

## Konfiguration

### next-i18next.config.js
```javascript
module.exports = {
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    localePath: './public/locales',
    localeDetection: true,
  },
  fallbackLng: 'de',
  ns: ['common', 'landing', 'dashboard', 'assessment', 'projects', 'auth', 'errors'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
}
```

### next.config.js
```javascript
const { i18n } = require('./next-i18next.config')

module.exports = {
  i18n,
  // ... andere Konfig
}
```

## Übersetzungs-Dateien

### common.json (Gemeinsame Begriffe)
```json
{
  "buttons": {
    "save": "Speichern",
    "cancel": "Abbrechen",
    "delete": "Löschen",
    "edit": "Bearbeiten",
    "create": "Erstellen",
    "back": "Zurück",
    "next": "Weiter",
    "submit": "Absenden",
    "loading": "Lädt..."
  },
  "navigation": {
    "dashboard": "Dashboard",
    "projects": "Projekte",
    "assessment": "KI-Analyse",
    "messages": "Nachrichten",
    "settings": "Einstellungen",
    "logout": "Abmelden"
  },
  "status": {
    "active": "Aktiv",
    "inactive": "Inaktiv",
    "pending": "Ausstehend",
    "completed": "Abgeschlossen"
  },
  "time": {
    "days": "Tage",
    "hours": "Stunden",
    "minutes": "Minuten",
    "ago": "vor {{time}}",
    "in": "in {{time}}"
  }
}
```

### landing.json (Landing Page)
```json
{
  "hero": {
    "title": "KI einfach machen - für Ihr Unternehmen",
    "subtitle": "Wir begleiten Sie auf Ihrer KI-Reise mit persönlicher Beratung und praktischen Tools",
    "cta_primary": "Kostenlose KI-Analyse starten",
    "cta_secondary": "Demo ansehen"
  },
  "features": {
    "assessment": {
      "title": "KI-Readiness Assessment",
      "description": "Finden Sie heraus, wo Ihr Unternehmen bei der KI-Nutzung steht"
    },
    "roadmap": {
      "title": "Personalisierte Roadmap",
      "description": "Erhalten Sie einen maßgeschneiderten Plan für Ihre KI-Integration"
    },
    "support": {
      "title": "Persönliche Beratung",
      "description": "Ihr dedizierter KI-Berater begleitet Sie bei jedem Schritt"
    }
  },
  "pricing": {
    "title": "Wählen Sie Ihr Paket",
    "monthly": "Monatlich",
    "yearly": "Jährlich",
    "save": "Sparen Sie {{percent}}%",
    "currency": "EUR",
    "per_month": "/Monat"
  }
}
```

### dashboard.json
```json
{
  "welcome": {
    "title": "Willkommen zurück, {{name}}!",
    "subtitle": "Hier ist Ihre KI-Fortschrittsübersicht"
  },
  "widgets": {
    "roadmap_progress": "Roadmap-Fortschritt",
    "active_projects": "Aktive Projekte",
    "next_milestone": "Nächster Meilenstein",
    "advisor_message": "Nachricht von Ihrem Berater"
  },
  "quick_actions": {
    "new_project": "Neues Projekt",
    "schedule_call": "Termin buchen",
    "view_roadmap": "Roadmap ansehen"
  }
}
```

### assessment.json
```json
{
  "title": "KI-Bereitschafts-Analyse",
  "types": {
    "quick": {
      "name": "Schnell-Analyse",
      "duration": "5 Minuten",
      "questions": 5
    },
    "detailed": {
      "name": "Detaillierte Analyse", 
      "duration": "15 Minuten",
      "questions": 15
    }
  },
  "progress": "Frage {{current}} von {{total}}",
  "questions": {
    "company_size": {
      "label": "Wie groß ist Ihr Unternehmen?",
      "options": {
        "freelancer": "Freelancer",
        "startup": "Startup (1-10)",
        "small": "Klein (11-50)",
        "medium": "Mittel (51-250)",
        "large": "Groß (250+)"
      }
    }
  },
  "results": {
    "title": "Ihre KI-Bereitschaft",
    "score": "Ihr Score: {{score}} von 100",
    "level": {
      "beginner": "Einsteiger",
      "intermediate": "Fortgeschritten",
      "advanced": "Experte"
    }
  }
}
```

### errors.json
```json
{
  "general": {
    "something_went_wrong": "Etwas ist schiefgelaufen",
    "try_again": "Bitte versuchen Sie es erneut",
    "contact_support": "Support kontaktieren"
  },
  "auth": {
    "invalid_credentials": "Ungültige Anmeldedaten",
    "email_not_verified": "Bitte verifizieren Sie Ihre E-Mail-Adresse",
    "session_expired": "Ihre Sitzung ist abgelaufen"
  },
  "validation": {
    "required": "Dieses Feld ist erforderlich",
    "email": "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    "min_length": "Mindestens {{min}} Zeichen erforderlich",
    "max_length": "Maximal {{max}} Zeichen erlaubt"
  },
  "api": {
    "network_error": "Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung",
    "server_error": "Serverfehler. Bitte später erneut versuchen",
    "not_found": "Die angeforderte Ressource wurde nicht gefunden"
  }
}
```

## TypeScript Integration

### Typen generieren
```typescript
// lib/i18n/types.ts
import common from '../../public/locales/de/common.json'
import landing from '../../public/locales/de/landing.json'
// ... weitere imports

export interface I18nNamespaces {
  common: typeof common
  landing: typeof landing
  // ... weitere namespaces
}

export type TranslationKeys<NS extends keyof I18nNamespaces> = 
  keyof I18nNamespaces[NS]
```

### Typed Hook
```typescript
// lib/i18n/useTypedTranslation.ts
import { useTranslation } from 'next-i18next'
import type { I18nNamespaces } from './types'

export function useTypedTranslation<NS extends keyof I18nNamespaces>(
  namespace: NS
) {
  const { t, i18n } = useTranslation(namespace)
  
  return {
    t: (key: TranslationKeys<NS>, options?: any) => t(key, options),
    i18n,
  }
}
```

## Verwendung in Komponenten

### Server Components
```typescript
// app/[locale]/page.tsx
import { useTranslation } from '@/app/i18n'

export default async function Page({ params: { locale } }) {
  const { t } = await useTranslation(locale, 'landing')
  
  return (
    <h1>{t('hero.title')}</h1>
  )
}
```

### Client Components
```typescript
// components/Button.tsx
'use client'

import { useTypedTranslation } from '@/lib/i18n/useTypedTranslation'

export function SaveButton() {
  const { t } = useTypedTranslation('common')
  
  return (
    <button>{t('buttons.save')}</button>
  )
}
```

## Formatierung

### Zahlen
```typescript
const { i18n } = useTranslation()

const formattedPrice = new Intl.NumberFormat(i18n.language, {
  style: 'currency',
  currency: 'EUR',
}).format(49)
// de: "49,00 €"
// en: "€49.00"
```

### Datum
```typescript
const formattedDate = new Intl.DateTimeFormat(i18n.language, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(new Date())
// de: "20. Januar 2024"
// en: "January 20, 2024"
```

### Pluralisierung
```json
{
  "items": {
    "one": "{{count}} Artikel",
    "other": "{{count}} Artikel"
  }
}
```

```typescript
t('items', { count: 5 }) // "5 Artikel"
```

## Best Practices

### 1. Key Naming Convention
```
namespace.section.element.state
Beispiel: dashboard.widgets.roadmap_progress.title
```

### 2. Variablen
```json
{
  "welcome": "Willkommen {{name}}!"
}
```
```typescript
t('welcome', { name: user.name })
```

### 3. Keine Hardcoded Strings
```typescript
// ❌ Schlecht
<button>Speichern</button>

// ✅ Gut
<button>{t('common:buttons.save')}</button>
```

### 4. Namespace Organization
- **common**: Wiederverwendbare Begriffe
- **Feature-spezifisch**: landing, dashboard, etc.
- **errors**: Alle Fehlermeldungen

### 5. Default Values
```typescript
t('missing.key', 'Fallback Text')
```

## SEO Considerations

### Meta Tags
```typescript
// app/[locale]/layout.tsx
export async function generateMetadata({ params: { locale } }) {
  const { t } = await useTranslation(locale, 'meta')
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      locale: locale,
      alternateLocale: locale === 'de' ? 'en' : 'de',
    },
  }
}
```

### Alternate Links
```html
<link rel="alternate" hreflang="de" href="https://ki-beratung.de/de" />
<link rel="alternate" hreflang="en" href="https://ki-beratung.de/en" />
```

## Language Switcher Component

```typescript
// components/LanguageSwitcher.tsx
export function LanguageSwitcher() {
  const router = useRouter()
  const { i18n } = useTranslation()
  
  const handleChange = (locale: string) => {
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, { locale })
  }
  
  return (
    <select 
      value={i18n.language} 
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="de">Deutsch</option>
      <option value="en">English</option>
    </select>
  )
}
```

## Testing

### Unit Tests
```typescript
// Mock i18n
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'de' },
  }),
}))
```

### E2E Tests
```typescript
// Sprach-Wechsel testen
test('language switcher', async ({ page }) => {
  await page.goto('/de')
  await page.selectOption('[data-testid="language-switcher"]', 'en')
  await expect(page).toHaveURL('/en')
})
```

## Übersetzungs-Workflow

### 1. Development
- Entwickler fügen Keys in Code ein
- Default-Werte als Fallback

### 2. Extraction
```bash
# Script zum Finden nicht übersetzter Keys
npm run i18n:extract
```

### 3. Translation
- JSON-Dateien an Übersetzer
- Oder Translation Management System

### 4. Validation
```bash
# Prüfung auf fehlende Keys
npm run i18n:validate
```

## Performance

### Lazy Loading
```typescript
// Nur benötigte Namespaces laden
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['landing', 'common'])),
    },
  }
}
```

### Bundle Size
- Keine ungenutzten Übersetzungen
- Tree-shaking für Namespaces

## Zukünftige Erweiterungen

### Weitere Sprachen
1. Locale zu Config hinzufügen
2. Übersetzungs-Dateien erstellen
3. Language Switcher erweitern

### Regional Variations
```
de-DE (Deutschland)
de-AT (Österreich)
de-CH (Schweiz)
```

### RTL Support
- Arabisch, Hebräisch
- CSS logical properties
- Mirrored UI components