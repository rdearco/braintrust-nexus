import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { 
  User, 
  Edit,
  Trash2,
  Plus,
} from 'lucide-react'
import { useUsers } from '@/hooks/useUsers'
import { useClients } from '@/hooks/useClients'
import { userApi } from '@/services/userApi'
import type { User as UserType } from '@/types'

export function UserManagement() {
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string>('')
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '' as 'admin' | 'se' | 'client' | '',
    costRate: 0,
    billRate: 0,
    avatar: '',
    assignedClients: [] as string[]
  })
  // Use userApi to get users data
  const { users, loading: usersLoading, error: usersError, updateRole } = useUsers({ 
    limit: 1000, // Get all users
    role: selectedRole === 'all' ? undefined : selectedRole
  })
  
  // Use clientApi to get clients data  
  const { clients } = useClients({ limit: 1000 }) // Get all clients

  // Set initial load to false after first load
  if (isInitialLoad && !usersLoading) {
    setIsInitialLoad(false)
  }

  const filteredUsers = users

  const formatCurrencyRate = (rate: number | undefined) => {
    if (!rate || rate === 0) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(rate) + '/hr'
  }

  const handleCloseForm = () => {
    setShowAddUserForm(false)
    setIsEditMode(false)
    setEditingUser(null)
    resetForm()
  }

  const handleClientSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
    setFormData(prev => ({ ...prev, assignedClients: selectedOptions }))
  }

  const newUserForm = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{isEditMode ? 'Edit User' : 'Add New User'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {formError}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <Input 
                    placeholder="Enter full name" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input 
                    placeholder="user@company.com" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input 
                    placeholder="+1 234 567 8900" 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Role *</label>
                  <select 
                    className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'se' | 'client' | '' }))}
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="se">Solutions Engineer</option>
                    <option value="client">Client</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Cost Rate ($/hr)</label>
                  <Input 
                    placeholder="75.00" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    value={formData.costRate || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, costRate: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Bill Rate ($/hr)</label>
                  <Input 
                    placeholder="150.00" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    value={formData.billRate || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, billRate: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Avatar URL</label>
                  <Input 
                    placeholder="https://example.com/avatar.jpg" 
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Assigned Clients</label>
                  <select 
                    className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md" 
                    multiple 
                    size={3}
                    value={formData.assignedClients}
                    onChange={handleClientSelection}
                  >
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple clients</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Role-specific Information</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Admin:</strong> Full access to all clients and system management</p>
                  <p><strong>Solutions Engineer:</strong> Access to assigned clients only</p>
                  <p><strong>Client:</strong> Access to own company data only</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCloseForm}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update User' : 'Add User')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
  }

  const getAssignedClientsBadges = (user: UserType) => {
    if (user.role === 'admin') {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
          All Clients
        </Badge>
      )
    }
    
    if (user.role === 'se' && user.assignedClients) {
      return user.assignedClients.map(clientId => {
        const client = clients.find(c => c.id === clientId)
        const clientName = client ? client.name.replace(' Corporation', '').replace(' Industries', '') : clientId
        const shortName = clientName.length > 8 ? clientName.substring(0, 8) + '...' : clientName
        return (
          <Badge key={clientId} variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
            {shortName}
          </Badge>
        )
      })
    }
    
    if (user.role === 'client' && user.companyId) {
      const client = clients.find(c => c.id === user.companyId)
      const clientName = client ? client.name.replace(' Corporation', '').replace(' Industries', '') : user.companyId
      const shortName = clientName.length > 8 ? clientName.substring(0, 8) + '...' : clientName
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
          {shortName}
        </Badge>
      )
    }
    
    return (
      <Badge variant="outline" className="text-xs">
        None
      </Badge>
    )
  }

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role)
    updateRole(role === 'all' ? '' : role)
  }

  const resetForm = () => {
    setFormData({
          name: '',
          email: '',
          phone: '',
          role: '',
          costRate: 0,
          billRate: 0,
          avatar: '',
          assignedClients: []
        })
    setFormError('')
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.role) {
      setFormError('Please fill in all required fields (Name, Email, Role)')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      // Prepare user data
      const userData: Omit<UserType, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role as 'admin' | 'se' | 'client',
        phone: formData.phone.trim() || undefined,
        costRate: !isNaN(formData.costRate) && formData.costRate > 0 ? formData.costRate : undefined,
        billRate: !isNaN(Number(formData.billRate)) && Number(formData.billRate) > 0 ? Number(formData.billRate) : undefined,
        avatar: typeof formData.avatar === 'string' ? formData.avatar.trim() || undefined : undefined,
        assignedClients: formData.assignedClients.length > 0 ? formData.assignedClients : undefined,
        companyId: formData.role === 'client' && formData.assignedClients.length > 0 ? formData.assignedClients[0] : undefined
      }

      let response
      if (isEditMode && editingUser) {
        // Update existing user
        response = await userApi.update(editingUser.id, userData)
      } else {
        // Create new user
        response = await userApi.create(userData)
      }
      
      if (response.success) {
        // Close modal and reset form
        setShowAddUserForm(false)
        setIsEditMode(false)
        setEditingUser(null)
        resetForm()
        // Refresh users list by updating role filter
        updateRole(selectedRole === 'all' ? '' : selectedRole)
      } else {
        setFormError(response.error || `Failed to ${isEditMode ? 'update' : 'create'} user`)
      }
    } catch (error) {
      setFormError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (user: UserType) => {
    setUserToDelete(user)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    setDeletingUserId(userToDelete.id)
    
    try {
      const response = await userApi.delete(userToDelete.id)
      
      if (response.success) {
        // Close confirmation dialog
        setShowDeleteConfirm(false)
        setUserToDelete(null)
        // Refresh users list
        updateRole(selectedRole === 'all' ? '' : selectedRole)
      } else {
        // Handle error - could show a toast or alert
        console.error('Failed to delete user:', response.error)
        alert(`Failed to delete user: ${response.error}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('An unexpected error occurred while deleting the user')
    } finally {
      setDeletingUserId(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
    setUserToDelete(null)
  }

  const handleEditClick = (user: UserType) => {
    setEditingUser(user)
    setIsEditMode(true)
    // Populate form with user data
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      costRate: user.costRate || 0,
      billRate: user.billRate || 0,
      avatar: user.avatar || '',
      assignedClients: user.assignedClients || []
    })
    setShowAddUserForm(true)
  }

  // Show full page loading state only on initial load
  if (usersLoading && isInitialLoad) {
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
        <Button
          variant="default"
          size="sm"
          className="bg-black text-white hover:bg-gray-800"
        onClick={() => setShowAddUserForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Role Toggle Buttons */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={selectedRole === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleRoleFilter('all')}
          className={selectedRole === 'all' ? 'bg-black text-white' : 'text-gray-600'}
        >
          All Users
        </Button>
        <Button
          variant={selectedRole === 'admin' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleRoleFilter('admin')}
          className={selectedRole === 'admin' ? 'bg-black text-white' : 'text-gray-600'}
        >
          Admin Users
        </Button>
        <Button
          variant={selectedRole === 'se' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleRoleFilter('se')}
          className={selectedRole === 'se' ? 'bg-black text-white' : 'text-gray-600'}
        >
          SE Users
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="font-medium text-gray-700">Name</TableHead>
              <TableHead className="font-medium text-gray-700">Email</TableHead>
              <TableHead className="font-medium text-gray-700">Phone</TableHead>
              <TableHead className="font-medium text-gray-700">Cost Rate</TableHead>
              <TableHead className="font-medium text-gray-700">Bill Rate</TableHead>
              <TableHead className="font-medium text-gray-700">Assigned Clients</TableHead>
              <TableHead className="font-medium text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersLoading && !isInitialLoad ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="text-lg">Loading users...</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                        ) : null}
                        <User className={`h-4 w-4 ${user.avatar ? 'hidden' : ''}`} />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{user.phone || '-'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{formatCurrencyRate(user.costRate)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{formatCurrencyRate(user.billRate)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {getAssignedClientsBadges(user)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(user)}
                        disabled={deletingUserId === user.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
            {/* Add User Form Modal (simplified) */}
      {showAddUserForm && newUserForm()}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Are you sure you want to delete <strong>{userToDelete.name}</strong>?</p>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleDeleteCancel}
                  disabled={deletingUserId === userToDelete.id}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDeleteConfirm}
                  disabled={deletingUserId === userToDelete.id}
                >
                  {deletingUserId === userToDelete.id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>

  )
}