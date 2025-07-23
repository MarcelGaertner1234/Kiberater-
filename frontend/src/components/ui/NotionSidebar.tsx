'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/design-system'
import { useNotionStyles } from '@/hooks/useNotionStyles'

interface SidebarItem {
  id: string
  label: string
  href: string
  icon?: React.ReactNode
  badge?: number
}

interface SidebarSection {
  title?: string
  items: SidebarItem[]
}

interface NotionSidebarProps {
  sections: SidebarSection[]
  className?: string
}

export function NotionSidebar({ sections, className }: NotionSidebarProps) {
  const pathname = usePathname()
  const styles = useNotionStyles()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(styles.sidebar.base, collapsed && 'w-16', className)}>
      <div className="flex h-full flex-col">
        {/* Logo/Brand area */}
        <div className="flex h-14 items-center border-b border-notion-border px-4 dark:border-notion-dark-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-notion-text-secondary hover:text-notion-text dark:text-notion-dark-text-secondary dark:hover:text-notion-dark-text"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={collapsed ? 'M13 5l7 7-7 7' : 'M11 19l-7-7 7-7'}
              />
            </svg>
          </button>
          {!collapsed && (
            <span className="ml-3 text-notion-lg font-semibold">KI Platform</span>
          )}
        </div>

        {/* Navigation sections */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {section.title && !collapsed && (
                <div className={styles.sidebar.section}>{section.title}</div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={styles.sidebar.item(isActive)}
                    >
                      {item.icon && (
                        <span className={cn(styles.sidebar.icon, collapsed && 'mr-0')}>
                          {item.icon}
                        </span>
                      )}
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className={styles.badge('primary')}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  )
                })}
              </div>
              {sectionIdx < sections.length - 1 && (
                <div className={styles.sidebar.divider} />
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}