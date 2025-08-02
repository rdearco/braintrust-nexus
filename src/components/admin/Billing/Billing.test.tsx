import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockAdminUser } from '@/test/utils'
import { Billing } from './Billing'

// Mock the mockData import
vi.mock('@/data/mockData', () => ({
  mockClients: [
    {
      id: 'client-1',
      name: 'Acme Corporation',
      url: 'https://acme.com',
      contractStartDate: new Date('2024-01-15'),
      totalWorkflows: 12,
      totalNodes: 45,
      executions: 2847,
      exceptions: 23,
      totalRevenue: 450000,
      timeSaved: 1200,
      moneySaved: 180000,
      departments: [],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      id: 'client-2',
      name: 'Global Industries',
      url: 'https://globalind.com',
      contractStartDate: new Date('2024-03-10'),
      totalWorkflows: 8,
      totalNodes: 28,
      executions: 1653,
      exceptions: 12,
      totalRevenue: 320000,
      timeSaved: 840,
      moneySaved: 125000,
      departments: [],
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-12-01'),
    }
  ]
}))

describe('Billing', () => {
  it('renders billing management page', () => {
    render(<Billing />, { user: mockAdminUser })
    
    expect(screen.getByText('Billing Management')).toBeInTheDocument()
    expect(screen.getByText('Create Invoice')).toBeInTheDocument()
    expect(screen.getByText('Export')).toBeInTheDocument()
  })

  it('displays summary cards with correct data', () => {
    render(<Billing />, { user: mockAdminUser })
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('Pending Amount')).toBeInTheDocument()
    expect(screen.getByText('Overdue Amount')).toBeInTheDocument()
    expect(screen.getByText('Total Invoices')).toBeInTheDocument()
  })

  it('displays billing table with invoices', () => {
    render(<Billing />, { user: mockAdminUser })
    
    expect(screen.getByText('Invoices (4)')).toBeInTheDocument()
    expect(screen.getAllByText('Acme Corporation')).toHaveLength(4) // Table + dropdown + recent payments + overdue
    expect(screen.getAllByText('Global Industries')).toHaveLength(2) // Table + dropdown
    expect(screen.getAllByText('TechStart Inc')).toHaveLength(2) // Table + overdue section
  })

  it('filters invoices by search term', async () => {
    const user = userEvent.setup()
    render(<Billing />, { user: mockAdminUser })
    
    const searchInput = screen.getByPlaceholderText('Search invoices or clients...')
    await user.type(searchInput, 'Acme')
    
    expect(screen.getAllByText('Acme Corporation')).toHaveLength(4) // Table + dropdown + recent payments + overdue
    // Note: Search doesn't filter dropdown options, so Global Industries still appears in dropdown
    expect(screen.getAllByText('Global Industries')).toHaveLength(1) // Only in dropdown
  })

  it('filters invoices by status', async () => {
    const user = userEvent.setup()
    render(<Billing />, { user: mockAdminUser })
    
    const statusSelect = screen.getByDisplayValue('All Status')
    await user.selectOptions(statusSelect, 'paid')
    
    // Should show paid invoices - only Acme Corporation has paid invoices
    expect(screen.getAllByText('Acme Corporation')).toHaveLength(3) // Table + dropdown + recent payments (no overdue)
  })

  it('filters invoices by client', async () => {
    const user = userEvent.setup()
    render(<Billing />, { user: mockAdminUser })
    
    const clientSelect = screen.getByDisplayValue('All Clients')
    await user.selectOptions(clientSelect, 'client-1')
    
    // Should show only Acme Corporation invoices
    expect(screen.getAllByText('Acme Corporation')).toHaveLength(4) // Table + dropdown + recent payments + overdue
    // Note: Client filter doesn't filter dropdown options, so Global Industries still appears in dropdown
    expect(screen.getAllByText('Global Industries')).toHaveLength(1) // Only in dropdown
  })

  it('displays recent payments section', () => {
    render(<Billing />, { user: mockAdminUser })
    
    expect(screen.getByText('Recent Payments')).toBeInTheDocument()
  })

  it('displays overdue invoices section', () => {
    render(<Billing />, { user: mockAdminUser })
    
    expect(screen.getByText('Overdue Invoices')).toBeInTheDocument()
  })

  it('shows correct invoice details', () => {
    render(<Billing />, { user: mockAdminUser })
    
    expect(screen.getAllByText('INV-2024-001')).toHaveLength(2) // Table + recent payments
    expect(screen.getAllByText('$45,000')).toHaveLength(4) // Summary card + table + recent payments + overdue
    expect(screen.getAllByText('December 2024')).toHaveLength(3) // Multiple invoices have December 2024 period
  })

  it('displays status badges correctly', () => {
    render(<Billing />, { user: mockAdminUser })
    
    expect(screen.getByText('paid')).toBeInTheDocument()
    expect(screen.getByText('pending')).toBeInTheDocument()
    expect(screen.getByText('overdue')).toBeInTheDocument()
  })

  it('shows action buttons for each invoice', () => {
    render(<Billing />, { user: mockAdminUser })
    
    // Check for action buttons (Eye, Edit, MoreHorizontal icons)
    const actionButtons = screen.getAllByRole('button')
    expect(actionButtons.length).toBeGreaterThan(0)
  })
}) 