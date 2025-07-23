/**
 * Notion-inspired animations
 * Subtle, smooth animations for a polished UX
 */

export const notionAnimations = {
  // Timing functions
  timing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Durations
  duration: {
    instant: '100ms',
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
    verySlow: '1000ms',
  },
  
  // Keyframe animations
  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    fadeOut: {
      from: { opacity: 1 },
      to: { opacity: 0 },
    },
    slideUp: {
      from: { transform: 'translateY(10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideDown: {
      from: { transform: 'translateY(-10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideInLeft: {
      from: { transform: 'translateX(-10px)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    slideInRight: {
      from: { transform: 'translateX(10px)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    scaleIn: {
      from: { transform: 'scale(0.95)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
    scaleOut: {
      from: { transform: 'scale(1)', opacity: 1 },
      to: { transform: 'scale(0.95)', opacity: 0 },
    },
    shimmer: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    bounce: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-25%)' },
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  },
  
  // Transition presets
  transitions: {
    all: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color, background-color, border-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Animation classes
  classes: {
    // Fade animations
    'fade-in': 'animate-notion-fade',
    'fade-out': 'animate-[notion-fade_0.3s_ease-out_reverse]',
    
    // Slide animations
    'slide-up': 'animate-notion-slide-up',
    'slide-down': 'animate-[notion-slide-up_0.3s_ease-out_reverse]',
    
    // Loading animations
    'shimmer': 'animate-notion-shimmer',
    'pulse': 'animate-pulse',
    'spin': 'animate-spin',
    'bounce': 'animate-bounce',
    
    // Hover effects
    'hover-lift': 'transition-transform duration-300 hover:-translate-y-0.5',
    'hover-grow': 'transition-transform duration-300 hover:scale-[1.02]',
    'hover-shrink': 'transition-transform duration-300 hover:scale-[0.98]',
    'hover-glow': 'transition-shadow duration-300 hover:shadow-notion-md',
    
    // Active effects
    'active-scale': 'active:scale-[0.98] transition-transform duration-100',
  },
}

// Helper to apply multiple animation classes
export const combineAnimations = (...classes: string[]) => classes.join(' ')

// Helper to create custom transition
export const createTransition = (
  properties: string[],
  duration: keyof typeof notionAnimations.duration = 'normal',
  timing: keyof typeof notionAnimations.timing = 'default'
) => {
  return `${properties.join(', ')} ${notionAnimations.duration[duration]} ${notionAnimations.timing[timing]}`
}