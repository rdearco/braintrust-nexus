import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import type { User } from '@/types'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  user?: User | null
}

// Mock user for testing
export const mockAdminUser: User = {
  id: '1',
  email: 'admin@usebraintrust.com',
  name: 'Admin User',
  role: 'admin',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-12-01'),
}

export const mockClientUser: User = {
  id: '3',
  email: 'client@company.com',
  name: 'Client User',
  role: 'client',
  companyId: 'client-1',
  createdAt: new Date('2024-02-01'),
  updatedAt: new Date('2024-12-01'),
}

export const mockSEUser: User = {
  id: '2',
  email: 'se@contractor.com',
  name: 'Solutions Engineer',
  role: 'se',
  assignedClients: ['client-1', 'client-2'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-12-01'),
}

// Custom render function with providers
export function customRender(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { initialEntries = ['/'], user = mockAdminUser, ...renderOptions } = options

  // Mock localStorage for auth
  if (user) {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => JSON.stringify(user)),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    })
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'
export { customRender as render }