import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter,
  Workflow,
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  Eye,
  BarChart3,
  Calendar
} from 'lucide-react'
import { mockWorkflows } from '@/data/mockData'
import { Link } from 'react-router-dom'

export function WorkflowManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredWorkflows = mockWorkflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'production_deploy':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'testing_started':
        return <Play className="h-4 w-4 text-blue-500" />
      case 'development':
        return <Settings className="h-4 w-4 text-orange-500" />
      case 'client_review':
        return <Eye className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'production_deploy':
        return <Badge variant="success">Live</Badge>
      case 'testing_started':
        return <Badge variant="default">Testing</Badge>
      case 'development':
        return <Badge variant="warning">Development</Badge>
      case 'client_review':
        return <Badge variant="secondary">Review</Badge>
      case 'design_approved':
        return <Badge variant="outline">Approved</Badge>
      default:
        return <Badge variant="outline">{status.replace('_', ' ')}</Badge>
    }
  }

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'production_deploy', label: 'Live' },
    { value: 'testing_started', label: 'Testing' },
    { value: 'development', label: 'Development' },
    { value: 'client_review', label: 'Review' },
    { value: 'design_approved', label: 'Approved' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workflow Management</h1>
        <Button>
          <Workflow className="h-4 w-4 mr-2" />
          Request New Workflow
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Filter className="h-4 w-4 mt-2 text-gray-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-input bg-background rounded-md"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Workflow Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getStatusIcon(workflow.status)}
                  {workflow.name}
                </CardTitle>
                {getStatusBadge(workflow.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{workflow.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{workflow.nodes.length}</div>
                  <div className="text-sm text-gray-600">Nodes</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{workflow.executions.length}</div>
                  <div className="text-sm text-gray-600">Executions</div>
                </div>
              </div>

              {workflow.exceptions.length > 0 && (
                <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-700">
                    {workflow.exceptions.length} open exception{workflow.exceptions.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created: {workflow.createdAt.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated: {workflow.updatedAt.toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/client/workflows/${workflow.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/client/workflows/${workflow.id}/executions`}>
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Executions
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Workflow className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You don\'t have any workflows yet'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button>
                <Workflow className="h-4 w-4 mr-2" />
                Request Your First Workflow
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockWorkflows.filter(w => w.status === 'production_deploy').length}
              </div>
              <div className="text-sm font-medium text-gray-600">Live Workflows</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mockWorkflows.filter(w => w.status === 'testing_started').length}
              </div>
              <div className="text-sm font-medium text-gray-600">In Testing</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {mockWorkflows.filter(w => w.status === 'development').length}
              </div>
              <div className="text-sm font-medium text-gray-600">In Development</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {mockWorkflows.reduce((sum, w) => sum + w.executions.length, 0)}
              </div>
              <div className="text-sm font-medium text-gray-600">Total Executions</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}