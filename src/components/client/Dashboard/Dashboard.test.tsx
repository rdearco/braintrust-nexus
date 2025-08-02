import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render, mockClientUser } from '@/test/utils'
import { ClientDashboard } from './Dashboard'

describe('ClientDashboard', () => {
  it('renders pipeline progress section', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('Pipeline Progress')).toBeInTheDocument()
  })

  it('displays pipeline steps', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('Discovery: Initial Survey')).toBeInTheDocument()
    expect(screen.getByText('Discovery: Process deep dive')).toBeInTheDocument()
    expect(screen.getByText('ADA Proposal Sent')).toBeInTheDocument()
    expect(screen.getByText('ADA Proposal Review')).toBeInTheDocument()
    expect(screen.getByText('ADA Contract Sent')).toBeInTheDocument()
    expect(screen.getByText('ADA Contract Signed')).toBeInTheDocument()
    expect(screen.getByText('Credentials collected')).toBeInTheDocument()
    expect(screen.getByText('Factory build initiated')).toBeInTheDocument()
  })

  it('shows completed step dates', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('Completed: Jan 15, 2025')).toBeInTheDocument()
    expect(screen.getByText('Completed: Jan 20, 2025')).toBeInTheDocument()
    expect(screen.getByText('Completed: Jan 25, 2025')).toBeInTheDocument()
  })

  it('shows in progress step status', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('displays time saved metrics', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('Time Saved')).toBeInTheDocument()
    expect(screen.getByText('24.5 hrs')).toBeInTheDocument()
    expect(screen.getByText('168.2 hrs')).toBeInTheDocument()
    expect(screen.getAllByText('Last 7 days')).toHaveLength(2) // Appears in both Time and Money Saved cards
    expect(screen.getAllByText('All time')).toHaveLength(2) // Appears in both Time and Money Saved cards
  })

  it('displays money saved metrics', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('Money Saved')).toBeInTheDocument()
    expect(screen.getByText('$2,450')).toBeInTheDocument()
    expect(screen.getByText('$16,820')).toBeInTheDocument()
  })

  it('shows active workflows count', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('Active Workflows')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('View workflows →')).toBeInTheDocument()
  })

  it('displays user profile card', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    expect(screen.getByText('John Smith')).toBeInTheDocument()
    expect(screen.getByText('Solutions Engineer')).toBeInTheDocument()
    expect(screen.getByText('Message SE')).toBeInTheDocument()
  })

  it('shows user avatar fallback', () => {
    render(<ClientDashboard />, { user: mockClientUser })
    
    // Avatar fallback shows initials when image fails to load
    expect(screen.getByText('JS')).toBeInTheDocument()
  })
})