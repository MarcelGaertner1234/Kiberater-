'use client'

import { NotionSidebar } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
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
  Bell
} from 'lucide-react'

const sidebarSections = [
  {
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: <Home className="w-4 h-4" />
      },
      {
        id: 'assessment',
        label: 'KI-Assessment',
        href: '/assessment',
        icon: <Target className="w-4 h-4" />
      },
      {
        id: 'roadmap',
        label: 'Roadmap',
        href: '/roadmap',
        icon: <Map className="w-4 h-4" />
      },
      {
        id: 'projects',
        label: 'Projekte',
        href: '/projects',
        icon: <FolderOpen className="w-4 h-4" />,
        badge: 3
      }
    ]
  },
  {
    title: 'Lernen & Support',
    items: [
      {
        id: 'learning',
        label: 'Lernbereich',
        href: '/learning',
        icon: <BookOpen className="w-4 h-4" />
      },
      {
        id: 'chat',
        label: 'Berater Chat',
        href: '/chat',
        icon: <MessageCircle className="w-4 h-4" />,
        badge: 2
      },
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/analytics',
        icon: <BarChart3 className="w-4 h-4" />
      }
    ]
  },
  {
    title: 'Account',
    items: [
      {
        id: 'team',
        label: 'Team',
        href: '/team',
        icon: <Users className="w-4 h-4" />
      },
      {
        id: 'notifications',
        label: 'Benachrichtigungen',
        href: '/notifications',
        icon: <Bell className="w-4 h-4" />
      },
      {
        id: 'settings',
        label: 'Einstellungen',
        href: '/settings',
        icon: <Settings className="w-4 h-4" />
      }
    ]
  }
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const styles = useNotionStyles()

  return (
    <div className={styles.page('withSidebar')}>
      <NotionSidebar 
        sections={sidebarSections}
        className="w-64 border-r border-notion-border dark:border-notion-dark-border"
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AuthHeader />
        <main className="flex-1 overflow-y-auto bg-notion-bg dark:bg-notion-dark-bg">
          <div className="container mx-auto px-4 py-6 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function AuthHeader() {
  const styles = useNotionStyles()

  return (
    <header className={styles.topbar.base}>
      <div className={styles.topbar.content}>
        <div className="flex items-center space-x-4">
          <h1 className={styles.topbar.title}>KI-Beratung Platform</h1>
        </div>
        
        <div className="flex items-center space-x-4">
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