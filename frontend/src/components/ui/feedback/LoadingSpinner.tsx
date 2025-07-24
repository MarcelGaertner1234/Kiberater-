'use client'

import { cn } from '@/lib/design-system'

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'bar' | 'skeleton'
  className?: string
  label?: string
}

export function LoadingSpinner({
  size = 'md',
  variant = 'spinner',
  className,
  label = 'Laden...',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3',
  }

  if (variant === 'spinner') {
    return (
      <div className={cn('inline-flex items-center gap-2', className)} role="status" aria-label={label}>
        <div
          className={cn(
            'border-2 border-notion-border dark:border-notion-dark-border border-t-notion-blue rounded-full animate-spin',
            sizeClasses[size]
          )}
        />
        {label && <span className="sr-only">{label}</span>}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={cn('inline-flex items-center gap-1', className)} role="status" aria-label={label}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'bg-notion-blue rounded-full animate-bounce',
              dotSizes[size]
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.6s',
            }}
          />
        ))}
        {label && <span className="sr-only">{label}</span>}
      </div>
    )
  }

  if (variant === 'bar') {
    const barHeights = {
      xs: 'h-1',
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-2.5',
      xl: 'h-3',
    }

    return (
      <div className={cn('w-full', className)} role="status" aria-label={label}>
        <div className={cn(
          'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full overflow-hidden',
          barHeights[size]
        )}>
          <div
            className={cn(
              'h-full bg-gradient-to-r from-notion-blue via-notion-purple to-notion-blue',
              'bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]'
            )}
            style={{
              animation: 'shimmer 2s ease-in-out infinite',
            }}
          />
        </div>
        {label && <span className="sr-only">{label}</span>}
      </div>
    )
  }

  if (variant === 'skeleton') {
    const skeletonHeights = {
      xs: 'h-3',
      sm: 'h-4',
      md: 'h-5',
      lg: 'h-6',
      xl: 'h-8',
    }

    return (
      <div className={cn('animate-pulse', className)} role="status" aria-label={label}>
        <div className={cn(
          'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-notion',
          skeletonHeights[size],
          'w-full'
        )} />
        {label && <span className="sr-only">{label}</span>}
      </div>
    )
  }

  return null
}

// Utility components for different loading scenarios
export function SpinnerOverlay({ 
  isLoading, 
  children, 
  className 
}: { 
  isLoading: boolean
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center rounded-notion">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  )
}

export function SkeletonText({ 
  lines = 3, 
  className 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSpinner
          key={i}
          variant="skeleton"
          size="md"
          className={cn(
            'block',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-4 space-y-3', className)}>
      <LoadingSpinner variant="skeleton" size="lg" className="w-1/3" />
      <SkeletonText lines={2} />
      <div className="flex gap-2">
        <LoadingSpinner variant="skeleton" size="md" className="w-16" />
        <LoadingSpinner variant="skeleton" size="md" className="w-20" />
      </div>
    </div>
  )
}