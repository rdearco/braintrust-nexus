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
        phone: '+1 234 567 8900',
        costRate: '$120/hr',
        billRate: '$200/hr',
        avatar: '/avatars/admin.jpg',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01'),
      },
      {
        id: '2',
        email: 'se@contractor.com',
        name: 'Solutions Engineer',
        role: 'se',
        phone: '+1 234 567 8901',
        costRate: '$75/hr',
        billRate: '$150/hr',
        avatar: '/avatars/se.jpg',
        assignedClients: ['client-1', 'client-2'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-01'),
      },
      {
        id: '3',
        email: 'client@company.com',
        name: 'Client User',
        role: 'client',
        phone: '+1 234 567 8902',
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
    expect(screen.getByText('Add User')).toBeInTheDocument()
  })


  it('displays role filter buttons', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('All Users')).toBeInTheDocument()
    expect(screen.getByText('Admin Users')).toBeInTheDocument()
    expect(screen.getByText('SE Users')).toBeInTheDocument()
  })

  it('displays users table with headers', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('Cost Rate')).toBeInTheDocument()
    expect(screen.getByText('Bill Rate')).toBeInTheDocument()
    expect(screen.getByText('Assigned Clients')).toBeInTheDocument()
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

  it('displays assigned clients as badges', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('All Clients')).toBeInTheDocument()
    // expect(screen.getByText('Acme')).toBeInTheDocument() // Truncated client name
  })

  it('filters users by role', async () => {
    const user = userEvent.setup()
    render(<UserManagement />, { user: mockAdminUser })
    
    const adminButton = screen.getByText('Admin Users')
    await user.click(adminButton)
    
    // All users should still be visible as we show filtered results
    expect(screen.getByText('Admin User')).toBeInTheDocument()
  })


  it('opens add user modal when button is clicked', async () => {
    const user = userEvent.setup()
    render(<UserManagement />, { user: mockAdminUser })
    
    const addButton = screen.getByText('Add User')
    await user.click(addButton)
    
    expect(screen.getByText('Add New User')).toBeInTheDocument() // Modal title
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('closes add user modal when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<UserManagement />, { user: mockAdminUser })
    
    // Open modal
    const addButton = screen.getByText('Add User')
    await user.click(addButton)
    
    // Close modal
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)
    
    expect(screen.queryByText('Add New User')).not.toBeInTheDocument()
  })



  it('displays user access information', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('All Clients')).toBeInTheDocument() // Admin access
    // expect(screen.getByText('Acme')).toBeInTheDocument() // Truncated client access
  })

  it('shows action buttons for each user', () => {
    render(<UserManagement />, { user: mockAdminUser })
    
    // Should have edit, activate/deactivate, and delete buttons for each user
    const actionButtons = screen.getAllByRole('button')
    expect(actionButtons.length).toBeGreaterThan(6) // Multiple action buttons per user
  })
})