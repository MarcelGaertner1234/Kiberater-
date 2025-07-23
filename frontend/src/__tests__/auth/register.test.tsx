import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import RegisterPage from '@/app/(auth)/register/page'
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

// Mock fetch
global.fetch = jest.fn()

const mockPush = jest.fn()
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

beforeEach(() => {
  ;(useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  })
  mockSignIn.mockResolvedValue({ ok: true })
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ message: 'User created successfully' }),
  } as Response)
})

afterEach(() => {
  jest.clearAllMocks()
})

const renderRegisterPage = () => {
  return render(
    <SessionProvider session={null}>
      <RegisterPage />
    </SessionProvider>
  )
}

describe('RegisterPage', () => {
  it('renders registration form', () => {
    renderRegisterPage()

    expect(screen.getByText('Konto erstellen')).toBeInTheDocument()
    expect(screen.getByLabelText('Vollständiger Name *')).toBeInTheDocument()
    expect(screen.getByLabelText('E-Mail-Adresse *')).toBeInTheDocument()
    expect(screen.getByLabelText('Passwort *')).toBeInTheDocument()
    expect(screen.getByLabelText('Passwort bestätigen *')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /konto erstellen/i })).toBeInTheDocument()
  })

  it('shows validation errors for invalid inputs', async () => {
    renderRegisterPage()

    const nameInput = screen.getByLabelText('Vollständiger Name *')
    const emailInput = screen.getByLabelText('E-Mail-Adresse *')
    const passwordInput = screen.getByLabelText('Passwort *')
    const submitButton = screen.getByRole('button', { name: /konto erstellen/i })

    fireEvent.change(nameInput, { target: { value: 'A' } }) // Too short
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.change(passwordInput, { target: { value: '123' } }) // Too short and simple
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Name muss mindestens 2 Zeichen haben')).toBeInTheDocument()
      expect(
        screen.getByText('Bitte geben Sie eine gültige E-Mail-Adresse ein')
      ).toBeInTheDocument()
      expect(screen.getByText('Passwort muss mindestens 8 Zeichen haben')).toBeInTheDocument()
    })
  })

  it('shows error when passwords do not match', async () => {
    renderRegisterPage()

    const passwordInput = screen.getByLabelText('Passwort *')
    const confirmPasswordInput = screen.getByLabelText('Passwort bestätigen *')
    const submitButton = screen.getByRole('button', { name: /konto erstellen/i })

    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Passwörter stimmen nicht überein')).toBeInTheDocument()
    })
  })

  it('requires terms acceptance', async () => {
    renderRegisterPage()

    const nameInput = screen.getByLabelText('Vollständiger Name *')
    const emailInput = screen.getByLabelText('E-Mail-Adresse *')
    const passwordInput = screen.getByLabelText('Passwort *')
    const confirmPasswordInput = screen.getByLabelText('Passwort bestätigen *')
    const submitButton = screen.getByRole('button', { name: /konto erstellen/i })

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Sie müssen die Nutzungsbedingungen akzeptieren')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    renderRegisterPage()

    const nameInput = screen.getByLabelText('Vollständiger Name *')
    const emailInput = screen.getByLabelText('E-Mail-Adresse *')
    const passwordInput = screen.getByLabelText('Passwort *')
    const confirmPasswordInput = screen.getByLabelText('Passwort bestätigen *')
    const termsCheckbox = screen.getByLabelText(/ich akzeptiere die/i)
    const submitButton = screen.getByRole('button', { name: /konto erstellen/i })

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } })
    fireEvent.click(termsCheckbox)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123',
          companyName: '',
          companySize: '',
          industry: '',
        }),
      })
    })
  })

  it('handles registration error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'User already exists' }),
    } as Response)

    renderRegisterPage()

    const nameInput = screen.getByLabelText('Vollständiger Name *')
    const emailInput = screen.getByLabelText('E-Mail-Adresse *')
    const passwordInput = screen.getByLabelText('Passwort *')
    const confirmPasswordInput = screen.getByLabelText('Passwort bestätigen *')
    const termsCheckbox = screen.getByLabelText(/ich akzeptiere die/i)
    const submitButton = screen.getByRole('button', { name: /konto erstellen/i })

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } })
    fireEvent.click(termsCheckbox)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument()
    })
  })

  it('includes optional company fields', () => {
    renderRegisterPage()

    expect(screen.getByLabelText('Unternehmensname (optional)')).toBeInTheDocument()
    expect(screen.getByLabelText('Unternehmensgröße (optional)')).toBeInTheDocument()
    expect(screen.getByLabelText('Branche (optional)')).toBeInTheDocument()
  })

  it('contains link to login page', () => {
    renderRegisterPage()

    const loginLink = screen.getByRole('link', { name: /jetzt anmelden/i })
    expect(loginLink).toHaveAttribute('href', '/auth/login')
  })
})
