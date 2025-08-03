import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockAdminUser } from '@/test/utils'
import { SubscriptionNew } from './SubscriptionNew'
import { subscriptionApi } from '@/services/subscriptionApi'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock subscriptionApi
vi.mock('@/services/subscriptionApi', () => ({
  subscriptionApi: {
    create: vi.fn().mockResolvedValue({
      success: true,
      data: { id: 'test-plan', name: 'Test Plan' },
      message: 'Plan created successfully'
    })
  }
}))

describe('SubscriptionNew', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    vi.mocked(subscriptionApi.create).mockClear()
  })

  it('renders page title and form', () => {
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    expect(screen.getByText('Add New Plan')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Plan Name')).toBeInTheDocument()
  })

  it('displays all form fields', () => {
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    // Text input
    expect(screen.getByPlaceholderText('Plan Name')).toBeInTheDocument()
    
    // Dropdowns should show selected values as text content
    expect(screen.getByText('Fixed')).toBeInTheDocument()
    expect(screen.getByText('AIR Direct')).toBeInTheDocument()
    // There are two "Month" values (contractCadence and billingFrequency)
    const monthElements = screen.getAllByText('Month')
    expect(monthElements).toHaveLength(2)
    
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
    
    const planNameInput = screen.getByPlaceholderText('Plan Name')
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

  it('navigates back on create plan with valid data', async () => {
    const user = userEvent.setup()
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    // Fill in required fields with valid data
    const planNameInput = screen.getByPlaceholderText('Plan Name')
    await user.type(planNameInput, 'Test Plan')
    
    const contractLengthInput = screen.getByPlaceholderText('Contract Length')
    await user.type(contractLengthInput, '12')
    
    const setupFeeInput = screen.getByPlaceholderText('Setup Fee')
    await user.type(setupFeeInput, '1000')
    
    const prepaymentInput = screen.getByPlaceholderText('Prepayment %')
    await user.type(prepaymentInput, '25')
    
    const capInput = screen.getByPlaceholderText('Cap Amount')
    await user.type(capInput, '50000')
    
    const overageInput = screen.getByPlaceholderText('Overage Cost')
    await user.type(overageInput, '150')
    
    const createButton = screen.getByText('Create Plan')
    await user.click(createButton)
    
    // Wait for success message to appear
    expect(await screen.findByText('Subscription plan created successfully!')).toBeInTheDocument()
    
    // Wait for the navigation (happens after 1.5 second delay)
    await new Promise(resolve => setTimeout(resolve, 1600))
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin/subscriptions')
  })

  it('shows validation error when plan name is missing', async () => {
    const user = userEvent.setup()
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    const createButton = screen.getByText('Create Plan')
    await user.click(createButton)
    
    // Should show validation error instead of navigating
    expect(screen.getByText('Please fill in required field: Plan Name')).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('displays dropdown components', () => {
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    // Find the combobox elements (there are 4 of them)
    const comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes).toHaveLength(4)
    
    // Check that default values are displayed
    expect(screen.getByText('Fixed')).toBeInTheDocument()
    expect(screen.getByText('AIR Direct')).toBeInTheDocument()
    // There are two "Month" values (contractCadence and billingFrequency)
    const monthElements = screen.getAllByText('Month')
    expect(monthElements).toHaveLength(2)
  })

  it('renders form in grid layout', () => {
    render(<SubscriptionNew />, { user: mockAdminUser })
    
    // Check that the form container exists
    const planNameInput = screen.getByPlaceholderText('Plan Name')
    expect(planNameInput).toBeInTheDocument()
    
    // The grid layout should be applied via CSS classes
    const formContainer = planNameInput.closest('.grid')
    expect(formContainer).toBeInTheDocument()
  })
})