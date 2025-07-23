import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ThemeToggle } from '@/components/ui'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Authentifizierung | KI-Beratungsplattform',
  description: 'Melden Sie sich an oder registrieren Sie sich für die KI-Beratungsplattform',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-notion-bg dark:bg-notion-dark-bg">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <Link 
          href="/" 
          className="text-notion-text dark:text-notion-dark-text font-semibold text-lg hover:opacity-80 transition-opacity duration-notion"
        >
          KI-Beratungsplattform
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary text-sm">
          © 2024 KI-Beratungsplattform. Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  )
}