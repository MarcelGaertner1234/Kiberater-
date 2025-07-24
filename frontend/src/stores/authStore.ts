import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AuthState, LoginCredentials, RegisterData, User } from '@/types/auth.types'
import { apiClient } from '@/lib/api'

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  confirmPasswordReset: (token: string, password: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  clearError: () => void
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null })

          const response = await apiClient.post('/auth/login', credentials)
          const { user, token, refreshToken } = response.data

          // Set token in API client
          apiClient.setToken(token)
          
          // Store refresh token
          localStorage.setItem('refresh_token', refreshToken)

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Anmeldung fehlgeschlagen'
          })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null })

          const response = await apiClient.post('/auth/register', data)
          const { user, token, refreshToken } = response.data

          // Set token in API client
          apiClient.setToken(token)
          
          // Store refresh token
          localStorage.setItem('refresh_token', refreshToken)

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Registrierung fehlgeschlagen'
          })
          throw error
        }
      },

      logout: () => {
        // Clear API client token
        apiClient.clearToken()

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
      },

      refreshToken: async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token')
          if (!refreshToken) {
            throw new Error('Kein Refresh Token verfügbar')
          }

          const response = await apiClient.post('/auth/refresh', { refreshToken })
          const { token: newToken, refreshToken: newRefreshToken } = response.data

          // Update tokens
          apiClient.setToken(newToken)
          localStorage.setItem('refresh_token', newRefreshToken)

          set({
            token: newToken,
            error: null
          })
        } catch (error: any) {
          // Refresh failed, logout user
          get().logout()
          throw error
        }
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          set({ isLoading: true, error: null })

          const response = await apiClient.patch('/auth/profile', data)
          const updatedUser = response.data

          set({
            user: updatedUser,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Profil-Update fehlgeschlagen'
          })
          throw error
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          set({ isLoading: true, error: null })

          await apiClient.post('/auth/change-password', {
            currentPassword,
            newPassword
          })

          set({
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Passwort-Änderung fehlgeschlagen'
          })
          throw error
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null })

          await apiClient.post('/auth/reset-password', { email })

          set({
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Passwort-Reset fehlgeschlagen'
          })
          throw error
        }
      },

      confirmPasswordReset: async (token: string, password: string) => {
        try {
          set({ isLoading: true, error: null })

          await apiClient.post('/auth/reset-password/confirm', {
            token,
            password
          })

          set({
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Passwort-Reset-Bestätigung fehlgeschlagen'
          })
          throw error
        }
      },

      verifyEmail: async (token: string) => {
        try {
          set({ isLoading: true, error: null })

          const response = await apiClient.post('/auth/verify-email', { token })
          const updatedUser = response.data

          set({
            user: updatedUser,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'E-Mail-Verifizierung fehlgeschlagen'
          })
          throw error
        }
      },

      // Utility actions
      clearError: () => set({ error: null }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        if (token) {
          apiClient.setToken(token)
        } else {
          apiClient.clearToken()
        }
        set({ token, isAuthenticated: !!token })
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)