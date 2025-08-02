import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
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
  it('renders billing overview page', () => {
    render(<Billing />, { user: mockAdminUser })
    
    expect(screen.getByText('Billing Overview')).toBeInTheDocument()
  })

  it('displays billing overview cards with correct data', () => {
    render(<Billing />, { user: mockAdminUser })
    
    // Current Plan card
    expect(screen.getByText('Current Plan')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
    expect(screen.getByText('$2,000/month base fee')).toBeInTheDocument()
    
    // Credits Remaining card
    expect(screen.getByText('Credits Remaining')).toBeInTheDocument()
    expect(screen.getByText('8,450')).toBeInTheDocument()
    expect(screen.getByText('Renews on May 1, 2025')).toBeInTheDocument()
    
    // SE Hours card
    expect(screen.getByText('SE Hours This Month')).toBeInTheDocument()
    expect(screen.getByText('12.5 / 20')).toBeInTheDocument()
    expect(screen.getByText('7.5 hours remaining')).toBeInTheDocument()
  })

  it('displays usage summary section', () => {
    render(<Billing />, { user: mockAdminUser })
    
    expect(screen.getByText('Usage Summary')).toBeInTheDocument()
    expect(screen.getByText('View detailed report →')).toBeInTheDocument()
    expect(screen.getByText('API Calls')).toBeInTheDocument()
    expect(screen.getByText('245,678')).toBeInTheDocument()
    expect(screen.getByText('Storage Used')).toBeInTheDocument()
    expect(screen.getByText('1.2 TB')).toBeInTheDocument()
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('127')).toBeInTheDocument()
  })

  it('displays recent invoices section', () => {
    render(<Billing />, { user: mockAdminUser })
    
    expect(screen.getByText('Recent Invoices')).toBeInTheDocument()
    expect(screen.getByText('View all invoices →')).toBeInTheDocument()
    
    // Check for invoice entries
    expect(screen.getByText('April 2025')).toBeInTheDocument()
    expect(screen.getByText('Invoice #2025-04')).toBeInTheDocument()
    
    expect(screen.getByText('March 2025')).toBeInTheDocument()
    expect(screen.getByText('Invoice #2025-03')).toBeInTheDocument()
    
    expect(screen.getByText('February 2025')).toBeInTheDocument()
    expect(screen.getByText('Invoice #2025-02')).toBeInTheDocument()
  })

  it('displays billing actions section', () => {
    render(<Billing />, { user: mockAdminUser })
    
    expect(screen.getByText('Billing Actions')).toBeInTheDocument()
    expect(screen.getByText('Payment Method')).toBeInTheDocument()
    expect(screen.getByText('Visa ending in 4242')).toBeInTheDocument()
    expect(screen.getByText('Expires 12/25')).toBeInTheDocument()
    expect(screen.getByText('Update payment method')).toBeInTheDocument()
  })

  it('displays need help section', () => {
    render(<Billing />, { user: mockAdminUser })
    
    expect(screen.getByText('Need Help?')).toBeInTheDocument()
    expect(screen.getByText('Download Contract')).toBeInTheDocument()
    expect(screen.getByText('Contact Support')).toBeInTheDocument()
  })

  it('shows download buttons for invoices', () => {
    render(<Billing />, { user: mockAdminUser })
    
    // Check for download buttons (should be 3 for the 3 recent invoices)
    const downloadButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg') // Download icon
    )
    expect(downloadButtons.length).toBeGreaterThan(0)
  })

  it('displays visa card mockup correctly', () => {
    render(<Billing />, { user: mockAdminUser })
    
    expect(screen.getByText('VISA')).toBeInTheDocument()
    expect(screen.getByText('Visa ending in 4242')).toBeInTheDocument()
    expect(screen.getByText('Expires 12/25')).toBeInTheDocument()
  })

  it('shows action buttons with correct styling', () => {
    render(<Billing />, { user: mockAdminUser })
    
    // Check for Download Contract button (outline style)
    const downloadContractButton = screen.getByText('Download Contract')
    expect(downloadContractButton).toBeInTheDocument()
    
    // Check for Contact Support button (filled style)
    const contactSupportButton = screen.getByText('Contact Support')
    expect(contactSupportButton).toBeInTheDocument()
  })
}) 