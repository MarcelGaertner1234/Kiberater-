'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'

// Validierung Schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Ungültige Email-Adresse')
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const styles = useNotionStyles()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    
    try {
      // API Call zum Backend
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        setError('root', { message: error.message || 'Fehler beim Senden der E-Mail' })
        return
      }

      // Erfolgreiche Anfrage
      setIsSuccess(true)
    } catch (error) {
      setError('root', { message: 'Netzwerkfehler. Bitte versuchen Sie es erneut.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={styles.page('base')}>
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-notion-bg dark:bg-notion-dark-bg">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-notion-blue to-notion-purple rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  KI
                </div>
              </Link>
              <div className="w-16 h-16 bg-notion-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-notion-green" />
              </div>
              <h1 className={styles.text('h2', 'mb-2')}>E-Mail gesendet!</h1>
              <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary')}>
                Wir haben Ihnen einen Link zum Zurücksetzen Ihres Passworts an{' '}
                <strong>{getValues('email')}</strong> gesendet.
              </p>
            </div>

            <NotionCard>
              <div className="text-center space-y-4">
                <div className="p-4 bg-notion-blue/10 rounded-lg">
                  <Mail className="w-8 h-8 text-notion-blue mx-auto mb-2" />
                  <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary')}>
                    Prüfen Sie Ihr E-Mail-Postfach und folgen Sie dem Link, um Ihr Passwort zurückzusetzen.
                  </p>
                </div>

                <div className="text-left space-y-2">
                  <p className={styles.text('small', 'text-notion-text-secondary dark:text-notion-dark-text-secondary')}>
                    <strong>E-Mail nicht erhalten?</strong>
                  </p>
                  <ul className={styles.text('small', 'text-notion-text-secondary dark:text-notion-dark-text-secondary space-y-1')}>
                    <li>• Prüfen Sie Ihren Spam-Ordner</li>
                    <li>• Die E-Mail kann bis zu 5 Minuten dauern</li>
                    <li>• Stellen Sie sicher, dass die E-Mail-Adresse korrekt ist</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <NotionButton 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => setIsSuccess(false)}
                  >
                    Erneut senden
                  </NotionButton>
                  <Link href="/login">
                    <NotionButton variant="ghost" className="w-full">
                      Zurück zur Anmeldung
                    </NotionButton>
                  </Link>
                </div>
              </div>
            </NotionCard>

            {/* Back to Homepage */}
            <div className="text-center mt-6">
              <Link 
                href="/" 
                className={styles.text('small', 'text-notion-text-secondary hover:text-notion-text dark:text-notion-dark-text-secondary dark:hover:text-notion-dark-text')}
              >
                ← Zurück zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page('base')}>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-notion-bg dark:bg-notion-dark-bg">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-notion-blue to-notion-purple rounded-lg flex items-center justify-center text-white font-bold text-xl">
                KI
              </div>
            </Link>
            <h1 className={styles.text('h2', 'mb-2')}>Passwort vergessen?</h1>
            <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary')}>
              Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen.
            </p>
          </div>

          <NotionCard>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className={styles.input.label}>E-Mail-Adresse</label>
                <input
                  {...register('email')}
                  type="email"
                  className={styles.input({ error: !!errors.email })}
                  placeholder="ihre@email.de"
                  autoComplete="email"
                  autoFocus
                />
                {errors.email && (
                  <p className={styles.input.errorText}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {errors.root && (
                <div className="p-3 rounded-lg bg-notion-red/10 border border-notion-red/20">
                  <p className={styles.text('small', 'text-notion-red')}>
                    {errors.root.message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <NotionButton
                type="submit"
                variant="primary"
                className="w-full"
                loading={isLoading}
                leftIcon={<Mail className="w-4 h-4" />}
              >
                Reset-Link senden
              </NotionButton>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link 
                href="/login" 
                className={styles.text('body', 'text-notion-text-secondary hover:text-notion-text dark:text-notion-dark-text-secondary dark:hover:text-notion-dark-text inline-flex items-center')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück zur Anmeldung
              </Link>
            </div>
          </NotionCard>

          {/* Back to Homepage */}
          <div className="text-center mt-6">
            <Link 
              href="/" 
              className={styles.text('small', 'text-notion-text-secondary hover:text-notion-text dark:text-notion-dark-text-secondary dark:hover:text-notion-dark-text')}
            >
              ← Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}