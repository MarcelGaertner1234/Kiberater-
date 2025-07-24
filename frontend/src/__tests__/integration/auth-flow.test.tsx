import { render, screen, fireEvent, waitFor } from '@/test-utils'
import { setupApiMocks, resetApiMocks, userFactory } from '@/test-utils'
import { useAuthStore } from '@/stores'
import App from '@/app/page'
import LoginPage from '@/app/login/page'
import DashboardPage from '@/app/(dashboard)/dashboard/page'

// Mock Next.js navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    resetApiMocks()
    // Clear Zustand store
    useAuthStore.getState().logout()
    jest.clearAllMocks()
  })

  describe('Complete Login Flow', () => {
    it('should login user and redirect to dashboard', async () => {
      const testUser = userFactory.build()
      
      // Setup successful login response
      require('@/test-utils').mockApiClient.post.mockImplementation((url, data) => {
        if (url === '/auth/login') {
          return Promise.resolve({
            data: {
              user: testUser,
              token: 'mock-token',
              refreshToken: 'mock-refresh-token',
              expiresAt: '2024-12-31T23:59:59Z',
            },
            message: 'Login erfolgreich',
            success: true,
          })
        }
        return Promise.resolve({ data: {}, message: 'Success', success: true })
      })

      render(<LoginPage />)

      // Fill out login form
      const emailInput = screen.getByLabelText(/e-mail/i)
      const passwordInput = screen.getByLabelText(/passwort/i)
      const submitButton = screen.getByRole('button', { name: /anmelden/i })

      fireEvent.change(emailInput, { target: { value: testUser.email } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      // Wait for login to complete
      await waitFor(() => {
        const authState = useAuthStore.getState()
        expect(authState.isAuthenticated).toBe(true)
        expect(authState.user).toEqual(testUser)
        expect(authState.token).toBe('mock-token')
      })

      // Check navigation to dashboard
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })

    it('should handle login failure gracefully', async () => {
      // Setup failed login response
      require('@/test-utils').mockApiClient.post.mockImplementation((url) => {
        if (url === '/auth/login') {
          return Promise.reject(new Error('Ungültige Anmeldedaten'))
        }
        return Promise.resolve({ data: {}, message: 'Success', success: true })
      })

      render(<LoginPage />)

      const emailInput = screen.getByLabelText(/e-mail/i)
      const passwordInput = screen.getByLabelText(/passwort/i)
      const submitButton = screen.getByRole('button', { name: /anmelden/i })

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        const authState = useAuthStore.getState()
        expect(authState.isAuthenticated).toBe(false)
        expect(authState.error).toBe('Ungültige Anmeldedaten')
      })

      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Protected Routes', () => {
    it('should redirect unauthenticated users to login', async () => {
      // Ensure user is not authenticated
      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(false)

      render(<DashboardPage />)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })

    it('should allow authenticated users to access protected routes', async () => {
      const testUser = userFactory.build()
      
      // Set user as authenticated
      useAuthStore.getState().setUser(testUser)
      useAuthStore.getState().setToken('mock-token')

      render(<DashboardPage />)

      // Should not redirect to login
      expect(mockPush).not.toHaveBeenCalledWith('/login')
      
      // Should render dashboard content
      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
      })
    })
  })

  describe('Token Refresh', () => {
    it('should refresh token automatically when expired', async () => {
      const testUser = userFactory.build()
      
      // Setup initial auth state
      useAuthStore.getState().setUser(testUser)
      useAuthStore.getState().setToken('expired-token')

      // Mock 401 response followed by successful refresh
      let callCount = 0
      require('@/test-utils').mockApiClient.get.mockImplementation((url) => {
        if (url === '/auth/profile') {
          callCount++
          if (callCount === 1) {
            // First call fails with 401
            const error = new Error('Unauthorized')
            ;(error as any).response = { status: 401 }
            return Promise.reject(error)
          } else {
            // Second call succeeds after token refresh
            return Promise.resolve({
              data: testUser,
              message: 'Success',
              success: true,
            })
          }
        }
        return Promise.resolve({ data: {}, message: 'Success', success: true })
      })

      // Mock refresh token success
      require('@/test-utils').mockApiClient.post.mockImplementation((url) => {
        if (url === '/auth/refresh') {
          return Promise.resolve({
            data: {
              token: 'new-token',
              refreshToken: 'new-refresh-token',
            },
            message: 'Token refreshed',
            success: true,
          })
        }
        return Promise.resolve({ data: {}, message: 'Success', success: true })
      })

      // Simulate API call that triggers token refresh
      const { result } = render(<DashboardPage />)

      await waitFor(() => {
        const authState = useAuthStore.getState()
        expect(authState.token).toBe('new-token')
      })
    })

    it('should logout user when refresh token fails', async () => {
      const testUser = userFactory.build()
      
      useAuthStore.getState().setUser(testUser)
      useAuthStore.getState().setToken('expired-token')

      // Mock 401 response and failed refresh
      require('@/test-utils').mockApiClient.get.mockImplementation((url) => {
        if (url === '/auth/profile') {
          const error = new Error('Unauthorized')
          ;(error as any).response = { status: 401 }
          return Promise.reject(error)
        }
        return Promise.resolve({ data: {}, message: 'Success', success: true })
      })

      require('@/test-utils').mockApiClient.post.mockImplementation((url) => {
        if (url === '/auth/refresh') {
          return Promise.reject(new Error('Refresh token expired'))
        }
        return Promise.resolve({ data: {}, message: 'Success', success: true })
      })

      render(<DashboardPage />)

      await waitFor(() => {
        const authState = useAuthStore.getState()
        expect(authState.isAuthenticated).toBe(false)
        expect(authState.user).toBe(null)
        expect(authState.token).toBe(null)
      })

      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  describe('Logout Flow', () => {
    it('should logout user and clear all data', async () => {
      const testUser = userFactory.build()
      
      // Set user as authenticated
      useAuthStore.getState().setUser(testUser)
      useAuthStore.getState().setToken('mock-token')

      render(<DashboardPage />)

      // Find and click logout button
      const logoutButton = screen.getByRole('button', { name: /abmelden/i })
      fireEvent.click(logoutButton)

      await waitFor(() => {
        const authState = useAuthStore.getState()
        expect(authState.isAuthenticated).toBe(false)
        expect(authState.user).toBe(null)
        expect(authState.token).toBe(null)
      })

      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  describe('Registration Flow', () => {
    it('should register new user and redirect to dashboard', async () => {
      const newUser = userFactory.build({
        email: 'newuser@example.com',
        name: 'New User',
      })

      // Mock successful registration
      require('@/test-utils').mockApiClient.post.mockImplementation((url, data) => {
        if (url === '/auth/register') {
          return Promise.resolve({
            data: {
              user: newUser,
              token: 'new-token',
              refreshToken: 'new-refresh-token',
              expiresAt: '2024-12-31T23:59:59Z',
            },
            message: 'Registrierung erfolgreich',
            success: true,
          })
        }
        return Promise.resolve({ data: {}, message: 'Success', success: true })
      })

      // Test would render RegisterPage and simulate form submission
      // Similar to login test but with additional fields
    })
  })

  describe('Persistence', () => {
    it('should persist auth state across page reloads', () => {
      const testUser = userFactory.build()
      
      // Simulate existing localStorage data
      const mockLocalStorage = {
        'auth-storage': JSON.stringify({
          state: {
            user: testUser,
            token: 'persisted-token',
            isAuthenticated: true,
          },
          version: 0,
        }),
      }

      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn((key) => mockLocalStorage[key]),
          setItem: jest.fn(),
          removeItem: jest.fn(),
          clear: jest.fn(),
        },
        writable: true,
      })

      // Reinitialize store to trigger persistence
      render(<App />)

      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(true)
      expect(authState.user).toEqual(testUser)
      expect(authState.token).toBe('persisted-token')
    })
  })
})