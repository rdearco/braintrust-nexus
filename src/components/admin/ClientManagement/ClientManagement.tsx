import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2 } from 'lucide-react'

interface Department {
  id: string
  name: string
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  department: string
  emailNotifications: boolean
  smsNotifications: boolean
  billingAccess: boolean
  adminAccess: boolean
}

interface SolutionsEngineer {
  id: string
  name: string
  email: string
}

export function ClientManagement() {
  const [companyName, setCompanyName] = useState('')
  const [companyUrl, setCompanyUrl] = useState('https://')
  const [departments, setDepartments] = useState<Department[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [solutionsEngineers, setSolutionsEngineers] = useState<SolutionsEngineer[]>([])

  const addDepartment = () => {
    setDepartments([...departments, {
      id: Date.now().toString(),
      name: ''
    }])
  }

  const removeDepartment = (id: string) => {
    setDepartments(departments.filter(dept => dept.id !== id))
  }

  const addUser = () => {
    setUsers([...users, {
      id: Date.now().toString(),
      name: '',
      email: '',
      phone: '',
      department: '',
      emailNotifications: false,
      smsNotifications: false,
      billingAccess: false,
      adminAccess: false
    }])
  }

  const updateUser = (id: string, field: keyof User, value: string | boolean) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, [field]: value } : user
    ))
  }

  const removeUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id))
  }

  const addSolutionsEngineer = () => {
    setSolutionsEngineers([...solutionsEngineers, {
      id: Date.now().toString(),
      name: '',
      email: ''
    }])
  }

  const updateSolutionsEngineer = (id: string, field: keyof SolutionsEngineer, value: string) => {
    setSolutionsEngineers(solutionsEngineers.map(se => 
      se.id === id ? { ...se, [field]: value } : se
    ))
  }

  const removeSolutionsEngineer = (id: string) => {
    setSolutionsEngineers(solutionsEngineers.filter(se => se.id !== id))
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <h1 className="text-2xl font-bold">Add New Client</h1>
      
      <div className="space-y-6">
        {/* Company Information and Manage Departments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Information */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Name<span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company URL<span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="https://"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Manage Departments */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium">Manage Departments</h3>
              
              {/* Department Header */}
              <div className="text-sm font-medium text-gray-600 border-b pb-2">
                Department Name
              </div>

              {/* Department List */}
              {departments.map((department) => (
                <div key={department.id} className="grid grid-cols-12 gap-2 items-center py-2">
                  <div className="col-span-11">
                    <Input
                      value={department.name}
                      onChange={(e) => setDepartments(departments.map(dept => 
                        dept.id === department.id ? { ...dept, name: e.target.value } : dept
                      ))}
                      className="text-sm"
                      placeholder="Department"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDepartment(department.id)}
                      className="h-8 w-8 p-0 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addDepartment}
                className="w-full mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Users Section - Full Width */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-medium">Users</h3>
            
            {/* Users Table Header */}
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
              <div className="col-span-2">Name</div>
              <div className="col-span-2">Email</div>
              <div className="col-span-2">Phone</div>
              <div className="col-span-2">Department</div>
              <div className="col-span-2">Exceptions</div>
              <div className="col-span-2">Access</div>
            </div>

            {/* Users List */}
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-12 gap-2 items-center py-2">
                <div className="col-span-2">
                  <Input
                    placeholder="Full name"
                    value={user.name}
                    onChange={(e) => updateUser(user.id, 'name', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    placeholder="Email"
                    type="email"
                    value={user.email}
                    onChange={(e) => updateUser(user.id, 'email', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    placeholder="Phone"
                    value={user.phone}
                    onChange={(e) => updateUser(user.id, 'phone', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <Select value={user.department} onValueChange={(value) => updateUser(user.id, 'department', value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`email-${user.id}`}
                      checked={user.emailNotifications}
                      onCheckedChange={(checked) => updateUser(user.id, 'emailNotifications', !!checked)}
                    />
                    <label htmlFor={`email-${user.id}`} className="text-xs">Email</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`sms-${user.id}`}
                      checked={user.smsNotifications}
                      onCheckedChange={(checked) => updateUser(user.id, 'smsNotifications', !!checked)}
                    />
                    <label htmlFor={`sms-${user.id}`} className="text-xs">SMS</label>
                  </div>
                </div>
                <div className="col-span-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`billing-${user.id}`}
                      checked={user.billingAccess}
                      onCheckedChange={(checked) => updateUser(user.id, 'billingAccess', !!checked)}
                    />
                    <label htmlFor={`billing-${user.id}`} className="text-xs">Billing Access</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`admin-${user.id}`}
                      checked={user.adminAccess}
                      onCheckedChange={(checked) => updateUser(user.id, 'adminAccess', !!checked)}
                    />
                    <label htmlFor={`admin-${user.id}`} className="text-xs">Admin Access</label>
                  </div>
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUser(user.id)}
                    className="h-8 w-8 p-0 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addUser}
              className="w-full mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </CardContent>
        </Card>

        {/* Assign Solutions Engineers - Full Width */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-medium">Assign Solutions Engineers</h3>
            
            {/* SE Table Header */}
            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
              <div>Name</div>
              <div>Email</div>
              <div>Actions</div>
            </div>

            {/* SE List */}
            {solutionsEngineers.map((se) => (
              <div key={se.id} className="grid grid-cols-3 gap-4 items-center py-2">
                <div>
                  <Select value={se.name} onValueChange={(value) => updateSolutionsEngineer(se.id, 'name', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SE" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="alex-chen">Alex Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input
                    placeholder="email@example.com"
                    value={se.email}
                    onChange={(e) => updateSolutionsEngineer(se.id, 'email', e.target.value)}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSolutionsEngineer(se.id)}
                    className="h-8 w-8 p-0 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addSolutionsEngineer}
              className="w-full mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Solutions Engineer
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <Button variant="outline">
          Cancel
        </Button>
        <Button className="bg-black hover:bg-gray-800 text-white">
          Create Client
        </Button>
      </div>
    </div>
  )
}