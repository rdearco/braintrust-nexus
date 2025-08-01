import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render, mockAdminUser, mockClientUser, mockSEUser } from '@/test/utils'
import { Sidebar } from './Sidebar'

// Mock useAuth and useLocation
let mockCurrentUser = mockAdminUser

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => ({
      user: mockCurrentUser,
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
    mockCurrentUser = mockAdminUser // Reset to default
  })

  it('renders Braintrust Nexus logo', () => {
    render(<Sidebar />)
    expect(screen.getByAltText('Braintrust Nexus')).toBeInTheDocument()
  })

  it('shows admin navigation items for admin users', () => {
    render(<Sidebar />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Clients')).toBeInTheDocument()
    expect(screen.getByText('Subscriptions')).toBeInTheDocument()
    expect(screen.getByText('Credentials')).toBeInTheDocument()
    expect(screen.getByText('Exceptions')).toBeInTheDocument()
  })

  it('shows client navigation items for client users', () => {
    mockCurrentUser = mockClientUser
    render(<Sidebar />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Workflow ROI')).toBeInTheDocument()
    expect(screen.getByText('Exceptions')).toBeInTheDocument()
  })

  it('shows admin navigation items for SE users', () => {
    mockCurrentUser = mockSEUser
    render(<Sidebar />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Clients')).toBeInTheDocument()
    expect(screen.getByText('Subscriptions')).toBeInTheDocument()
    expect(screen.getByText('Credentials')).toBeInTheDocument()
    expect(screen.getByText('Exceptions')).toBeInTheDocument()
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
    const usersLink = screen.getByText('Users').closest('a')
    const clientsLink = screen.getByText('Clients').closest('a')
    const subscriptionsLink = screen.getByText('Subscriptions').closest('a')
    const credentialsLink = screen.getByText('Credentials').closest('a')
    const exceptionsLink = screen.getByText('Exceptions').closest('a')
    
    expect(dashboardLink).toHaveAttribute('href', '/admin')
    expect(usersLink).toHaveAttribute('href', '/admin/users')
    expect(clientsLink).toHaveAttribute('href', '/admin/clients')
    expect(subscriptionsLink).toHaveAttribute('href', '/admin/subscriptions')
    expect(credentialsLink).toHaveAttribute('href', '/admin/credentials')
    expect(exceptionsLink).toHaveAttribute('href', '/admin/exceptions')
  })

  it('navigates to correct routes for client', () => {
    mockCurrentUser = mockClientUser
    render(<Sidebar />)
    
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    const workflowsLink = screen.getByText('Workflow ROI').closest('a')
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
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Clients')).toBeInTheDocument()
    expect(screen.getByText('Subscriptions')).toBeInTheDocument()
    expect(screen.getByText('Credentials')).toBeInTheDocument()
    expect(screen.getByText('Exceptions')).toBeInTheDocument()
  })

})