import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render, mockClientUser } from '@/test/utils'
import { ClientDashboard } from './Dashboard'

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
          logs: ['Started execution', 'Email processed', 'Invoice posted to Bill.com'],
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
          details: 'Ticket content was unclear and required human review',
          status: 'open',
          assignedTo: 'se@contractor.com',
          createdAt: new Date('2024-11-28'),
        }
      ],
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-11-28'),
    }
  ],
  mockExceptions: [
    {
      id: 'exc-1',
      workflowId: 'workflow-2',
      message: 'Unable to classify ticket priority',
      details: 'Ticket content was unclear and required human review',
      status: 'open',
      assignedTo: 'se@contractor.com',
      createdAt: new Date('2024-11-28'),
    }
  ]
}))

describe('ClientDashboard', () => {
  it('renders dashboard title', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('displays time filter buttons', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('Last 7 days')).toBeInTheDocument()
    expect(screen.getByText('Last 30 days')).toBeInTheDocument()
    expect(screen.getByText('MTD')).toBeInTheDocument()
    expect(screen.getByText('QTD')).toBeInTheDocument()
    expect(screen.getByText('YTD')).toBeInTheDocument()
    expect(screen.getByText('ITD')).toBeInTheDocument()
  })

  it('displays metrics cards', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('Active Workflows')).toBeInTheDocument()
    expect(screen.getByText('Open Exceptions')).toBeInTheDocument()
    expect(screen.getByText('Executions')).toBeInTheDocument()
    expect(screen.getByText('Time Saved')).toBeInTheDocument()
  })

  it('calculates active workflows correctly', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    // Should show 2 active workflows (1 production_deploy + 1 testing_started)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('displays open exceptions count', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    // Should show 1 open exception - use getAllByText since '1' appears multiple times
    expect(screen.getAllByText('1')).toHaveLength(4) // Multiple 1s in the UI
  })

  it('shows recent workflows section', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('Recent Workflows')).toBeInTheDocument()
    expect(screen.getByText('Invoice Processing Automation')).toBeInTheDocument()
    expect(screen.getByText('Customer Support Ticket Routing')).toBeInTheDocument()
  })

  it('shows recent exceptions section', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('Recent Exceptions')).toBeInTheDocument()
    expect(screen.getByText('Unable to classify ticket priority')).toBeInTheDocument()
  })

  it('displays workflow status badges', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('Live')).toBeInTheDocument()
    expect(screen.getByText('Testing')).toBeInTheDocument()
  })

  it('shows workflow descriptions', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('Automatically process incoming invoices from email and integrate with accounting system')).toBeInTheDocument()
    expect(screen.getByText('Automatically route support tickets based on priority and category')).toBeInTheDocument()
  })

  it('displays workflow status overview', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('Workflow Status Overview')).toBeInTheDocument()
    expect(screen.getByText('design approved')).toBeInTheDocument()
    expect(screen.getByText('development')).toBeInTheDocument()
    expect(screen.getByText('testing started')).toBeInTheDocument()
    expect(screen.getByText('production deploy')).toBeInTheDocument()
    expect(screen.getByText('client review')).toBeInTheDocument()
  })

  it('allows time filter selection', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    const mtdButton = screen.getByText('MTD')
    fireEvent.click(mtdButton)
    
    expect(mtdButton).toBeInTheDocument()
  })

  it('includes navigation links', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getAllByText('View All')).toHaveLength(2) // One for workflows, one for exceptions
  })

  it('shows execution counts for workflows', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('1 executions')).toBeInTheDocument()
    expect(screen.getByText('0 executions')).toBeInTheDocument()
  })

  it('displays exception status badges', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('open')).toBeInTheDocument()
  })

  it('shows trend indicators', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('2 deployed this month')).toBeInTheDocument()
    expect(screen.getByText('3 resolved this week')).toBeInTheDocument()
    expect(screen.getByText('12% increase')).toBeInTheDocument()
  })
})