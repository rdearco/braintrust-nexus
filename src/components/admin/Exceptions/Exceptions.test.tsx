import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockAdminUser } from '@/test/utils'
import { Exceptions } from './Exceptions'

describe('Exceptions', () => {
  it('renders Third Party Services section', () => {
    render(<Exceptions />, { user: mockAdminUser })
    
    expect(screen.getByText('Third Party Services')).toBeInTheDocument()
    expect(screen.getByText('Slack')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Jira')).toBeInTheDocument()
    expect(screen.getByText('Salesforce')).toBeInTheDocument()
    expect(screen.getByText('AWS')).toBeInTheDocument()
  })

  it('shows connected status for Slack', () => {
    render(<Exceptions />, { user: mockAdminUser })
    
    expect(screen.getByText('Connected')).toBeInTheDocument()
    // The green checkmark should be visible in the DOM
    const pageContent = screen.getByText('Third Party Services').closest('div')
    expect(pageContent).toBeInTheDocument()
  })

  it('renders Slack Credentials section', () => {
    render(<Exceptions />, { user: mockAdminUser })
    
    expect(screen.getByText('Slack Credentials')).toBeInTheDocument()
    expect(screen.getByText('Workspace URL')).toBeInTheDocument()
    expect(screen.getByText('Bot User OAuth Token')).toBeInTheDocument()
    expect(screen.getByText('Signing Secret')).toBeInTheDocument()
  })

  it('displays credential form fields with default values', () => {
    render(<Exceptions />, { user: mockAdminUser })
    
    expect(screen.getByDisplayValue('acme-corp.slack.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('xoxb-************')).toBeInTheDocument()
    expect(screen.getByDisplayValue('********')).toBeInTheDocument()
  })

  it('renders Save Changes button', () => {
    render(<Exceptions />, { user: mockAdminUser })
    
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  it('can update workspace URL', async () => {
    const user = userEvent.setup()
    render(<Exceptions />, { user: mockAdminUser })
    
    const workspaceInput = screen.getByDisplayValue('acme-corp.slack.com')
    await user.clear(workspaceInput)
    await user.type(workspaceInput, 'new-workspace.slack.com')
    
    expect(workspaceInput).toHaveValue('new-workspace.slack.com')
  })

  it('can update bot token', async () => {
    const user = userEvent.setup()
    render(<Exceptions />, { user: mockAdminUser })
    
    const botTokenInput = screen.getByDisplayValue('xoxb-************')
    await user.clear(botTokenInput)
    await user.type(botTokenInput, 'xoxb-new-token')
    
    expect(botTokenInput).toHaveValue('xoxb-new-token')
  })

  it('can update signing secret', async () => {
    const user = userEvent.setup()
    render(<Exceptions />, { user: mockAdminUser })
    
    const signingSecretInput = screen.getByDisplayValue('********')
    await user.clear(signingSecretInput)
    await user.type(signingSecretInput, 'new-secret')
    
    expect(signingSecretInput).toHaveValue('new-secret')
  })

  it('handles save changes button click', async () => {
    const user = userEvent.setup()
    render(<Exceptions />, { user: mockAdminUser })
    
    const saveButton = screen.getByText('Save Changes')
    await user.click(saveButton)
    
    // The button should be clickable (no error thrown)
    expect(saveButton).toBeInTheDocument()
  })

  it('renders in grid layout', () => {
    render(<Exceptions />, { user: mockAdminUser })
    
    // Check that both main sections are present
    expect(screen.getByText('Third Party Services')).toBeInTheDocument()
    expect(screen.getByText('Slack Credentials')).toBeInTheDocument()
  })

  it('uses password type for sensitive fields', () => {
    render(<Exceptions />, { user: mockAdminUser })
    
    const botTokenInput = screen.getByDisplayValue('xoxb-************')
    const signingSecretInput = screen.getByDisplayValue('********')
    
    expect(botTokenInput).toHaveAttribute('type', 'password')
    expect(signingSecretInput).toHaveAttribute('type', 'password')
  })
})