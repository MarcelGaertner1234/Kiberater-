'use client'

import { cn } from '@/lib/design-system'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showLabel?: boolean
  variant?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  striped?: boolean
  animated?: boolean
  steps?: number
  currentStep?: number
  className?: string
  labelClassName?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showLabel = false,
  variant = 'primary',
  size = 'md',
  striped = false,
  animated = false,
  steps,
  currentStep,
  className,
  labelClassName,
}: ProgressBarProps) {
  // Calculate percentage
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  // For stepped progress
  const stepPercentage = steps && currentStep 
    ? Math.min(Math.max((currentStep / steps) * 100, 0), 100)
    : percentage

  const displayPercentage = steps ? stepPercentage : percentage

  // Size configurations
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  // Variant colors
  const variantClasses = {
    primary: 'bg-notion-blue',
    success: 'bg-notion-green',
    warning: 'bg-notion-yellow',
    error: 'bg-notion-red',
  }

  // Format label
  const displayLabel = steps && currentStep 
    ? `${currentStep} / ${steps}`
    : label || `${Math.round(percentage)}%`

  return (
    <div className={cn('w-full', className)}>
      {/* Label */}
      {showLabel && (
        <div className={cn(
          'flex items-center justify-between mb-2 text-notion-sm',
          labelClassName
        )}>
          <span className="text-notion-text dark:text-notion-dark-text font-medium">
            {displayLabel}
          </span>
          {!steps && (
            <span className="text-notion-text-secondary dark:text-notion-dark-text-secondary">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress container */}
      <div className={cn(
        'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        {/* Progress bar */}
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantClasses[variant],
            striped && 'bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]',
            animated && striped && 'animate-[progress-stripes_1s_linear_infinite]'
          )}
          style={{ width: `${displayPercentage}%` }}
          role="progressbar"
          aria-valuenow={steps ? currentStep : value}
          aria-valuemin={0}
          aria-valuemax={steps || max}
          aria-label={displayLabel}
        />
      </div>

      {/* Steps indicators */}
      {steps && (
        <div className="flex justify-between mt-2">
          {Array.from({ length: steps + 1 }).map((_, index) => {
            const isCompleted = currentStep ? index <= currentStep : false
            const isCurrent = currentStep === index
            
            return (
              <div
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors duration-200',
                  isCompleted
                    ? variantClasses[variant]
                    : 'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary',
                  isCurrent && 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800',
                  isCurrent && `ring-${variant === 'primary' ? 'notion-blue' : variant === 'success' ? 'notion-green' : variant === 'warning' ? 'notion-yellow' : 'notion-red'}`
                )}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

// Utility component for multi-step processes
export function SteppedProgress({
  steps,
  currentStep,
  variant = 'primary',
  showLabels = true,
  className,
}: {
  steps: Array<{ label: string; description?: string }>
  currentStep: number
  variant?: ProgressBarProps['variant']
  showLabels?: boolean
  className?: string
}) {
  return (
    <div className={cn('w-full', className)}>
      {/* Progress bar */}
      <ProgressBar
        value={currentStep}
        max={steps.length - 1}
        variant={variant}
        showLabel={false}
        steps={steps.length - 1}
        currentStep={currentStep}
        className="mb-4"
      />

      {/* Step labels */}
      {showLabels && (
        <div className="space-y-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isUpcoming = index > currentStep

            return (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-notion transition-colors duration-200',
                  isCurrent && 'bg-notion-bg-hover dark:bg-notion-dark-bg-hover',
                  isCompleted && 'opacity-75'
                )}
              >
                {/* Step indicator */}
                <div className={cn(
                  'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-notion-xs font-bold transition-colors duration-200',
                  isCompleted
                    ? `bg-${variant === 'primary' ? 'notion-blue' : variant === 'success' ? 'notion-green' : variant === 'warning' ? 'notion-yellow' : 'notion-red'} text-white`
                    : isCurrent
                      ? 'bg-notion-blue text-white'
                      : 'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary text-notion-text-secondary dark:text-notion-dark-text-secondary'
                )}>
                  {isCompleted ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    'font-medium text-notion-sm',
                    isCurrent
                      ? 'text-notion-text dark:text-notion-dark-text'
                      : isCompleted
                        ? 'text-notion-text-secondary dark:text-notion-dark-text-secondary'
                        : 'text-notion-text-tertiary dark:text-notion-dark-text-tertiary'
                  )}>
                    {step.label}
                  </h4>
                  {step.description && (
                    <p className="text-notion-xs text-notion-text-secondary dark:text-notion-dark-text-secondary mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}