import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

// Test component that uses the auth context
function TestComponent() {
  const { user, login, logout, isLoading } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <button onClick={() => login('admin@usebraintrust.com', 'password')}>
        Login Admin
      </button>
      <button onClick={() => login('client@company.com', 'password')}>
        Login Client
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides initial auth state', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )
    
    expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    expect(screen.getByTestId('user')).toHaveTextContent('no-user')
  })

  it('loads user from localStorage on mount', async () => {
    const storedUser = {
      id: '1',
      email: 'admin@usebraintrust.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-12-01T00:00:00.000Z',
    }
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedUser))
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('admin@usebraintrust.com')
    })
  })

  it('creates admin user for @usebraintrust.com email', async () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )
    
    await user.click(screen.getByText('Login Admin'))
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('admin@usebraintrust.com')
    })
  })

  it('creates client user for other emails', async () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )
    
    await user.click(screen.getByText('Login Client'))
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('client@company.com')
    })
  })

  it('logs out user and clears localStorage', async () => {
    const storedUser = {
      id: '1',
      email: 'admin@usebraintrust.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-12-01T00:00:00.000Z',
    }
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedUser))
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('admin@usebraintrust.com')
    })
    
    await user.click(screen.getByText('Logout'))
    
    expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('nexus_user')
  })

  it('throws error when useAuth is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleSpy.mockRestore()
  })

  it('handles malformed localStorage data gracefully', async () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })
    
    consoleSpy.mockRestore()
  })
})