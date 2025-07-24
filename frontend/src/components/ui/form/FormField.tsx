'use client'

import { cn } from '@/lib/design-system'

interface FormFieldProps {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
}

export function FormField({
  label,
  error,
  helperText,
  required = false,
  children,
  className,
  disabled = false,
  labelProps,
}: FormFieldProps) {
  const fieldId = labelProps?.htmlFor || Math.random().toString(36).substr(2, 9)

  return (
    <div className={cn('w-full', disabled && 'opacity-50', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={fieldId}
          className={cn(
            'block text-notion-sm font-medium mb-1.5',
            'text-notion-text dark:text-notion-dark-text',
            disabled && 'cursor-not-allowed'
          )}
          {...labelProps}
        >
          {label}
          {required && (
            <span className="text-notion-red ml-1" aria-label="Pflichtfeld">
              *
            </span>
          )}
        </label>
      )}

      {/* Form Element */}
      <div className="relative">
        {children}
      </div>

      {/* Helper Text / Error */}
      {(helperText || error) && (
        <div
          className={cn(
            'mt-1.5 text-notion-xs',
            error 
              ? 'text-notion-red' 
              : 'text-notion-text-secondary dark:text-notion-dark-text-secondary'
          )}
          role={error ? 'alert' : 'note'}
          aria-live={error ? 'polite' : undefined}
        >
          {error || helperText}
        </div>
      )}
    </div>
  )
}

// Utility component for form sections
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-notion-lg font-semibold text-notion-text dark:text-notion-dark-text">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-notion-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

// Utility component for form rows (side-by-side fields)
export function FormRow({
  children,
  columns = 2,
  className,
}: {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn(
      'grid gap-4',
      gridCols[columns],
      className
    )}>
      {children}
    </div>
  )
}