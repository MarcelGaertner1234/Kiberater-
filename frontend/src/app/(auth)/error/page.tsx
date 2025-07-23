'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { AlertCircle, ArrowLeft } from 'lucide-react'

const errorMessages: Record<string, string> = {
  Configuration: 'Es gibt ein Problem mit der Server-Konfiguration.',
  AccessDenied: 'Sie haben keine Berechtigung, auf diese Ressource zuzugreifen.',
  Verification: 'Das Verifizierungs-Token ist abgelaufen oder wurde bereits verwendet.',
  Default: 'Ein unbekannter Fehler ist aufgetreten.',
  OAuthSignin: 'Fehler beim Initialisieren der OAuth-Anmeldung.',
  OAuthCallback: 'Fehler beim Verarbeiten der OAuth-Antwort.',
  OAuthCreateAccount: 'Das OAuth-Konto konnte nicht erstellt werden.',
  EmailCreateAccount: 'Das E-Mail-Konto konnte nicht erstellt werden.',
  Callback: 'Fehler beim Verarbeiten der Anmeldung.',
  OAuthAccountNotLinked: 'Um die Sicherheit zu gewährleisten, verwenden Sie den gleichen Anbieter, mit dem Sie sich ursprünglich angemeldet haben.',
  EmailSignin: 'Die E-Mail konnte nicht gesendet werden.',
  CredentialsSignin: 'Die Anmeldung ist fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.',
  SessionRequired: 'Eine Anmeldung ist erforderlich, um auf diese Seite zuzugreifen.',
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const styles = useNotionStyles()

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h1 className={styles.text('h1')}>Authentifizierungsfehler</h1>
        <p className={styles.text('body')}>
          Beim Anmelden ist ein Problem aufgetreten
        </p>
      </div>

      <NotionCard padding="lg" className="space-y-4">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
            Fehlerdetails
          </h3>
          <p className="text-red-700 dark:text-red-300 text-sm">
            {errorMessage}
          </p>
          {error && (
            <p className="text-red-600 dark:text-red-400 text-xs mt-2 font-mono">
              Error Code: {error}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <h4 className={styles.text('h4')}>Was können Sie tun?</h4>
          <ul className="space-y-2 text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
            <li>• Versuchen Sie sich erneut anzumelden</li>
            <li>• Überprüfen Sie Ihre E-Mail-Adresse und Ihr Passwort</li>
            <li>• Verwenden Sie den gleichen Anbieter wie bei der Registrierung</li>
            <li>• Kontaktieren Sie den Support, falls das Problem weiterhin besteht</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <NotionButton
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => window.location.href = '/auth/login'}
          >
            Erneut anmelden
          </NotionButton>
          <NotionButton
            variant="secondary"
            size="lg"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="flex-1"
            onClick={() => window.location.href = '/'}
          >
            Zur Startseite
          </NotionButton>
        </div>
      </NotionCard>

      <div className="text-center">
        <p className={styles.text('body')}>
          Brauchen Sie Hilfe?{' '}
          <Link
            href="/support"
            className="text-notion-blue hover:underline font-medium"
          >
            Kontaktieren Sie unseren Support
          </Link>
        </p>
      </div>
    </div>
  )
}