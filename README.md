# KI-Unternehmensberatungs-Plattform

Eine umfassende Plattform für KI-Beratung und -Integration in Unternehmen.

## Übersicht

Diese Plattform hilft Unternehmern dabei, KI optimal in ihre Geschäftsprozesse zu integrieren. Mit personalisierten Assessments, maßgeschneiderten Roadmaps und professioneller Beratung begleiten wir Unternehmen auf ihrer KI-Reise.

## Hauptfunktionen

- **KI-Assessment Tool**: Analyse der KI-Bereitschaft mit branchenspezifischen Fragen
- **Personalisierte Roadmaps**: Individuelle KI-Implementierungspläne
- **Projekt Management**: Übersichtliche Verwaltung von KI-Projekten
- **Lernbereich**: Angepasste Lernpfade für verschiedene Wissensstände
- **Berater-Kommunikation**: Direkter Draht zu KI-Experten
- **Gamification**: Motivierendes Punktesystem und Achievements

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Authentication**: NextAuth.js (Google, GitHub, Apple, Email)
- **Payments**: Stripe
- **Hosting**: Vercel + AWS

## Projektstruktur

```
ki-beratung-platform/
├── docs/           # Dokumentation
├── frontend/       # Next.js Frontend
├── backend/        # Node.js Backend
├── database/       # Datenbank-Schemas
├── infrastructure/ # DevOps & Deployment
├── tests/          # Tests
├── content/        # Platform Content
├── design/         # Design Assets
└── scripts/        # Entwicklungs-Scripts
```

## Setup

### Voraussetzungen

- Node.js 18+
- PostgreSQL 14+
- npm oder yarn

### Installation

```bash
# Repository klonen
git clone https://github.com/your-org/ki-beratung-platform.git
cd ki-beratung-platform

# Dependencies installieren
npm install

# Umgebungsvariablen einrichten
cp .env.example .env
# .env mit eigenen Werten ausfüllen

# Datenbank migrieren
npm run db:migrate

# Entwicklungsserver starten
npm run dev
```

## Entwicklung

```bash
# Frontend und Backend gleichzeitig starten
npm run dev

# Nur Frontend
npm run dev:frontend

# Nur Backend
npm run dev:backend

# Tests ausführen
npm run test

# Code formatieren
npm run format

# Linting
npm run lint
```

## Deployment

Siehe [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) für detaillierte Deployment-Anweisungen.

## Beitragen

Wir freuen uns über Beiträge! Bitte lesen Sie [CONTRIBUTING.md](CONTRIBUTING.md) für Details.

## Lizenz

[MIT License](LICENSE)

## Support

Bei Fragen oder Problemen:
- Email: support@ki-beratung.de
- Dokumentation: [docs/](docs/)
- Issues: GitHub Issues