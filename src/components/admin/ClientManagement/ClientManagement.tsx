import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Building2, 
  Workflow, 
  AlertTriangle,
  Calendar,
  ExternalLink
} from 'lucide-react'
import { mockClients } from '@/data/mockData'
import { Link } from 'react-router-dom'

export function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddClientForm, setShowAddClientForm] = useState(false)

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Client Management</h1>
        <Button onClick={() => setShowAddClientForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {client.name}
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <a href={client.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                Contract started: {client.contractStartDate.toLocaleDateString()}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{client.totalWorkflows}</div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <Workflow className="h-3 w-3" />
                    Workflows
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{client.exceptions}</div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Exceptions
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Revenue:</span>
                  <span className="font-semibold">${client.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Time Saved:</span>
                  <span className="font-semibold">{client.timeSaved} hrs</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Money Saved:</span>
                  <span className="font-semibold">${client.moneySaved.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/admin/clients/${client.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/admin/clients/${client.id}/workflows`}>
                    Workflows
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Client Form Modal (simplified) */}
      {showAddClientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Company Name</label>
                <Input placeholder="Enter company name" />
              </div>
              <div>
                <label className="text-sm font-medium">Company URL</label>
                <Input placeholder="https://company.com" />
              </div>
              <div>
                <label className="text-sm font-medium">Contract Start Date</label>
                <Input type="date" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowAddClientForm(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Add Client
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
              <div className="text-2xl font-bold">{mockClients.length}</div>
              <div className="text-sm font-medium text-gray-600">Total Clients</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {mockClients.reduce((sum, client) => sum + client.totalWorkflows, 0)}
              </div>
              <div className="text-sm font-medium text-gray-600">Total Workflows</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                ${mockClients.reduce((sum, client) => sum + client.totalRevenue, 0).toLocaleString()}
              </div>
              <div className="text-sm font-medium text-gray-600">Total Revenue</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {mockClients.reduce((sum, client) => sum + client.timeSaved, 0)} hrs
              </div>
              <div className="text-sm font-medium text-gray-600">Total Time Saved</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}