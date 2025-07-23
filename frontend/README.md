# KI-Beratung Platform Frontend

Notion-inspirierte KI-Beratungsplattform mit moderndem UI/UX Design.

## 🎨 Design System

Das Frontend basiert auf einem konsistenten Notion-inspirierten Design System
mit:

- **Entsättigte Farben** für subtile, professionelle Optik
- **Micro-Animationen** für natürliche Interaktionen
- **Konsistente Spacing** und Typography
- **Dark/Light Mode** Support (vorbereitet)
- **Mobile-First** responsive Design

### Design Tokens

```typescript
// Farben
notion-blue: #529cca
notion-purple: #a47bb3
notion-green: #6ba085
notion-red: #e07c7c
notion-yellow: #dfab01

// Spacing
spacing-xs: 0.5rem
spacing-sm: 1rem
spacing-md: 1.5rem
spacing-lg: 2rem
```

## 🏗️ Architektur

### Route Structure

```
app/
├── (landing)/              # Public marketing pages
│   ├── layout.tsx          # Landing layout with header/footer
│   └── page.tsx            # Hero, features, pricing, testimonials
├── (auth)/                 # Authenticated user area
│   ├── layout.tsx          # Auth layout with sidebar
│   ├── dashboard/          # Main dashboard
│   ├── assessment/         # Multi-step KI assessment
│   ├── projects/           # Kanban project management
│   ├── roadmap/            # Strategic roadmap view
│   ├── learning/           # Learning resources
│   ├── chat/               # Consultant chat
│   └── settings/           # User settings
└── page.tsx                # Root redirect
```

### Component Hierarchy

```
components/
├── ui/                     # Base UI components
│   ├── NotionButton.tsx    # Notion-style buttons
│   ├── NotionCard.tsx      # Card component
│   ├── NotionSidebar.tsx   # Navigation sidebar
│   └── index.ts            # Component exports
├── landing/                # Landing page sections
├── dashboard/              # Dashboard widgets
└── shared/                 # Shared components
```

## ✨ Features Implemented

### 🏠 Landing Page

- [x] **Hero Section** mit gradient text und CTAs
- [x] **Features Grid** mit hover-Effekten
- [x] **How It Works** 4-step process
- [x] **Pricing Table** mit 3 Tiers (49€/199€/499€)
- [x] **Testimonials** mit Star-Ratings
- [x] **Final CTA** mit Urgency
- [x] **Responsive Navigation** mit mobile menu
- [x] **Footer** mit Links und Legal

### 📊 Dashboard

- [x] **Welcome Widget** mit personalized greeting
- [x] **Stats Cards** mit Metriken und Trends
- [x] **Recent Projects** mit Progress-Bars
- [x] **Quick Actions** für häufige Aufgaben
- [x] **Upcoming Tasks** mit Icons und Zeiten
- [x] **Progress Chart** für KI-Implementation
- [x] **Responsive Layout** mit Grid-System

### 🎯 Assessment Flow

- [x] **Multi-Step Form** mit Progress-Indikator
- [x] **Step 1: Company Profile** (Branche, Größe, Umsatz)
- [x] **Dynamic Progress Bar** mit Animations
- [x] **Form Validation** mit Error-States
- [x] **Local Storage** für Session-Persistenz
- [x] **Info-Tooltips** für Erklärungen
- [x] **Mobile-Optimiert** für alle Devices

### 📁 Projects/Kanban

- [x] **Drag & Drop Kanban** mit react-beautiful-dnd
- [x] **4 Spalten**: Todo, In Progress, Review, Done
- [x] **Task Cards** mit Priority, Assignees, Due Dates
- [x] **List View Toggle** für alternative Ansicht
- [x] **Search Filter** für Tasks
- [x] **Animations** beim Drag & Drop
- [x] **Team Avatars** mit Gradient-Backgrounds

### 🎨 UI Components

- [x] **NotionButton** mit Variants und Sizes
- [x] **NotionCard** mit Hover-Effekten
- [x] **NotionSidebar** mit Collapse-Funktion
- [x] **Loading States** mit Skeletons
- [x] **Badge System** für Status-Anzeigen
- [x] **Icon Integration** mit Lucide React

