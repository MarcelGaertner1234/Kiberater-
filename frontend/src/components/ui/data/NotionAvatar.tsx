'use client'

import { useState } from 'react'
import { cn } from '@/lib/design-system'

interface NotionAvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  status?: 'online' | 'offline' | 'away' | 'busy' | 'invisible'
  showStatus?: boolean
  shape?: 'circle' | 'square'
  className?: string
  onClick?: () => void
}

export function NotionAvatar({
  src,
  alt,
  fallback,
  size = 'md',
  status,
  showStatus = false,
  shape = 'circle',
  className,
  onClick,
}: NotionAvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Size configurations
  const sizeClasses = {
    xs: 'w-6 h-6 text-notion-xs',
    sm: 'w-8 h-8 text-notion-sm',
    md: 'w-10 h-10 text-notion-base',
    lg: 'w-12 h-12 text-notion-lg',
    xl: 'w-16 h-16 text-notion-xl',
    '2xl': 'w-20 h-20 text-notion-2xl',
  }

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  }

  // Status colors
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    invisible: 'bg-gray-400',
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // Generate initials from fallback or alt text
  const getInitials = () => {
    const text = fallback || alt || '?'
    return text
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('')
  }

  const shouldShowImage = src && !imageError
  const shouldShowInitials = !shouldShowImage

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center flex-shrink-0',
        sizeClasses[size],
        shape === 'circle' ? 'rounded-full' : 'rounded-notion',
        shouldShowImage ? '' : 'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary',
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity duration-200',
        className
      )}
      onClick={onClick}
    >
      {/* Image */}
      {shouldShowImage && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover',
            shape === 'circle' ? 'rounded-full' : 'rounded-notion',
            !imageLoaded && 'opacity-0'
          )}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}

      {/* Loading skeleton */}
      {shouldShowImage && !imageLoaded && (
        <div className={cn(
          'absolute inset-0 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary animate-pulse',
          shape === 'circle' ? 'rounded-full' : 'rounded-notion'
        )} />
      )}

      {/* Initials fallback */}
      {shouldShowInitials && (
        <span className="font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary select-none">
          {getInitials()}
        </span>
      )}

      {/* Status indicator */}
      {showStatus && status && (
        <div
          className={cn(
            'absolute -bottom-0 -right-0 border-2 border-white dark:border-gray-800 rounded-full',
            statusSizes[size],
            statusColors[status]
          )}
          title={status}
        />
      )}
    </div>
  )
}

// Avatar group component
interface NotionAvatarGroupProps {
  children: React.ReactNode
  max?: number
  size?: NotionAvatarProps['size']
  className?: string
  spacing?: 'tight' | 'normal' | 'loose'
}

export function NotionAvatarGroup({
  children,
  max = 5,
  size = 'md',
  className,
  spacing = 'normal',
}: NotionAvatarGroupProps) {
  const childrenArray = Array.isArray(children) ? children : [children]
  const visibleChildren = childrenArray.slice(0, max)
  const hiddenCount = Math.max(0, childrenArray.length - max)

  const spacingClasses = {
    tight: '-space-x-1',
    normal: '-space-x-2',
    loose: '-space-x-1',
  }

  const overlapClasses = {
    xs: 'border-2',
    sm: 'border-2',
    md: 'border-2',
    lg: 'border-2',
    xl: 'border-4',
    '2xl': 'border-4',
  }

  return (
    <div className={cn('flex items-center', spacingClasses[spacing], className)}>
      {visibleChildren.map((child, index) => (
        <div
          key={index}
          className={cn(
            'relative border-white dark:border-gray-800 rounded-full',
            overlapClasses[size],
            index > 0 && 'hover:z-10'
          )}
        >
          {child}
        </div>
      ))}

      {/* More count */}
      {hiddenCount > 0 && (
        <NotionAvatar
          fallback={`+${hiddenCount}`}
          size={size}
          className="bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary text-notion-text-secondary dark:text-notion-dark-text-secondary"
        />
      )}
    </div>
  )
}

// Avatar with dropdown
interface NotionAvatarDropdownProps extends NotionAvatarProps {
  children: React.ReactNode
  dropdownAlign?: 'start' | 'end'
}

export function NotionAvatarDropdown({
  children,
  dropdownAlign = 'end',
  ...avatarProps
}: NotionAvatarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <NotionAvatar
        {...avatarProps}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'cursor-pointer',
          avatarProps.className
        )}
      />

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            className={cn(
              'absolute top-full mt-2 z-50 min-w-[200px]',
              'bg-white dark:bg-gray-800 border border-notion-border dark:border-notion-dark-border',
              'rounded-notion shadow-notion-lg dark:shadow-notion-dark-lg',
              'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200',
              dropdownAlign === 'end' ? 'right-0' : 'left-0'
            )}
          >
            {children}
          </div>
        </>
      )}
    </div>
  )
}

// Multiple avatars with names
interface UserAvatarProps extends NotionAvatarProps {
  name: string
  subtitle?: string
  showName?: boolean
  layout?: 'horizontal' | 'vertical'
}

export function UserAvatar({
  name,
  subtitle,
  showName = true,
  layout = 'horizontal',
  ...avatarProps
}: UserAvatarProps) {
  if (!showName) {
    return <NotionAvatar {...avatarProps} alt={name} />
  }

  return (
    <div className={cn(
      'flex items-center',
      layout === 'vertical' ? 'flex-col text-center' : 'flex-row',
      layout === 'horizontal' ? 'gap-3' : 'gap-2'
    )}>
      <NotionAvatar {...avatarProps} alt={name} />
      
      <div className={cn(
        'min-w-0',
        layout === 'vertical' ? 'text-center' : ''
      )}>
        <div className="text-notion-sm font-medium text-notion-text dark:text-notion-dark-text truncate">
          {name}
        </div>
        {subtitle && (
          <div className="text-notion-xs text-notion-text-secondary dark:text-notion-dark-text-secondary truncate">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}