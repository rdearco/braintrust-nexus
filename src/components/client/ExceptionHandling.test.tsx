import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockClientUser } from '@/test/utils'
import { ExceptionHandling } from './ExceptionHandling'

// Mock the data
vi.mock('@/data/mockData', () => ({
  mockExceptions: [
    {
      id: 'exc-1',
      workflowId: 'workflow-2',
      message: 'Unable to classify ticket priority',
      details: 'Ticket content was unclear and required human review',
      status: 'open',
      assignedTo: 'se@contractor.com',
      createdAt: new Date('2024-11-28'),
    },
    {
      id: 'exc-2',
      workflowId: 'workflow-1',
      message: 'Bill.com API timeout',
      details: 'API call exceeded 30 second timeout limit',
      status: 'resolved',
      assignedTo: 'client@company.com',
      resolution: 'Increased timeout limit and retried successfully',
      createdAt: new Date('2024-11-25'),
      resolvedAt: new Date('2024-11-26'),
    }
  ],
  mockWorkflows: [
    {
      id: 'workflow-1',
      name: 'Invoice Processing Automation'
    },
    {
      id: 'workflow-2',
      name: 'Customer Support Ticket Routing'
    }
  ]
}))

describe('ExceptionHandling', () => {
  it('renders page title', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    expect(screen.getByText('Exception Handling')).toBeInTheDocument()
  })

  it('displays status badges in header', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    
    expect(screen.getByText('1 Open')).toBeInTheDocument()
    expect(screen.getByText('1 Resolved')).toBeInTheDocument()
  })

  it('displays search input', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    
    const searchInput = screen.getByPlaceholderText('Search exceptions...')
    expect(searchInput).toBeInTheDocument()
  })

  it('displays status filter dropdown', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    
    const statusFilter = screen.getByDisplayValue('All Status')
    expect(statusFilter).toBeInTheDocument()
  })

  it('displays summary cards', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    
    expect(screen.getByText('Open Exceptions')).toBeInTheDocument()
    expect(screen.getByText('Resolved This Month')).toBeInTheDocument()
    expect(screen.getByText('Resolution Rate')).toBeInTheDocument()
  })

  it('calculates summary statistics correctly', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    
    expect(screen.getAllByText('1')).toHaveLength(2) // Open (1) and Resolved (1) exceptions
    expect(screen.getByText('50%')).toBeInTheDocument() // Resolution rate (1/2 * 100)
  })

  it('displays exception list with correct count', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    
    expect(screen.getByText('Exception List (2)')).toBeInTheDocument()
  })

  it('shows exception details', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    
    expect(screen.getByText('Unable to classify ticket priority')).toBeInTheDocument()
    expect(screen.getByText('Bill.com API timeout')).toBeInTheDocument()
    expect(screen.getByText('Ticket content was unclear and required human review')).toBeInTheDocument()
    expect(screen.getByText('API call exceeded 30 second timeout limit')).toBeInTheDocument()
  })

  it('displays exception status badges', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    
    const openBadges = screen.getAllByText('open')
    const resolvedBadges = screen.getAllByText('resolved')
    
    expect(openBadges.length).toBeGreaterThanOrEqual(1)
    expect(resolvedBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('shows workflow names for exceptions', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    
    expect(screen.getByText('Customer Support Ticket Routing')).toBeInTheDocument()
    expect(screen.getByText('Invoice Processing Automation')).toBeInTheDocument()
  })

  it('displays assigned users', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    
    expect(screen.getByText('Assigned: se@contractor.com')).toBeInTheDocument()
    expect(screen.getByText('Assigned: client@company.com')).toBeInTheDocument()
  })

  it('shows creation dates', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    
    // Dates are formatted with toLocaleDateString() which may vary by locale
    expect(screen.getAllByText(/Created:/)).toHaveLength(2)
  })

  it('displays resolution information for resolved exceptions', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    
    expect(screen.getByText('Resolution')).toBeInTheDocument()
    expect(screen.getByText('Increased timeout limit and retried successfully')).toBeInTheDocument()
    // Date formatting varies by locale
    expect(screen.getByText(/Resolved:/)).toBeInTheDocument()
  })

  it('shows action buttons for exceptions', () => {
    render(<ExceptionHandling />, { user: mockClientUser })
    
    const viewButtons = screen.getAllByText('View')
    const resolveButtons = screen.getAllByText('Resolve')
    
    expect(viewButtons).toHaveLength(2)
    expect(resolveButtons).toHaveLength(1) // Only for open exceptions
  })

  it('opens resolution modal when resolve button is clicked', async () => {
    const user = userEvent.setup()
    render(<ExceptionHandling />, { user: mockClientUser })
    
    const resolveButton = screen.getByText('Resolve')
    await user.click(resolveButton)
    
    expect(screen.getByText('Resolve Exception')).toBeInTheDocument()
    expect(screen.getByText('Resolution Details')).toBeInTheDocument()
  })

  it('allows entering resolution details', async () => {
    const user = userEvent.setup()
    render(<ExceptionHandling />, { user: mockClientUser })
    
    const resolveButton = screen.getByText('Resolve')
    await user.click(resolveButton)
    
    const textarea = screen.getByPlaceholderText('Describe how you resolved this exception...')
    await user.type(textarea, 'Fixed the issue by updating configuration')
    
    expect(textarea).toHaveValue('Fixed the issue by updating configuration')
  })

  it('enables mark resolved button when resolution is entered', async () => {
    const user = userEvent.setup()
    render(<ExceptionHandling />, { user: mockClientUser })
    
    const resolveButton = screen.getByText('Resolve')
    await user.click(resolveButton)
    
    const markResolvedButton = screen.getByText('Mark Resolved')
    expect(markResolvedButton).toBeDisabled()
    
    const textarea = screen.getByPlaceholderText('Describe how you resolved this exception...')
    await user.type(textarea, 'Fixed')
    
    expect(markResolvedButton).toBeEnabled()
  })

  it('closes resolution modal when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<ExceptionHandling />, { user: mockClientUser })
    
    const resolveButton = screen.getByText('Resolve')
    await user.click(resolveButton)
    
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)
    
    expect(screen.queryByText('Resolve Exception')).not.toBeInTheDocument()
  })

  it('filters exceptions by search term', async () => {
    const user = userEvent.setup()
    render(<ExceptionHandling />, { user: mockClientUser })
    
    const searchInput = screen.getByPlaceholderText('Search exceptions...')
    await user.type(searchInput, 'timeout')
    
    expect(screen.getByText('Bill.com API timeout')).toBeInTheDocument()
  })

  it('filters exceptions by status', async () => {
    const user = userEvent.setup()
    render(<ExceptionHandling />, { user: mockClientUser })
    
    const statusFilter = screen.getByDisplayValue('All Status')
    await user.selectOptions(statusFilter, 'Open')
    
    expect(statusFilter).toHaveValue('open')
  })
})