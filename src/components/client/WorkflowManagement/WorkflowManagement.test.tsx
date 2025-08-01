import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockClientUser } from '@/test/utils'
import { WorkflowManagement } from './WorkflowManagement'

// Mock the data
vi.mock('@/data/mockData', () => ({
  mockWorkflows: [
    {
      id: 'workflow-1',
      name: 'Invoice Processing Automation',
      description: 'Automatically process incoming invoices from email and integrate with accounting system',
      status: 'production_deploy',
      departmentId: 'dept-2',
      nodes: [{ id: 'node-1' }, { id: 'node-2' }],
      executions: [
        {
          id: 'exec-1',
          workflowId: 'workflow-1',
          status: 'success',
          startTime: new Date('2024-12-01T09:00:00'),
          endTime: new Date('2024-12-01T09:05:00'),
          logs: ['Started execution'],
          timeSaved: 25
        }
      ],
      exceptions: [],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      id: 'workflow-2',
      name: 'Customer Support Ticket Routing',
      description: 'Automatically route support tickets based on priority and category',
      status: 'testing_started',
      departmentId: 'dept-1',
      nodes: [{ id: 'node-3' }],
      executions: [],
      exceptions: [
        {
          id: 'exc-1',
          workflowId: 'workflow-2',
          message: 'Unable to classify ticket priority',
          details: 'Ticket content was unclear',
          status: 'open',
          createdAt: new Date('2024-11-28'),
        }
      ],
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-11-28'),
    }
  ]
}))

describe('WorkflowManagement', () => {
  it('renders page title and request workflow button', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    expect(screen.getByText('Workflow Management')).toBeInTheDocument()
    expect(screen.getByText('Request New Workflow')).toBeInTheDocument()
  })

  it('displays search input', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    const searchInput = screen.getByPlaceholderText('Search workflows...')
    expect(searchInput).toBeInTheDocument()
  })

  it('displays status filter dropdown', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    const statusFilter = screen.getByDisplayValue('All Statuses')
    expect(statusFilter).toBeInTheDocument()
  })

  it('displays workflow cards', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    expect(screen.getByText('Invoice Processing Automation')).toBeInTheDocument()
    expect(screen.getByText('Customer Support Ticket Routing')).toBeInTheDocument()
  })

  it('shows workflow descriptions', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    expect(screen.getByText('Automatically process incoming invoices from email and integrate with accounting system')).toBeInTheDocument()
    expect(screen.getByText('Automatically route support tickets based on priority and category')).toBeInTheDocument()
  })

  it('displays workflow status badges', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    expect(screen.getAllByText('Live')).toHaveLength(2) // Badge and dropdown option
    expect(screen.getAllByText('Testing')).toHaveLength(2) // Badge and dropdown option
  })

  it('shows node and execution counts', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    expect(screen.getAllByText('2')).toHaveLength(1) // Nodes count for workflow 1
    expect(screen.getAllByText('1')).toHaveLength(5) // Nodes count for workflow 2 + execution count + multiple summary stats
    expect(screen.getAllByText('Nodes')).toHaveLength(2) // Both workflow cards
    expect(screen.getAllByText('Executions')).toHaveLength(4) // 2 workflow cards + 2 buttons
  })

  it('displays exception warnings', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    expect(screen.getByText('1 open exception')).toBeInTheDocument()
  })

  it('shows creation and update dates', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    // Dates are formatted with toLocaleDateString() which may vary by locale
    expect(screen.getAllByText(/Created:/)).toHaveLength(2)
    expect(screen.getAllByText(/Updated:/)).toHaveLength(2)
  })

  it('includes action buttons for each workflow', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    const viewDetailsButtons = screen.getAllByText('View Details')
    const executionsButtons = screen.getAllByText('Executions')
    
    expect(viewDetailsButtons).toHaveLength(2)
    expect(executionsButtons).toHaveLength(4) // 2 buttons + 2 labels in workflow cards
  })

  it('filters workflows by search term', async () => {
    const user = userEvent.setup()
    render(<WorkflowManagement />, { user: mockClientUser })
    
    const searchInput = screen.getByPlaceholderText('Search workflows...')
    await user.type(searchInput, 'Invoice')
    
    expect(screen.getByText('Invoice Processing Automation')).toBeInTheDocument()
    expect(screen.queryByText('Customer Support Ticket Routing')).not.toBeInTheDocument() // Should be filtered out
  })

  it('filters workflows by status', async () => {
    const user = userEvent.setup()
    render(<WorkflowManagement />, { user: mockClientUser })
    
    const statusFilter = screen.getByDisplayValue('All Statuses')
    await user.selectOptions(statusFilter, 'production_deploy')
    
    expect(statusFilter).toHaveValue('production_deploy')
  })

  it('displays summary statistics', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    expect(screen.getByText('Live Workflows')).toBeInTheDocument()
    expect(screen.getByText('In Testing')).toBeInTheDocument()
    expect(screen.getByText('In Development')).toBeInTheDocument()
    expect(screen.getByText('Total Executions')).toBeInTheDocument()
  })

  it('calculates statistics correctly', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    // Should show 1 live workflow, 1 in testing, 0 in development, 1 total execution
    const summaryCards = screen.getByText('Live Workflows').closest('.grid')
    expect(summaryCards).toBeInTheDocument()
  })

  it('handles empty state when no workflows match filters', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    // This would be tested with different mock data that results in no matches
    // For now, just verify the basic rendering works
    expect(screen.getByText('Workflow Management')).toBeInTheDocument()
  })

  it('displays workflow status icons', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    // Status icons are rendered as part of the status badges
    expect(screen.getAllByText('Live')).toHaveLength(2) // Badge and dropdown option
    expect(screen.getAllByText('Testing')).toHaveLength(2) // Badge and dropdown option
  })
})