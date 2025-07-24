'use client'

import { cn } from '@/lib/design-system'

interface NotionStatProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  sparkline?: number[]
  compareValue?: string | number
  compareLabel?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  loading?: boolean
  className?: string
}

export function NotionStat({
  label,
  value,
  change,
  changeLabel,
  trend,
  icon,
  sparkline,
  compareValue,
  compareLabel,
  size = 'md',
  color = 'default',
  loading = false,
  className,
}: NotionStatProps) {
  // Size configurations
  const sizeConfigs = {
    sm: {
      value: 'text-notion-xl font-bold',
      label: 'text-notion-sm',
      change: 'text-notion-xs',
      icon: 'w-4 h-4',
    },
    md: {
      value: 'text-notion-2xl font-bold',
      label: 'text-notion-base',
      change: 'text-notion-sm',
      icon: 'w-5 h-5',
    },
    lg: {
      value: 'text-notion-3xl font-bold',
      label: 'text-notion-lg',
      change: 'text-notion-base',
      icon: 'w-6 h-6',
    },
  }

  // Color configurations
  const colorConfigs = {
    default: {
      value: 'text-notion-text dark:text-notion-dark-text',
      icon: 'text-notion-text-secondary dark:text-notion-dark-text-secondary',
    },
    primary: {
      value: 'text-notion-blue',
      icon: 'text-notion-blue',
    },
    success: {
      value: 'text-green-600 dark:text-green-400',
      icon: 'text-green-600 dark:text-green-400',
    },
    warning: {
      value: 'text-yellow-600 dark:text-yellow-400',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
    error: {
      value: 'text-red-600 dark:text-red-400',
      icon: 'text-red-600 dark:text-red-400',
    },
  }

  // Trend configurations
  const trendConfigs = {
    up: {
      color: 'text-green-600 dark:text-green-400',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7m0 0H7" />
        </svg>
      ),
    },
    down: {
      color: 'text-red-600 dark:text-red-400',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10m0 0h10" />
        </svg>
      ),
    },
    neutral: {
      color: 'text-notion-text-secondary dark:text-notion-dark-text-secondary',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6" />
        </svg>
      ),
    },
  }

  const sizeConfig = sizeConfigs[size]
  const colorConfig = colorConfigs[color]

  // Auto-detect trend based on change if not provided
  const detectedTrend = trend || (change !== undefined
    ? change > 0 
      ? 'up' 
      : change < 0 
        ? 'down' 
        : 'neutral'
    : undefined)

  const trendConfig = detectedTrend ? trendConfigs[detectedTrend] : undefined

  // Format change percentage
  const formatChange = (changeValue: number) => {
    const sign = changeValue > 0 ? '+' : ''
    return `${sign}${changeValue}%`
  }

  if (loading) {
    return (
      <div className={cn('p-4', className)}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded w-1/2" />
          <div className="h-8 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded w-3/4" />
          <div className="h-3 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded w-1/3" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('p-4 space-y-2', className)}>
      {/* Header with label and icon */}
      <div className="flex items-center justify-between">
        <span className={cn(
          'font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary',
          sizeConfig.label
        )}>
          {label}
        </span>
        
        {icon && (
          <span className={cn(sizeConfig.icon, colorConfig.icon)}>
            {icon}
          </span>
        )}
      </div>

      {/* Main value */}
      <div className={cn(sizeConfig.value, colorConfig.value)}>
        {value}
      </div>

      {/* Change indicator and comparison */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Change with trend */}
          {change !== undefined && trendConfig && (
            <div className={cn(
              'flex items-center gap-1',
              sizeConfig.change,
              trendConfig.color
            )}>
              {trendConfig.icon}
              <span>{formatChange(change)}</span>
            </div>
          )}

          {/* Change label */}
          {changeLabel && (
            <span className={cn(
              sizeConfig.change,
              'text-notion-text-secondary dark:text-notion-dark-text-secondary'
            )}>
              {changeLabel}
            </span>
          )}
        </div>

        {/* Comparison value */}
        {compareValue && (
          <div className="text-right">
            <div className={cn(
              sizeConfig.change,
              'text-notion-text-secondary dark:text-notion-dark-text-secondary'
            )}>
              {compareValue}
            </div>
            {compareLabel && (
              <div className="text-notion-xs text-notion-text-tertiary dark:text-notion-dark-text-tertiary">
                {compareLabel}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sparkline */}
      {sparkline && sparkline.length > 0 && (
        <div className="mt-3">
          <Sparkline data={sparkline} color={color} />
        </div>
      )}
    </div>
  )
}

// Sparkline component
interface SparklineProps {
  data: number[]
  color?: NotionStatProps['color']
  height?: number
  className?: string
}

function Sparkline({ 
  data, 
  color = 'default', 
  height = 40,
  className 
}: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  // Generate SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = ((max - value) / range) * 100
    return `${x},${y}`
  }).join(' ')

  const colorClasses = {
    default: 'stroke-notion-text-secondary',
    primary: 'stroke-notion-blue',
    success: 'stroke-green-500',
    warning: 'stroke-yellow-500',
    error: 'stroke-red-500',
  }

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <polyline
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className={cn(colorClasses[color], 'dark:opacity-80')}
        />
      </svg>
    </div>
  )
}

// Stats grid for multiple stats
interface NotionStatsGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function NotionStatsGrid({ 
  children, 
  columns = 3, 
  className 
}: NotionStatsGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn(
      'grid gap-4',
      gridClasses[columns],
      className
    )}>
      {children}
    </div>
  )
}

// Quick stat for inline display
interface QuickStatProps {
  label: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function QuickStat({ 
  label, 
  value, 
  change, 
  trend,
  className 
}: QuickStatProps) {
  const detectedTrend = trend || (change !== undefined
    ? change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    : undefined)

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-notion-text-secondary',
  }

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className="text-notion-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
        {label}:
      </span>
      <span className="text-notion-base font-semibold text-notion-text dark:text-notion-dark-text">
        {value}
      </span>
      {change !== undefined && detectedTrend && (
        <span className={cn(
          'text-notion-xs',
          trendColors[detectedTrend]
        )}>
          ({change > 0 ? '+' : ''}{change}%)
        </span>
      )}
    </div>
  )
}