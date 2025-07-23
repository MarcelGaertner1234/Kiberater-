# 🧩 Notion-Style Komponenten-Bibliothek

Diese Bibliothek enthält wiederverwendbare UI-Komponenten, die externe Pakete mit unserem Notion Design System wrappen.

## 📋 Übersicht

### Verfügbare Komponenten

| Komponente | Basis-Paket | Status | Beschreibung |
|------------|-------------|--------|--------------|
| NotionCalendar | react-big-calendar | 🟡 In Arbeit | Vollständiger Kalender mit Events |
| NotionDatePicker | react-datepicker | 🔴 Geplant | Date/Time Picker |
| NotionEditor | @tiptap/react | 🔴 Geplant | Rich-Text Editor |
| NotionChart | recharts | ✅ Installiert | Charts & Visualisierungen |
| NotionKanban | react-beautiful-dnd | 🔴 Geplant | Drag & Drop Kanban Board |
| NotionTable | @tanstack/react-table | 🔴 Geplant | Erweiterte Datentabellen |
| NotionUpload | react-dropzone | 🔴 Geplant | File Upload mit Drag & Drop |
| NotionVideo | react-player | 🔴 Geplant | Video Player |

## 🚀 Installation

### Benötigte Pakete installieren:

```bash
# Kalender
npm install react-big-calendar moment
npm install --save-dev @types/react-big-calendar

# Date Picker
npm install react-datepicker
npm install --save-dev @types/react-datepicker

# Editor
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit

# Kanban
npm install react-beautiful-dnd
npm install --save-dev @types/react-beautiful-dnd

# File Upload
npm install react-dropzone

# Video Player
npm install react-player
```

## 💻 Verwendung

### NotionCalendar

```tsx
import { NotionCalendar } from '@/lib/components'

function MyCalendar() {
  const events = [
    {
      title: 'Meeting',
      start: new Date(),
      end: new Date(),
    }
  ]

  return (
    <NotionCalendar
      events={events}
      onSelectEvent={(event) => console.log(event)}
    />
  )
}
```

### NotionDatePicker

```tsx
import { NotionDatePicker } from '@/lib/components'

function MyForm() {
  const [date, setDate] = useState(new Date())

  return (
    <NotionDatePicker
      selected={date}
      onChange={setDate}
      placeholder="Datum auswählen"
    />
  )
}
```

### NotionChart

```tsx
import { NotionChart } from '@/lib/components'

function MyChart() {
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
  ]

  return (
    <NotionChart
      type="line"
      data={data}
      height={300}
    />
  )
}
```

## 🎨 Design Prinzipien

1. **Konsistenz**: Alle Komponenten folgen dem Notion Design System
2. **Anpassbarkeit**: Komponenten akzeptieren className und style Props
3. **Type-Safety**: Vollständige TypeScript Unterstützung
4. **Performance**: Lazy Loading wo möglich
5. **Accessibility**: ARIA Labels und Keyboard Navigation

## 🛠️ Entwicklung

### Neue Komponente hinzufügen:

1. Ordner in `/src/lib/components/[name]` erstellen
2. Komponente implementieren mit Notion Styles
3. CSS Overrides in `styles.css` definieren
4. Export in `index.ts` hinzufügen
5. Dokumentation aktualisieren

### Style Override Pattern:

```css
/* calendar/styles.css */
.notion-calendar {
  @apply font-notion;
}

.notion-calendar .rbc-event {
  @apply bg-notion-blue text-white rounded-notion;
  @apply hover:bg-notion-blue-dark transition-colors;
}
```

### Wrapper Pattern:

```tsx
export function NotionComponent({ className, ...props }) {
  const styles = useNotionStyles()
  
  return (
    <div className={cn(styles.card.base, className)}>
      <ExternalComponent
        {...props}
        className="notion-override"
      />
    </div>
  )
}
```