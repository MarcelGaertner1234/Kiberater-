'use client'

import { useState } from 'react'
import { cn } from '@/lib/design-system'

interface NotionAlertProps {
  type: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
  dismissible?: boolean
  icon?: React.ReactNode
  onDismiss?: () => void
  className?: string
}

export function NotionAlert({
  type,
  title,
  children,
  dismissible = false,
  icon,
  onDismiss,
  className,
}: NotionAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  if (isDismissed) return null

  // Default icons for each type
  const defaultIcons = {
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.82 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  // Styling for each type
  const typeStyles = {
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500 text-blue-800 dark:text-blue-200',
      icon: 'text-blue-500',
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/20 border-l-green-500 text-green-800 dark:text-green-200',
      icon: 'text-green-500',
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-l-yellow-500 text-yellow-800 dark:text-yellow-200',
      icon: 'text-yellow-500',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border-l-red-500 text-red-800 dark:text-red-200',
      icon: 'text-red-500',
    },
  }

  const styles = typeStyles[type]
  const displayIcon = icon || defaultIcons[type]

  return (
    <div
      className={cn(
        'border-l-4 p-4 rounded-r-notion',
        'border border-l-0 border-notion-border dark:border-notion-dark-border',
        'animate-in slide-in-from-left-1 duration-300',
        styles.container,
        isDismissed && 'animate-out slide-out-to-left-1 duration-300',
        className
      )}
      role="alert"
    >
      <div className="flex items-start">
        {/* Icon */}
        <div className={cn('flex-shrink-0 mr-3', styles.icon)}>
          {displayIcon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-notion-sm font-semibold mb-1">
              {title}
            </h3>
          )}
          
          <div className={cn(
            'text-notion-sm',
            title ? 'mt-1' : '',
            '[&_a]:underline [&_a]:font-medium [&_a]:hover:no-underline'
          )}>
            {children}
          </div>
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              'flex-shrink-0 ml-3 p-1 rounded-notion',
              'hover:bg-black/10 dark:hover:bg-white/10',
              'transition-colors duration-200',
              styles.icon
            )}
            aria-label="Alert schließen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// Utility components for common alert patterns
export function InfoAlert({ children, ...props }: Omit<NotionAlertProps, 'type'>) {
  return <NotionAlert type="info" {...props}>{children}</NotionAlert>
}

export function SuccessAlert({ children, ...props }: Omit<NotionAlertProps, 'type'>) {
  return <NotionAlert type="success" {...props}>{children}</NotionAlert>
}

export function WarningAlert({ children, ...props }: Omit<NotionAlertProps, 'type'>) {
  return <NotionAlert type="warning" {...props}>{children}</NotionAlert>
}

export function ErrorAlert({ children, ...props }: Omit<NotionAlertProps, 'type'>) {
  return <NotionAlert type="error" {...props}>{children}</NotionAlert>
}