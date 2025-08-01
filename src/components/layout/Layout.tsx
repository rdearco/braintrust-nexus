import React from 'react'
import { Sidebar } from './Sidebar'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-1">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}