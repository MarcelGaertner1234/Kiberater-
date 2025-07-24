// API Hooks
export * from './api'

// Existing hooks
export { useAuth as useAuthContext } from './useAuth'
export { useNotionStyles } from './useNotionStyles'

// Mobile & Responsive Hooks
export { useMediaQuery, useResponsive, useContainerQuery, useViewport, useSafeArea } from './useMediaQuery'
export { useDeviceDetection, usePWA, useDeviceOptimizations } from './useDeviceDetection'