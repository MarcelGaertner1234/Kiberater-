/**
 * Notion-inspired color palette
 * Centralized color definitions for consistent theming
 */

export const notionColors = {
  // Base colors
  white: '#ffffff',
  black: '#000000',
  
  // Light mode palette
  light: {
    bg: {
      primary: '#ffffff',
      secondary: '#f8f8f7',
      hover: '#f1f1f0',
      active: '#e8e8e7',
    },
    text: {
      primary: '#37352f',
      secondary: '#787774',
      tertiary: '#9b9a97',
      disabled: '#c7c6c2',
    },
    border: {
      default: '#e8e8e7',
      dark: '#d3d3d2',
      light: '#f1f1f0',
    },
  },
  
  // Dark mode palette
  dark: {
    bg: {
      primary: '#191919',
      secondary: '#202020',
      hover: '#2f2f2f',
      active: '#373737',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.81)',
      secondary: 'rgba(255, 255, 255, 0.44)',
      tertiary: 'rgba(255, 255, 255, 0.28)',
      disabled: 'rgba(255, 255, 255, 0.14)',
    },
    border: {
      default: '#2f2f2f',
      dark: '#232323',
      light: '#373737',
    },
  },
  
  // Accent colors (same for both themes)
  accent: {
    blue: '#2383e2',
    purple: '#9065b0',
    pink: '#c14c8a',
    red: '#d44c47',
    orange: '#cc5d2b',
    yellow: '#c09200',
    green: '#448361',
    gray: '#787774',
  },
  
  // Semantic colors
  semantic: {
    info: '#2383e2',
    success: '#448361',
    warning: '#c09200',
    error: '#d44c47',
  },
  
  // Background overlays
  overlay: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
  },
}

// Color utilities
export const getAccentColor = (color: keyof typeof notionColors.accent) => notionColors.accent[color]
export const getSemanticColor = (type: keyof typeof notionColors.semantic) => notionColors.semantic[type]

// Opacity utilities
export const withOpacity = (color: string, opacity: number) => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}