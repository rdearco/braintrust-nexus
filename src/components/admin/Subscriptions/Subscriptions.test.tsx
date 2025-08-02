import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render, mockAdminUser } from '@/test/utils'
import { Subscriptions } from './Subscriptions'

describe('Subscriptions', () => {
  it('renders page title and add plan button', () => {
    render(<Subscriptions />, { user: mockAdminUser })
    
    expect(screen.getByText('Plan Manager')).toBeInTheDocument()
    expect(screen.getByText('Add Plan')).toBeInTheDocument()
  })

  it('displays table headers correctly', () => {
    render(<Subscriptions />, { user: mockAdminUser })
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Pricing Model')).toBeInTheDocument()
    expect(screen.getByText('Contract Length')).toBeInTheDocument()
    expect(screen.getByText('Billing Cadence')).toBeInTheDocument()
    expect(screen.getByText('Setup Fee')).toBeInTheDocument()
    expect(screen.getByText('Prepayment %')).toBeInTheDocument()
    expect(screen.getByText('$ Cap')).toBeInTheDocument()
    expect(screen.getByText('Overage Cost')).toBeInTheDocument()
    expect(screen.getByText('# Clients')).toBeInTheDocument()
  })

  it('displays subscription plans data', () => {
    render(<Subscriptions />, { user: mockAdminUser })
    
    // Check plan names
    expect(screen.getByText('Enterprise Pro')).toBeInTheDocument()
    expect(screen.getByText('Business Plus')).toBeInTheDocument()
    expect(screen.getByText('Starter')).toBeInTheDocument()
    
    // Check pricing models
    expect(screen.getByText('Tiered')).toBeInTheDocument()
    expect(screen.getByText('Fixed')).toBeInTheDocument()
    expect(screen.getByText('Usage')).toBeInTheDocument()
    
    // Check contract lengths
    expect(screen.getByText('2 Quarters')).toBeInTheDocument()
    expect(screen.getByText('6 Months')).toBeInTheDocument()
    expect(screen.getByText('3 Years')).toBeInTheDocument()
  })

  it('displays billing cadence correctly', () => {
    render(<Subscriptions />, { user: mockAdminUser })
    
    expect(screen.getAllByText('Monthly')).toHaveLength(2) // Enterprise Pro and Starter
    expect(screen.getByText('Quarterly')).toBeInTheDocument() // Business Plus
  })

  it('displays setup fees formatted as currency', () => {
    render(<Subscriptions />, { user: mockAdminUser })
    
    expect(screen.getByText('$5,000')).toBeInTheDocument()
    expect(screen.getByText('$2,500')).toBeInTheDocument()
    expect(screen.getByText('$1,000')).toBeInTheDocument()
  })

  it('displays prepayment percentages', () => {
    render(<Subscriptions />, { user: mockAdminUser })
    
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('15%')).toBeInTheDocument()
    expect(screen.getByText('10%')).toBeInTheDocument()
  })

  it('displays caps formatted as currency', () => {
    render(<Subscriptions />, { user: mockAdminUser })
    
    expect(screen.getByText('$100,000')).toBeInTheDocument()
    expect(screen.getByText('$50,000')).toBeInTheDocument()
    expect(screen.getByText('$25,000')).toBeInTheDocument()
  })

  it('displays overage costs with /hr suffix', () => {
    render(<Subscriptions />, { user: mockAdminUser })
    
    expect(screen.getByText('$150/hr')).toBeInTheDocument()
    expect(screen.getByText('$125/hr')).toBeInTheDocument()
    expect(screen.getByText('$100/hr')).toBeInTheDocument()
  })

  it('displays client counts', () => {
    render(<Subscriptions />, { user: mockAdminUser })
    
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('28')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
  })
})