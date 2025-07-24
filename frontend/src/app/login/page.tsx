'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'

export default function LoginPage() {
  const router = useRouter()
  const styles = useNotionStyles()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Implement actual login
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className={styles.page('centered')}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Willkommen zurück</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Melden Sie sich an, um fortzufahren
          </p>
        </div>

        <NotionCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">E-Mail</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ihre@email.de"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Passwort</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Angemeldet bleiben</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Passwort vergessen?
              </Link>
            </div>

            <NotionButton
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
            >
              Anmelden
            </NotionButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Noch kein Konto?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Jetzt registrieren
              </Link>
            </p>
          </div>
        </NotionCard>
      </div>
    </div>
  )
}