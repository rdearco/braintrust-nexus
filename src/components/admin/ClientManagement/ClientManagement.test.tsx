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
    expect(screen.getByText('Workflow management coming soon...')).toBeInTheDocument()
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
})