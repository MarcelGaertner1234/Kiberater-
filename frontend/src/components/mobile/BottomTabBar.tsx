'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { cn } from '@/lib/design-system'
import { useAuthStore } from '@/stores'

// Icons (using Lucide React)
import { 
  Home, 
  FileText, 
  BarChart3, 
  FolderOpen, 
  User,
  Plus,
  MessageSquare
} from 'lucide-react'

interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: number
  requiresAuth?: boolean
  adminOnly?: boolean
}

const tabItems: TabItem[] = [
  {
    id: 'home',
    label: 'Start',
    icon: Home,
    href: '/',
  },
  {
    id: 'assessments',
    label: 'Assessment',
    icon: FileText,
    href: '/assessment',
    requiresAuth: true,
  },
  {
    id: 'add',
    label: 'Erstellen',
    icon: Plus,
    href: '/dashboard',
    requiresAuth: true,
  },
  {
    id: 'projects',
    label: 'Projekte',
    icon: FolderOpen,
    href: '/projects',
    requiresAuth: true,
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: User,
    href: '/dashboard',
    requiresAuth: true,
  },
]

export function BottomTabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const styles = useNotionStyles()
  const { user, isAuthenticated } = useAuthStore()

  // Don't show on desktop or in certain routes
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    return null
  }

  // Hide on auth pages
  if (pathname.includes('/login') || pathname.includes('/register')) {
    return null
  }

  const handleTabClick = (tab: TabItem) => {
    if (tab.requiresAuth && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (tab.adminOnly && user?.role !== 'ADMIN') {
      return
    }

    // Special handling for "add" button
    if (tab.id === 'add') {
      // Could open a modal or navigate to create page
      router.push('/dashboard')
      return
    }

    router.push(tab.href)
  }

  const getTabStyle = (tab: TabItem) => {
    const isActive = pathname === tab.href || 
      (tab.href !== '/' && pathname.startsWith(tab.href))
    
    // Special styling for add button
    if (tab.id === 'add') {
      return cn(
        'flex flex-col items-center justify-center',
        'w-12 h-12 -mt-6 mb-1',
        'bg-notion-blue rounded-full',
        'text-white shadow-lg',
        'transition-all duration-200',
        'active:scale-95'
      )
    }

    return cn(
      'flex flex-col items-center justify-center',
      'min-w-0 flex-1 py-2 px-1',
      'transition-all duration-200',
      'active:scale-95',
      isActive ? [
        'text-notion-blue',
        'dark:text-notion-blue'
      ] : [
        'text-notion-text-tertiary',
        'dark:text-notion-dark-text-tertiary'
      ]
    )
  }

  const getIconStyle = (tab: TabItem) => {
    const isActive = pathname === tab.href || 
      (tab.href !== '/' && pathname.startsWith(tab.href))

    if (tab.id === 'add') {
      return cn('h-5 w-5')
    }

    return cn(
      'h-5 w-5 mb-1',
      'transition-colors duration-200',
      isActive ? 'scale-110' : 'scale-100'
    )
  }

  const filteredTabs = tabItems.filter(tab => {
    if (tab.requiresAuth && !isAuthenticated) {
      // Show tab but it will redirect to login when clicked
      return true
    }
    if (tab.adminOnly && user?.role !== 'ADMIN') {
      return false
    }
    return true
  })

  return (
    <div className="md:hidden">
      {/* Spacer to prevent content overlap */}
      <div className="h-20" />
      
      {/* Bottom Tab Bar */}
      <nav className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white dark:bg-notion-dark-bg-primary',
        'border-t border-notion-border dark:border-notion-dark-border',
        'px-2 pb-safe-bottom', // pb-safe-bottom for devices with home indicator
        'backdrop-blur-md bg-opacity-95 dark:bg-opacity-95'
      )}>
        <div className="flex items-end justify-around h-16">
          {filteredTabs.map((tab) => {
            const Icon = tab.icon
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={getTabStyle(tab)}
                aria-label={tab.label}
              >
                <div className="relative">
                  <Icon className={getIconStyle(tab)} />
                  
                  {/* Badge */}
                  {tab.badge && tab.badge > 0 && (
                    <span className={cn(
                      'absolute -top-1 -right-1',
                      'min-w-[16px] h-4 px-1',
                      'bg-red-500 text-white text-xs',
                      'rounded-full flex items-center justify-center',
                      'font-medium'
                    )}>
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  )}
                </div>
                
                {/* Label - hide for add button */}
                {tab.id !== 'add' && (
                  <span className={cn(
                    'text-xs font-medium',
                    'truncate max-w-full',
                    'leading-tight'
                  )}>
                    {tab.label}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

// Custom hook for managing bottom tab bar visibility
export function useBottomTabBar() {
  const pathname = usePathname()
  
  const shouldShow = !pathname.includes('/login') && 
    !pathname.includes('/register') &&
    !pathname.includes('/admin')
  
  return {
    shouldShow,
    tabHeight: shouldShow ? 80 : 0, // 64px + 16px padding
  }
}