'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { Mail, Lock, User, Building, ArrowRight, Chrome } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
const registerSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  password: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen haben')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Passwort muss Klein-, Großbuchstaben und Zahlen enthalten'),
  confirmPassword: z.string(),
  companyName: z.string().optional(),
  companySize: z.enum(['freelancer', 'startup', 'small', 'medium', 'large']).optional(),
  industry: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Sie müssen die Nutzungsbedingungen akzeptieren'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

const companySizeOptions = [
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'startup', label: 'Startup (1-10 Mitarbeiter)' },
  { value: 'small', label: 'Kleines Unternehmen (11-50 Mitarbeiter)' },
  { value: 'medium', label: 'Mittleres Unternehmen (51-250 Mitarbeiter)' },
  { value: 'large', label: 'Großunternehmen (250+ Mitarbeiter)' },
]

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const styles = useNotionStyles()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      // Create user (password will be hashed on server)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password, // Send plain password, will be hashed on server
          companyName: data.companyName,
          companySize: data.companySize,
          industry: data.industry,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registrierung fehlgeschlagen')
      }

      // Sign in user
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Registrierung erfolgreich, aber Anmeldung fehlgeschlagen')
      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      setError(error.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true)
      setError(null)
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      setError('Google-Registrierung fehlgeschlagen')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className={styles.text('h1')}>Konto erstellen</h1>
        <p className={styles.text('body')}>
          Starten Sie Ihre KI-Beratung heute
        </p>
      </div>

      <NotionCard padding="lg" className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className={styles.text('label')} htmlFor="name">
              Vollständiger Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-notion-text-secondary dark:text-notion-dark-text-secondary" />
              <input
                {...register('name')}
                type="text"
                id="name"
                className={`${styles.input({ error: !!errors.name })} pl-10`}
                placeholder="Max Mustermann"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className={styles.text('label')} htmlFor="email">
              E-Mail-Adresse *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-notion-text-secondary dark:text-notion-dark-text-secondary" />
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`${styles.input({ error: !!errors.email })} pl-10`}
                placeholder="ihre@email.de"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className={styles.text('label')} htmlFor="password">
              Passwort *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-notion-text-secondary dark:text-notion-dark-text-secondary" />
              <input
                {...register('password')}
                type="password"
                id="password"
                className={`${styles.input({ error: !!errors.password })} pl-10`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className={styles.text('label')} htmlFor="confirmPassword">
              Passwort bestätigen *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-notion-text-secondary dark:text-notion-dark-text-secondary" />
              <input
                {...register('confirmPassword')}
                type="password"
                id="confirmPassword"
                className={`${styles.input({ error: !!errors.confirmPassword })} pl-10`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <label className={styles.text('label')} htmlFor="companyName">
              Unternehmensname (optional)
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-notion-text-secondary dark:text-notion-dark-text-secondary" />
              <input
                {...register('companyName')}
                type="text"
                id="companyName"
                className={`${styles.input()} pl-10`}
                placeholder="Ihr Unternehmen"
              />
            </div>
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <label className={styles.text('label')} htmlFor="companySize">
              Unternehmensgröße (optional)
            </label>
            <select
              {...register('companySize')}
              id="companySize"
              className={styles.input()}
            >
              <option value="">Bitte wählen</option>
              {companySizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <label className={styles.text('label')} htmlFor="industry">
              Branche (optional)
            </label>
            <input
              {...register('industry')}
              type="text"
              id="industry"
              className={styles.input()}
              placeholder="z.B. IT, Einzelhandel, Beratung"
            />
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-3">
            <input
              {...register('acceptTerms')}
              type="checkbox"
              id="acceptTerms"
              className="mt-1 h-4 w-4 text-notion-blue focus:ring-notion-blue border-notion-border dark:border-notion-dark-border rounded"
            />
            <label className={styles.text('body')} htmlFor="acceptTerms">
              Ich akzeptiere die{' '}
              <Link href="/legal/terms" className="text-notion-blue hover:underline">
                Nutzungsbedingungen
              </Link>{' '}
              und{' '}
              <Link href="/legal/privacy" className="text-notion-blue hover:underline">
                Datenschutzerklärung
              </Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
          )}

          <NotionButton
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full"
          >
            Konto erstellen
          </NotionButton>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-notion-border dark:border-notion-dark-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-notion-bg dark:bg-notion-dark-bg text-notion-text-secondary dark:text-notion-dark-text-secondary">
              oder
            </span>
          </div>
        </div>

        <NotionButton
          variant="secondary"
          size="lg"
          loading={googleLoading}
          leftIcon={<Chrome className="h-4 w-4" />}
          onClick={handleGoogleRegister}
          className="w-full"
        >
          Mit Google registrieren
        </NotionButton>
      </NotionCard>

      <div className="text-center">
        <p className={styles.text('body')}>
          Bereits ein Konto?{' '}
          <Link
            href="/auth/login"
            className="text-notion-blue hover:underline font-medium"
          >
            Jetzt anmelden
          </Link>
        </p>
      </div>
    </div>
  )
}