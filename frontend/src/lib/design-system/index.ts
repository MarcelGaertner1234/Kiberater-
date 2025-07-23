/**
 * Design System Entry Point
 * Export all design system utilities and components
 */

export * from './notion-styles'
export * from './colors'
export * from './animations'

// Re-export commonly used utilities
export { cn } from './notion-styles'
export { withOpacity } from './colors'
export { combineAnimations, createTransition } from './animations'

// Export a unified design system object
import { notionStyles } from './notion-styles'
import { notionColors } from './colors'
import { notionAnimations } from './animations'

export const designSystem = {
  styles: notionStyles,
  colors: notionColors,
  animations: notionAnimations,
} as const

// Type exports
export type NotionStyleComponent = keyof typeof notionStyles
export type NotionColor = keyof typeof notionColors.accent
export type NotionAnimation = keyof typeof notionAnimations.classes