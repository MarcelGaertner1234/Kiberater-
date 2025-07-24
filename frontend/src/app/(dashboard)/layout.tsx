'use client'

import { NotionSidebar, ThemeToggle } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  Target,
  Map,
  FolderOpen,
  BookOpen,
  MessageCircle,
  Settings,
  Users,
  BarChart3,
  Bell,
} from 'lucide-react'

const sidebarSections = [
  {
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: <Home className="w-4 h-4" />,
      },
      {
        id: 'assessment',
        label: 'KI-Assessment',
        href: '/assessment',
        icon: <Target className="w-4 h-4" />,
      },
      {
        id: 'roadmap',
        label: 'Roadmap',
        href: '/roadmap',
        icon: <Map className="w-4 h-4" />,
      },
      {
        id: 'projects',
        label: 'Projekte',
        href: '/projects',
        icon: <FolderOpen className="w-4 h-4" />,
        badge: 3,
      },
    ],
  },
  {
    title: 'Lernen & Support',
    items: [
      {
        id: 'learning',
        label: 'Lernbereich',
        href: '/learning',
        icon: <BookOpen className="w-4 h-4" />,
      },
      {
        id: 'chat',
        label: 'Berater Chat',
        href: '/chat',
        icon: <MessageCircle className="w-4 h-4" />,
        badge: 2,
      },
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/analytics',
        icon: <BarChart3 className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        id: 'team',
        label: 'Team',
        href: '/team',
        icon: <Users className="w-4 h-4" />,
      },
      {
        id: 'notifications',
        label: 'Benachrichtigungen',
        href: '/notifications',
        icon: <Bell className="w-4 h-4" />,
      },
      {
        id: 'settings',
        label: 'Einstellungen',
        href: '/settings',
        icon: <Settings className="w-4 h-4" />,
      },
    ],
  },
]

// Mobile Navigation Items (5 wichtigste)
const mobileNavItems = [
  {
    id: 'dashboard',
    label: 'Home',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: 'projects',
    label: 'Projekte',
    href: '/projects',
    icon: <FolderOpen className="w-5 h-5" />,
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    href: '/roadmap',
    icon: <Map className="w-5 h-5" />,
  },
  {
    id: 'learning',
    label: 'Lernen',
    href: '/learning',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: 'chat',
    label: 'Chat',
    href: '/chat',
    icon: <MessageCircle className="w-5 h-5" />,
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const styles = useNotionStyles()
  const pathname = usePathname()

  return (
    <div className={styles.page('withSidebar')}>
      {/* Desktop Sidebar */}
      <NotionSidebar
        sections={sidebarSections}
        className="hidden md:flex w-64 border-r border-notion-border dark:border-notion-dark-border"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-notion-bg dark:bg-notion-dark-bg pb-16 md:pb-0">
          <div className="container mx-auto px-4 py-6 md:px-6">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-notion-dark-bg border-t border-notion-border dark:border-notion-dark-border z-50">
        <div className="grid grid-cols-5 h-16">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center space-y-1 transition-colors
                  ${isActive 
                    ? 'text-notion-blue bg-notion-blue/5' 
                    : 'text-notion-text-secondary hover:text-notion-text dark:text-notion-dark-text-secondary dark:hover:text-notion-dark-text'
                  }
                `}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-notion-blue rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

function DashboardHeader() {
  const styles = useNotionStyles()

  return (
    <header className="h-16 border-b border-notion-border dark:border-notion-dark-border bg-white dark:bg-notion-dark-bg">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile: Nur Logo */}
          <div className="md:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-notion-blue to-notion-purple rounded-lg flex items-center justify-center text-white font-bold text-sm">
              KI
            </div>
          </div>
          {/* Desktop: Logo + Title */}
          <h1 className="hidden md:block text-xl font-semibold">KI-Beratung Platform</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button className="relative p-2 text-notion-text-secondary hover:text-notion-text dark:text-notion-dark-text-secondary dark:hover:text-notion-dark-text rounded-lg hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-notion-red rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-notion-blue to-notion-purple flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
                Professional Plan
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}