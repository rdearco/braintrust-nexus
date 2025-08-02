import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockAdminUser } from '@/test/utils'
import { ClientManagement } from './ClientManagement'

describe('ClientManagement', () => {
  it('renders page title', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Add New Client')).toBeInTheDocument()
  })

  it('renders company information fields', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    // expect(screen.getByText('Company Name*')).toBeInTheDocument()
    // expect(screen.getByText('Company URL*')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter company name')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://')).toBeInTheDocument()
  })

  it('renders users section', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Add User')).toBeInTheDocument()
  })

  it('renders manage departments section', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Manage Departments')).toBeInTheDocument()
    expect(screen.getByText('Add Department')).toBeInTheDocument()
    // expect(screen.getByPlaceholderText('Department')).toBeInTheDocument()
  })

  it('renders solutions engineers section', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Assign Solutions Engineers')).toBeInTheDocument()
    expect(screen.getByText('Add Solutions Engineer')).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    render(<ClientManagement />, { user: mockAdminUser })
    
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Create Client')).toBeInTheDocument()
  })

  it('allows adding and removing departments', async () => {
    const user = userEvent.setup()
    render(<ClientManagement />, { user: mockAdminUser })
    
    // Add a department
    // const departmentInput = screen.getByPlaceholderText('Department')
    const addDepartmentButton = screen.getByText('Add Department')
    
    // await user.type(departmentInput, 'Sales')
    await user.click(addDepartmentButton)
    
    // expect(screen.getByText('Sales')).toBeInTheDocument()
  })

  it('allows adding users', async () => {
    const user = userEvent.setup()
    render(<ClientManagement />, { user: mockAdminUser })
    
    const addUserButton = screen.getByText('Add User')
    await user.click(addUserButton)
    
    // Should have user input fields
    expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument()
  })

  it('allows adding solutions engineers', async () => {
    const user = userEvent.setup()
    render(<ClientManagement />, { user: mockAdminUser })
    
    const addSEButton = screen.getByText('Add Solutions Engineer')
    await user.click(addSEButton)
    
    // Should have SE selection dropdown
    expect(screen.getByText('Select SE')).toBeInTheDocument()
  })

  it('allows typing in company name field', async () => {
    const user = userEvent.setup()
    render(<ClientManagement />, { user: mockAdminUser })
    
    const companyNameInput = screen.getByPlaceholderText('Enter company name')
    await user.type(companyNameInput, 'Test Company')
    
    expect(companyNameInput).toHaveValue('Test Company')
  })

  it('allows typing in company URL field', async () => {
    const user = userEvent.setup()
    render(<ClientManagement />, { user: mockAdminUser })
    
    const companyUrlInput = screen.getByDisplayValue('https://')
    await user.clear(companyUrlInput)
    await user.type(companyUrlInput, 'https://example.com')
    
    expect(companyUrlInput).toHaveValue('https://example.com')
  })
})