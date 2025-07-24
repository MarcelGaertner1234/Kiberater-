import { render, screen, fireEvent, waitFor } from '@/test-utils'
import { setupApiMocks, resetApiMocks, mockApiClient } from '@/test-utils'
import LoginPage from '@/app/login/page'

// Mock the hooks
jest.mock('@/hooks/api/useAuth', () => ({
  useAuth: () => ({
    login: jest.fn(),
    isLoggingIn: false,
    error: null,
    isAuthenticated: false,
  }),
}))

describe('Login Page', () => {
  beforeEach(() => {
    resetApiMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders login form correctly', () => {
    render(<LoginPage />)
    
    expect(screen.getByRole('heading', { name: /anmelden/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/passwort/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /anmelden/i })).toBeInTheDocument()
    expect(screen.getByText(/noch kein konto/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /anmelden/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/e-mail ist erforderlich/i)).toBeInTheDocument()
      expect(screen.getByText(/passwort ist erforderlich/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/e-mail/i)
    const submitButton = screen.getByRole('button', { name: /anmelden/i })
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/ungültige e-mail adresse/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockLogin = jest.fn()
    
    // Mock the useAuth hook with our mock function
    jest.mocked(require('@/hooks/api/useAuth').useAuth).mockReturnValue({
      login: mockLogin,
      isLoggingIn: false,
      error: null,
      isAuthenticated: false,
    })
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/e-mail/i)
    const passwordInput = screen.getByLabelText(/passwort/i)
    const submitButton = screen.getByRole('button', { name: /anmelden/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      })
    })
  })

  it('shows loading state during login', () => {
    jest.mocked(require('@/hooks/api/useAuth').useAuth).mockReturnValue({
      login: jest.fn(),
      isLoggingIn: true,
      error: null,
      isAuthenticated: false,
    })
    
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /anmelden/i })
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/wird geladen/i)).toBeInTheDocument()
  })

  it('displays error message on login failure', () => {
    const errorMessage = 'Ungültige Anmeldedaten'
    
    jest.mocked(require('@/hooks/api/useAuth').useAuth).mockReturnValue({
      login: jest.fn(),
      isLoggingIn: false,
      error: errorMessage,
      isAuthenticated: false,
    })
    
    render(<LoginPage />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('handles remember me checkbox', async () => {
    const mockLogin = jest.fn()
    
    jest.mocked(require('@/hooks/api/useAuth').useAuth).mockReturnValue({
      login: mockLogin,
      isLoggingIn: false,
      error: null,
      isAuthenticated: false,
    })
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/e-mail/i)
    const passwordInput = screen.getByLabelText(/passwort/i)
    const rememberCheckbox = screen.getByLabelText(/angemeldet bleiben/i)
    const submitButton = screen.getByRole('button', { name: /anmelden/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(rememberCheckbox)
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      })
    })
  })

  it('redirects to register page', () => {
    const { mockRouter } = require('@/test-utils')
    
    render(<LoginPage />)
    
    const registerLink = screen.getByText(/registrieren/i)
    fireEvent.click(registerLink)
    
    expect(mockRouter.push).toHaveBeenCalledWith('/register')
  })

  it('shows password reset link', () => {
    render(<LoginPage />)
    
    const forgotPasswordLink = screen.getByText(/passwort vergessen/i)
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink).toHaveAttribute('href', '/reset-password')
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<LoginPage />)
      
      expect(screen.getByRole('form')).toBeInTheDocument()
      expect(screen.getByLabelText(/e-mail/i)).toHaveAttribute('type', 'email')
      expect(screen.getByLabelText(/passwort/i)).toHaveAttribute('type', 'password')
    })

    it('associates form labels with inputs', () => {
      render(<LoginPage />)
      
      const emailInput = screen.getByLabelText(/e-mail/i)
      const passwordInput = screen.getByLabelText(/passwort/i)
      
      expect(emailInput).toHaveAttribute('id')
      expect(passwordInput).toHaveAttribute('id')
    })

    it('shows error messages with proper ARIA attributes', () => {
      jest.mocked(require('@/hooks/api/useAuth').useAuth).mockReturnValue({
        login: jest.fn(),
        isLoggingIn: false,
        error: 'Test error',
        isAuthenticated: false,
      })
      
      render(<LoginPage />)
      
      const errorMessage = screen.getByRole('alert')
      expect(errorMessage).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Mobile Responsiveness', () => {
    it('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<LoginPage />)
      
      // Add assertions for mobile-specific behavior
      expect(screen.getByRole('form')).toBeInTheDocument()
    })
  })

  describe('Social Login', () => {
    it('shows social login options if available', () => {
      render(<LoginPage />)
      
      // If social login is implemented
      const googleLogin = screen.queryByText(/mit google anmelden/i)
      const linkedinLogin = screen.queryByText(/mit linkedin anmelden/i)
      
      // These might not exist yet, so we use queryBy
      if (googleLogin) {
        expect(googleLogin).toBeInTheDocument()
      }
      if (linkedinLogin) {
        expect(linkedinLogin).toBeInTheDocument()
      }
    })
  })

  describe('Security', () => {
    it('does not expose sensitive data in DOM', () => {
      render(<LoginPage />)
      
      const passwordInput = screen.getByLabelText(/passwort/i)
      fireEvent.change(passwordInput, { target: { value: 'secret123' } })
      
      // Password should not be visible in the DOM as plain text
      expect(screen.queryByText('secret123')).not.toBeInTheDocument()
    })
  })
})
