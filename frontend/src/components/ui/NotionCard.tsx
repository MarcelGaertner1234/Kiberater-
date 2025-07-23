import { cn } from '@/lib/design-system'
import { useNotionStyles } from '@/hooks/useNotionStyles'

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
  const styles = useNotionStyles()

  const cardClasses = cn(
    styles.card.base,
    clickable && styles.card.clickable,
    gradient && styles.card.gradient,
    styles.card.padded[padding],
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
        <div className={styles.card.header}>
          {title && <h3 className={styles.card.title}>{title}</h3>}
          {description && <p className={styles.card.description}>{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}