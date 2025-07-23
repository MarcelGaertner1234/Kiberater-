'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      if (result?.ok) {
        router.push('/dashboard')
        return { success: true }
      } else {
        return { 
          success: false, 
          error: result?.error || 'Login fehlgeschlagen' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Ein unerwarteter Fehler ist aufgetreten' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true)
      await signIn('google', { callbackUrl: '/dashboard' })
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: 'Google-Anmeldung fehlgeschlagen' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    companyName?: string
    companySize?: string
    industry?: string
  }) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      
      if (response.ok) {
        // Auto-login after successful registration
        const loginResult = await login(userData.email, userData.password)
        return loginResult
      } else {
        const errorData = await response.json()
        return { 
          success: false, 
          error: errorData.message || 'Registrierung fehlgeschlagen' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Ein unerwarteter Fehler ist aufgetreten' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    // Session data
    user: session?.user || null,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading' || isLoading,
    
    // Auth methods
    login,
    loginWithGoogle,
    logout,
    register,
    
    // Utility methods
    hasRole: (role: string) => session?.user?.role === role,
    isAdmin: () => session?.user?.role === 'admin',
    isAdvisor: () => session?.user?.role === 'advisor',
  }
}