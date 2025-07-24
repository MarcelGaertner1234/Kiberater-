'use client'

import { useState, useEffect } from 'react'

export interface DeviceInfo {
  // Device type
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  
  // Operating System
  isIOS: boolean
  isAndroid: boolean
  isMacOS: boolean
  isWindows: boolean
  isLinux: boolean
  
  // Browser
  isChrome: boolean
  isFirefox: boolean
  isSafari: boolean
  isEdge: boolean
  
  // Capabilities
  isTouchDevice: boolean
  hasHover: boolean
  canVibrate: boolean
  canShare: boolean
  canInstall: boolean // PWA installable
  hasNotificationPermission: boolean
  
  // Screen info
  pixelRatio: number
  screenWidth: number
  screenHeight: number
  
  // Network
  isOnline: boolean
  connectionType?: string
  
  // Performance
  hardwareConcurrency: number
  deviceMemory?: number
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isIOS: false,
    isAndroid: false,
    isMacOS: false,
    isWindows: false,
    isLinux: false,
    isChrome: false,
    isFirefox: false,
    isSafari: false,
    isEdge: false,
    isTouchDevice: false,
    hasHover: true,
    canVibrate: false,
    canShare: false,
    canInstall: false,
    hasNotificationPermission: false,
    pixelRatio: 1,
    screenWidth: 1920,
    screenHeight: 1080,
    isOnline: true,
    hardwareConcurrency: 4,
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const updateDeviceInfo = () => {
      const userAgent = navigator.userAgent
      const platform = navigator.platform
      
      // Device type detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent) || 
        (isMobile && window.innerWidth >= 768)
      const isDesktop = !isMobile && !isTablet

      // Operating System detection
      const isIOS = /iPad|iPhone|iPod/.test(userAgent)
      const isAndroid = /Android/.test(userAgent)
      const isMacOS = /Mac/.test(platform) && !isIOS
      const isWindows = /Win/.test(platform)
      const isLinux = /Linux/.test(platform) && !isAndroid

      // Browser detection
      const isChrome = /Chrome/.test(userAgent) && !/Edg/.test(userAgent)
      const isFirefox = /Firefox/.test(userAgent)
      const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
      const isEdge = /Edg/.test(userAgent)

      // Capabilities
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const hasHover = window.matchMedia('(hover: hover)').matches
      const canVibrate = 'vibrate' in navigator
      const canShare = 'share' in navigator
      const canInstall = 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window
      
      // Notification permission
      let hasNotificationPermission = false
      if ('Notification' in window) {
        hasNotificationPermission = Notification.permission === 'granted'
      }

      // Screen info
      const pixelRatio = window.devicePixelRatio || 1
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height

      // Network
      const isOnline = navigator.onLine
      let connectionType: string | undefined
      
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        connectionType = connection?.effectiveType || connection?.type
      }

      // Performance
      const hardwareConcurrency = navigator.hardwareConcurrency || 4
      let deviceMemory: number | undefined
      
      if ('deviceMemory' in navigator) {
        deviceMemory = (navigator as any).deviceMemory
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isIOS,
        isAndroid,
        isMacOS,
        isWindows,
        isLinux,
        isChrome,
        isFirefox,
        isSafari,
        isEdge,
        isTouchDevice,
        hasHover,
        canVibrate,
        canShare,
        canInstall,
        hasNotificationPermission,
        pixelRatio,
        screenWidth,
        screenHeight,
        isOnline,
        connectionType,
        hardwareConcurrency,
        deviceMemory,
      })
    }

    // Initial detection
    updateDeviceInfo()

    // Listen for online/offline changes
    const handleOnlineStatusChange = () => {
      setDeviceInfo(prev => ({ ...prev, isOnline: navigator.onLine }))
    }

    window.addEventListener('online', handleOnlineStatusChange)
    window.addEventListener('offline', handleOnlineStatusChange)

    // Listen for orientation/resize changes that might affect device type
    const handleResize = () => {
      updateDeviceInfo()
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange)
      window.removeEventListener('offline', handleOnlineStatusChange)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return deviceInfo
}

/**
 * Hook for PWA-specific functionality
 */
export function usePWA() {
  const [pwaInfo, setPwaInfo] = useState({
    isInstalled: false,
    canInstall: false,
    isStandalone: false,
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    // Check if app is installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    // Check if app can be installed
    const canInstall = 'serviceWorker' in navigator

    // Check if app is already installed
    const isInstalled = isStandalone || localStorage.getItem('pwa-installed') === 'true'

    setPwaInfo({
      isInstalled,
      canInstall,
      isStandalone,
    })

    // Listen for app install events
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setPwaInfo(prev => ({ ...prev, canInstall: true }))
    }

    const handleAppInstalled = () => {
      localStorage.setItem('pwa-installed', 'true')
      setPwaInfo(prev => ({ ...prev, isInstalled: true, canInstall: false }))
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installApp = async () => {
    if ('deferredPrompt' in window && (window as any).deferredPrompt) {
      const deferredPrompt = (window as any).deferredPrompt
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setPwaInfo(prev => ({ ...prev, isInstalled: true, canInstall: false }))
      }
      
      (window as any).deferredPrompt = null
    }
  }

  return {
    ...pwaInfo,
    installApp,
  }
}

/**
 * Hook for device-specific optimizations
 */
export function useDeviceOptimizations() {
  const device = useDeviceDetection()
  
  const optimizations = {
    // Reduce animations on low-end devices
    shouldReduceAnimations: device.hardwareConcurrency <= 2 || 
      (device.deviceMemory && device.deviceMemory <= 2),
    
    // Use different image qualities based on device
    imageQuality: device.pixelRatio >= 2 ? 'high' : 'medium',
    
    // Adjust loading strategies
    shouldLazyLoad: device.isMobile || device.connectionType === 'slow-2g' || device.connectionType === '2g',
    
    // Optimize touch interactions
    touchOptimizations: device.isTouchDevice,
    
    // Battery optimizations
    shouldOptimizeForBattery: device.isMobile,
  }

  return {
    device,
    optimizations,
  }
}