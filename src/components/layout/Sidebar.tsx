import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Workflow,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth()
  const location = useLocation()

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Building2, label: 'Clients', href: '/admin/clients' },
  ]

  const clientNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/client' },
    { icon: Workflow, label: 'Workflows', href: '/client/workflows' },
    { icon: AlertTriangle, label: 'Exceptions', href: '/client/exceptions' },
  ]

  const navItems = user?.role === 'client' ? clientNavItems : adminNavItems

  return (
    <div className={cn('flex h-full w-64 flex-col bg-gray-900 text-white', className)}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Braintrust Nexus</h1>
        <p className="text-sm text-gray-400 mt-1">
          {user?.role === 'client' ? 'Client Portal' : 'Admin Portal'}
        </p>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href || 
              (item.href !== '/admin' && item.href !== '/client' && location.pathname.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-800',
                    isActive ? 'bg-gray-800 text-white' : 'text-gray-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

    </div>
  )
}