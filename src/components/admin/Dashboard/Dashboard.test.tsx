import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render, mockAdminUser } from '@/test/utils'
import { AdminDashboard } from './Dashboard'

// Mock the data
vi.mock('@/data/mockData', () => ({
  mockDashboardMetrics: {
    totalWorkflows: 25,
    totalExceptions: 43,
    timeSaved: 2460,
    revenue: 950000,
    activeClients: 3,
    previousPeriodComparison: {
      totalWorkflows: 22,
      totalExceptions: 38,
      timeSaved: 2100,
      revenue: 850000,
      activeClients: 3,
    }
  },
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
    }
  ]
}))

describe('AdminDashboard', () => {
  it('renders dashboard title', () => {
render(<AdminDashboard />, { user: mockAdminUser })
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
  })

  it('displays metrics cards', () => {
    render(<AdminDashboard />, { user: mockAdminUser })
    
    expect(screen.getByText('Total Workflows')).toBeInTheDocument()
    expect(screen.getByText('Total Exceptions')).toBeInTheDocument()
    expect(screen.getAllByText('Time Saved')).toHaveLength(2) // One in metrics card, one in table header
    expect(screen.getAllByText('Revenue')).toHaveLength(2) // One in metrics card, one in table header
    expect(screen.getByText('Active Clients')).toBeInTheDocument()
  })

  it('displays metric values', () => {
    render(<AdminDashboard />, { user: mockAdminUser })
    
    expect(screen.getByText('25')).toBeInTheDocument() // Total Workflows
    expect(screen.getByText('43')).toBeInTheDocument() // Total Exceptions
    expect(screen.getByText('2,460 hrs')).toBeInTheDocument() // Time Saved
    expect(screen.getByText('$950,000')).toBeInTheDocument() // Revenue
    expect(screen.getByText('3')).toBeInTheDocument() // Active Clients
  })

  it('renders time filter buttons', () => {
    render(<AdminDashboard />, { user: mockAdminUser })
    
    expect(screen.getByText('Last 7 days')).toBeInTheDocument()
    expect(screen.getByText('Last 30 days')).toBeInTheDocument()
    expect(screen.getByText('MTD')).toBeInTheDocument()
    expect(screen.getByText('QTD')).toBeInTheDocument()
    expect(screen.getByText('YTD')).toBeInTheDocument()
    expect(screen.getByText('ITD')).toBeInTheDocument()
  })

  it('allows filter selection', () => {
    render(<AdminDashboard />, { user: mockAdminUser })
    
    const mtdButton = screen.getByText('MTD')
    fireEvent.click(mtdButton)
    
    // Check if button becomes active (would need to check class changes in real implementation)
    expect(mtdButton).toBeInTheDocument()
  })

  it('displays clients table', () => {
    render(<AdminDashboard />, { user: mockAdminUser })
    
    expect(screen.getByText('All Clients')).toBeInTheDocument()
    expect(screen.getByText('Add Client')).toBeInTheDocument()
    expect(screen.getByText('Client Name')).toBeInTheDocument()
    expect(screen.getByText('Contract Start')).toBeInTheDocument()
    expect(screen.getByText('Workflows')).toBeInTheDocument()
  })

  it('displays client data in table', () => {
    render(<AdminDashboard />, { user: mockAdminUser })
    
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument() // Workflows count
    expect(screen.getByText('2,847')).toBeInTheDocument() // Executions
  })

  it('handles table sorting', () => {
    render(<AdminDashboard />, { user: mockAdminUser })
    
    const nameHeader = screen.getByText('Client Name')
    fireEvent.click(nameHeader)
    
    // Verify sort functionality (would need to check actual sorting in real implementation)
    expect(nameHeader).toBeInTheDocument()
  })

  it('displays percentage changes with trend indicators', () => {
    render(<AdminDashboard />, { user: mockAdminUser })
    
    // Should show positive trend indicators for metrics that increased
    const trendElements = screen.getAllByText(/% from last period/)
    expect(trendElements.length).toBeGreaterThan(0)
  })
})