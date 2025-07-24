'use client'

import { TextareaHTMLAttributes, forwardRef, useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/design-system'

interface NotionTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  autoResize?: boolean
  maxLength?: number
  showCharCount?: boolean
  markdownPreview?: boolean
  resizable?: boolean
}

export const NotionTextarea = forwardRef<HTMLTextAreaElement, NotionTextareaProps>(
  ({ 
    label,
    error,
    helperText,
    autoResize = false,
    maxLength,
    showCharCount = false,
    markdownPreview = false,
    resizable = true,
    className,
    value,
    onChange,
    onInput,
    rows = 4,
    ...props 
  }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    const [charCount, setCharCount] = useState(0)

    // Handle ref forwarding
    const setRefs = (element: HTMLTextAreaElement | null) => {
      textareaRef.current = element
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }

    // Auto resize functionality
    const adjustHeight = () => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
      }
    }

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      
      // Update character count
      setCharCount(newValue.length)
      
      // Trigger auto resize
      if (autoResize) {
        adjustHeight()
      }
      
      // Call parent onChange
      onChange?.(e)
    }

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        adjustHeight()
      }
      onInput?.(e)
    }

    // Initialize character count
    useEffect(() => {
      const currentValue = value || textareaRef.current?.value || ''
      setCharCount(String(currentValue).length)
    }, [value])

    // Adjust height on mount and value change
    useEffect(() => {
      if (autoResize) {
        adjustHeight()
      }
    }, [autoResize, value])

    const textValue = String(value || '')
    const isOverLimit = maxLength ? charCount > maxLength : false

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-notion-sm font-medium text-notion-text dark:text-notion-dark-text">
              {label}
            </label>
            
            {/* Markdown preview toggle */}
            {markdownPreview && (
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={cn(
                  'text-notion-xs font-medium px-2 py-1 rounded transition-colors duration-200',
                  showPreview
                    ? 'text-notion-blue bg-notion-blue/10'
                    : 'text-notion-text-secondary dark:text-notion-dark-text-secondary hover:text-notion-blue'
                )}
              >
                {showPreview ? 'Bearbeiten' : 'Vorschau'}
              </button>
            )}
          </div>
        )}

        {/* Textarea or Preview */}
        <div className="relative">
          {showPreview && markdownPreview ? (
            <div className={cn(
              'w-full px-3 py-2.5 min-h-[100px] rounded-notion',
              'border border-notion-border dark:border-notion-dark-border',
              'bg-white dark:bg-gray-800',
              'prose prose-notion dark:prose-invert max-w-none',
              'text-notion-base text-notion-text dark:text-notion-dark-text',
              className
            )}>
              {/* Simple markdown preview - you can enhance this with a proper markdown parser */}
              <div
                dangerouslySetInnerHTML={{
                  __html: textValue
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n/g, '<br />')
                }}
              />
              {!textValue && (
                <span className="text-notion-text-tertiary dark:text-notion-dark-text-tertiary">
                  Noch kein Inhalt...
                </span>
              )}
            </div>
          ) : (
            <textarea
              ref={setRefs}
              className={cn(
                'w-full px-3 py-2.5 text-notion-base rounded-notion transition-all duration-200',
                'border focus:outline-none focus:ring-2 focus:ring-notion-blue/20 focus:border-notion-blue',
                'placeholder:text-notion-text-tertiary dark:placeholder:text-notion-dark-text-tertiary',
                'text-notion-text dark:text-notion-dark-text',
                'bg-white dark:bg-gray-800 border-notion-border dark:border-notion-dark-border',
                
                // Error state
                error && 'border-notion-red focus:border-notion-red focus:ring-notion-red/20',
                
                // Character limit exceeded
                isOverLimit && 'border-notion-red focus:border-notion-red focus:ring-notion-red/20',
                
                // Disabled state
                props.disabled && 'opacity-50 cursor-not-allowed bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary',
                
                // Resize behavior
                resizable ? 'resize-y' : 'resize-none',
                
                className
              )}
              rows={rows}
              value={value}
              onChange={handleChange}
              onInput={handleInput}
              maxLength={maxLength}
              {...props}
            />
          )}
        </div>

        {/* Footer with character count and helper text */}
        <div className="mt-1.5 flex items-center justify-between">
          <div className={cn(
            'text-notion-xs',
            error 
              ? 'text-notion-red' 
              : 'text-notion-text-secondary dark:text-notion-dark-text-secondary'
          )}>
            {error || helperText}
          </div>
          
          {(showCharCount || maxLength) && (
            <div className={cn(
              'text-notion-xs font-medium',
              isOverLimit 
                ? 'text-notion-red'
                : maxLength && charCount > maxLength * 0.8
                  ? 'text-notion-yellow'
                  : 'text-notion-text-secondary dark:text-notion-dark-text-secondary'
            )}>
              {charCount}{maxLength && ` / ${maxLength}`}
            </div>
          )}
        </div>
      </div>
    )
  }
)

NotionTextarea.displayName = 'NotionTextarea'