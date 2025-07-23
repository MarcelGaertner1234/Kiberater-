'use client'

import { useCallback, useMemo } from 'react'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { cn } from '@/lib/design-system'

// Wir verwenden erstmal ein Placeholder, bis react-big-calendar installiert ist
// import { Calendar, momentLocalizer } from 'react-big-calendar'
// import moment from 'moment'
// import 'react-big-calendar/lib/css/react-big-calendar.css'

export interface NotionCalendarEvent {
  id: string | number
  title: string
  start: Date
  end: Date
  allDay?: boolean
  resource?: any
  color?: string
}

export interface NotionCalendarProps {
  events: NotionCalendarEvent[]
  onSelectEvent?: (event: NotionCalendarEvent) => void
  onSelectSlot?: (slotInfo: any) => void
  defaultView?: 'month' | 'week' | 'day' | 'agenda'
  views?: ('month' | 'week' | 'day' | 'agenda')[]
  className?: string
  height?: number | string
  selectable?: boolean
  popup?: boolean
}

export function NotionCalendar({
  events,
  onSelectEvent,
  onSelectSlot,
  defaultView = 'month',
  views = ['month', 'week', 'day'],
  className,
  height = 600,
  selectable = true,
  popup = true,
}: NotionCalendarProps) {
  const styles = useNotionStyles()

  // Event style getter für Notion-Style
  const eventStyleGetter = useCallback((event: NotionCalendarEvent) => {
    const backgroundColor = event.color || '#529cca'
    return {
      style: {
        backgroundColor,
        borderRadius: '3px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '13px',
        padding: '2px 5px',
      }
    }
  }, [])

  // Custom toolbar component
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => toolbar.onNavigate('PREV')
    const goToNext = () => toolbar.onNavigate('NEXT')
    const goToToday = () => toolbar.onNavigate('TODAY')

    return (
      <div className="flex items-center justify-between mb-4 p-4 border-b border-notion-border dark:border-notion-dark-border">
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className={cn(styles.button({ variant: 'secondary', size: 'sm' }))}
          >
            Heute
          </button>
          <button
            onClick={goToBack}
            className={cn(styles.button({ variant: 'ghost', size: 'sm' }))}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className={cn(styles.button({ variant: 'ghost', size: 'sm' }))}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <h2 className={styles.text.h3}>{toolbar.label}</h2>
        
        <div className="flex items-center gap-1">
          {views.map(view => (
            <button
              key={view}
              onClick={() => toolbar.onView(view)}
              className={cn(
                styles.button({ variant: toolbar.view === view ? 'primary' : 'ghost', size: 'sm' })
              )}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Placeholder für den Kalender bis react-big-calendar installiert ist
  return (
    <div className={cn(styles.card.base, 'p-0 overflow-hidden', className)}>
      <div style={{ height }} className="relative">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 p-4 border-b border-notion-border dark:border-notion-dark-border">
          <div className="flex items-center gap-2">
            <button className={cn(styles.button({ variant: 'secondary', size: 'sm' }))}>
              Heute
            </button>
            <button className={cn(styles.button({ variant: 'ghost', size: 'sm' }))}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className={cn(styles.button({ variant: 'ghost', size: 'sm' }))}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <h2 className={styles.text.h3}>November 2024</h2>
          
          <div className="flex items-center gap-1">
            <button className={cn(styles.button({ variant: 'primary', size: 'sm' }))}>
              Monat
            </button>
            <button className={cn(styles.button({ variant: 'ghost', size: 'sm' }))}>
              Woche
            </button>
            <button className={cn(styles.button({ variant: 'ghost', size: 'sm' }))}>
              Tag
            </button>
          </div>
        </div>

        {/* Placeholder Grid */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-px bg-notion-border dark:bg-notion-dark-border">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
              <div key={day} className="bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary p-2 text-center text-sm font-medium">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-notion-dark-bg h-24 p-2 hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-colors"
              >
                <span className="text-sm text-notion-text-secondary">{(i % 31) + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-notion-yellow-light dark:bg-notion-dark-bg-secondary rounded-notion">
          <p className="text-sm text-notion-yellow-dark dark:text-notion-dark-yellow">
            ℹ️ react-big-calendar muss noch installiert werden:
            <code className="ml-2 px-2 py-1 bg-notion-bg-hover dark:bg-notion-dark-bg-hover rounded text-xs">
              npm install react-big-calendar moment
            </code>
          </p>
        </div>
      </div>
    </div>
  )
}

/* 
// Implementierung nach Installation von react-big-calendar:

const localizer = momentLocalizer(moment)

export function NotionCalendar({ ...props }) {
  return (
    <div className={cn(styles.card.base, 'p-0 overflow-hidden notion-calendar', className)}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height }}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable={selectable}
        popup={popup}
        views={views}
        defaultView={defaultView}
        eventPropGetter={eventStyleGetter}
        components={{
          toolbar: CustomToolbar,
        }}
      />
    </div>
  )
}
*/