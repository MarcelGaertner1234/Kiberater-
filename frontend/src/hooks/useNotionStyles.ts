import { useMemo } from 'react'
import { notionStyles, cn } from '@/lib/design-system'
import { useTheme } from '@/components/providers/ThemeProvider'

type StyleVariant = string | undefined
type StyleOptions = Record<string, any>

/**
 * Hook to access Notion-style design system
 * Provides type-safe style builders and theme-aware utilities
 */
export function useNotionStyles() {
  const { resolvedTheme } = useTheme()

  const styles = useMemo(() => ({
    // Direct access to all styles
    ...notionStyles,
    
    // Page layouts
    page: (variant?: 'base' | 'container' | 'content' | 'withSidebar') => 
      cn(notionStyles.page.base, variant && notionStyles.page[variant]),

    // Cards
    card: (options?: { 
      clickable?: boolean
      padding?: 'sm' | 'md' | 'lg'
      className?: string 
    }) => cn(
      notionStyles.card.base,
      options?.clickable && notionStyles.card.clickable,
      options?.padding && notionStyles.card.padded[options.padding],
      options?.className
    ),

    // Buttons
    button: (options?: {
      variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning'
      size?: 'sm' | 'md' | 'lg'
      loading?: boolean
      className?: string
    }) => cn(
      notionStyles.button.base,
      options?.variant ? notionStyles.button[options.variant] : notionStyles.button.primary,
      options?.size && notionStyles.button.size[options.size],
      options?.loading && notionStyles.button.loading,
      options?.className
    ),

    // Form inputs
    input: (options?: {
      error?: boolean
      disabled?: boolean
      className?: string
    }) => cn(
      notionStyles.input.base,
      options?.error && notionStyles.input.error,
      options?.disabled && notionStyles.input.disabled,
      options?.className
    ),

    // Typography
    text: (variant: keyof typeof notionStyles.text, className?: string) =>
      cn(notionStyles.text[variant], className),

    // Sidebar
    sidebar: {
      base: notionStyles.sidebar.base,
      item: (active?: boolean, className?: string) => cn(
        notionStyles.sidebar.item,
        active && notionStyles.sidebar.itemActive,
        className
      ),
      icon: notionStyles.sidebar.icon,
      divider: notionStyles.sidebar.divider,
    },

    // Table
    table: {
      base: notionStyles.table.base,
      header: notionStyles.table.header,
      headerCell: notionStyles.table.headerCell,
      row: notionStyles.table.row,
      cell: notionStyles.table.cell,
    },

    // Badge
    badge: (variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple') => cn(
      notionStyles.badge.base,
      notionStyles.badge[variant || 'default']
    ),

    // Loading
    loading: {
      spinner: notionStyles.loading.spinner,
      skeleton: (className?: string) => cn(notionStyles.loading.skeleton, className),
      dots: notionStyles.loading.dots,
      dot: notionStyles.loading.dot,
    },

    // Modal
    modal: {
      overlay: notionStyles.modal.overlay,
      content: notionStyles.modal.content,
      header: notionStyles.modal.header,
      title: notionStyles.modal.title,
      close: notionStyles.modal.close,
    },

    // Utilities
    hover: (effect: keyof typeof notionStyles.hover) => notionStyles.hover[effect],
    transition: (speed?: 'base' | 'fast' | 'slow') => 
      notionStyles.transition[speed || 'base'],
  }), [resolvedTheme])

  return styles
}

// Export individual style builders for more specific use cases
export const cardStyles = (options?: Parameters<ReturnType<typeof useNotionStyles>['card']>[0]) => {
  const { card } = useNotionStyles()
  return card(options)
}

export const buttonStyles = (options?: Parameters<ReturnType<typeof useNotionStyles>['button']>[0]) => {
  const { button } = useNotionStyles()
  return button(options)
}

export const inputStyles = (options?: Parameters<ReturnType<typeof useNotionStyles>['input']>[0]) => {
  const { input } = useNotionStyles()
  return input(options)
}