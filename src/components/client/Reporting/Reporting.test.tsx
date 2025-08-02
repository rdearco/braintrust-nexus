import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render, mockClientUser } from '@/test/utils'
import { Reporting } from './Reporting'

describe('Reporting', () => {
  it('renders page title', () => {
    render(<Reporting />, { user: mockClientUser })
    
    expect(screen.getByText('Workflow Execution Logs')).toBeInTheDocument()
  })

  it('displays workflow filter dropdown', () => {
    render(<Reporting />, { user: mockClientUser })
    
    expect(screen.getByText('Invoice Processing Workflow')).toBeInTheDocument()
  })

  it('displays table headers', () => {
    render(<Reporting />, { user: mockClientUser })
    
    expect(screen.getByText('Timestamp')).toBeInTheDocument()
    expect(screen.getByText('Workflow')).toBeInTheDocument()
    expect(screen.getByText('Execution Details')).toBeInTheDocument()
  })

  it('displays execution log entries', () => {
    render(<Reporting />, { user: mockClientUser })
    
    expect(screen.getByText('2025-05-14 02:15:47')).toBeInTheDocument()
    expect(screen.getByText('Successfully processed invoice #INV-2025-001')).toBeInTheDocument()
    expect(screen.getByText('Data extraction completed for invoice #INV-2025-002')).toBeInTheDocument()
    expect(screen.getByText('Started processing invoice batch #BATCH-051')).toBeInTheDocument()
    expect(screen.getByText('Validation checks passed for invoice #INV-2025-003')).toBeInTheDocument()
    expect(screen.getByText('New invoice detected in input folder')).toBeInTheDocument()
  })

  it('displays Invoice Processing workflow in table rows', () => {
    render(<Reporting />, { user: mockClientUser })
    
    const invoiceProcessingCells = screen.getAllByText('Invoice Processing')
    expect(invoiceProcessingCells.length).toBeGreaterThan(0)
  })

  it('displays workflow filter dropdown with default selection', () => {
    render(<Reporting />, { user: mockClientUser })
    
    // Should display the default selected workflow
    const selectElement = screen.getByRole('combobox')
    expect(selectElement).toBeInTheDocument()
  })

  it('renders with default workflow selection', () => {
    render(<Reporting />, { user: mockClientUser })
    
    // The component should render without errors with default selection
    expect(screen.getByText('Workflow Execution Logs')).toBeInTheDocument()
    expect(screen.getByText('Invoice Processing Workflow')).toBeInTheDocument()
  })

  it('displays all execution log timestamps', () => {
    render(<Reporting />, { user: mockClientUser })
    
    expect(screen.getByText('2025-05-14 02:15:47')).toBeInTheDocument()
    expect(screen.getByText('2025-05-14 02:14:32')).toBeInTheDocument()
    expect(screen.getByText('2025-05-14 02:13:15')).toBeInTheDocument()
    expect(screen.getByText('2025-05-14 02:12:03')).toBeInTheDocument()
    expect(screen.getByText('2025-05-14 02:10:47')).toBeInTheDocument()
  })

  it('renders table with proper structure', () => {
    render(<Reporting />, { user: mockClientUser })
    
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    
    // Should have 6 rows total (1 header + 5 data rows)
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(6)
  })
})