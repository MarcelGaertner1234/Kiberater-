'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { Mail, Lock, ArrowRight, Chrome } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const styles = useNotionStyles()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const handleEmailLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Ungültige E-Mail oder Passwort')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true)
      setError(null)
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      setError('Google-Anmeldung fehlgeschlagen')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className={styles.text('h1')}>Willkommen zurück</h1>
        <p className={styles.text('body')}>Melden Sie sich bei Ihrem Konto an</p>
      </div>

      <NotionCard padding="lg" className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-4">
          <div className="space-y-2">
            <label className={styles.text('label')} htmlFor="email">
              E-Mail-Adresse
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
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className={styles.text('label')} htmlFor="password">
              Passwort
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
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <Link href="/auth/forgot-password" className="text-notion-blue hover:underline text-sm">
              Passwort vergessen?
            </Link>
          </div>

          <NotionButton
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full"
          >
            Anmelden
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
          onClick={handleGoogleLogin}
          className="w-full"
        >
          Mit Google fortfahren
        </NotionButton>
      </NotionCard>

      <div className="text-center">
        <p className={styles.text('body')}>
          Noch kein Konto?{' '}
          <Link href="/auth/register" className="text-notion-blue hover:underline font-medium">
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  )
}
