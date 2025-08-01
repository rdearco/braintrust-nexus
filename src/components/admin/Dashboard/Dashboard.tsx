import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Workflow, 
  AlertTriangle, 
  Clock,
  DollarSign,
  Plus,
  ArrowUpDown
} from 'lucide-react'
import { mockDashboardMetrics, mockClients } from '@/data/mockData'
import type { TimeFilter } from '@/types'
import { Link } from 'react-router-dom'

const timeFilters: TimeFilter[] = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'MTD', value: 'mtd' },
  { label: 'QTD', value: 'qtd' },
  { label: 'YTD', value: 'ytd' },
  { label: 'ITD', value: 'itd' },
]

export function AdminDashboard() {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter['value']>('itd')
  const [sortField, setSortField] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const metrics = mockDashboardMetrics

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatHours = (hours: number) => {
    return `${hours.toLocaleString()} hrs`
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedClients = [...mockClients].sort((a, b) => {
    if (!sortField) return 0
    
    let aValue: any
    let bValue: any
    
    switch (sortField) {
      case 'name':
        aValue = a.name
        bValue = b.name
        break
      case 'contractStartDate':
        aValue = a.contractStartDate
        bValue = b.contractStartDate
        break
      case 'totalWorkflows':
        aValue = a.totalWorkflows
        bValue = b.totalWorkflows
        break
      case 'totalNodes':
        aValue = a.totalNodes
        bValue = b.totalNodes
        break
      case 'executions':
        aValue = a.executions
        bValue = b.executions
        break
      case 'exceptions':
        aValue = a.exceptions
        bValue = b.exceptions
        break
      case 'totalRevenue':
        aValue = a.totalRevenue
        bValue = b.totalRevenue
        break
      case 'timeSaved':
        aValue = a.timeSaved
        bValue = b.timeSaved
        break
      case 'moneySaved':
        aValue = a.moneySaved
        bValue = b.moneySaved
        break
      default:
        return 0
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </div>

      {/* Time Filters */}
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalWorkflows}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {calculatePercentageChange(metrics.totalWorkflows, metrics.previousPeriodComparison.totalWorkflows) >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              {Math.abs(calculatePercentageChange(metrics.totalWorkflows, metrics.previousPeriodComparison.totalWorkflows)).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exceptions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalExceptions}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {calculatePercentageChange(metrics.totalExceptions, metrics.previousPeriodComparison.totalExceptions) >= 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              )}
              {Math.abs(calculatePercentageChange(metrics.totalExceptions, metrics.previousPeriodComparison.totalExceptions)).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatHours(metrics.timeSaved)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {calculatePercentageChange(metrics.timeSaved, metrics.previousPeriodComparison.timeSaved) >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              {Math.abs(calculatePercentageChange(metrics.timeSaved, metrics.previousPeriodComparison.timeSaved)).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.revenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {calculatePercentageChange(metrics.revenue, metrics.previousPeriodComparison.revenue) >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              {Math.abs(calculatePercentageChange(metrics.revenue, metrics.previousPeriodComparison.revenue)).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeClients}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {calculatePercentageChange(metrics.activeClients, metrics.previousPeriodComparison.activeClients) >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              {Math.abs(calculatePercentageChange(metrics.activeClients, metrics.previousPeriodComparison.activeClients)).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Clients</CardTitle>
          <Button asChild className="whitespace-nowrap flex items-center">
            <Link to="/admin/clients" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center">
                    Client Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('contractStartDate')}>
                  <div className="flex items-center">
                    Contract Start
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('totalWorkflows')}>
                  <div className="flex items-center">
                    Workflows
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('totalNodes')}>
                  <div className="flex items-center">
                    Nodes
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('executions')}>
                  <div className="flex items-center">
                    Executions
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('exceptions')}>
                  <div className="flex items-center">
                    Exceptions
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('totalRevenue')}>
                  <div className="flex items-center">
                    Revenue
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('timeSaved')}>
                  <div className="flex items-center">
                    Time Saved
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('moneySaved')}>
                  <div className="flex items-center">
                    Money Saved
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link 
                      to={`/admin/clients/${client.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {client.contractStartDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link 
                      to={`/admin/clients/${client.id}/workflows`}
                      className="text-blue-600 hover:underline"
                    >
                      {client.totalWorkflows}
                    </Link>
                  </TableCell>
                  <TableCell>{client.totalNodes}</TableCell>
                  <TableCell>
                    <Link 
                      to={`/admin/clients/${client.id}/executions`}
                      className="text-blue-600 hover:underline"
                    >
                      {client.executions.toLocaleString()}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link 
                      to={`/admin/clients/${client.id}/exceptions`}
                      className="text-blue-600 hover:underline"
                    >
                      <Badge variant={client.exceptions > 20 ? 'destructive' : client.exceptions > 10 ? 'warning' : 'secondary'}>
                        {client.exceptions}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell>{formatCurrency(client.totalRevenue)}</TableCell>
                  <TableCell>{formatHours(client.timeSaved)}</TableCell>
                  <TableCell>{formatCurrency(client.moneySaved)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}