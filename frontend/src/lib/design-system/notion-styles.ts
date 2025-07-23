/**
 * Notion-inspired Design System
 * Provides consistent styling across the application
 */

import { clsx, type ClassValue } from 'clsx'

export const notionStyles = {
  // Page Layout
  page: {
    base: 'min-h-screen bg-notion-bg dark:bg-notion-dark-bg transition-colors duration-notion',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    content: 'max-w-[900px] mx-auto px-4 py-8',
    withSidebar: 'flex h-screen overflow-hidden',
  },

  // Sidebar Navigation
  sidebar: {
    base: 'notion-sidebar',
    item: 'notion-sidebar-item',
    itemActive: 'notion-sidebar-item-active',
    icon: 'w-4 h-4 mr-2 opacity-70',
    divider: 'my-2 border-t border-notion-border dark:border-notion-dark-border',
    section: 'px-3 py-2 text-notion-xs font-medium text-tertiary uppercase tracking-wider',
  },

  // Top Navigation Bar
  topbar: {
    base: 'h-14 border-b border-notion-border dark:border-notion-dark-border bg-notion-bg dark:bg-notion-dark-bg',
    sticky: 'sticky top-0 z-40 backdrop-blur-sm bg-notion-bg/95 dark:bg-notion-dark-bg/95',
    content: 'flex items-center justify-between h-full px-4',
    title: 'text-notion-lg font-semibold',
  },

  // Cards and Containers
  card: {
    base: 'notion-card p-4',
    clickable: 'cursor-pointer hover:shadow-notion-md dark:hover:shadow-notion-dark-md transform transition-all duration-notion hover:-translate-y-0.5',
    gradient: 'notion-gradient-card',
    padded: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
    header: 'mb-4 pb-4 border-b border-notion-border dark:border-notion-dark-border',
    title: 'text-notion-lg font-semibold text-notion-text dark:text-notion-dark-text',
    description: 'text-notion-sm text-secondary mt-1',
  },

  // Buttons
  button: {
    base: 'notion-button',
    primary: 'notion-button-primary',
    secondary: 'notion-button-secondary',
    ghost: 'notion-button-ghost',
    danger: 'notion-button bg-gradient-to-r from-notion-red to-notion-red-dark text-white hover:shadow-notion-md',
    success: 'notion-button bg-gradient-to-r from-notion-green to-notion-green-dark text-white hover:shadow-notion-md',
    warning: 'notion-button bg-gradient-to-r from-notion-yellow to-notion-yellow-dark text-white hover:shadow-notion-md',
    size: {
      sm: 'px-2 py-1 text-notion-xs',
      md: 'px-3 py-1.5 text-notion-sm',
      lg: 'px-4 py-2 text-notion-base',
    },
    icon: 'w-4 h-4',
    loading: 'opacity-70 cursor-not-allowed animate-notion-pulse',
    withIcon: 'inline-flex items-center gap-2',
  },

  // Form Elements
  input: {
    base: 'notion-input',
    error: 'border-notion-red focus:ring-notion-red focus:border-notion-red',
    disabled: 'opacity-50 cursor-not-allowed bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary',
    label: 'block text-notion-sm font-medium mb-1',
    helper: 'text-notion-xs text-secondary mt-1',
    errorText: 'text-notion-xs text-notion-red mt-1',
  },

  select: {
    base: 'notion-input pr-10 appearance-none bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzc4Nzc3NCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=)] bg-[length:16px_16px] bg-[right_0.5rem_center] bg-no-repeat',
  },

  textarea: {
    base: 'notion-input min-h-[100px] resize-y',
  },

  checkbox: {
    base: 'w-4 h-4 rounded-notion border-notion-border dark:border-notion-dark-border text-notion-blue focus:ring-notion-blue focus:ring-offset-0',
    label: 'ml-2 text-notion-sm text-notion-text dark:text-notion-dark-text',
  },

  // Typography
  text: {
    h1: 'text-notion-3xl font-bold text-notion-text dark:text-notion-dark-text',
    h2: 'text-notion-2xl font-semibold text-notion-text dark:text-notion-dark-text',
    h3: 'text-notion-xl font-medium text-notion-text dark:text-notion-dark-text',
    h4: 'text-notion-lg font-medium text-notion-text dark:text-notion-dark-text',
    body: 'text-notion-base text-notion-text dark:text-notion-dark-text',
    small: 'text-notion-sm text-notion-text dark:text-notion-dark-text',
    muted: 'text-secondary',
    error: 'text-notion-red',
    success: 'text-notion-green',
  },

  // Lists
  list: {
    base: 'space-y-2',
    item: 'flex items-start',
    bullet: 'w-1.5 h-1.5 rounded-full bg-notion-text-secondary dark:bg-notion-dark-text-secondary mt-2 mr-2',
    number: 'text-notion-sm text-secondary mr-2',
  },

  // Tables
  table: {
    base: 'w-full border-collapse',
    header: 'border-b border-notion-border dark:border-notion-dark-border',
    headerCell: 'text-left text-notion-xs font-medium text-tertiary uppercase tracking-wider py-3 px-4',
    row: 'border-b border-notion-border dark:border-notion-dark-border hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-colors duration-notion',
    cell: 'py-3 px-4 text-notion-sm',
  },

  // Badges and Tags
  badge: {
    base: 'notion-badge',
    default: 'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary text-notion-text-secondary dark:text-notion-dark-text-secondary',
    primary: 'notion-badge-blue',
    success: 'notion-badge-green',
    warning: 'notion-badge-yellow',
    danger: 'notion-badge-red',
    purple: 'notion-badge-purple',
    withDot: 'inline-flex items-center gap-1.5',
    dot: 'w-1.5 h-1.5 rounded-full animate-notion-pulse',
  },

  // Loading States
  loading: {
    spinner: 'animate-spin h-5 w-5 border-2 border-notion-border dark:border-notion-dark-border border-t-transparent rounded-full bg-gradient-to-r from-notion-blue to-notion-purple',
    skeleton: 'notion-shimmer bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-notion',
    dots: 'inline-flex items-center gap-1',
    dot: 'w-1.5 h-1.5 bg-notion-text-secondary dark:bg-notion-dark-text-secondary rounded-full animate-notion-bounce',
    bar: 'h-1 bg-gradient-to-r from-notion-blue via-notion-purple to-notion-blue bg-[length:200%_100%] animate-notion-shimmer rounded-full',
  },

  // Modals and Overlays
  modal: {
    overlay: 'fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50',
    content: 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-notion-bg dark:bg-notion-dark-bg rounded-lg shadow-notion-lg dark:shadow-notion-dark p-6 z-50',
    header: 'mb-4',
    title: 'text-notion-xl font-semibold',
    close: 'absolute top-4 right-4 text-notion-text-secondary dark:text-notion-dark-text-secondary hover:text-notion-text dark:hover:text-notion-dark-text',
  },

  // Tooltips
  tooltip: {
    base: 'absolute z-50 px-2 py-1 text-notion-xs bg-notion-text dark:bg-notion-dark-text text-white dark:text-notion-dark-bg rounded-notion shadow-notion-md pointer-events-none',
  },

  // Dividers
  divider: {
    horizontal: 'border-t border-notion-border dark:border-notion-dark-border',
    vertical: 'border-l border-notion-border dark:border-notion-dark-border',
    text: 'relative text-center',
    textContent: 'bg-notion-bg dark:bg-notion-dark-bg px-2 text-notion-xs text-tertiary',
  },

  // Hover Effects
  hover: {
    lift: 'hover:-translate-y-0.5 transition-transform duration-notion',
    grow: 'hover:scale-[1.02] transition-transform duration-notion',
    glow: 'hover:shadow-notion-glow transition-shadow duration-notion',
    fade: 'hover:opacity-80 transition-opacity duration-notion',
    brighten: 'hover:brightness-110 transition-all duration-notion',
    rotate: 'hover:rotate-2 transition-transform duration-notion',
  },

  // Focus Effects
  focus: {
    ring: 'focus:outline-none focus:shadow-notion-glow',
    within: 'focus-within:shadow-notion-glow',
    scale: 'focus:scale-[1.02] transition-transform duration-notion',
    gradient: 'focus:bg-gradient-to-r focus:from-notion-blue/5 focus:to-notion-purple/5',
  },

  // Transitions
  transition: {
    base: 'transition-all duration-notion ease-out',
    fast: 'transition-all duration-150 ease-out',
    slow: 'transition-all duration-500 ease-out',
    spring: 'transition-all duration-notion cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Effects and Animations
  effects: {
    glow: {
      blue: 'shadow-[0_0_20px_rgba(82,156,202,0.15)]',
      purple: 'shadow-[0_0_20px_rgba(164,123,179,0.15)]',
      green: 'shadow-[0_0_20px_rgba(107,160,133,0.15)]',
    },
    gradient: {
      subtle: 'bg-gradient-to-br from-white via-notion-bg-secondary to-white dark:from-notion-dark-bg dark:via-notion-dark-bg-secondary dark:to-notion-dark-bg',
      vibrant: 'bg-gradient-to-r from-notion-blue via-notion-purple to-notion-pink',
      overlay: 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/5 before:to-transparent',
    },
    blur: {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
    },
  },

  // Icon styles (for when we add icons)
  icon: {
    base: 'inline-flex shrink-0',
    size: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    },
    color: {
      default: 'text-notion-text-secondary dark:text-notion-dark-text-secondary',
      primary: 'text-notion-blue',
      success: 'text-notion-green',
      danger: 'text-notion-red',
      warning: 'text-notion-yellow',
    },
  },
}

// Helper function to combine class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Type-safe style getter
export function getNotionStyle<T extends keyof typeof notionStyles>(
  component: T,
  variant?: string
): string {
  const styles = notionStyles[component] as any
  if (!variant) return styles.base || ''
  return styles[variant] || ''
}