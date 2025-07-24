'use client'

import { createContext, useContext, useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/design-system'

// Context for tab state management
interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
}

const TabsContext = createContext<TabsContextType | null>(null)

// Main Tabs container
interface NotionTabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
  children: React.ReactNode
}

export function NotionTabs({
  defaultValue,
  value,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
}: NotionTabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  
  const activeTab = value !== undefined ? value : internalValue
  
  const setActiveTab = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, orientation }}>
      <div className={cn(
        'w-full',
        orientation === 'vertical' && 'flex gap-6',
        className
      )}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// Tabs list container
interface NotionTabsListProps {
  className?: string
  children: React.ReactNode
}

export function NotionTabsList({ className, children }: NotionTabsListProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('NotionTabsList must be used within NotionTabs')
  
  const { orientation } = context
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({})
  const listRef = useRef<HTMLDivElement>(null)

  // Update indicator position when active tab changes
  useEffect(() => {
    const updateIndicator = () => {
      if (!listRef.current) return
      
      const activeTab = listRef.current.querySelector('[data-state="active"]') as HTMLElement
      if (!activeTab) return

      const listRect = listRef.current.getBoundingClientRect()
      const tabRect = activeTab.getBoundingClientRect()

      if (orientation === 'horizontal') {
        setIndicatorStyle({
          width: tabRect.width,
          height: 2,
          left: tabRect.left - listRect.left,
          bottom: 0,
        })
      } else {
        setIndicatorStyle({
          width: 2,
          height: tabRect.height,
          left: 0,
          top: tabRect.top - listRect.top,
        })
      }
    }

    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [context.activeTab, orientation])

  return (
    <div
      ref={listRef}
      className={cn(
        'relative',
        orientation === 'horizontal'
          ? 'flex items-center border-b border-notion-border dark:border-notion-dark-border'
          : 'flex flex-col border-r border-notion-border dark:border-notion-dark-border min-w-[200px]',
        className
      )}
      role="tablist"
      aria-orientation={orientation}
    >
      {children}
      
      {/* Animated indicator */}
      <div
        className={cn(
          'absolute bg-notion-blue transition-all duration-300 ease-out',
          orientation === 'horizontal' ? 'bottom-0' : 'left-0'
        )}
        style={indicatorStyle}
      />
    </div>
  )
}

// Individual tab
interface NotionTabProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
  badge?: number | string
  className?: string
}

export function NotionTab({ 
  value, 
  children, 
  disabled = false, 
  icon, 
  badge,
  className 
}: NotionTabProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('NotionTab must be used within NotionTabs')
  
  const { activeTab, setActiveTab, orientation } = context
  const isActive = activeTab === value

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setActiveTab(value)
    }
    
    // Arrow key navigation
    const tabList = event.currentTarget.parentElement
    if (!tabList) return
    
    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]:not([disabled])')) as HTMLElement[]
    const currentIndex = tabs.indexOf(event.currentTarget as HTMLElement)
    
    let nextIndex = currentIndex
    
    if ((orientation === 'horizontal' && event.key === 'ArrowRight') ||
        (orientation === 'vertical' && event.key === 'ArrowDown')) {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if ((orientation === 'horizontal' && event.key === 'ArrowLeft') ||
               (orientation === 'vertical' && event.key === 'ArrowUp')) {
      nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1
    }
    
    if (nextIndex !== currentIndex) {
      event.preventDefault()
      tabs[nextIndex].focus()
      const tabValue = tabs[nextIndex].getAttribute('data-value')
      if (tabValue) setActiveTab(tabValue)
    }
  }

  return (
    <button
      role="tab"
      data-state={isActive ? 'active' : 'inactive'}
      data-value={value}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex items-center gap-2 px-4 py-3 text-notion-sm font-medium transition-colors duration-200',
        'focus:outline-none focus:z-10',
        orientation === 'horizontal'
          ? 'whitespace-nowrap'
          : 'w-full justify-start',
        isActive
          ? 'text-notion-blue'
          : 'text-notion-text-secondary dark:text-notion-dark-text-secondary hover:text-notion-text dark:hover:text-notion-dark-text',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
    >
      {icon && (
        <span className="w-4 h-4 flex-shrink-0">
          {icon}
        </span>
      )}
      
      <span className="flex-1">{children}</span>
      
      {badge && (
        <span className={cn(
          'px-1.5 py-0.5 text-notion-xs rounded-full font-medium',
          isActive
            ? 'bg-notion-blue text-white'
            : 'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary text-notion-text-secondary dark:text-notion-dark-text-secondary'
        )}>
          {badge}
        </span>
      )}
    </button>
  )
}

// Tab content panels
interface NotionTabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
  forceMount?: boolean
}

export function NotionTabsContent({ 
  value, 
  children, 
  className,
  forceMount = false 
}: NotionTabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('NotionTabsContent must be used within NotionTabs')
  
  const { activeTab, orientation } = context
  const isActive = activeTab === value

  if (!isActive && !forceMount) return null

  return (
    <div
      role="tabpanel"
      data-state={isActive ? 'active' : 'inactive'}
      className={cn(
        'focus:outline-none',
        orientation === 'vertical' ? 'flex-1' : 'mt-4',
        !isActive && forceMount && 'hidden',
        isActive && 'animate-in fade-in-0 duration-200',
        className
      )}
      tabIndex={0}
    >
      {children}
    </div>
  )
}

// Utility component for mobile swipeable tabs
interface SwipeableTabsProps extends NotionTabsProps {
  onSwipe?: (direction: 'left' | 'right') => void
}

export function SwipeableTabs({ 
  onSwipe, 
  children, 
  ...props 
}: SwipeableTabsProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      onSwipe?.('left')
    } else if (isRightSwipe) {
      onSwipe?.('right')
    }
  }

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <NotionTabs {...props}>
        {children}
      </NotionTabs>
    </div>
  )
}