## 🛠️ Tech Stack

- **Framework**: Next.js 14 mit App Router
- **Styling**: Tailwind CSS mit Custom Design Tokens
- **Components**: Custom Notion-Style Components
- **Drag & Drop**: react-beautiful-dnd
- **Icons**: Lucide React
- **Animations**: CSS Transitions + Transforms
- **State Management**: React Hook (Zustand vorbereitet)
- **Forms**: React Hook Form (Assessment)

## 🚀 Getting Started

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Tablet */
md: 768px   /* Small Desktop */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
```

## 🎯 Design Principles

### 1. **Subtle is Better**

- Entsättigte Farben statt knallbunt
- Micro-Animationen statt heavy Effects
- Soft Shadows statt hard Borders

### 2. **Consistency First**

- Einheitliche Spacing-Skala
- Konsistente Color-Palette
- Wiederverwendbare Patterns

### 3. **Mobile-First**

- Touch-Optimized Interactions
- Readable Typography auf kleinen Screens
- Progressive Enhancement

### 4. **Performance**

- Lazy Loading für Images
- Code Splitting für Routes
- Optimized Bundle Size

## 🧪 Testing Strategy

```bash
# Run tests
npm test

# E2E tests (geplant)
npm run test:e2e

# Visual regression (geplant)
npm run test:visual
```

## 🔄 Mock Data

Alle Komponenten verwenden Mock-Daten aus `lib/mock-data.ts`:

- Dashboard Stats und Projekte
- Assessment Antworten und Ergebnisse
- Kanban Tasks und Assignees
- User Profile und Notifications
- Chat Messages und Team Members

## 🌐 Internationalization

Vorbereitet für i18n mit next-i18next:

```typescript
// Beispiel Usage
const { t } = useTranslation('common')

// Verwende
<h1>{t('dashboard.title')}</h1>

// Statt
<h1>Dashboard</h1>
```

## 🎨 Customization

### Colors

```typescript
// tailwind.config.js
colors: {
  'notion-blue': '#529cca',
  'notion-purple': '#a47bb3',
  // ... weitere Custom Colors
}
```

### Components

```typescript
// Eigene Notion-Komponente erstellen
import { useNotionStyles } from '@/hooks/useNotionStyles'

const MyComponent = () => {
  const styles = useNotionStyles()

  return (
    <div className={styles.card({ clickable: true })}>
      <h3 className={styles.text('h3')}>Titel</h3>
    </div>
  )
}
```

## 🚧 Roadmap

### Phase 2

- [ ] Dark Mode Implementation
- [ ] Advanced Animations (Framer Motion)
- [ ] Real-time Updates (Socket.io)
- [ ] Offline Support (PWA)

### Phase 3

- [ ] Advanced Charts (Recharts)
- [ ] Video Call Integration
- [ ] File Upload Components
- [ ] Advanced Search

## 📚 Style Guide

### Button Usage

```typescript
// Primary für Main Actions
<NotionButton variant="primary">Speichern</NotionButton>

// Secondary für Alternative Actions
<NotionButton variant="secondary">Abbrechen</NotionButton>

// Ghost für Subtle Actions
<NotionButton variant="ghost">Mehr anzeigen</NotionButton>
```

### Card Usage

```typescript
// Basic Card
<NotionCard>Content</NotionCard>

// Clickable Card mit Hover
<NotionCard clickable>Content</NotionCard>

// Card mit Gradient Background
<NotionCard gradient>Content</NotionCard>
```

### Layout Patterns

```typescript
// Dashboard Grid
<div className="grid lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">Main Content</div>
  <div>Sidebar</div>
</div>

// Stats Cards
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map(stat => <StatCard key={stat.id} {...stat} />)}
</div>
```

## 🎯 Performance

Aktuelle Metriken:

- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3s

## 💎 Best Practices

1. **Komponenten-Komposition** statt Inheritance
2. **Props Interface** für Type Safety
3. **Custom Hooks** für Logic Reuse
4. **Memoization** für Performance
5. **Error Boundaries** für Stability

---

**Status**: ✅ Core Features implementiert  
**Version**: 1.0.0  
**Last Updated**: 2024-02-12  
**Maintainer**: Frontend UI/UX Team
