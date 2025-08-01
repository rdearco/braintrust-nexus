import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockAdminUser } from '@/test/utils'
import { ClientManagement } from './ClientManagement'

// Mock the data
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

describe('ClientManagement', () => {
  it('renders page title and add client button', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Client Management')).toBeInTheDocument()
    expect(screen.getByText('Add New Client')).toBeInTheDocument()
  })

  it('displays search input', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    const searchInput = screen.getByPlaceholderText('Search clients...')
    expect(searchInput).toBeInTheDocument()
  })

  it('displays client cards', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
    expect(screen.getByText('Global Industries')).toBeInTheDocument()
  })

  it('displays client information correctly', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    // Check client details - use getAllByText for numbers that appear multiple times
    expect(screen.getAllByText('12')).toHaveLength(2) // Acme workflows (12) and Global exceptions (12)
    expect(screen.getByText('8')).toBeInTheDocument() // Global workflows
    expect(screen.getByText('23')).toBeInTheDocument() // Acme exceptions
  })

  it('filters clients based on search input', async () => {
    const user = userEvent.setup()
    render(<ClientManagement />, { user: mockAdminUser })
    
    const searchInput = screen.getByPlaceholderText('Search clients...')
    
    await user.type(searchInput, 'Acme')
    
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
    expect(screen.queryByText('Global Industries')).not.toBeInTheDocument() // Should be filtered out
  })

  it('opens add client modal when button is clicked', async () => {
    const user = userEvent.setup()
    render(<ClientManagement />, { user: mockAdminUser })
    
    const addButton = screen.getByText('Add New Client')
    await user.click(addButton)
    
    expect(screen.getByText('Company Name')).toBeInTheDocument()
    expect(screen.getByText('Company URL')).toBeInTheDocument()
    expect(screen.getByText('Contract Start Date')).toBeInTheDocument()
  })

  it('closes add client modal when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<ClientManagement />, { user: mockAdminUser })
    
    // Open modal
    const addButton = screen.getByText('Add New Client')
    await user.click(addButton)
    
    // Close modal
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)
    
    expect(screen.queryByText('Company Name')).not.toBeInTheDocument()
  })

  it('displays summary statistics', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Total Clients')).toBeInTheDocument()
    expect(screen.getByText('Total Workflows')).toBeInTheDocument()
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('Total Time Saved')).toBeInTheDocument()
  })

  it('calculates summary statistics correctly', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    // Should show sum of all clients' data
    expect(screen.getByText('2')).toBeInTheDocument() // Total clients
    expect(screen.getByText('20')).toBeInTheDocument() // Total workflows (12 + 8)
    expect(screen.getByText('$770,000')).toBeInTheDocument() // Total revenue
    expect(screen.getByText('2040 hrs')).toBeInTheDocument() // Total time saved
  })

  it('displays client contract start dates', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    // The dates are formatted using toLocaleDateString() which may vary by locale
    // Just check that contract start text exists
    expect(screen.getAllByText(/Contract started:/)).toHaveLength(2)
  })

  it('includes view details and workflows links', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    const viewDetailsButtons = screen.getAllByText('View Details')
    const workflowsButtons = screen.getAllByText('Workflows')
    
    expect(viewDetailsButtons).toHaveLength(2)
    expect(workflowsButtons).toHaveLength(4) // 2 labels + 2 button links
  })
})