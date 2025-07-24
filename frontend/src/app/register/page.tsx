'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { setAuthToken } from '@/lib/api'
import { Eye, EyeOff, Github, Chrome, CheckCircle } from 'lucide-react'

// Validierung Schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Ungültige Email-Adresse'),
  password: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen haben')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten'),
  company: z.string().optional(),
  terms: z.boolean().refine(val => val === true, {
    message: 'Sie müssen den Nutzungsbedingungen zustimmen'
  }),
  marketing: z.boolean().optional()
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const styles = useNotionStyles()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    
    try {
      // API Call zum Backend
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        setError('root', { message: error.message || 'Registrierung fehlgeschlagen' })
        return
      }

      const result = await response.json()
      
      // Erfolgreiche Registrierung - automatisch anmelden
      setAuthToken(result.token, false)
      router.push('/dashboard')
    } catch (error) {
      setError('root', { message: 'Netzwerkfehler. Bitte versuchen Sie es erneut.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialRegister = (provider: string) => {
    // Social Registration Implementation
    console.log(`Register with ${provider}`)
    // TODO: Implementierung für Social Auth (NextAuth.js oder ähnliches)
  }

  const watchPassword = watch('password', '')

  // Password Strength Indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(watchPassword)

  const getStrengthColor = (strength: number) => {
    if (strength < 3) return 'bg-notion-red'
    if (strength < 4) return 'bg-notion-yellow'
    return 'bg-notion-green'
  }

  const getStrengthText = (strength: number) => {
    if (strength < 3) return 'Schwach'
    if (strength < 4) return 'Mittel'
    return 'Stark'
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
            <h1 className={styles.text('h2', 'mb-2')}>Konto erstellen</h1>
            <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary')}>
              Starten Sie Ihre KI-Transformation noch heute
            </p>
          </div>

          <NotionCard>
            {/* Social Registration Buttons */}
            <div className="space-y-3 mb-6">
              <NotionButton 
                variant="secondary" 
                className="w-full" 
                leftIcon={<Chrome className="w-5 h-5" />}
                onClick={() => handleSocialRegister('google')}
              >
                Mit Google registrieren
              </NotionButton>
              <NotionButton 
                variant="secondary" 
                className="w-full" 
                leftIcon={<Github className="w-5 h-5" />}
                onClick={() => handleSocialRegister('github')}
              >
                Mit GitHub registrieren
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className={styles.input.label}>Vollständiger Name</label>
                <input
                  {...register('name')}
                  type="text"
                  className={styles.input({ error: !!errors.name })}
                  placeholder="Max Mustermann"
                  autoComplete="name"
                />
                {errors.name && (
                  <p className={styles.input.errorText}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className={styles.input.label}>E-Mail-Adresse</label>
                <input
                  {...register('email')}
                  type="email"
                  className={styles.input({ error: !!errors.email })}
                  placeholder="max@unternehmen.de"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className={styles.input.errorText}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Company Field (Optional) */}
              <div>
                <label className={styles.input.label}>
                  Unternehmen 
                  <span className={styles.text('small', 'text-notion-text-secondary ml-1')}>(optional)</span>
                </label>
                <input
                  {...register('company')}
                  type="text"
                  className={styles.input()}
                  placeholder="Ihr Unternehmen GmbH"
                  autoComplete="organization"
                />
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
                    autoComplete="new-password"
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
                
                {/* Password Strength Indicator */}
                {watchPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className={styles.text('small', 'text-notion-text-secondary')}>
                        Passwort-Stärke:
                      </span>
                      <span className={styles.text('small', passwordStrength >= 3 ? 'text-notion-green' : passwordStrength >= 2 ? 'text-notion-yellow' : 'text-notion-red')}>
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="w-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full h-2">
                      <div 
                        className={`${getStrengthColor(passwordStrength)} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className={styles.input.errorText}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Terms & Conditions Checkbox */}
              <div>
                <label className="flex items-start">
                  <input
                    {...register('terms')}
                    type="checkbox"
                    className={styles.checkbox.base + ' mt-1'}
                  />
                  <span className={styles.checkbox.label + ' ml-2'}>
                    Ich akzeptiere die{' '}
                    <Link href="/terms" className="text-notion-blue hover:underline">
                      Nutzungsbedingungen
                    </Link>
                    {' '}und{' '}
                    <Link href="/privacy" className="text-notion-blue hover:underline">
                      Datenschutzerklärung
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className={styles.input.errorText}>
                    {errors.terms.message}
                  </p>
                )}
              </div>

              {/* Marketing Checkbox (Optional) */}
              <div>
                <label className="flex items-start">
                  <input
                    {...register('marketing')}
                    type="checkbox"
                    className={styles.checkbox.base + ' mt-1'}
                  />
                  <span className={styles.checkbox.label + ' ml-2'}>
                    Ich möchte gelegentlich Updates und Tipps zur KI-Transformation erhalten
                    <span className={styles.text('small', 'text-notion-text-secondary block mt-1')}>
                      (optional, jederzeit kündbar)
                    </span>
                  </span>
                </label>
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
                Konto erstellen
              </NotionButton>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary')}>
                Bereits ein Konto?{' '}
                <Link href="/login" className={styles.text('body', 'text-notion-blue hover:underline font-medium')}>
                  Jetzt anmelden
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