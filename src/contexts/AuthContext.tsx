import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('nexus_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        localStorage.removeItem('nexus_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, _password: string) => {
    setIsLoading(true)
    try {
      // Mock authentication - in real app this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let mockUser: User
      if (email.includes('@usebraintrust.com')) {
        mockUser = {
          id: '1',
          email,
          name: email.split('@')[0],
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      } else if (email.includes('@contractor.com')) {
        mockUser = {
          id: '2',
          email,
          name: email.split('@')[0],
          role: 'se',
          assignedClients: ['client-1', 'client-2'],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      } else {
        mockUser = {
          id: '3',
          email,
          name: email.split('@')[0],
          role: 'client',
          companyId: 'client-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }

      setUser(mockUser)
      localStorage.setItem('nexus_user', JSON.stringify(mockUser))
    } catch (error) {
      throw new Error('Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('nexus_user')
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}