# User Journey - KI-Beratungsplattform

## Übersicht
Dieses Dokument beschreibt die User Journeys für alle Nutzertypen unserer Plattform.

## 1. Neue Besucher (Visitor Journey)

### 1.1 Landing Page Ankunft
```
Einstiegspunkte:
- Google Suche: "KI Beratung Mittelstand"
- Social Media Link
- Empfehlung
```

### 1.2 Erster Eindruck (Hero Section)
- **Headline**: "KI einfach machen - für Ihr Unternehmen"
- **CTA Primary**: "Kostenlose KI-Analyse starten"
- **CTA Secondary**: "Demo ansehen"
- **Trust Signals**: Kundenzahlen, Erfolgsgeschichten

### 1.3 Quick Assessment Flow
```
1. CTA Click → Modal/Neue Seite
2. 5 Fragen:
   - Unternehmensgröße (Freelancer/Startup/Mittelstand)
   - Branche (Dropdown)
   - Aktueller KI-Einsatz (Ja/Nein/Geplant)
   - Größte Herausforderung (Multiple Choice)
   - Budget-Range (Optional)
3. Ergebnis-Teaser → Registrierung erforderlich
```

### 1.4 Registrierung
```
Optionen:
- Google OAuth (1-Click)
- Email + Password
- GitHub (für Tech-Startups)

Nach Registrierung:
→ Vollständiges Assessment-Ergebnis
→ Personalisierte Roadmap
→ 14 Tage Trial Professional
```

## 2. Registrierte Nutzer Journey

### 2.1 Erstes Dashboard
```
Welcome Widget:
- "Willkommen [Name], hier ist Ihre KI-Roadmap"
- 3 erste Schritte prominent
- Video-Tutorial (2 Min)
- Berater-Vorstellung
```

### 2.2 Detailed Assessment (Optional)
```
Wenn Quick Assessment gemacht:
- Banner: "Vertiefen Sie Ihre Analyse"
- 15 zusätzliche Fragen
- Detailliertere Roadmap
- Industrie-Benchmarks
```

### 2.3 Projekt Start
```
1. "Erstes Projekt anlegen" Button
2. Template-Auswahl:
   - Prozess-Automatisierung
   - Kunden-Service KI
   - Datenanalyse
   - Eigenes Projekt
3. Kanban Board öffnet sich
4. Erste Tasks vorausgefüllt
```

### 2.4 Berater-Interaktion
```
Starter (Email):
- Frage stellen → 48h Antwort

Professional (Chat):
- Chat-Widget unten rechts
- Business Hours Indicator
- Durchschnittliche Antwortzeit: 30 Min

Enterprise:
- Dedizierter Berater
- Direkter Chat
- Video-Call Scheduling
```

## 3. Berater Journey (Admin)

### 3.1 Berater Dashboard
```
Übersicht:
- Neue Nachrichten (Priorisiert nach Plan)
- Offene Tickets
- Heutige Termine
- Client-Übersicht
```

### 3.2 Client Management
```
Pro Client:
- Assessment-Ergebnisse
- Projekt-Status
- Kommunikations-Historie
- Notizen
- Nächste Schritte
```

### 3.3 Effizienz-Tools
```
- Template-Antworten
- Knowledge Base
- Quick Actions (Meeting buchen, Dokument teilen)
- Bulk-Nachrichten (für Updates)
```

## 4. Conversion Paths

### 4.1 Visitor → Free User
```
Trigger: Quick Assessment
Motivation: Neugier auf Ergebnis
Barrier: Registrierung
Lösung: Social Login, Wert kommunizieren
```

### 4.2 Free → Starter (49€)
```
Trigger: Limitierungen spüren
Motivation: Email-Support benötigt
Barrier: Erstes Bezahl-Commitment
Lösung: 14 Tage Trial, Geld-zurück-Garantie
```

### 4.3 Starter → Professional (199€)
```
Trigger: Schnellere Hilfe benötigt
Motivation: Chat + monatliches 1:1
Barrier: Preis-Sprung
Lösung: ROI Calculator, Success Stories
```

### 4.4 Professional → Enterprise (499€)
```
Trigger: Intensive Betreuung gewünscht
Motivation: Dedizierter Berater
Barrier: Hoher Preis
Lösung: Persönliches Gespräch, Custom Package
```

## 5. Mobile Journey Besonderheiten

### 5.1 Landing Page Mobile
- Kürzere Texte
- Quick Assessment prominent
- Swipe-Navigation für Features

### 5.2 Dashboard Mobile
- Bottom Navigation
- Wichtigste Widgets zuerst
- Chat als Floating Button

### 5.3 Kanban Mobile
- Horizontales Scrollen
- Tap zum Editieren
- Swipe für Status-Änderung

## 6. Kritische Touch Points

### 6.1 Drop-off Risiken
1. **Assessment zu lang** → Quick Version
2. **Registrierung** → Social Login
3. **Leeres Dashboard** → Onboarding Content
4. **Keine Berater-Antwort** → Erwartungen setzen
5. **Preis-Schock** → Value Proposition

### 6.2 Engagement Booster
1. **Progress Bar** bei Assessment
2. **Instant Value** nach Registrierung
3. **Weekly Check-ins** vom Berater
4. **Milestone Celebrations**
5. **Success Metrics** im Dashboard

## 7. Metriken pro Journey Stage

### Visitor Stage
- Landing Page Bounce Rate < 40%
- Assessment Start Rate > 20%
- Assessment Completion > 80%

### User Stage
- Activation Rate (First Project) > 60%
- Weekly Active Users > 40%
- Support Ticket Resolution < 48h

### Customer Stage
- Trial to Paid Conversion > 20%
- Monthly Churn < 5%
- Upsell Rate > 15%
- NPS Score > 50

## 8. Internationalisierung (i18n)

### Sprach-Erkennung
```
1. Browser-Sprache
2. IP-Geolocation (Fallback)
3. Manual Switch (Footer)
```

### Content-Anpassung
- Währung (EUR/USD/GBP)
- Datum/Zeit-Format
- Kulturelle Beispiele
- Rechtliche Texte (DSGVO vs GDPR)

## 9. Accessibility Checkpoints

- Keyboard Navigation durch alle Flows
- Screen Reader Labels
- Kontrast-Verhältnisse WCAG AA
- Alternative Texte für Visualisierungen
- Focus-Indikatoren deutlich

## 10. Error States & Recovery

### Assessment Unterbrechung
- Auto-Save nach jeder Frage
- "Später fortsetzen" Option
- Email-Reminder nach 24h

### Payment Failures
- Klare Fehlermeldung
- Alternative Zahlungsmethoden
- Support-Kontakt prominent

### Berater nicht verfügbar
- Erwartete Antwortzeit anzeigen
- Eskalation zu Email
- FAQ/Knowledge Base Vorschläge