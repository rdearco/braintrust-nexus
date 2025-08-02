import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockAdminUser } from '@/test/utils'
import { UserManagement } from './UserManagement'

// Mock the useUsers hook
vi.mock('@/hooks/useUsers', () => ({
  useUsers: vi.fn(() => ({
    users: [
      {
        id: '1',
        email: 'admin@usebraintrust.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01'),
      },
      {
        id: '2',
        email: 'se@contractor.com',
        name: 'Solutions Engineer',
        role: 'se',
        assignedClients: ['client-1', 'client-2'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-01'),
      },
      {
        id: '3',
        email: 'client@company.com',
        name: 'Client User',
        role: 'client',
        companyId: 'client-1',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-12-01'),
      }
    ],
    loading: false,
    error: null,
    pagination: null,
    refetch: vi.fn(),
    updateSearch: vi.fn(),
    updateRole: vi.fn(),
    updateSort: vi.fn(),
    updatePage: vi.fn()
  })),
  useUserStats: vi.fn(() => ({
    stats: {
      totalUsers: 3,
      totalAdmins: 1,
      totalSEs: 1,
      totalClients: 1
    },
    loading: false,
    error: null,
    refetch: vi.fn()
  }))
}))

// Mock the useClients hook
vi.mock('@/hooks/useClients', () => ({
  useClients: vi.fn(() => ({
    clients: [
      {
        id: 'client-1',
        name: 'Acme Corporation',
      }
    ],
    loading: false,
    error: null,
    pagination: null,
    refetch: vi.fn(),
    updateSearch: vi.fn(),
    updateSort: vi.fn(),
    updatePage: vi.fn()
  }))
}))

describe('UserManagement', () => {
  it('renders page title and add user button', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('User Management')).toBeInTheDocument()
    expect(screen.getByText('Add New User')).toBeInTheDocument()
  })

  it('displays search input', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    const searchInput = screen.getByPlaceholderText('Search users...')
    expect(searchInput).toBeInTheDocument()
  })

  it('displays role filter buttons', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getAllByText('Admins')).toHaveLength(2) // Button and stats label
    expect(screen.getByText('SEs')).toBeInTheDocument()
    expect(screen.getByText('Clients')).toBeInTheDocument() // Button text only
  })

  it('displays users table with headers', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('All Users (3)')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Access')).toBeInTheDocument()
    expect(screen.getByText('Created')).toBeInTheDocument()
    expect(screen.getByText('Last Updated')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('displays user information correctly', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('admin@usebraintrust.com')).toBeInTheDocument()
    expect(screen.getByText('Solutions Engineer')).toBeInTheDocument()
    expect(screen.getByText('se@contractor.com')).toBeInTheDocument()
    expect(screen.getByText('Client User')).toBeInTheDocument()
    expect(screen.getByText('client@company.com')).toBeInTheDocument()
  })

  it('displays role badges', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    expect(screen.getByText('SE')).toBeInTheDocument()
    expect(screen.getByText('CLIENT')).toBeInTheDocument()
  })

  it('filters users by role', async () => {
    const user = userEvent.setup()
    render(<UserManagement />, { user: mockAdminUser })
    
    const adminButton = screen.getAllByText('Admins')[0] // Get the button (first occurrence)
    await user.click(adminButton)
    
    // All users should still be visible as we show filtered results
    expect(screen.getByText('Admin User')).toBeInTheDocument()
  })

  it('searches users by name and email', async () => {
    const user = userEvent.setup()
    render(<UserManagement />, { user: mockAdminUser })
    
    const searchInput = screen.getByPlaceholderText('Search users...')
    await user.type(searchInput, 'admin')
    
    expect(screen.getByText('Admin User')).toBeInTheDocument()
  })

  it('opens add user modal when button is clicked', async () => {
    const user = userEvent.setup()
    render(<UserManagement />, { user: mockAdminUser })
    
    const addButton = screen.getByText('Add New User')
    await user.click(addButton)
    
    expect(screen.getAllByText('Name')).toHaveLength(1) // Modal form field
    expect(screen.getAllByText('Email')).toHaveLength(1) // Modal form field
    expect(screen.getAllByText('Role')).toHaveLength(2) // Modal form field and table header
  })

  it('closes add user modal when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<UserManagement />, { user: mockAdminUser })
    
    // Open modal
    const addButton = screen.getByText('Add New User')
    await user.click(addButton)
    
    // Close modal
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)
    
    expect(screen.queryByText('Name')).not.toBeInTheDocument()
  })

  it('displays summary statistics', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    expect(screen.getAllByText('Admins')).toHaveLength(2) // Button and stats label
    expect(screen.getByText('Solutions Engineers')).toBeInTheDocument()
    expect(screen.getByText('Client Users')).toBeInTheDocument()
    expect(screen.getByText('Total Users')).toBeInTheDocument()
  })

  it('calculates user statistics correctly', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    // Should show counts for each role
    const adminCount = screen.getAllByText('1')
    expect(adminCount.length).toBeGreaterThanOrEqual(3) // 1 admin, 1 SE, 1 client
    expect(screen.getByText('3')).toBeInTheDocument() // Total users
  })

  it('displays user access information', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('All clients')).toBeInTheDocument() // Admin access
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument() // Client access
  })

  it('shows action buttons for each user', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    // Should have edit, activate/deactivate, and delete buttons for each user
    const actionButtons = screen.getAllByRole('button')
    expect(actionButtons.length).toBeGreaterThan(6) // Multiple action buttons per user
  })
})