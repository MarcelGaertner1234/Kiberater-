'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook for responsive design based on media queries
 * @param query - CSS media query string
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(query)
    
    // Set initial value
    setMatches(mediaQuery.matches)

    // Define the listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add the listener
    mediaQuery.addEventListener('change', listener)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', listener)
    }
  }, [query])

  return matches
}

/**
 * Responsive breakpoint hooks based on Tailwind CSS defaults
 */
export const useResponsive = () => {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)')
  
  // Device orientations
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const isLandscape = useMediaQuery('(orientation: landscape)')
  
  // Touch capabilities
  const isTouchDevice = useMediaQuery('(hover: none) and (pointer: coarse)')
  
  // Reduced motion preference
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  
  // Dark mode preference
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isPortrait,
    isLandscape,
    isTouchDevice,
    prefersReducedMotion,
    prefersDarkMode,
    
    // Convenience breakpoints
    isMobileOrTablet: isMobile || isTablet,
    isTabletOrDesktop: isTablet || isDesktop,
    
    // Screen size categories
    screenSize: isMobile ? 'mobile' : isTablet ? 'tablet' : isDesktop ? 'desktop' : 'large',
  }
}

/**
 * Hook for container queries (experimental)
 * Note: Container queries have limited browser support
 */
export function useContainerQuery(containerRef: React.RefObject<HTMLElement>, query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') {
      return
    }

    // For now, we'll simulate container queries using ResizeObserver
    // In the future, this could use native container queries when widely supported
    const element = containerRef.current
    
    const checkQuery = () => {
      const { width, height } = element.getBoundingClientRect()
      
      // Simple query parsing for width-based queries
      if (query.includes('min-width')) {
        const minWidth = parseInt(query.match(/\d+/)?.[0] || '0')
        setMatches(width >= minWidth)
      } else if (query.includes('max-width')) {
        const maxWidth = parseInt(query.match(/\d+/)?.[0] || '0')
        setMatches(width <= maxWidth)
      }
    }

    // Initial check
    checkQuery()

    // Set up ResizeObserver
    const resizeObserver = new ResizeObserver(checkQuery)
    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [containerRef, query])

  return matches
}

/**
 * Hook for viewport dimensions
 */
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Initial value
    updateViewport()

    // Listen for changes
    window.addEventListener('resize', updateViewport)
    
    return () => {
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  return viewport
}

/**
 * Hook for safe area insets (for devices with notches, etc.)
 */
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)')) || 0,
        right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)')) || 0,
        bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
        left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)')) || 0,
      })
    }

    updateSafeArea()
    
    // Safe area can change on orientation change
    window.addEventListener('orientationchange', updateSafeArea)
    
    return () => {
      window.removeEventListener('orientationchange', updateSafeArea)
    }
  }, [])

  return safeArea
}