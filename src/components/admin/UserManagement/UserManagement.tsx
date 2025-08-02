import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Plus, 
  Search, 
  User, 
  Mail,
  Calendar,
  Building2,
  Shield,
  Edit,
  Trash2,
  UserCheck,
} from 'lucide-react'
import { useUsers, useUserStats } from '@/hooks/useUsers'
import { useClients } from '@/hooks/useClients'
import type { User as UserType } from '@/types'

export function UserManagement() {
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('all')

  // Use userApi to get users data
  const { users, loading: usersLoading, error: usersError, updateSearch, updateRole } = useUsers({ 
    limit: 1000, // Get all users
    role: selectedRole
  })
  
  // Use clientApi to get clients data  
  const { clients } = useClients({ limit: 1000 }) // Get all clients

  // Use userStats hook for statistics
  const { stats } = useUserStats()

  const filteredUsers = users

  const getRoleBadgeVariant = (role: UserType['role']) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'se':
        return 'default'
      case 'client':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getAssignedClientsText = (user: UserType) => {
    if (user.role === 'admin') return 'All clients'
    if (user.role === 'se' && user.assignedClients) {
      const clientNames = user.assignedClients.map(clientId => {
        const client = clients.find(c => c.id === clientId)
        return client ? client.name : clientId
      })
      return clientNames.join(', ')
    }
    if (user.role === 'client' && user.companyId) {
      const client = clients.find(c => c.id === user.companyId)
      return client ? client.name : user.companyId
    }
    return 'None'
  }

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role)
    updateRole(role)
  }

  // Show loading state
  if (usersLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    )
  }

  // Show error state
  if (usersError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading users: {usersError}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => setShowAddUserForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            onChange={(e) => updateSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedRole === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRoleFilter('all')}
          >
            All
          </Button>
          <Button
            variant={selectedRole === 'admin' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRoleFilter('admin')}
          >
            Admins
          </Button>
          <Button
            variant={selectedRole === 'se' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRoleFilter('se')}
          >
            SEs
          </Button>
          <Button
            variant={selectedRole === 'client' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRoleFilter('client')}
          >
            Clients
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {getAssignedClientsText(user)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {user.createdAt.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {user.updatedAt.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Form Modal (simplified) */}
      {showAddUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Enter full name" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input placeholder="user@company.com" type="email" />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <select className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md">
                  <option value="client">Client</option>
                  <option value="se">Solutions Engineer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Company/Access</label>
                <Input placeholder="Assign to client or leave empty for all" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowAddUserForm(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Add User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats?.totalAdmins || 0}
              </div>
              <div className="text-sm font-medium text-gray-600">Admins</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats?.totalSEs || 0}
              </div>
              <div className="text-sm font-medium text-gray-600">Solutions Engineers</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats?.totalClients || 0}
              </div>
              <div className="text-sm font-medium text-gray-600">Client Users</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <div className="text-sm font-medium text-gray-600">Total Users</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}