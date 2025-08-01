import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Workflow, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  CheckCircle,
  BarChart3
} from 'lucide-react'
import { mockWorkflows, mockExceptions } from '@/data/mockData'
import { Link } from 'react-router-dom'
import type { TimeFilter } from '@/types'

const timeFilters: TimeFilter[] = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'MTD', value: 'mtd' },
  { label: 'QTD', value: 'qtd' },
  { label: 'YTD', value: 'ytd' },
  { label: 'ITD', value: 'itd' },
]

export function ClientDashboard() {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter['value']>('7d')

  const activeWorkflows = mockWorkflows.filter(w => 
    w.status === 'production_deploy' || w.status === 'testing_started'
  )
  
  const openExceptions = mockExceptions.filter(e => e.status === 'open')
  
  const totalExecutions = mockWorkflows.reduce((sum, w) => sum + w.executions.length, 0)
  const totalTimeSaved = mockWorkflows.reduce((sum, w) => 
    sum + w.executions.reduce((execSum, e) => execSum + (e.timeSaved || 0), 0), 0
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'production_deploy':
        return <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" />Live</Badge>
      case 'testing_started':
        return <Badge variant="warning"><Play className="h-3 w-3 mr-1" />Testing</Badge>
      case 'development':
        return <Badge variant="default"><Pause className="h-3 w-3 mr-1" />Development</Badge>
      default:
        return <Badge variant="secondary">{status.replace('_', ' ')}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          {timeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWorkflows.length}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              2 deployed this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Exceptions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{openExceptions.length}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              3 resolved this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExecutions}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              {selectedFilter} period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTimeSaved} hrs</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              12% increase
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workflows */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Workflows</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/client/workflows">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockWorkflows.slice(0, 3).map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <Link 
                    to={`/client/workflows/${workflow.id}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {workflow.name}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(workflow.status)}
                    <span className="text-xs text-gray-500">
                      {workflow.executions.length} executions
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Exceptions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Exceptions</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/client/exceptions">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockExceptions.slice(0, 3).map((exception) => (
              <div key={exception.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">{exception.message}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{exception.details}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={exception.status === 'open' ? 'destructive' : 'success'}>
                      {exception.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {exception.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {openExceptions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No open exceptions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Workflow Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['design_approved', 'development', 'testing_started', 'production_deploy', 'client_review'].map((status) => {
              const count = mockWorkflows.filter(w => w.status === status).length
              return (
                <div key={status} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-gray-600 capitalize">
                    {status.replace('_', ' ')}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}