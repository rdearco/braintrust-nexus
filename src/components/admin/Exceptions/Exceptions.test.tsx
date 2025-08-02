import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render, mockAdminUser } from '@/test/utils'
import { Exceptions } from './Exceptions'

describe('Exceptions', () => {
  it('renders page title', () => {
    render(<Exceptions />, { user: mockAdminUser })
    
    expect(screen.getByText('Exceptions')).toBeInTheDocument()
  })

  it('displays filter controls', () => {
    render(<Exceptions />, { user: mockAdminUser })
    
    // Check filter labels exist (multiple instances are OK)
    expect(screen.getAllByText('Client name')).toHaveLength(2) // One in filter, one in table
    expect(screen.getAllByText('Exception type')).toHaveLength(2) // One in filter, one in table
    expect(screen.getAllByText('Severity')).toHaveLength(2) // One in filter, one in table
    
    // Check default filter values
    expect(screen.getByText('All clients')).toBeInTheDocument()
    expect(screen.getByText('All types')).toBeInTheDocument()
    expect(screen.getByText('All severities')).toBeInTheDocument()
  })


})