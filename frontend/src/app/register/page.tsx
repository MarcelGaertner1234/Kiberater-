'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'

export default function RegisterPage() {
  const router = useRouter()
  const styles = useNotionStyles()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Implement actual registration
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className={styles.page('centered')}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Konto erstellen</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Starten Sie Ihre KI-Reise noch heute
          </p>
        </div>

        <NotionCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max Mustermann"
                required
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium mb-1">Passwort bestätigen</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start">
              <input type="checkbox" className="mr-2 mt-1" required />
              <span className="text-sm">
                Ich stimme den{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Nutzungsbedingungen
                </Link>{' '}
                und der{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Datenschutzerklärung
                </Link>{' '}
                zu
              </span>
            </div>

            <NotionButton
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
            >
              Registrieren
            </NotionButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Bereits registriert?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Jetzt anmelden
              </Link>
            </p>
          </div>
        </NotionCard>
      </div>
    </div>
  )
}