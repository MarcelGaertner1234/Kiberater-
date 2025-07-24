'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { cn } from '@/lib/design-system'
import { useAuthStore, useUIStore } from '@/stores'
import { NotionButton } from '@/components/ui/NotionButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

// Icons
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  BarChart3, 
  FolderOpen, 
  User,
  Settings,
  LogOut,
  ChevronRight,
  Bell
} from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  badge?: number
  divider?: boolean
  requiresAuth?: boolean
  adminOnly?: boolean
  children?: MenuItem[]
}

export function MobileMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const styles = useNotionStyles()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore()
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  // Close menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname, setMobileMenuOpen])

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Element
      if (isMobileMenuOpen && !target.closest('[data-mobile-menu]')) {
        setMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleOutsideClick)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen, setMobileMenuOpen])

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    router.push('/')
  }

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Startseite',
      icon: Home,
      href: '/',
    },
    {
      id: 'divider-1',
      label: '',
      icon: Home,
      divider: true,
    },
    ...(isAuthenticated ? [
      {
        id: 'assessment',
        label: 'Assessment',
        icon: FileText,
        href: '/assessment',
        children: [
          {
            id: 'assessment-new',
            label: 'Neues Assessment',
            icon: FileText,
            href: '/assessment/new',
          },
          {
            id: 'assessment-history',
            label: 'Verlauf',
            icon: BarChart3,
            href: '/assessment/history',
          },
        ],
      },
      {
        id: 'projects',
        label: 'Projekte',
        icon: FolderOpen,
        href: '/projects',
        children: [
          {
            id: 'projects-active',
            label: 'Aktive Projekte',
            icon: FolderOpen,
            href: '/projects?status=active',
          },
          {
            id: 'projects-completed',
            label: 'Abgeschlossen',
            icon: FolderOpen,
            href: '/projects?status=completed',
          },
        ],
      },
      {
        id: 'notifications',
        label: 'Benachrichtigungen',
        icon: Bell,
        href: '/notifications',
        badge: 3, // Example badge
      },
      {
        id: 'divider-2',
        label: '',
        icon: Home,
        divider: true,
      },
      {
        id: 'profile',
        label: 'Profil',
        icon: User,
        href: '/profile',
      },
      {
        id: 'settings',
        label: 'Einstellungen',
        icon: Settings,
        href: '/settings',
      },
      {
        id: 'logout',
        label: 'Abmelden',
        icon: LogOut,
        onClick: handleLogout,
      },
    ] : [
      {
        id: 'login',
        label: 'Anmelden',
        icon: User,
        href: '/login',
      },
      {
        id: 'register',
        label: 'Registrieren',
        icon: User,
        href: '/register',
      },
    ]),
  ]

  const handleItemClick = (item: MenuItem) => {
    if (item.divider) return

    if (item.children && item.children.length > 0) {
      setExpandedItem(expandedItem === item.id ? null : item.id)
      return
    }

    if (item.onClick) {
      item.onClick()
      return
    }

    if (item.href) {
      router.push(item.href)
    }
  }

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    if (item.divider) {
      return (
        <div 
          key={item.id} 
          className={cn(
            'my-2 border-t',
            'border-notion-border dark:border-notion-dark-border'
          )} 
        />
      )
    }

    const isActive = item.href === pathname || 
      (item.href !== '/' && pathname.startsWith(item.href || ''))
    const isExpanded = expandedItem === item.id
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            'w-full flex items-center justify-between',
            'px-4 py-3 text-left',
            'transition-colors duration-200',
            'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover',
            isChild && 'pl-12',
            isActive && [
              'bg-notion-bg-hover dark:bg-notion-dark-bg-hover',
              'text-notion-blue dark:text-notion-blue',
              'border-r-2 border-notion-blue'
            ]
          )}
        >
          <div className="flex items-center flex-1 min-w-0">
            <item.icon className={cn(
              'h-5 w-5 mr-3 flex-shrink-0',
              isActive ? 'text-notion-blue' : 'text-notion-text-secondary dark:text-notion-dark-text-secondary'
            )} />
            
            <span className={cn(
              'font-medium truncate',
              isActive ? 'text-notion-blue' : 'text-notion-text-primary dark:text-notion-dark-text-primary'
            )}>
              {item.label}
            </span>

            {/* Badge */}
            {item.badge && item.badge > 0 && (
              <span className={cn(
                'ml-2 px-2 py-0.5',
                'bg-red-500 text-white text-xs',
                'rounded-full font-medium'
              )}>
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </div>

          {/* Expand Arrow */}
          {hasChildren && (
            <ChevronRight 
              className={cn(
                'h-4 w-4 ml-2 transition-transform duration-200',
                isExpanded && 'rotate-90'
              )} 
            />
          )}
        </button>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary">
            {item.children!.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        className={cn(
          'md:hidden fixed top-4 right-4 z-50',
          'p-2 rounded-lg',
          'bg-white dark:bg-notion-dark-bg-primary',
          'border border-notion-border dark:border-notion-dark-border',
          'text-notion-text-primary dark:text-notion-dark-text-primary',
          'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover',
          'transition-colors duration-200',
          'shadow-lg'
        )}
        aria-label="Menu öffnen"
        data-mobile-menu
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={cn(
            'md:hidden fixed inset-0 z-40',
            'bg-black bg-opacity-50',
            'backdrop-blur-sm'
          )}
        />
      )}

      {/* Menu Panel */}
      <div
        data-mobile-menu
        className={cn(
          'md:hidden fixed top-0 right-0 bottom-0 z-40',
          'w-80 max-w-[85vw]',
          'bg-white dark:bg-notion-dark-bg-primary',
          'border-l border-notion-border dark:border-notion-dark-border',
          'transform transition-transform duration-300 ease-in-out',
          'overflow-y-auto',
          'shadow-2xl',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className={cn(
          'p-4 border-b',
          'border-notion-border dark:border-notion-dark-border'
        )}>
          <div className="flex items-center justify-between">
            <h2 className={cn(
              'text-lg font-semibold',
              'text-notion-text-primary dark:text-notion-dark-text-primary'
            )}>
              Menu
            </h2>
            <ThemeToggle />
          </div>
          
          {/* User Info */}
          {isAuthenticated && user && (
            <div className="mt-4 flex items-center">
              <div className={cn(
                'w-10 h-10 rounded-full',
                'bg-notion-blue text-white',
                'flex items-center justify-center',
                'font-medium text-sm'
              )}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className={cn(
                  'font-medium text-sm',
                  'text-notion-text-primary dark:text-notion-dark-text-primary'
                )}>
                  {user.name}
                </p>
                <p className={cn(
                  'text-xs',
                  'text-notion-text-secondary dark:text-notion-dark-text-secondary'
                )}>
                  {user.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="py-2">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>
      </div>
    </>
  )
}