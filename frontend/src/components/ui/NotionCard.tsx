import { cn } from '@/lib/design-system'

interface NotionCardProps {
  children: React.ReactNode
  title?: string
  description?: string
  clickable?: boolean
  gradient?: boolean
  padding?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

export function NotionCard({
  children,
  title,
  description,
  clickable = false,
  gradient = false,
  padding = 'md',
  className,
  onClick,
}: NotionCardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const cardClasses = cn(
    'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
    clickable && 'cursor-pointer hover:shadow-lg transition-shadow',
    gradient && 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20',
    paddingClasses[padding],
    className
  )

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
          {description && <p className="text-gray-600 dark:text-gray-300">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}