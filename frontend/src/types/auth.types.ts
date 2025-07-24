import { User } from './api.types'

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  name: string
  firstName?: string
  lastName?: string
  company?: string
  acceptTerms: boolean
  newsletter?: boolean
}

export interface Session {
  user: User
  token: string
  refreshToken: string
  expiresAt: Date
  lastActivity: Date
}

export interface AuthError {
  code: string
  message: string
  field?: string
}

export interface PasswordReset {
  email: string
}

export interface PasswordResetConfirmation {
  token: string
  password: string
  confirmPassword: string
}

export interface EmailVerification {
  token: string
}

export interface ProfileUpdate {
  name?: string
  firstName?: string
  lastName?: string
  avatar?: string
  preferences?: Partial<User['preferences']>
}

export interface PasswordChange {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}