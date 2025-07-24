import { create } from 'zustand'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface Modal {
  id: string
  type: string
  props?: any
  onClose?: () => void
}

export interface UIState {
  // Loading states
  isGlobalLoading: boolean
  loadingStates: Record<string, boolean>
  
  // Toasts
  toasts: Toast[]
  
  // Modals
  modals: Modal[]
  
  // Sidebar
  isSidebarOpen: boolean
  isSidebarCollapsed: boolean
  
  // Mobile
  isMobileMenuOpen: boolean
  
  // Theme
  isDarkMode: boolean
  
  // Page states
  pageTitle: string
  breadcrumbs: Array<{ label: string; href?: string }>
}

interface UIStore extends UIState {
  // Loading actions
  setGlobalLoading: (loading: boolean) => void
  setLoading: (key: string, loading: boolean) => void
  isLoading: (key: string) => boolean
  
  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  
  // Modal actions
  openModal: (modal: Omit<Modal, 'id'>) => void
  closeModal: (id: string) => void
  closeAllModals: () => void
  
  // Sidebar actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebarCollapse: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Mobile actions
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  
  // Theme actions
  toggleDarkMode: () => void
  setDarkMode: (dark: boolean) => void
  
  // Page actions
  setPageTitle: (title: string) => void
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href?: string }>) => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial State
  isGlobalLoading: false,
  loadingStates: {},
  toasts: [],
  modals: [],
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  isMobileMenuOpen: false,
  isDarkMode: false,
  pageTitle: '',
  breadcrumbs: [],

  // Loading actions
  setGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),
  
  setLoading: (key, loading) => {
    const { loadingStates } = get()
    set({
      loadingStates: {
        ...loadingStates,
        [key]: loading
      }
    })
  },
  
  isLoading: (key) => {
    const { loadingStates } = get()
    return loadingStates[key] || false
  },

  // Toast actions
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000
    }
    
    set(state => ({
      toasts: [...state.toasts, newToast]
    }))

    // Auto-remove toast after duration
    setTimeout(() => {
      get().removeToast(id)
    }, newToast.duration)
  },
  
  removeToast: (id) => {
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }))
  },
  
  clearToasts: () => set({ toasts: [] }),

  // Modal actions
  openModal: (modal) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newModal: Modal = { ...modal, id }
    
    set(state => ({
      modals: [...state.modals, newModal]
    }))
  },
  
  closeModal: (id) => {
    set(state => ({
      modals: state.modals.filter(modal => modal.id !== id)
    }))
  },
  
  closeAllModals: () => set({ modals: [] }),

  // Sidebar actions
  toggleSidebar: () => {
    set(state => ({ isSidebarOpen: !state.isSidebarOpen }))
  },
  
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  
  toggleSidebarCollapse: () => {
    set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed }))
  },
  
  setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),

  // Mobile actions
  toggleMobileMenu: () => {
    set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen }))
  },
  
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),

  // Theme actions
  toggleDarkMode: () => {
    set(state => ({ isDarkMode: !state.isDarkMode }))
  },
  
  setDarkMode: (isDarkMode) => set({ isDarkMode }),

  // Page actions
  setPageTitle: (pageTitle) => set({ pageTitle }),
  
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs })
}))

// Helper functions for common toast types
export const toast = {
  success: (title: string, message?: string) => {
    useUIStore.getState().addToast({ type: 'success', title, message })
  },
  
  error: (title: string, message?: string) => {
    useUIStore.getState().addToast({ type: 'error', title, message })
  },
  
  warning: (title: string, message?: string) => {
    useUIStore.getState().addToast({ type: 'warning', title, message })
  },
  
  info: (title: string, message?: string) => {
    useUIStore.getState().addToast({ type: 'info', title, message })
  }
}