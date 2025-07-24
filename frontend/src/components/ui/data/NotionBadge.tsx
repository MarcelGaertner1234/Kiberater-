'use client'

import { cn } from '@/lib/design-system'

interface NotionBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'purple' | 'pink' | 'orange'
  size?: 'sm' | 'md'
  icon?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
  className?: string
  dot?: boolean
  outline?: boolean
}

export function NotionBadge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  removable = false,
  onRemove,
  className,
  dot = false,
  outline = false,
}: NotionBadgeProps) {
  // Size configurations
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-notion-xs',
    md: 'px-2.5 py-1 text-notion-sm',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  }

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
  }

  // Variant styles
  const variantStyles = {
    default: outline
      ? 'bg-transparent border border-notion-border dark:border-notion-dark-border text-notion-text-secondary dark:text-notion-dark-text-secondary'
      : 'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary text-notion-text-secondary dark:text-notion-dark-text-secondary',
    primary: outline
      ? 'bg-transparent border border-notion-blue text-notion-blue'
      : 'bg-notion-blue text-white',
    success: outline
      ? 'bg-transparent border border-green-500 text-green-700 dark:text-green-400'
      : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200',
    warning: outline
      ? 'bg-transparent border border-yellow-500 text-yellow-700 dark:text-yellow-400'
      : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
    error: outline
      ? 'bg-transparent border border-red-500 text-red-700 dark:text-red-400'
      : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200',
    purple: outline
      ? 'bg-transparent border border-purple-500 text-purple-700 dark:text-purple-400'
      : 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200',
    pink: outline
      ? 'bg-transparent border border-pink-500 text-pink-700 dark:text-pink-400'
      : 'bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-200',
    orange: outline
      ? 'bg-transparent border border-orange-500 text-orange-700 dark:text-orange-400'
      : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200',
  }

  // Dot colors for status indicators
  const dotColors = {
    default: 'bg-notion-text-secondary dark:bg-notion-dark-text-secondary',
    primary: 'bg-notion-blue',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    orange: 'bg-orange-500',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        sizeClasses[size],
        variantStyles[variant],
        className
      )}
    >
      {/* Status dot */}
      {dot && (
        <span
          className={cn(
            'rounded-full animate-pulse',
            dotSizes[size],
            dotColors[variant]
          )}
        />
      )}

      {/* Icon */}
      {icon && (
        <span className={cn('flex-shrink-0', iconSizes[size])}>
          {icon}
        </span>
      )}

      {/* Content */}
      <span className="truncate">{children}</span>

      {/* Remove button */}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className={cn(
            'flex-shrink-0 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200',
            size === 'sm' ? 'p-0.5' : 'p-1'
          )}
          aria-label="Entfernen"
        >
          <svg
            className={iconSizes[size]}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  )
}

// Badge group for multiple badges
interface NotionBadgeGroupProps {
  children: React.ReactNode
  max?: number
  className?: string
  spacing?: 'tight' | 'normal' | 'loose'
}

export function NotionBadgeGroup({
  children,
  max,
  className,
  spacing = 'normal',
}: NotionBadgeGroupProps) {
  const childrenArray = Array.isArray(children) ? children : [children]
  const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray
  const hiddenCount = max ? Math.max(0, childrenArray.length - max) : 0

  const spacingClasses = {
    tight: 'gap-1',
    normal: 'gap-2',
    loose: 'gap-3',
  }

  return (
    <div className={cn('flex flex-wrap items-center', spacingClasses[spacing], className)}>
      {visibleChildren}
      
      {hiddenCount > 0 && (
        <NotionBadge variant="default" size="sm">
          +{hiddenCount} mehr
        </NotionBadge>
      )}
    </div>
  )
}

// Status badge with predefined styles
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'draft' | 'published'
  size?: NotionBadgeProps['size']
  className?: string
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      variant: 'success' as const,
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Aktiv',
    },
    inactive: {
      variant: 'default' as const,
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Inaktiv',
    },
    pending: {
      variant: 'warning' as const,
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Ausstehend',
    },
    approved: {
      variant: 'success' as const,
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Genehmigt',
    },
    rejected: {
      variant: 'error' as const,
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Abgelehnt',
    },
    draft: {
      variant: 'default' as const,
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      ),
      label: 'Entwurf',
    },
    published: {
      variant: 'primary' as const,
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Veröffentlicht',
    },
  }

  const config = statusConfig[status]

  return (
    <NotionBadge
      variant={config.variant}
      size={size}
      icon={config.icon}
      className={className}
    >
      {config.label}
    </NotionBadge>
  )
}

// Priority badge
interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent'
  size?: NotionBadgeProps['size']
  className?: string
}

export function PriorityBadge({ priority, size = 'md', className }: PriorityBadgeProps) {
  const priorityConfig = {
    low: {
      variant: 'default' as const,
      label: 'Niedrig',
    },
    medium: {
      variant: 'warning' as const,
      label: 'Mittel',
    },
    high: {
      variant: 'orange' as const,
      label: 'Hoch',
    },
    urgent: {
      variant: 'error' as const,
      label: 'Dringend',
    },
  }

  const config = priorityConfig[priority]

  return (
    <NotionBadge
      variant={config.variant}
      size={size}
      className={className}
    >
      {config.label}
    </NotionBadge>
  )
}