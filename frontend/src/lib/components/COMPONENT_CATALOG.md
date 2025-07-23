# 📚 Komponenten-Katalog

Übersicht aller verfügbaren Komponenten in der Notion-Style Bibliothek.

## 🗓️ NotionCalendar

Vollständiger Kalender mit Event-Management.

```tsx
import { NotionCalendar } from '@/lib/components'

<NotionCalendar
  events={[
    {
      id: 1,
      title: 'Meeting',
      start: new Date(2024, 11, 25, 10, 0),
      end: new Date(2024, 11, 25, 11, 0),
      color: '#529cca'
    }
  ]}
  onSelectEvent={(event) => console.log(event)}
  height={600}
/>
```

**Benötigt**: `npm install react-big-calendar moment`

---

## 📅 NotionDatePicker

Date/Time Picker mit Kalender-Dropdown.

```tsx
import { NotionDatePicker } from '@/lib/components'

const [date, setDate] = useState(new Date())

<NotionDatePicker
  selected={date}
  onChange={setDate}
  showTimeSelect
  placeholder="Datum & Zeit wählen"
/>
```

**Benötigt**: `npm install react-datepicker`

---

## 📊 NotionChart

Flexible Charts mit Recharts.

```tsx
import { NotionChart } from '@/lib/components'

// Line Chart
<NotionChart
  type="line"
  data={[
    { month: 'Jan', sales: 400, profit: 240 },
    { month: 'Feb', sales: 300, profit: 180 },
  ]}
  xDataKey="month"
  dataKey={['sales', 'profit']}
  height={300}
  title="Verkaufszahlen"
/>

// Bar Chart
<NotionChart
  type="bar"
  data={data}
  stacked
/>

// Pie Chart
<NotionChart
  type="pie"
  data={[
    { name: 'Desktop', value: 45 },
    { name: 'Mobile', value: 35 },
    { name: 'Tablet', value: 20 },
  ]}
  dataKey="value"
/>
```

**Bereits installiert**: `recharts` ✅

---

## 📋 NotionTable (Coming Soon)

Erweiterte Datentabellen mit Sortierung, Filter und Pagination.

```tsx
import { NotionTable } from '@/lib/components'

<NotionTable
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Rolle', filterable: true }
  ]}
  data={users}
  pagination
  pageSize={10}
/>
```

**Benötigt**: `npm install @tanstack/react-table`

---

## 📝 NotionEditor (Coming Soon)

Rich-Text Editor mit Formatierung.

```tsx
import { NotionEditor } from '@/lib/components'

<NotionEditor
  content={content}
  onChange={setContent}
  placeholder="Beginne zu schreiben..."
  toolbar={['bold', 'italic', 'link', 'bullet-list']}
/>
```

**Benötigt**: `npm install @tiptap/react @tiptap/starter-kit`

---

## 🎯 NotionKanban (Coming Soon)

Drag & Drop Kanban Board.

```tsx
import { NotionKanban } from '@/lib/components'

<NotionKanban
  columns={[
    { id: 'todo', title: 'To Do' },
    { id: 'progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ]}
  cards={tasks}
  onCardMove={(cardId, newColumnId) => {}}
/>
```

**Benötigt**: `npm install react-beautiful-dnd`

---

## 📤 NotionUpload (Coming Soon)

File Upload mit Drag & Drop.

```tsx
import { NotionUpload } from '@/lib/components'

<NotionUpload
  accept="image/*,application/pdf"
  maxSize={5 * 1024 * 1024} // 5MB
  onUpload={(files) => console.log(files)}
  multiple
/>
```

**Benötigt**: `npm install react-dropzone`

---

## 🎥 NotionVideo (Coming Soon)

Video Player mit Controls.

```tsx
import { NotionVideo } from '@/lib/components'

<NotionVideo
  url="https://example.com/video.mp4"
  controls
  width="100%"
  height={400}
/>
```

**Benötigt**: `npm install react-player`

---

## 🎨 Design Tokens

Alle Komponenten verwenden folgende Farben:

| Farbe | Hex | Verwendung |
|-------|-----|------------|
| Blue | #529cca | Primary Actions |
| Green | #6ba085 | Success States |
| Red | #e07c7c | Error/Danger |
| Yellow | #dfab01 | Warnings |
| Purple | #a47bb3 | Special |

## 🔧 Gemeinsame Props

Die meisten Komponenten unterstützen:

- `className`: Zusätzliche CSS-Klassen
- `title`: Komponenten-Titel
- `description`: Beschreibungstext
- Dark Mode: Automatisch über Theme Provider

## 📦 Installation Cheatsheet

```bash
# Alle Komponenten-Pakete auf einmal installieren
npm install react-big-calendar moment react-datepicker @tanstack/react-table @tiptap/react @tiptap/starter-kit react-beautiful-dnd react-dropzone react-player

# Dev Dependencies
npm install --save-dev @types/react-big-calendar @types/react-datepicker @types/react-beautiful-dnd
```