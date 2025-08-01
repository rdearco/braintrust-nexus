import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render, mockAdminUser } from '@/test/utils'
import { Layout } from './Layout'

describe('Layout', () => {
  it('renders sidebar and main content area', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
      { user: mockAdminUser }
    )
    
    expect(screen.getByText('Braintrust Nexus')).toBeInTheDocument() // From Sidebar
    expect(screen.getByText('Test Content')).toBeInTheDocument() // Children content
  })

  it('passes children to main content area', () => {
    render(
      <Layout>
        <h1>Dashboard Title</h1>
        <p>Dashboard content goes here</p>
      </Layout>,
      { user: mockAdminUser }
    )
    
    expect(screen.getByText('Dashboard Title')).toBeInTheDocument()
    expect(screen.getByText('Dashboard content goes here')).toBeInTheDocument()
  })

  it('has correct layout structure', () => {
    const { container } = render(
      <Layout>
        <div>Content</div>
      </Layout>,
      { user: mockAdminUser }
    )
    
    // Check if the layout has the expected CSS classes
    const layoutDiv = container.firstChild
    expect(layoutDiv).toHaveClass('flex', 'h-screen', 'bg-gray-100')
  })

  it('renders sidebar with correct styling', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
      { user: mockAdminUser }
    )
    
    // Sidebar should be present with navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Clients')).toBeInTheDocument()
  })

  it('main content area has overflow handling', () => {
    const { container } = render(
      <Layout>
        <div>Scrollable Content</div>
      </Layout>,
      { user: mockAdminUser }
    )
    
    // Find the main element
    const mainElement = container.querySelector('main')
    expect(mainElement).toHaveClass('flex-1', 'overflow-auto')
  })

  it('works with different content types', () => {
    render(
      <Layout>
        <div>
          <header>Page Header</header>
          <section>
            <h2>Section Title</h2>
            <p>Section content</p>
          </section>
          <footer>Page Footer</footer>
        </div>
      </Layout>,
      { user: mockAdminUser }
    )
    
    expect(screen.getByText('Page Header')).toBeInTheDocument()
    expect(screen.getByText('Section Title')).toBeInTheDocument()
    expect(screen.getByText('Section content')).toBeInTheDocument()
    expect(screen.getByText('Page Footer')).toBeInTheDocument()
  })

  it('maintains sidebar functionality within layout', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
      { user: mockAdminUser }
    )
    
    // Sidebar functionality should work
    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

  it('handles empty children gracefully', () => {
    render(
      <Layout>
        {null}
      </Layout>,
      { user: mockAdminUser }
    )
    
    // Sidebar should still render
    expect(screen.getByText('Braintrust Nexus')).toBeInTheDocument()
  })
})