import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LoginPage from '@/app/(auth)/login/page'
import { signIn } from 'next-auth/react'

// Mock dependencies
jest.mock('next-auth/react')
jest.mock('next/navigation')
jest.mock('@/hooks/useNotionStyles', () => ({
  useNotionStyles: () => ({
    text: (variant: string) => `text-${variant}`,
    input: (options?: any) => `input ${options?.error ? 'error' : ''}`,
    button: (options?: any) => `button ${options?.variant || 'primary'}`,
  }),
}))

const mockPush = jest.fn()
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  })
  mockSignIn.mockResolvedValue({ ok: true })
})

afterEach(() => {
  jest.clearAllMocks()
})

const renderLoginPage = () => {
  return render(
    <SessionProvider session={null}>
      <LoginPage />
    </SessionProvider>
  )
}

describe('LoginPage', () => {
  it('renders login form', () => {
    renderLoginPage()
    
    expect(screen.getByText('Willkommen zurück')).toBeInTheDocument()
    expect(screen.getByLabelText('E-Mail-Adresse')).toBeInTheDocument()
    expect(screen.getByLabelText('Passwort')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /anmelden/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    renderLoginPage()
    
    const submitButton = screen.getByRole('button', { name: /anmelden/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Bitte geben Sie eine gültige E-Mail-Adresse ein')).toBeInTheDocument()
      expect(screen.getByText('Passwort ist erforderlich')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    renderLoginPage()
    
    const emailInput = screen.getByLabelText('E-Mail-Adresse')
    const passwordInput = screen.getByLabelText('Passwort')
    const submitButton = screen.getByRole('button', { name: /anmelden/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      })
    })
  })

  it('handles login error', async () => {
    mockSignIn.mockResolvedValue({ ok: false, error: 'CredentialsSignin' })
    renderLoginPage()
    
    const emailInput = screen.getByLabelText('E-Mail-Adresse')
    const passwordInput = screen.getByLabelText('Passwort')
    const submitButton = screen.getByRole('button', { name: /anmelden/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Ungültige E-Mail oder Passwort')).toBeInTheDocument()
    })
  })

  it('redirects to dashboard on successful login', async () => {
    mockSignIn.mockResolvedValue({ ok: true })
    renderLoginPage()
    
    const emailInput = screen.getByLabelText('E-Mail-Adresse')
    const passwordInput = screen.getByLabelText('Passwort')
    const submitButton = screen.getByRole('button', { name: /anmelden/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('calls Google sign-in when Google button is clicked', async () => {
    renderLoginPage()
    
    const googleButton = screen.getByRole('button', { name: /mit google fortfahren/i })
    fireEvent.click(googleButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('google', { callbackUrl: '/dashboard' })
    })
  })

  it('contains link to register page', () => {
    renderLoginPage()
    
    const registerLink = screen.getByRole('link', { name: /jetzt registrieren/i })
    expect(registerLink).toHaveAttribute('href', '/auth/register')
  })

  it('contains forgot password link', () => {
    renderLoginPage()
    
    const forgotPasswordLink = screen.getByRole('link', { name: /passwort vergessen/i })
    expect(forgotPasswordLink).toHaveAttribute('href', '/auth/forgot-password')
  })
})