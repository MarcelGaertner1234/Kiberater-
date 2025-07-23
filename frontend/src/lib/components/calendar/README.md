# NotionCalendar Component

Ein vollständiger Kalender im Notion-Stil basierend auf `react-big-calendar`.

## Installation

```bash
npm install react-big-calendar moment
npm install --save-dev @types/react-big-calendar
```

## Verwendung

```tsx
import { NotionCalendar } from '@/lib/components'

const events = [
  {
    id: 1,
    title: 'Team Meeting',
    start: new Date(2024, 11, 25, 10, 0),
    end: new Date(2024, 11, 25, 11, 0),
    color: '#529cca' // optional
  },
  {
    id: 2,
    title: 'Projekt Deadline',
    start: new Date(2024, 11, 26),
    end: new Date(2024, 11, 26),
    allDay: true,
    color: '#e07c7c'
  }
]

function MyCalendar() {
  const handleSelectEvent = (event) => {
    console.log('Event selected:', event)
  }

  const handleSelectSlot = (slotInfo) => {
    console.log('Slot selected:', slotInfo)
    // Neues Event erstellen
  }

  return (
    <NotionCalendar
      events={events}
      onSelectEvent={handleSelectEvent}
      onSelectSlot={handleSelectSlot}
      height={600}
      defaultView="month"
      views={['month', 'week', 'day', 'agenda']}
    />
  )
}
```

## Props

| Prop | Type | Default | Beschreibung |
|------|------|---------|--------------|
| events | NotionCalendarEvent[] | required | Array von Event-Objekten |
| onSelectEvent | (event) => void | - | Callback wenn ein Event angeklickt wird |
| onSelectSlot | (slotInfo) => void | - | Callback wenn ein Zeitslot ausgewählt wird |
| defaultView | 'month' \| 'week' \| 'day' \| 'agenda' | 'month' | Standard-Ansicht |
| views | Array | ['month', 'week', 'day'] | Verfügbare Ansichten |
| height | number \| string | 600 | Höhe des Kalenders |
| selectable | boolean | true | Slots können ausgewählt werden |
| popup | boolean | true | Events in Popup anzeigen |
| className | string | - | Zusätzliche CSS-Klassen |

## Event Object

```typescript
interface NotionCalendarEvent {
  id: string | number
  title: string
  start: Date
  end: Date
  allDay?: boolean
  resource?: any
  color?: string // Notion color: blue, green, red, yellow, purple
}
```

## Styling

Der Kalender verwendet automatisch das Notion Design System. Zusätzliche Anpassungen können über CSS vorgenommen werden:

```css
/* Custom Event Colors */
.my-custom-calendar .rbc-event {
  background-color: var(--my-color);
}

/* Custom Today Highlight */
.my-custom-calendar .rbc-today {
  background-color: rgba(82, 156, 202, 0.1);
}
```

## Features

- ✅ Monat-, Wochen-, Tages- und Agenda-Ansicht
- ✅ Drag & Drop für Events (wenn react-big-calendar mit DnD addon)
- ✅ Notion-Style Design
- ✅ Dark Mode Support
- ✅ Responsive
- ✅ Keyboard Navigation
- ✅ Custom Event Colors
- ✅ TypeScript Support

## Lokalisierung

Für deutsche Lokalisierung:

```tsx
import moment from 'moment'
import 'moment/locale/de'

moment.locale('de')

// Kalender wird automatisch auf Deutsch sein
```