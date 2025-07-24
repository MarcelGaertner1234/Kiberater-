'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/design-system'

interface NotionCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  children?: React.ReactNode
  indeterminate?: boolean
}

export const NotionCheckbox = forwardRef<HTMLInputElement, NotionCheckboxProps>(
  ({ 
    children,
    indeterminate = false,
    className,
    disabled,
    checked,
    ...props 
  }, ref) => {

    return (
      <label className={cn(
        'inline-flex items-start gap-3 cursor-pointer group',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}>
        <div className="relative flex-shrink-0 mt-0.5">
          {/* Hidden input */}
          <input
            ref={ref}
            type="checkbox"
            className="sr-only"
            disabled={disabled}
            checked={checked}
            {...props}
          />
          
          {/* Custom checkbox */}
          <div className={cn(
            'w-4 h-4 rounded border-2 transition-all duration-200',
            'flex items-center justify-center',
            checked || indeterminate
              ? 'bg-notion-blue border-notion-blue'
              : 'bg-white dark:bg-gray-800 border-notion-border dark:border-notion-dark-border hover:border-notion-blue/60',
            'group-focus-within:ring-2 group-focus-within:ring-notion-blue/20',
            disabled && 'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary border-notion-border dark:border-notion-dark-border'
          )}>
            {/* Checkmark */}
            {checked && !indeterminate && (
              <svg 
                className="w-2.5 h-2.5 text-white animate-in zoom-in-50 duration-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={3}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            )}
            
            {/* Indeterminate state */}
            {indeterminate && (
              <div className="w-2 h-0.5 bg-white rounded-full animate-in zoom-in-50 duration-200" />
            )}
          </div>
        </div>

        {/* Label content */}
        {children && (
          <div className={cn(
            'text-notion-sm text-notion-text dark:text-notion-dark-text',
            'select-none leading-relaxed',
            '[&_a]:text-notion-blue [&_a]:hover:underline [&_a]:font-medium'
          )}>
            {children}
          </div>
        )}
      </label>
    )
  }
)

NotionCheckbox.displayName = 'NotionCheckbox'