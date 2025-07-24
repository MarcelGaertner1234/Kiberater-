'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/design-system'

interface BreadcrumbItem {
  href?: string
  label: string
  current?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}

interface NotionBreadcrumbProps {
  items?: BreadcrumbItem[]
  separator?: React.ReactNode
  maxItems?: number
  className?: string
  children?: React.ReactNode
}

export function NotionBreadcrumb({
  items = [],
  separator,
  maxItems,
  className,
  children,
}: NotionBreadcrumbProps) {
  // Default separator
  const defaultSeparator = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )

  // Process items for mobile collapse
  let displayItems = items
  if (maxItems && items.length > maxItems) {
    const startItems = items.slice(0, 1) // Always show first item
    const endItems = items.slice(-(maxItems - 2)) // Show last items
    
    displayItems = [
      ...startItems,
      { label: '...', disabled: true },
      ...endItems,
    ]
  }

  // If children are provided, use them instead of items
  if (children) {
    return (
      <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1', className)}>
        <ol className="flex items-center space-x-1">
          {children}
        </ol>
      </nav>
    )
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1', className)}>
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => (
          <Fragment key={index}>
            <li className="flex items-center">
              <NotionBreadcrumbItem {...item} />
            </li>
            
            {/* Separator */}
            {index < displayItems.length - 1 && (
              <li className="flex items-center text-notion-text-tertiary dark:text-notion-dark-text-tertiary">
                {separator || defaultSeparator}
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}

// Individual breadcrumb item
interface NotionBreadcrumbItemProps extends BreadcrumbItem {
  className?: string
  children?: React.ReactNode
}

export function NotionBreadcrumbItem({
  href,
  label,
  current = false,
  disabled = false,
  icon,
  className,
  children,
}: NotionBreadcrumbItemProps) {
  const content = children || label
  
  const baseClasses = cn(
    'flex items-center gap-1.5 text-notion-sm transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-notion-blue/20 rounded',
    current
      ? 'text-notion-text dark:text-notion-dark-text font-medium cursor-default'
      : disabled
        ? 'text-notion-text-tertiary dark:text-notion-dark-text-tertiary cursor-default'
        : 'text-notion-text-secondary dark:text-notion-dark-text-secondary hover:text-notion-text dark:hover:text-notion-dark-text',
    className
  )

  if (disabled || label === '...') {
    return (
      <span className={baseClasses} aria-disabled="true">
        {icon && <span className="w-4 h-4">{icon}</span>}
        <span>{content}</span>
      </span>
    )
  }

  if (current || !href) {
    return (
      <span className={baseClasses} aria-current={current ? 'page' : undefined}>
        {icon && <span className="w-4 h-4">{icon}</span>}
        <span>{content}</span>
      </span>
    )
  }

  return (
    <Link href={href} className={baseClasses}>
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{content}</span>
    </Link>
  )
}

// Utility component for home icon
export function HomeBreadcrumbItem({ 
  href = '/', 
  className,
  ...props 
}: Omit<NotionBreadcrumbItemProps, 'icon' | 'label'> & { href?: string }) {
  return (
    <NotionBreadcrumbItem
      href={href}
      label="Home"
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      }
      className={className}
      {...props}
    />
  )
}

// Mobile responsive breadcrumb
interface ResponsiveBreadcrumbProps extends NotionBreadcrumbProps {
  mobileMaxItems?: number
}

export function ResponsiveBreadcrumb({
  mobileMaxItems = 2,
  maxItems,
  items = [],
  ...props
}: ResponsiveBreadcrumbProps) {
  return (
    <>
      {/* Desktop version */}
      <div className="hidden sm:block">
        <NotionBreadcrumb items={items} maxItems={maxItems} {...props} />
      </div>
      
      {/* Mobile version */}
      <div className="block sm:hidden">
        <NotionBreadcrumb items={items} maxItems={mobileMaxItems} {...props} />
      </div>
    </>
  )
}

// Breadcrumb with dropdown for overflow items
export function DropdownBreadcrumb({
  items = [],
  maxVisibleItems = 4,
  className,
  ...props
}: NotionBreadcrumbProps & { maxVisibleItems?: number }) {
  if (items.length <= maxVisibleItems) {
    return <NotionBreadcrumb items={items} className={className} {...props} />
  }

  const firstItem = items[0]
  const lastItems = items.slice(-(maxVisibleItems - 2))
  const hiddenItems = items.slice(1, -(maxVisibleItems - 2))

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1', className)}>
      <ol className="flex items-center space-x-1">
        {/* First item */}
        <li className="flex items-center">
          <NotionBreadcrumbItem {...firstItem} />
        </li>
        
        {/* Separator */}
        <li className="flex items-center text-notion-text-tertiary dark:text-notion-dark-text-tertiary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </li>
        
        {/* Dropdown for hidden items */}
        <li className="flex items-center">
          <details className="relative">
            <summary className={cn(
              'flex items-center gap-1.5 text-notion-sm cursor-pointer',
              'text-notion-text-secondary dark:text-notion-dark-text-secondary',
              'hover:text-notion-text dark:hover:text-notion-dark-text',
              'focus:outline-none focus:ring-2 focus:ring-notion-blue/20 rounded'
            )}>
              <span>...</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            
            <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-white dark:bg-gray-800 border border-notion-border dark:border-notion-dark-border rounded-notion shadow-notion-lg z-50">
              {hiddenItems.map((item, index) => (
                <div key={index} className="p-2">
                  <NotionBreadcrumbItem {...item} className="w-full justify-start" />
                </div>
              ))}
            </div>
          </details>
        </li>
        
        {/* Last items */}
        {lastItems.map((item, index) => (
          <Fragment key={index}>
            <li className="flex items-center text-notion-text-tertiary dark:text-notion-dark-text-tertiary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="flex items-center">
              <NotionBreadcrumbItem {...item} />
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}