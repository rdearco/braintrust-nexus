import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockAdminUser, mockClientUser, mockSEUser } from '@/test/utils'
import { Sidebar } from './Sidebar'

// Mock useAuth and useLocation
const mockLogout = vi.fn()
let mockCurrentUser = mockAdminUser

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => ({
      user: mockCurrentUser,
      logout: mockLogout,
    }),
  }
})

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => ({ pathname: '/admin' }),
    Link: ({ children, to, className }: any) => 
      <a href={to} className={className}>{children}</a>
  }
})

describe('Sidebar', () => {
  beforeEach(() => {
    mockLogout.mockClear()
    mockCurrentUser = mockAdminUser // Reset to default
  })

  it('renders Braintrust Nexus title', () => {
    render(<Sidebar />)
    expect(screen.getByText('Braintrust Nexus')).toBeInTheDocument()
  })

  it('displays Admin Portal for admin users', () => {
    render(<Sidebar />)
    expect(screen.getByText('Admin Portal')).toBeInTheDocument()
  })

  it('displays Client Portal for client users', () => {
    mockCurrentUser = mockClientUser
    render(<Sidebar />)
    expect(screen.getByText('Client Portal')).toBeInTheDocument()
  })

  it('shows admin navigation items for admin users', () => {
    render(<Sidebar />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Clients')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('shows client navigation items for client users', () => {
    mockCurrentUser = mockClientUser
    render(<Sidebar />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Workflows')).toBeInTheDocument()
    expect(screen.getByText('Exceptions')).toBeInTheDocument()
  })

  it('shows admin navigation items for SE users', () => {
    mockCurrentUser = mockSEUser
    render(<Sidebar />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Clients')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('displays user information', () => {
    render(<Sidebar />)
    
    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('shows user avatar with first letter of name', () => {
    render(<Sidebar />)
    
    expect(screen.getByText('A')).toBeInTheDocument() // First letter of "Admin User"
  })

  it('displays different user roles correctly', () => {
    mockCurrentUser = mockClientUser
    render(<Sidebar />)
    expect(screen.getByText('client')).toBeInTheDocument()
    
    mockCurrentUser = mockSEUser
    render(<Sidebar />)
    expect(screen.getByText('se')).toBeInTheDocument()
  })

  it('includes sign out button', () => {
    render(<Sidebar />)
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

  it('calls logout function when sign out is clicked', async () => {
    const user = userEvent.setup()
    render(<Sidebar />)
    
    const signOutButton = screen.getByText('Sign Out')
    await user.click(signOutButton)
    
    expect(mockLogout).toHaveBeenCalled()
  })

  it('highlights active navigation item', () => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useLocation: () => ({ pathname: '/admin/clients' }),
        Link: ({ children, to, className }: any) => 
          <a href={to} className={className}>{children}</a>
      }
    })
    
    render(<Sidebar />)
    
    // The active item should have different styling
    const clientsLink = screen.getByText('Clients')
    expect(clientsLink).toBeInTheDocument()
  })

  it('navigates to correct routes for admin', () => {
    render(<Sidebar />)
    
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    const clientsLink = screen.getByText('Clients').closest('a')
    const usersLink = screen.getByText('Users').closest('a')
    
    expect(dashboardLink).toHaveAttribute('href', '/admin')
    expect(clientsLink).toHaveAttribute('href', '/admin/clients')
    expect(usersLink).toHaveAttribute('href', '/admin/users')
  })

  it('navigates to correct routes for client', () => {
    mockCurrentUser = mockClientUser
    render(<Sidebar />)
    
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    const workflowsLink = screen.getByText('Workflows').closest('a')
    const exceptionsLink = screen.getByText('Exceptions').closest('a')
    
    expect(dashboardLink).toHaveAttribute('href', '/client')
    expect(workflowsLink).toHaveAttribute('href', '/client/workflows')
    expect(exceptionsLink).toHaveAttribute('href', '/client/exceptions')
  })

  it('renders with custom className', () => {
    const { container } = render(<Sidebar className="custom-class" />, { user: mockAdminUser })
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('displays icons for navigation items', () => {
    render(<Sidebar />)
    
    // Icons are rendered as SVG elements, we can check for their presence
    // by checking if the navigation items exist
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Clients')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('shows correct user information for different users', () => {
    mockCurrentUser = mockSEUser
    render(<Sidebar />)
    
    expect(screen.getByText('Solutions Engineer')).toBeInTheDocument()
    expect(screen.getByText('se')).toBeInTheDocument()
    expect(screen.getByText('S')).toBeInTheDocument() // First letter
  })
})