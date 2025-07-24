'use client'

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react'
import { cn } from '@/lib/design-system'

interface SwipeableViewsProps {
  children: ReactNode[]
  index: number
  onIndexChange: (index: number) => void
  disabled?: boolean
  threshold?: number
  resistance?: boolean
  className?: string
  containerStyle?: React.CSSProperties
  slideStyle?: React.CSSProperties
  enableMouseEvents?: boolean
}

interface TouchState {
  isSwiping: boolean
  startX: number
  currentX: number
  startTime: number
}

export function SwipeableViews({
  children,
  index,
  onIndexChange,
  disabled = false,
  threshold = 0.3,
  resistance = true,
  className,
  containerStyle,
  slideStyle,
  enableMouseEvents = false,
}: SwipeableViewsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [touchState, setTouchState] = useState<TouchState>({
    isSwiping: false,
    startX: 0,
    currentX: 0,
    startTime: 0,
  })
  const [offset, setOffset] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const childrenArray = Array.isArray(children) ? children : [children]
  const childCount = childrenArray.length

  // Reset offset when index changes externally
  useEffect(() => {
    if (!touchState.isSwiping) {
      setOffset(0)
    }
  }, [index, touchState.isSwiping])

  const getSwipeOffset = useCallback((clientX: number) => {
    const containerWidth = containerRef.current?.offsetWidth || 0
    let swipeOffset = clientX - touchState.startX

    // Apply resistance at boundaries
    if (resistance) {
      if ((index === 0 && swipeOffset > 0) || (index === childCount - 1 && swipeOffset < 0)) {
        swipeOffset = swipeOffset * 0.3 // Resistance factor
      }
    } else {
      // Prevent swiping beyond boundaries
      if ((index === 0 && swipeOffset > 0) || (index === childCount - 1 && swipeOffset < 0)) {
        swipeOffset = 0
      }
    }

    return Math.min(Math.max(swipeOffset, -containerWidth), containerWidth)
  }, [touchState.startX, index, childCount, resistance])

  const handleTouchStart = useCallback((event: TouchEvent | MouseEvent) => {
    if (disabled) return

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX

    setTouchState({
      isSwiping: true,
      startX: clientX,
      currentX: clientX,
      startTime: Date.now(),
    })

    // Prevent default to avoid scrolling on mobile
    if ('touches' in event) {
      event.preventDefault()
    }
  }, [disabled])

  const handleTouchMove = useCallback((event: TouchEvent | MouseEvent) => {
    if (!touchState.isSwiping || disabled) return

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const swipeOffset = getSwipeOffset(clientX)

    setTouchState(prev => ({ ...prev, currentX: clientX }))
    setOffset(swipeOffset)

    // Prevent scrolling
    event.preventDefault()
  }, [touchState.isSwiping, disabled, getSwipeOffset])

  const handleTouchEnd = useCallback(() => {
    if (!touchState.isSwiping || disabled) return

    const containerWidth = containerRef.current?.offsetWidth || 0
    const swipeDistance = touchState.currentX - touchState.startX
    const swipeTime = Date.now() - touchState.startTime
    const velocity = Math.abs(swipeDistance) / swipeTime
    const swipeThreshold = containerWidth * threshold

    let newIndex = index

    // Determine if swipe should trigger a page change
    const shouldChangePage = 
      Math.abs(swipeDistance) > swipeThreshold || 
      (velocity > 0.5 && Math.abs(swipeDistance) > 50)

    if (shouldChangePage) {
      if (swipeDistance > 0 && index > 0) {
        newIndex = index - 1
      } else if (swipeDistance < 0 && index < childCount - 1) {
        newIndex = index + 1
      }
    }

    // Animate to final position
    setTransitioning(true)
    setOffset(0)

    if (newIndex !== index) {
      onIndexChange(newIndex)
    }

    setTouchState({
      isSwiping: false,
      startX: 0,
      currentX: 0,
      startTime: 0,
    })

    // Remove transition after animation
    setTimeout(() => setTransitioning(false), 300)
  }, [touchState, disabled, threshold, index, childCount, onIndexChange])

  // Touch event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const passiveOptions = { passive: false }

    container.addEventListener('touchstart', handleTouchStart, passiveOptions)
    container.addEventListener('touchmove', handleTouchMove, passiveOptions)
    container.addEventListener('touchend', handleTouchEnd, passiveOptions)

    if (enableMouseEvents) {
      container.addEventListener('mousedown', handleTouchStart)
      document.addEventListener('mousemove', handleTouchMove)
      document.addEventListener('mouseup', handleTouchEnd)
    }

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)

      if (enableMouseEvents) {
        container.removeEventListener('mousedown', handleTouchStart)
        document.removeEventListener('mousemove', handleTouchMove)
        document.removeEventListener('mouseup', handleTouchEnd)
      }
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enableMouseEvents])

  const translateX = -index * 100 + (offset / (containerRef.current?.offsetWidth || 1)) * 100

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden', className)}
      style={containerStyle}
    >
      <div
        className={cn(
          'flex w-full h-full',
          transitioning && 'transition-transform duration-300 ease-out'
        )}
        style={{
          transform: `translateX(${translateX}%)`,
          cursor: touchState.isSwiping ? 'grabbing' : 'grab',
        }}
      >
        {childrenArray.map((child, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full h-full"
            style={slideStyle}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Optional indicators */}
      {childCount > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {childrenArray.map((_, i) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors duration-200',
                i === index 
                  ? 'bg-notion-blue' 
                  : 'bg-notion-border dark:bg-notion-dark-border'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Higher-order component for easier usage with assessment steps
export function SwipeableAssessmentSteps({
  steps,
  currentStep,
  onStepChange,
  className,
  disabled,
}: {
  steps: ReactNode[]
  currentStep: number
  onStepChange: (step: number) => void
  className?: string
  disabled?: boolean
}) {
  return (
    <SwipeableViews
      index={currentStep}
      onIndexChange={onStepChange}
      disabled={disabled}
      className={cn('h-full', className)}
      threshold={0.25} // Easier to swipe
      resistance={true}
    >
      {steps}
    </SwipeableViews>
  )
}

// Hook for gesture-based navigation
export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  disabled = false,
}: {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  disabled?: boolean
}) {
  const [startX, setStartX] = useState<number | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return
    setStartX(e.touches[0].clientX)
  }, [disabled])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (disabled || startX === null) return

    const endX = e.changedTouches[0].clientX
    const deltaX = endX - startX

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    setStartX(null)
  }, [disabled, startX, threshold, onSwipeLeft, onSwipeRight])

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  }
}