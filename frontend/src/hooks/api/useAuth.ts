import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore, toast } from '@/stores'
import { LoginCredentials, RegisterData, User } from '@/types/auth.types'
import { apiClient } from '@/lib/api'

export const useAuth = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: loginStore,
    register: registerStore,
    logout: logoutStore,
    refreshToken: refreshTokenStore,
    updateProfile: updateProfileStore,
    changePassword: changePasswordStore,
    resetPassword: resetPasswordStore,
    confirmPasswordReset: confirmPasswordResetStore,
    verifyEmail: verifyEmailStore,
    clearError,
    setLoading,
    setError
  } = useAuthStore()

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      await loginStore(credentials)
    },
    onSuccess: () => {
      toast.success('Erfolgreich angemeldet', 'Willkommen zurück!')
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.push('/dashboard')
    },
    onError: (error: any) => {
      toast.error('Anmeldung fehlgeschlagen', error.message)
    }
  })

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      await registerStore(data)
    },
    onSuccess: () => {
      toast.success('Registrierung erfolgreich', 'Ihr Konto wurde erstellt!')
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.push('/dashboard')
    },
    onError: (error: any) => {
      toast.error('Registrierung fehlgeschlagen', error.message)
    }
  })

  // Logout
  const logout = () => {
    logoutStore()
    queryClient.clear()
    toast.info('Erfolgreich abgemeldet', 'Auf Wiedersehen!')
    router.push('/')
  }

  // Profile Update Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      await updateProfileStore(data)
    },
    onSuccess: () => {
      toast.success('Profil aktualisiert', 'Ihre Änderungen wurden gespeichert')
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error: any) => {
      toast.error('Profil-Update fehlgeschlagen', error.message)
    }
  })

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      await changePasswordStore(currentPassword, newPassword)
    },
    onSuccess: () => {
      toast.success('Passwort geändert', 'Ihr Passwort wurde erfolgreich aktualisiert')
    },
    onError: (error: any) => {
      toast.error('Passwort-Änderung fehlgeschlagen', error.message)
    }
  })

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      await resetPasswordStore(email)
    },
    onSuccess: () => {
      toast.success('E-Mail versendet', 'Prüfen Sie Ihr Postfach für weitere Anweisungen')
    },
    onError: (error: any) => {
      toast.error('Passwort-Reset fehlgeschlagen', error.message)
    }
  })

  // Confirm Password Reset Mutation
  const confirmPasswordResetMutation = useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      await confirmPasswordResetStore(token, password)
    },
    onSuccess: () => {
      toast.success('Passwort zurückgesetzt', 'Sie können sich jetzt mit Ihrem neuen Passwort anmelden')
      router.push('/login')
    },
    onError: (error: any) => {
      toast.error('Passwort-Reset fehlgeschlagen', error.message)
    }
  })

  // Verify Email Mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async (token: string) => {
      await verifyEmailStore(token)
    },
    onSuccess: () => {
      toast.success('E-Mail verifiziert', 'Ihr E-Mail-Adresse wurde erfolgreich bestätigt')
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error: any) => {
      toast.error('E-Mail-Verifizierung fehlgeschlagen', error.message)
    }
  })

  // Refresh Token
  const refreshToken = async () => {
    try {
      await refreshTokenStore()
    } catch (error) {
      // Refresh failed, user will be logged out automatically
      toast.error('Sitzung abgelaufen', 'Bitte melden Sie sich erneut an')
      router.push('/login')
    }
  }

  // Check Authentication Status
  const checkAuth = useQuery({
    queryKey: ['auth', 'check'],
    queryFn: async () => {
      if (!token) return null
      
      try {
        const response = await apiClient.get('/auth/me')
        return response.data
      } catch (error) {
        // Token is invalid, clear auth
        logoutStore()
        throw error
      }
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  // Get User Profile
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/profile')
      return response.data
    },
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    error,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    confirmPasswordReset: confirmPasswordResetMutation.mutate,
    verifyEmail: verifyEmailMutation.mutate,
    refreshToken,
    clearError,

    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isConfirmingPasswordReset: confirmPasswordResetMutation.isPending,
    isVerifyingEmail: verifyEmailMutation.isPending,

    // Query states
    isCheckingAuth: checkAuth.isLoading,
    isLoadingUser: userQuery.isLoading,

    // Helpers
    hasRole: (role: string) => user?.role === role,
    isAdmin: () => user?.role === 'ADMIN',
    isConsultant: () => user?.role === 'CONSULTANT',
    canAccess: (permission: string) => {
      // Simple permission check - can be extended
      if (user?.role === 'ADMIN') return true
      if (user?.role === 'CONSULTANT' && ['view_analytics', 'manage_content'].includes(permission)) return true
      return false
    }
  }
}