import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/design-system'
import { useNotionStyles } from '@/hooks/useNotionStyles'

interface NotionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const NotionButton = forwardRef<HTMLButtonElement, NotionButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    className,
    disabled,
    ...props 
  }, ref) => {
    const styles = useNotionStyles()

    return (
      <button
        ref={ref}
        className={styles.button({ variant, size, loading, className })}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <div className="mr-2 h-4 w-4 border-2 border-notion-bg-hover dark:border-notion-dark-bg-hover border-t-white rounded-full animate-spin" />
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span className={cn(styles.icon.base, styles.icon.size.sm, "mr-2")}>{leftIcon}</span>}
            {children}
            {rightIcon && <span className={cn(styles.icon.base, styles.icon.size.sm, "ml-2")}>{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

NotionButton.displayName = 'NotionButton'