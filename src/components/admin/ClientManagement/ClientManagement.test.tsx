import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockAdminUser } from '@/test/utils'
import { ClientManagement } from './ClientManagement'

describe('ClientManagement', () => {
  it('renders page title and tabs', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Client Manager')).toBeInTheDocument()
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Client Workflows')).toBeInTheDocument()
  })

  it('renders Assigned Support Engineers section', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Assigned Support Engineers')).toBeInTheDocument()
    expect(screen.getByText('John Smith')).toBeInTheDocument()
    expect(screen.getByText('Lead SE')).toBeInTheDocument()
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('Support SE')).toBeInTheDocument()
  })

  it('renders Client Users table', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Client Users')).toBeInTheDocument()
    
    // Check table headers
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('Billing')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Notes')).toBeInTheDocument()
    
    // Check user data
    expect(screen.getByText('Robert Wilson')).toBeInTheDocument()
    expect(screen.getByText('robert@company.com')).toBeInTheDocument()
    expect(screen.getByText('Emily Brown')).toBeInTheDocument()
    expect(screen.getByText('emily@company.com')).toBeInTheDocument()
  })

  it('renders Document Links section', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Document Links')).toBeInTheDocument()
    expect(screen.getByText('Survey Questions')).toBeInTheDocument()
    expect(screen.getByText('Survey Results')).toBeInTheDocument()
    expect(screen.getByText('Process Documentation')).toBeInTheDocument()
    expect(screen.getByText('ADA Proposal')).toBeInTheDocument()
    expect(screen.getByText('Contract')).toBeInTheDocument()
  })

  it('renders Pipeline Progress section', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Pipeline Progress')).toBeInTheDocument()
    expect(screen.getByText('Discovery: Initial Survey')).toBeInTheDocument()
    expect(screen.getByText('Discovery: Process Deep Dive')).toBeInTheDocument()
    expect(screen.getByText('ADA Proposal Sent')).toBeInTheDocument()
    expect(screen.getByText('ADA Proposal Review')).toBeInTheDocument()
  })

  it('shows completed steps with dates', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Completed on Jan 15, 2025')).toBeInTheDocument()
    expect(screen.getByText('Completed on Jan 20, 2025')).toBeInTheDocument()
    expect(screen.getByText('Completed on Jan 25, 2025')).toBeInTheDocument()
  })

  it('shows Mark Complete button for in-progress step', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Mark Complete')).toBeInTheDocument()
  })

  it('can switch between tabs', async () => {
    const user = userEvent.setup()
    render(<ClientManagement />, { user: mockAdminUser })
    
    // Click on Client Workflows tab
    const workflowsTab = screen.getByText('Client Workflows')
    await user.click(workflowsTab)
    
    // Should show workflows content
    expect(screen.getByText('Workflows')).toBeInTheDocument()
    expect(screen.getByText('Add Workflow')).toBeInTheDocument()
  })

  it('renders contact information with icons', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    // Phone numbers should be displayed
    expect(screen.getByText('+1 555-0123')).toBeInTheDocument()
    expect(screen.getByText('+1 555-0124')).toBeInTheDocument()
  })

  it('shows user notes correctly', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Primary contact')).toBeInTheDocument()
    expect(screen.getByText('Technical lead')).toBeInTheDocument()
  })

  it('renders external document links', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    // Should have external links
    const surveyLink = screen.getByText('https://docs.example.com/survey')
    expect(surveyLink).toBeInTheDocument()
    expect(surveyLink.closest('a')).toHaveAttribute('target', '_blank')
  })

  it('renders workflows table with correct data', async () => {
    const user = userEvent.setup()
    render(<ClientManagement />, { user: mockAdminUser })
    
    // Switch to workflows tab
    const workflowsTab = screen.getByText('Client Workflows')
    await user.click(workflowsTab)
    
    // Check table headers
    expect(screen.getByText('Create Date')).toBeInTheDocument()
    expect(screen.getByText('Department')).toBeInTheDocument()
    expect(screen.getByText('Workflow Name')).toBeInTheDocument()
    expect(screen.getByText('# of Nodes')).toBeInTheDocument()
    expect(screen.getByText('# of Executions')).toBeInTheDocument()
    expect(screen.getByText('# of Exceptions')).toBeInTheDocument()
    expect(screen.getByText('Time Saved')).toBeInTheDocument()
    expect(screen.getByText('$ Saved')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    
    // Check workflow data
    expect(screen.getByText('Lead Processing')).toBeInTheDocument()
    expect(screen.getByText('Sales')).toBeInTheDocument()
    expect(screen.getByText('Onboarding')).toBeInTheDocument()
    expect(screen.getByText('HR')).toBeInTheDocument()
    expect(screen.getByText('234')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
  })

  it('renders ROI Report links in workflows table', async () => {
    const user = userEvent.setup()
    render(<ClientManagement />, { user: mockAdminUser })
    
    // Switch to workflows tab
    const workflowsTab = screen.getByText('Client Workflows')
    await user.click(workflowsTab)
    
    // Should have ROI Report links for each workflow
    const roiLinks = screen.getAllByText('ROI Report')
    expect(roiLinks).toHaveLength(2)
  })

  it('displays workflow status toggle buttons', async () => {
    const user = userEvent.setup()
    render(<ClientManagement />, { user: mockAdminUser })
    
    // Switch to workflows tab
    const workflowsTab = screen.getByText('Client Workflows')
    await user.click(workflowsTab)
    
    // Should have toggle buttons showing ON/OFF states
    const onButtons = screen.getAllByText('ON')
    expect(onButtons).toHaveLength(2) // Both workflows are active by default
    
    // Test toggling a workflow status
    await user.click(onButtons[0])
    
    // Should now show OFF for the toggled workflow
    expect(screen.getByText('OFF')).toBeInTheDocument()
    expect(screen.getAllByText('ON')).toHaveLength(1) // One remaining ON
  })
})