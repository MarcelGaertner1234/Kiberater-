'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
})

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    setIsLoading(status === 'loading')
  }, [status])

  // Sync NextAuth session with Supabase if needed
  useEffect(() => {
    if (session?.user && !isLoading) {
      // You can sync user data with Supabase here if needed
      // For example, update last_seen or sync profile data
    }
  }, [session, isLoading])

  const value = {
    user: session?.user || null,
    isLoading,
    isAuthenticated: !!session?.user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}