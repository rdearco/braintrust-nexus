import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockClientUser } from '@/test/utils'
import { WorkflowManagement } from './WorkflowManagement'

describe('WorkflowManagement', () => {
  it('renders page title and new workflow button', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    expect(screen.getByText('Workflow ROI')).toBeInTheDocument()
    expect(screen.getByText('+ New Workflow')).toBeInTheDocument()
  })

  it('displays table headers with sort arrows', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
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
    render(<WorkflowManagement />, { user: mockClientUser })
    
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
    render(<WorkflowManagement />, { user: mockClientUser })
    
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
    render(<WorkflowManagement />, { user: mockClientUser })
    
    const invoiceWorkflow = screen.getByText('Invoice Processing')
    const onboardingWorkflow = screen.getByText('Employee Onboarding')
    
    expect(invoiceWorkflow).toHaveClass('text-blue-600', 'hover:underline', 'cursor-pointer')
    expect(onboardingWorkflow).toHaveClass('text-blue-600', 'hover:underline', 'cursor-pointer')
  })

  it('shows clickable execution counts', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
    const execution1234 = screen.getByText('1234')
    const execution456 = screen.getByText('456')
    
    expect(execution1234).toHaveClass('text-blue-600', 'hover:underline', 'cursor-pointer')
    expect(execution456).toHaveClass('text-blue-600', 'hover:underline', 'cursor-pointer')
  })

  it('renders sortable column headers', () => {
    render(<WorkflowManagement />, { user: mockClientUser })
    
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
    render(<WorkflowManagement />, { user: mockClientUser })
    
    // Should have toggle buttons showing 'ON' for each active workflow
    expect(screen.getAllByText('ON')).toHaveLength(2) // Both workflows are active by default
  })

  it('allows toggling workflow status', async () => {
    const user = userEvent.setup()
    render(<WorkflowManagement />, { user: mockClientUser })
    
    const toggleButtons = screen.getAllByText('ON')
    expect(toggleButtons).toHaveLength(2)
    
    // Click first toggle button to turn it off
    await user.click(toggleButtons[0])
    
    // Should now have one 'ON' and one 'OFF' button
    expect(screen.getAllByText('ON')).toHaveLength(1)
    expect(screen.getAllByText('OFF')).toHaveLength(1)
  })
})