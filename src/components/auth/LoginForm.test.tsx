import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils'
import { LoginForm } from './LoginForm'

// Mock useAuth hook
const mockLogin = vi.fn()
let mockIsLoading = false

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => ({
      login: mockLogin,
      isLoading: mockIsLoading,
    }),
  }
})

describe('LoginForm', () => {
  beforeEach(() => {
    mockLogin.mockClear()
    mockIsLoading = false
  })

  it('renders login form with title', () => {
    render(<LoginForm />, { user: null })
    
    expect(screen.getByText('Braintrust Nexus')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
  })

  it('displays email and password inputs', () => {
    render(<LoginForm />, { user: null })
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('displays sign in button', () => {
    render(<LoginForm />, { user: null })
    
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('displays demo account information', () => {
    render(<LoginForm />, { user: null })
    
    expect(screen.getByText('Demo accounts:')).toBeInTheDocument()
    expect(screen.getByText('Admin: admin@usebraintrust.com')).toBeInTheDocument()
    expect(screen.getByText('SE: se@contractor.com')).toBeInTheDocument()
    expect(screen.getByText('Client: client@company.com')).toBeInTheDocument()
    expect(screen.getByText('Use any password')).toBeInTheDocument()
  })

  it('allows entering email and password', async () => {
    const user = userEvent.setup()
    render(<LoginForm />, { user: null })
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    
    await user.type(emailInput, 'admin@usebraintrust.com')
    await user.type(passwordInput, 'password123')
    
    expect(emailInput).toHaveValue('admin@usebraintrust.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('calls login function when form is submitted', async () => {
    const user = userEvent.setup()
    render(<LoginForm />, { user: null })
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByText('Sign In')
    
    await user.type(emailInput, 'admin@usebraintrust.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    expect(mockLogin).toHaveBeenCalledWith('admin@usebraintrust.com', 'password123')
  })

  it('prevents form submission when fields are empty', async () => {
    const user = userEvent.setup()
    render(<LoginForm />, { user: null })
    
    const submitButton = screen.getByText('Sign In')
    await user.click(submitButton)
    
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('displays error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Login failed'))
    
    const user = userEvent.setup()
    render(<LoginForm />, { user: null })
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByText('Sign In')
    
    await user.type(emailInput, 'wrong@email.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('shows loading state during login', () => {
    mockIsLoading = true
    
    render(<LoginForm />, { user: null })
    
    expect(screen.getByText('Signing in...')).toBeInTheDocument()
    expect(screen.getByText('Signing in...')).toBeDisabled()
    
    // Reset for other tests
    mockIsLoading = false
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<LoginForm />, { user: null })
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    
    await user.type(emailInput, 'invalid-email')
    await user.type(passwordInput, 'password123')
    
    // HTML5 validation should prevent submission with invalid email
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('requires both email and password fields', () => {
    render(<LoginForm />, { user: null })
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    
    expect(emailInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('required')
  })

  it('clears error message when form is resubmitted', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Login failed'))
    mockLogin.mockResolvedValueOnce(undefined)
    
    const user = userEvent.setup()
    render(<LoginForm />, { user: null })
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByText('Sign In')
    
    // First failed attempt
    await user.type(emailInput, 'wrong@email.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
    
    // Clear inputs and try again
    await user.clear(emailInput)
    await user.clear(passwordInput)
    await user.type(emailInput, 'admin@usebraintrust.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument()
    })
  })
})