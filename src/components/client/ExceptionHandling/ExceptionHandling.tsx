import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter,
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  Workflow,
  Eye,
  Edit,
  CheckSquare
} from 'lucide-react'
import { mockExceptions, mockWorkflows } from '@/data/mockData'
import { Link } from 'react-router-dom'

export function ExceptionHandling() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedExceptionId, setSelectedExceptionId] = useState<string | null>(null)
  const [resolution, setResolution] = useState('')

  const filteredExceptions = mockExceptions.filter(exception => {
    const matchesSearch = exception.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exception.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || exception.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getWorkflowName = (workflowId: string) => {
    const workflow = mockWorkflows.find(w => w.id === workflowId)
    return workflow ? workflow.name : 'Unknown Workflow'
  }

  const openExceptions = mockExceptions.filter(e => e.status === 'open')
  const resolvedExceptions = mockExceptions.filter(e => e.status === 'resolved')

  const handleResolveException = (exceptionId: string) => {
    if (resolution.trim()) {
      // In a real app, this would make an API call
      console.log(`Resolving exception ${exceptionId} with resolution: ${resolution}`)
      setSelectedExceptionId(null)
      setResolution('')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Exception Handling</h1>
        <div className="flex gap-2">
          <Badge variant="destructive" className="px-3 py-1">
            {openExceptions.length} Open
          </Badge>
          <Badge variant="success" className="px-3 py-1">
            {resolvedExceptions.length} Resolved
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search exceptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-gray-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-input bg-background rounded-md"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{openExceptions.length}</div>
                <div className="text-sm font-medium text-gray-600">Open Exceptions</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{resolvedExceptions.length}</div>
                <div className="text-sm font-medium text-gray-600">Resolved This Month</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {resolvedExceptions.length > 0 
                    ? Math.round((resolvedExceptions.length / mockExceptions.length) * 100)
                    : 0
                  }%
                </div>
                <div className="text-sm font-medium text-gray-600">Resolution Rate</div>
              </div>
              <CheckSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exceptions List */}
      <Card>
        <CardHeader>
          <CardTitle>Exception List ({filteredExceptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExceptions.map((exception) => (
              <div 
                key={exception.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={exception.status === 'open' ? 'destructive' : 'success'}>
                        {exception.status === 'open' ? (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        ) : (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {exception.status}
                      </Badge>
                      <h3 className="font-semibold text-lg">{exception.message}</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{exception.details}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Workflow className="h-4 w-4 text-gray-400" />
                        <span>Workflow: </span>
                        <Link 
                          to={`/client/workflows/${exception.workflowId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {getWorkflowName(exception.workflowId)}
                        </Link>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Created: {exception.createdAt.toLocaleDateString()}</span>
                      </div>
                      
                      {exception.assignedTo && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>Assigned: {exception.assignedTo}</span>
                        </div>
                      )}
                    </div>

                    {exception.resolution && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">Resolution</span>
                        </div>
                        <p className="text-green-700 text-sm">{exception.resolution}</p>
                        {exception.resolvedAt && (
                          <p className="text-green-600 text-xs mt-1">
                            Resolved: {exception.resolvedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {exception.status === 'open' && (
                      <Button 
                        size="sm"
                        onClick={() => setSelectedExceptionId(exception.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredExceptions.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No exceptions found'
                  : 'No exceptions to display'
                }
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'All workflows are running smoothly!'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolution Modal */}
      {selectedExceptionId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Resolve Exception
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Resolution Details</label>
                <textarea
                  placeholder="Describe how you resolved this exception..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full h-24 px-3 py-2 text-sm border border-input bg-background rounded-md resize-none"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedExceptionId(null)
                    setResolution('')
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => handleResolveException(selectedExceptionId)}
                  disabled={!resolution.trim()}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Resolved
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}