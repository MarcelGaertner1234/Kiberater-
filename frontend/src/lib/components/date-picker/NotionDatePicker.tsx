'use client'

import { forwardRef, useState } from 'react'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { cn } from '@/lib/design-system'

// Placeholder bis react-datepicker installiert ist
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'

export interface NotionDatePickerProps {
  selected?: Date | null
  onChange: (date: Date | null) => void
  onBlur?: () => void
  placeholder?: string
  dateFormat?: string
  timeFormat?: string
  showTimeSelect?: boolean
  showTimeSelectOnly?: boolean
  timeIntervals?: number
  minDate?: Date
  maxDate?: Date
  filterDate?: (date: Date) => boolean
  inline?: boolean
  isClearable?: boolean
  disabled?: boolean
  required?: boolean
  error?: boolean
  className?: string
  calendarClassName?: string
  locale?: string
}

export const NotionDatePicker = forwardRef<any, NotionDatePickerProps>(({
  selected,
  onChange,
  onBlur,
  placeholder = 'Datum auswählen',
  dateFormat = 'dd.MM.yyyy',
  timeFormat = 'HH:mm',
  showTimeSelect = false,
  showTimeSelectOnly = false,
  timeIntervals = 15,
  minDate,
  maxDate,
  filterDate,
  inline = false,
  isClearable = true,
  disabled = false,
  required = false,
  error = false,
  className,
  calendarClassName,
  locale = 'de',
}, ref) => {
  const styles = useNotionStyles()
  const [isOpen, setIsOpen] = useState(false)

  // Custom Input Component
  const CustomInput = forwardRef<HTMLInputElement, any>(({ value, onClick, onChange, placeholder }, inputRef) => (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onClick={onClick}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          styles.input({ error, disabled }),
          'pr-10',
          className
        )}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-notion-text-secondary dark:text-notion-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  ))

  CustomInput.displayName = 'CustomInput'

  // Placeholder Implementation
  return (
    <div className={cn('notion-datepicker', inline && 'inline-block')}>
      {!inline ? (
        <div className="relative">
          <input
            type="date"
            value={selected ? selected.toISOString().split('T')[0] : ''}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={cn(
              styles.input({ error, disabled }),
              className
            )}
          />
          {showTimeSelect && !showTimeSelectOnly && (
            <input
              type="time"
              value={selected ? selected.toTimeString().slice(0, 5) : ''}
              onChange={(e) => {
                if (selected && e.target.value) {
                  const [hours, minutes] = e.target.value.split(':')
                  const newDate = new Date(selected)
                  newDate.setHours(parseInt(hours), parseInt(minutes))
                  onChange(newDate)
                }
              }}
              disabled={disabled}
              className={cn(
                styles.input({ error, disabled }),
                'mt-2',
                className
              )}
            />
          )}
        </div>
      ) : (
        <div className={cn(styles.card.base, 'inline-block p-4', calendarClassName)}>
          <div className="text-center mb-4">
            <h3 className={styles.text.h4}>Kalender Placeholder</h3>
            <p className={styles.text.small}>react-datepicker muss installiert werden</p>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
              <div key={day} className="text-xs font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary p-1">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <button
                key={i}
                className={cn(
                  'p-1 text-sm rounded hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover',
                  i === 15 && 'bg-notion-blue text-white hover:bg-notion-blue-dark'
                )}
                onClick={() => {
                  const date = new Date()
                  date.setDate(i + 1)
                  onChange(date)
                }}
              >
                {(i % 31) + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Info Box */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 p-2 bg-notion-yellow-light dark:bg-notion-dark-bg-secondary rounded text-xs">
          <p className="text-notion-yellow-dark dark:text-notion-dark-yellow">
            ℹ️ Installiere: <code className="px-1 bg-notion-bg-hover dark:bg-notion-dark-bg-hover rounded">npm install react-datepicker</code>
          </p>
        </div>
      )}
    </div>
  )
})

NotionDatePicker.displayName = 'NotionDatePicker'

/* 
// Implementierung nach Installation von react-datepicker:

import DatePicker, { registerLocale } from 'react-datepicker'
import de from 'date-fns/locale/de'
import 'react-datepicker/dist/react-datepicker.css'
import './styles.css'

registerLocale('de', de)

export const NotionDatePicker = forwardRef<any, NotionDatePickerProps>(({ ...props }, ref) => {
  const styles = useNotionStyles()
  
  return (
    <DatePicker
      ref={ref}
      {...props}
      locale={props.locale}
      dateFormat={showTimeSelect && !showTimeSelectOnly ? `${dateFormat} ${timeFormat}` : dateFormat}
      customInput={!inline ? <CustomInput /> : undefined}
      className={cn('notion-datepicker-input', className)}
      calendarClassName={cn('notion-datepicker-calendar', calendarClassName)}
      wrapperClassName="notion-datepicker-wrapper"
      popperClassName="notion-datepicker-popper"
      showPopperArrow={false}
    />
  )
})
*/