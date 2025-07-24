/**
 * Zentrale Komponenten-Bibliothek
 * 
 * Diese Bibliothek wrapped externe Pakete mit unserem Notion Design System
 * und bietet eine konsistente API für alle UI-Komponenten.
 */

// Calendar Components
export { NotionCalendar } from './calendar/NotionCalendar'
export type { NotionCalendarProps } from './calendar/NotionCalendar'

// Date Picker Components
export { NotionDatePicker } from './date-picker/NotionDatePicker'
export type { NotionDatePickerProps } from './date-picker/NotionDatePicker'

// Chart Components
export { NotionChart } from './charts/NotionChart'
export type { NotionChartProps } from './charts/NotionChart'

// Note: The following components are planned but not yet implemented:
// - NotionEditor (editor/NotionEditor) - Rich text editor with TipTap
// - NotionKanban (kanban/NotionKanban) - Drag & drop kanban board
// - NotionTable (data-table/NotionTable) - Advanced data tables
// - NotionUpload (file-upload/NotionUpload) - File upload with drag & drop
// - NotionVideo (video-player/NotionVideo) - Video player component