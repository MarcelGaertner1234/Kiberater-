'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/design-system'
import { useNotionStyles } from '@/hooks/useNotionStyles'

interface NotionInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  rightElement?: React.ReactNode
  variant?: 'default' | 'filled' | 'ghost'
}

export const NotionInput = forwardRef<HTMLInputElement, NotionInputProps>(
  ({ 
    label,
    error,
    helperText,
    icon,
    rightElement,
    variant = 'default',
    className,
    placeholder,
    value,
    defaultValue,
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    const styles = useNotionStyles()
    const [focused, setFocused] = useState(false)
    const hasValue = value !== undefined ? String(value).length > 0 : false

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      onBlur?.(e)
    }

    const variantStyles = {
      default: 'bg-white dark:bg-gray-800 border-notion-border dark:border-notion-dark-border',
      filled: 'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary border-transparent',
      ghost: 'bg-transparent border-transparent hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover'
    }

    const shouldFloat = focused || hasValue || defaultValue

    return (
      <div className="w-full">
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-notion-text-secondary dark:text-notion-dark-text-secondary">
              <span className="w-4 h-4 flex items-center justify-center">
                {icon}
              </span>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            className={cn(
              // Base styles
              'w-full px-3 py-2.5 text-notion-base rounded-notion transition-all duration-200',
              'border focus:outline-none focus:ring-2 focus:ring-notion-blue/20 focus:border-notion-blue',
              'placeholder:text-notion-text-tertiary dark:placeholder:text-notion-dark-text-tertiary',
              'text-notion-text dark:text-notion-dark-text',
              
              // Variant styles
              variantStyles[variant],
              
              // Icon padding
              icon && 'pl-10',
              rightElement && 'pr-10',
              
              // Label padding (when floating)
              label && 'pt-6 pb-2',
              
              // Error state
              error && 'border-notion-red focus:border-notion-red focus:ring-notion-red/20',
              
              // Disabled state
              props.disabled && 'opacity-50 cursor-not-allowed bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary',
              
              className
            )}
            placeholder={label ? '' : placeholder}
            value={value}
            defaultValue={defaultValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <label
              className={cn(
                'absolute left-3 transition-all duration-200 pointer-events-none',
                'text-notion-text-secondary dark:text-notion-dark-text-secondary',
                icon && 'left-10',
                shouldFloat
                  ? 'top-1.5 text-notion-xs font-medium'
                  : 'top-1/2 -translate-y-1/2 text-notion-base',
                error && shouldFloat && 'text-notion-red',
                focused && 'text-notion-blue'
              )}
            >
              {label}
            </label>
          )}

          {/* Right Element */}
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-notion-text-secondary dark:text-notion-dark-text-secondary">
              {rightElement}
            </div>
          )}
        </div>

        {/* Helper Text / Error */}
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

NotionInput.displayName = 'NotionInput'