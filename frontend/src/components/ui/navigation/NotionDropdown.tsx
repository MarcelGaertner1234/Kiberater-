'use client'

import { createContext, useContext, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/design-system'

// Context for dropdown state
interface DropdownContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement>
  dropdownRef: React.RefObject<HTMLDivElement>
}

const DropdownContext = createContext<DropdownContextType | null>(null)

// Main dropdown container
interface NotionDropdownProps {
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  modal?: boolean
}

export function NotionDropdown({
  children,
  onOpenChange,
  defaultOpen = false,
  modal = false,
}: NotionDropdownProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const triggerRef = useRef<HTMLElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        dropdownRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleOpenChange(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      if (modal) {
        document.body.style.overflow = 'hidden'
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (modal) {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, modal])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleOpenChange(false)
        triggerRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        setIsOpen: handleOpenChange,
        triggerRef,
        dropdownRef,
      }}
    >
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

// Dropdown trigger
interface NotionDropdownTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

export function NotionDropdownTrigger({
  children,
  asChild = false,
  className,
}: NotionDropdownTriggerProps) {
  const context = useContext(DropdownContext)
  if (!context) throw new Error('NotionDropdownTrigger must be used within NotionDropdown')

  const { isOpen, setIsOpen, triggerRef } = context

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setIsOpen(!isOpen)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
    }
  }

  if (asChild) {
    // Clone the child and add our props
    return (
      <div
        ref={triggerRef as React.RefObject<HTMLDivElement>}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={className}
      >
        {children}
      </div>
    )
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 text-notion-sm font-medium rounded-notion',
        'border border-notion-border dark:border-notion-dark-border',
        'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover',
        'focus:outline-none focus:ring-2 focus:ring-notion-blue/20',
        'transition-colors duration-200',
        isOpen && 'bg-notion-bg-hover dark:bg-notion-dark-bg-hover',
        className
      )}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      {children}
    </button>
  )
}

// Dropdown content
interface NotionDropdownContentProps {
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
  sideOffset?: number
  alignOffset?: number
  className?: string
  portal?: boolean
}

export function NotionDropdownContent({
  children,
  align = 'start',
  side = 'bottom',
  sideOffset = 4,
  alignOffset = 0,
  className,
  portal = true,
}: NotionDropdownContentProps) {
  const context = useContext(DropdownContext)
  if (!context) throw new Error('NotionDropdownContent must be used within NotionDropdown')

  const { isOpen, dropdownRef, triggerRef } = context
  const [position, setPosition] = useState<React.CSSProperties>({})

  // Calculate position
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const newPosition: React.CSSProperties = {}

    // Calculate horizontal position
    switch (align) {
      case 'start':
        newPosition.left = triggerRect.left + alignOffset
        break
      case 'center':
        newPosition.left = triggerRect.left + triggerRect.width / 2 + alignOffset
        newPosition.transform = 'translateX(-50%)'
        break
      case 'end':
        newPosition.right = window.innerWidth - triggerRect.right + alignOffset
        break
    }

    // Calculate vertical position
    switch (side) {
      case 'top':
        newPosition.bottom = window.innerHeight - triggerRect.top + sideOffset
        break
      case 'bottom':
        newPosition.top = triggerRect.bottom + sideOffset
        break
      case 'left':
        newPosition.right = window.innerWidth - triggerRect.left + sideOffset
        newPosition.top = triggerRect.top + alignOffset
        break
      case 'right':
        newPosition.left = triggerRect.right + sideOffset
        newPosition.top = triggerRect.top + alignOffset
        break
    }

    setPosition(newPosition)
  }, [isOpen, align, side, sideOffset, alignOffset])

  if (!isOpen) return null

  const content = (
    <div
      ref={dropdownRef}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-notion border bg-white p-1 shadow-notion-lg',
        'border-notion-border dark:border-notion-dark-border',
        'dark:bg-gray-800 dark:shadow-notion-dark-lg',
        'animate-in fade-in-0 zoom-in-95 duration-200',
        side === 'bottom' && 'slide-in-from-top-2',
        side === 'top' && 'slide-in-from-bottom-2',
        side === 'left' && 'slide-in-from-right-2',
        side === 'right' && 'slide-in-from-left-2',
        className
      )}
      style={portal ? position : undefined}
      role="menu"
    >
      {children}
    </div>
  )

  if (portal) {
    return createPortal(
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div className="pointer-events-auto" style={position}>
          {content}
        </div>
      </div>,
      document.body
    )
  }

  return (
    <div className="absolute z-50" style={position}>
      {content}
    </div>
  )
}

// Dropdown item
interface NotionDropdownItemProps {
  children: React.ReactNode
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export function NotionDropdownItem({
  children,
  icon,
  shortcut,
  disabled = false,
  onClick,
  className,
}: NotionDropdownItemProps) {
  const context = useContext(DropdownContext)
  
  const handleClick = () => {
    if (!disabled) {
      onClick?.()
      context?.setIsOpen(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded px-2 py-1.5 text-notion-sm outline-none',
        'transition-colors duration-150',
        disabled
          ? 'pointer-events-none opacity-50'
          : 'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover focus:bg-notion-bg-hover dark:focus:bg-notion-dark-bg-hover',
        className
      )}
      role="menuitem"
    >
      {icon && (
        <span className="mr-2 h-4 w-4 flex-shrink-0 text-notion-text-secondary dark:text-notion-dark-text-secondary">
          {icon}
        </span>
      )}
      
      <span className="flex-1 text-left">{children}</span>
      
      {shortcut && (
        <span className="ml-auto text-notion-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
          {shortcut}
        </span>
      )}
    </button>
  )
}

// Dropdown separator
export function NotionDropdownSeparator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'my-1 h-px bg-notion-border dark:bg-notion-dark-border',
        className
      )}
      role="separator"
    />
  )
}

// Dropdown label
interface NotionDropdownLabelProps {
  children: React.ReactNode
  className?: string
}

export function NotionDropdownLabel({ children, className }: NotionDropdownLabelProps) {
  return (
    <div
      className={cn(
        'px-2 py-1.5 text-notion-xs font-semibold text-notion-text-secondary dark:text-notion-dark-text-secondary',
        className
      )}
    >
      {children}
    </div>
  )
}

// Nested dropdown (submenu)
interface NotionDropdownSubProps {
  children: React.ReactNode
  trigger: React.ReactNode
  className?: string
}

export function NotionDropdownSub({ children, trigger, className }: NotionDropdownSubProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => setIsOpen(false), 150)
    setTimeoutId(id)
  }

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded px-2 py-1.5 text-notion-sm outline-none',
        'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover',
        className
      )}>
        <span className="flex-1">{trigger}</span>
        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      
      {isOpen && (
        <div className={cn(
          'absolute left-full top-0 z-50 ml-1 min-w-[8rem] overflow-hidden rounded-notion border bg-white p-1 shadow-notion-lg',
          'border-notion-border dark:border-notion-dark-border',
          'dark:bg-gray-800 dark:shadow-notion-dark-lg',
          'animate-in fade-in-0 zoom-in-95 slide-in-from-left-1 duration-200'
        )}>
          {children}
        </div>
      )}
    </div>
  )
}