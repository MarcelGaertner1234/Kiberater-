'use client'

import { useState, useEffect, useRef, forwardRef } from 'react'
import { cn } from '@/lib/design-system'
import { useNotionStyles } from '@/hooks/useNotionStyles'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}

interface SelectGroup {
  label: string
  options: SelectOption[]
}

interface NotionSelectProps {
  label?: string
  options?: SelectOption[]
  groups?: SelectGroup[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  placeholder?: string
  searchable?: boolean
  multiple?: boolean
  disabled?: boolean
  error?: string
  helperText?: string
  className?: string
  renderOption?: (option: SelectOption) => React.ReactNode
}

export const NotionSelect = forwardRef<HTMLDivElement, NotionSelectProps>(
  ({ 
    label,
    options = [],
    groups = [],
    value,
    onChange,
    placeholder = 'Auswählen...',
    searchable = false,
    multiple = false,
    disabled = false,
    error,
    helperText,
    className,
    renderOption,
    ...props 
  }, ref) => {
    const styles = useNotionStyles()
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Flatten all options from groups and direct options
    const allOptions = [
      ...options,
      ...groups.flatMap(group => group.options)
    ]

    // Filter options based on search
    const filteredOptions = searchQuery.trim()
      ? allOptions.filter(option => 
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allOptions

    const filteredGroups = searchQuery.trim()
      ? groups.map(group => ({
          ...group,
          options: group.options.filter(option =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
          )
        })).filter(group => group.options.length > 0)
      : groups

    // Get selected options
    const selectedOptions = multiple && Array.isArray(value)
      ? allOptions.filter(opt => value.includes(opt.value))
      : value 
        ? allOptions.filter(opt => opt.value === value)
        : []

    const selectedValues = Array.isArray(selectedOptions) 
      ? selectedOptions.map(opt => opt.value)
      : selectedOptions.length > 0 
        ? [selectedOptions[0].value]
        : []

    // Handle option selection
    const handleSelect = (optionValue: string) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : []
        const newValues = currentValues.includes(optionValue)
          ? currentValues.filter(v => v !== optionValue)
          : [...currentValues, optionValue]
        onChange?.(newValues)
      } else {
        onChange?.(optionValue)
        setIsOpen(false)
      }
    }

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setSearchQuery('')
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Focus search input when opening
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }, [isOpen, searchable])

    // Display text
    const displayText = multiple && Array.isArray(selectedOptions) && selectedOptions.length > 0
      ? selectedOptions.length === 1
        ? selectedOptions[0].label
        : `${selectedOptions.length} ausgewählt`
      : !multiple && selectedOptions.length > 0
        ? selectedOptions[0].label
        : placeholder

    return (
      <div className={cn('w-full', className)} ref={ref} {...props}>
        {/* Label */}
        {label && (
          <label className="block text-notion-sm font-medium mb-1.5 text-notion-text dark:text-notion-dark-text">
            {label}
          </label>
        )}

        {/* Select Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              'w-full px-3 py-2.5 text-left text-notion-base rounded-notion transition-all duration-200',
              'border bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-notion-blue/20',
              'flex items-center justify-between',
              error 
                ? 'border-notion-red focus:border-notion-red focus:ring-notion-red/20'
                : 'border-notion-border dark:border-notion-dark-border focus:border-notion-blue',
              disabled && 'opacity-50 cursor-not-allowed bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary',
              'hover:border-notion-blue/60'
            )}
          >
            <span className={cn(
              'truncate',
              selectedValues.length === 0 && 'text-notion-text-tertiary dark:text-notion-dark-text-tertiary'
            )}>
              {displayText}
            </span>
            
            <svg
              className={cn(
                'w-4 h-4 text-notion-text-secondary dark:text-notion-dark-text-secondary transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {isOpen && !disabled && (
            <div className={cn(
              'absolute top-full left-0 right-0 mt-1 z-50',
              'bg-white dark:bg-gray-800 border border-notion-border dark:border-notion-dark-border',
              'rounded-notion shadow-notion-lg dark:shadow-notion-dark-lg',
              'max-h-60 overflow-hidden flex flex-col'
            )}>
              {/* Search input */}
              {searchable && (
                <div className="p-2 border-b border-notion-border dark:border-notion-dark-border">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      'w-full px-3 py-2 text-notion-sm rounded-notion',
                      'border border-notion-border dark:border-notion-dark-border',
                      'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary',
                      'focus:outline-none focus:ring-1 focus:ring-notion-blue focus:border-notion-blue'
                    )}
                  />
                </div>
              )}

              {/* Options list */}
              <div className="overflow-y-auto">
                {/* Direct options */}
                {!groups.length && filteredOptions.length > 0 && (
                  <div className="p-1">
                    {filteredOptions.map((option) => (
                      <OptionItem
                        key={option.value}
                        option={option}
                        selected={selectedValues.includes(option.value)}
                        onSelect={handleSelect}
                        multiple={multiple}
                        renderOption={renderOption}
                      />
                    ))}
                  </div>
                )}

                {/* Grouped options */}
                {filteredGroups.map((group) => (
                  <div key={group.label}>
                    <div className="px-3 py-2 text-notion-xs font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary">
                      {group.label}
                    </div>
                    <div className="p-1">
                      {group.options.map((option) => (
                        <OptionItem
                          key={option.value}
                          option={option}
                          selected={selectedValues.includes(option.value)}
                          onSelect={handleSelect}
                          multiple={multiple}
                          renderOption={renderOption}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {/* No options */}
                {(filteredOptions.length === 0 && filteredGroups.length === 0) && (
                  <div className="p-3 text-center text-notion-text-secondary dark:text-notion-dark-text-secondary text-notion-sm">
                    {searchQuery ? 'Keine Ergebnisse gefunden' : 'Keine Optionen verfügbar'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Helper text / Error */}
        {(helperText || error) && (
          <div className={cn(
            'mt-1.5 text-notion-xs',
            error 
              ? 'text-notion-red' 
              : 'text-notion-text-secondary dark:text-notion-dark-text-secondary'
          )}>
            {error || helperText}
          </div>
        )}
      </div>
    )
  }
)

// Option Item Component
interface OptionItemProps {
  option: SelectOption
  selected: boolean
  onSelect: (value: string) => void
  multiple: boolean
  renderOption?: (option: SelectOption) => React.ReactNode
}

function OptionItem({ option, selected, onSelect, multiple, renderOption }: OptionItemProps) {
  return (
    <button
      type="button"
      onClick={() => !option.disabled && onSelect(option.value)}
      disabled={option.disabled}
      className={cn(
        'w-full px-3 py-2 text-left text-notion-sm rounded transition-colors duration-150',
        'flex items-center justify-between',
        selected 
          ? 'bg-notion-blue text-white'
          : 'text-notion-text dark:text-notion-dark-text hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover',
        option.disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span className="truncate">
        {renderOption ? renderOption(option) : option.label}
      </span>
      
      {multiple && selected && (
        <svg className="w-4 h-4 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  )
}

NotionSelect.displayName = 'NotionSelect'