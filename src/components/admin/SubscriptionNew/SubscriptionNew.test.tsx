import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockAdminUser } from '@/test/utils'
import { SubscriptionNew } from './SubscriptionNew'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('SubscriptionNew', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders page title and form', () => {
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    expect(screen.getByText('Add New Plan')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter plan name')).toBeInTheDocument()
  })

  it('displays all form fields', () => {
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    // Text input
    expect(screen.getByPlaceholderText('Enter plan name')).toBeInTheDocument()
    
    // Dropdowns should show selected values as text content
    expect(screen.getByText('Fixed')).toBeInTheDocument()
    expect(screen.getByText('AIR Direct')).toBeInTheDocument()
    expect(screen.getByText('Month')).toBeInTheDocument()
    
    // Number inputs with $ symbols
    const dollarSigns = screen.getAllByText('$')
    expect(dollarSigns.length).toBeGreaterThan(0)
    
    // Percentage symbol
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('displays action buttons', () => {
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Create Plan')).toBeInTheDocument()
  })

  it('can update plan name input', async () => {
    const user = userEvent.setup()
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    const planNameInput = screen.getByPlaceholderText('Enter plan name')
    await user.type(planNameInput, 'Test Plan')
    
    expect(planNameInput).toHaveValue('Test Plan')
  })

  it('can update numeric inputs', async () => {
    const user = userEvent.setup()
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    // Find number inputs by their container structure
    const numberInputs = screen.getAllByRole('spinbutton')
    
    // Update the first number input (contract length)
    await user.type(numberInputs[0], '1000')
    expect(numberInputs[0]).toHaveValue(1000)
  })

  it('navigates back on cancel', async () => {
    const user = userEvent.setup()
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin/subscriptions')
  })

  it('navigates back on create plan', async () => {
    const user = userEvent.setup()
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    const createButton = screen.getByText('Create Plan')
    await user.click(createButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin/subscriptions')
  })

  it('displays dropdown components', () => {
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    // Find the combobox elements (there are 3 of them)
    const comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes).toHaveLength(3)
    
    // Check that default values are displayed
    expect(screen.getByText('Fixed')).toBeInTheDocument()
    expect(screen.getByText('AIR Direct')).toBeInTheDocument()
    expect(screen.getByText('Month')).toBeInTheDocument()
  })

  it('renders form in grid layout', () => {
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    // Check that the form container exists
    const planNameInput = screen.getByPlaceholderText('Enter plan name')
    expect(planNameInput).toBeInTheDocument()
    
    // The grid layout should be applied via CSS classes
    const formContainer = planNameInput.closest('.grid')
    expect(formContainer).toBeInTheDocument()
  })
})