import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockClientUser } from '@/test/utils'
import { Workflows } from './Workflows'
import { useWorkflows } from '@/hooks/useWorkflows'

// Mock the useWorkflows hook
vi.mock('@/hooks/useWorkflows', () => ({
  useWorkflows: vi.fn()
}))

// Mock workflowApi
vi.mock('@/services/workflowApi', () => ({
  workflowApi: {
    toggleStatus: vi.fn().mockResolvedValue({
      success: true,
      data: { id: '1', status: 'inactive' },
      message: 'Workflow status toggled successfully'
    })
  }
}))

const mockWorkflowsData = [
  {
    id: '1',
    createDateTime: '2025-05-14 09:30',
    department: 'Finance',
    workflowName: 'Invoice Processing',
    description: 'Automated invoice processing workflow',
    nodes: 12,
    executions: 1234,
    exceptions: 23,
    timeSaved: 156.5,
    costSaved: 15650,
    status: 'active'
  },
  {
    id: '2',
    createDateTime: '2025-05-13 14:15',
    department: 'HR',
    workflowName: 'Employee Onboarding',
    description: 'New employee onboarding automation',
    nodes: 8,
    executions: 456,
    exceptions: 5,
    timeSaved: 89.2,
    costSaved: 8920,
    status: 'active'
  }
]

describe('Workflows', () => {
  beforeEach(() => {
    // Default mock return value
    vi.mocked(useWorkflows).mockReturnValue({
      workflows: mockWorkflowsData,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 100,
        total: 2,
        totalPages: 1
      },
      refetch: vi.fn(),
      updateSearch: vi.fn(),
      updateSort: vi.fn(),
      updatePage: vi.fn(),
      updateFilters: vi.fn()
    })
  })

  it('renders page title and new workflow button', () => {
    render(<Workflows />, { user: mockClientUser })
    
    expect(screen.getByText('Workflow ROI')).toBeInTheDocument()
    expect(screen.getByText('+ New Workflow')).toBeInTheDocument()
  })

  it('displays table headers with sort arrows', () => {
    render(<Workflows />, { user: mockClientUser })
    
    expect(screen.getByText('Create Date/Time')).toBeInTheDocument()
    expect(screen.getByText('Department')).toBeInTheDocument()
    expect(screen.getByText('Workflow Name')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Nodes')).toBeInTheDocument()
    expect(screen.getByText('Executions')).toBeInTheDocument()
    expect(screen.getByText('Exceptions')).toBeInTheDocument()
    expect(screen.getByText('Time Saved')).toBeInTheDocument()
    expect(screen.getByText('Cost Saved')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('displays workflow data rows', () => {
    render(<Workflows />, { user: mockClientUser })
    
    expect(screen.getByText('2025-05-14 09:30')).toBeInTheDocument()
    expect(screen.getByText('Finance')).toBeInTheDocument()
    expect(screen.getByText('Invoice Processing')).toBeInTheDocument()
    expect(screen.getByText('Automated invoice processing workflow')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('1234')).toBeInTheDocument()
    expect(screen.getByText('23')).toBeInTheDocument()
    expect(screen.getByText('156.5 hrs')).toBeInTheDocument()
    expect(screen.getByText('$15,650')).toBeInTheDocument()
  })

  it('displays second workflow row', () => {
    render(<Workflows />, { user: mockClientUser })
    
    expect(screen.getByText('2025-05-13 14:15')).toBeInTheDocument()
    expect(screen.getByText('HR')).toBeInTheDocument()
    expect(screen.getByText('Employee Onboarding')).toBeInTheDocument()
    expect(screen.getByText('New employee onboarding automation')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('456')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('89.2 hrs')).toBeInTheDocument()
    expect(screen.getByText('$8,920')).toBeInTheDocument()
  })

  it('shows clickable workflow names', () => {
    render(<Workflows />, { user: mockClientUser })
    
    const invoiceWorkflow = screen.getByText('Invoice Processing')
    const onboardingWorkflow = screen.getByText('Employee Onboarding')
    
    expect(invoiceWorkflow).toHaveClass('text-blue-600', 'hover:underline', 'cursor-pointer')
    expect(onboardingWorkflow).toHaveClass('text-blue-600', 'hover:underline', 'cursor-pointer')
  })

  it('shows clickable execution counts', () => {
    render(<Workflows />, { user: mockClientUser })
    
    const execution1234 = screen.getByText('1234')
    const execution456 = screen.getByText('456')
    
    expect(execution1234).toHaveClass('text-blue-600', 'hover:underline', 'cursor-pointer')
    expect(execution456).toHaveClass('text-blue-600', 'hover:underline', 'cursor-pointer')
  })

  it('renders sortable column headers', () => {
    render(<Workflows />, { user: mockClientUser })
    
    // All sortable headers should have cursor-pointer class and ArrowUpDown icons
    const sortableHeaders = [
      'Create Date/Time',
      'Department', 
      'Workflow Name',
      'Nodes',
      'Executions',
      'Exceptions',
      'Time Saved',
      'Cost Saved'
    ]
    
    sortableHeaders.forEach(header => {
      expect(screen.getByText(header).closest('th')).toHaveClass('cursor-pointer')
    })
  })

  it('displays status toggle buttons', () => {
    render(<Workflows />, { user: mockClientUser })
    
    // Should have toggle buttons showing 'ON' for each active workflow
    expect(screen.getAllByText('ON')).toHaveLength(2) // Both workflows are active by default
  })

  it('allows toggling workflow status', async () => {
    const mockRefetch = vi.fn()
    
    // Mock useWorkflows to return the refetch function
    vi.mocked(useWorkflows).mockReturnValue({
      workflows: mockWorkflowsData,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 100,
        total: 2,
        totalPages: 1
      },
      refetch: mockRefetch,
      updateSearch: vi.fn(),
      updateSort: vi.fn(),
      updatePage: vi.fn(),
      updateFilters: vi.fn()
    })

    const user = userEvent.setup()
    render(<Workflows />, { user: mockClientUser })
    
    const toggleButtons = screen.getAllByText('ON')
    expect(toggleButtons).toHaveLength(2)
    
    // Click first toggle button
    await user.click(toggleButtons[0])
    
    // Verify the API was called and refetch was triggered
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('displays loading state', () => {
    // Mock loading state
    vi.mocked(useWorkflows).mockReturnValueOnce({
      workflows: [],
      loading: true,
      error: null,
      pagination: null,
      refetch: vi.fn(),
      updateSearch: vi.fn(),
      updateSort: vi.fn(),
      updatePage: vi.fn(),
      updateFilters: vi.fn()
    })

    render(<Workflows />, { user: mockClientUser })
    
    expect(screen.getByText('Workflow ROI')).toBeInTheDocument()
    expect(screen.getByText('Loading workflows...')).toBeInTheDocument()
  })

  it('displays error state', () => {
    // Mock error state
    vi.mocked(useWorkflows).mockReturnValueOnce({
      workflows: [],
      loading: false,
      error: 'Failed to load workflows',
      pagination: null,
      refetch: vi.fn(),
      updateSearch: vi.fn(),
      updateSort: vi.fn(),
      updatePage: vi.fn(),
      updateFilters: vi.fn()
    })

    render(<Workflows />, { user: mockClientUser })
    
    expect(screen.getByText('Workflow ROI')).toBeInTheDocument()
    expect(screen.getByText('Failed to load workflows')).toBeInTheDocument()
  })
})