'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { useApiMutation, setAuthToken } from '@/lib/api'
import { Eye, EyeOff, Github, Chrome } from 'lucide-react'

// Validierung Schema
const loginSchema = z.object({
  email: z.string().email('Ungültige Email-Adresse'),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen haben'),
  rememberMe: z.boolean().optional()
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const styles = useNotionStyles()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      // API Call zum Backend
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        setError('root', { message: error.message || 'Anmeldung fehlgeschlagen' })
        return
      }

      const result = await response.json()
      
      // Erfolgreiche Anmeldung
      setAuthToken(result.token, data.rememberMe || false)
      router.push('/dashboard')
    } catch (error) {
      setError('root', { message: 'Netzwerkfehler. Bitte versuchen Sie es erneut.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    // Social Login Implementation
    console.log(`Login with ${provider}`)
    // TODO: Implementierung für Social Auth (NextAuth.js oder ähnliches)
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
            <h1 className={styles.text('h2', 'mb-2')}>Willkommen zurück</h1>
            <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary')}>
              Melden Sie sich an, um fortzufahren
            </p>
          </div>

          <NotionCard>
            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <NotionButton 
                variant="secondary" 
                className="w-full" 
                leftIcon={<Chrome className="w-5 h-5" />}
                onClick={() => handleSocialLogin('google')}
              >
                Mit Google anmelden
              </NotionButton>
              <NotionButton 
                variant="secondary" 
                className="w-full" 
                leftIcon={<Github className="w-5 h-5" />}
                onClick={() => handleSocialLogin('github')}
              >
                Mit GitHub anmelden
              </NotionButton>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-notion-border dark:border-notion-dark-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={styles.text('small', 'bg-white dark:bg-notion-dark-bg px-2 text-notion-text-secondary dark:text-notion-dark-text-secondary')}>
                  oder mit E-Mail
                </span>
              </div>
            </div>

            {/* Login Form */}
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
                />
                {errors.email && (
                  <p className={styles.input.errorText}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className={styles.input.label}>Passwort</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className={styles.input({ error: !!errors.password }) + ' pr-10'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-notion-text-secondary" />
                    ) : (
                      <Eye className="h-4 w-4 text-notion-text-secondary" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className={styles.input.errorText}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className={styles.checkbox.base}
                  />
                  <span className={styles.checkbox.label}>
                    Angemeldet bleiben
                  </span>
                </label>
                <Link 
                  href="/auth/forgot-password" 
                  className={styles.text('small', 'text-notion-blue hover:underline')}
                >
                  Passwort vergessen?
                </Link>
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
              >
                Anmelden
              </NotionButton>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary')}>
                Noch kein Konto?{' '}
                <Link href="/register" className={styles.text('body', 'text-notion-blue hover:underline font-medium')}>
                  Jetzt registrieren
                </Link>
              </p>
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