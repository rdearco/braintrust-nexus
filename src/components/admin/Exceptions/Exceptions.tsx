import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowUpDown } from 'lucide-react'

const exceptionsData = [
  {
    id: '1',
    datetimeReported: '2025-05-14 12:30:00',
    clientName: 'Acme Corp',
    department: 'Finance',
    workflowName: 'Invoice Processing',
    notifications: [
      { id: '1', name: 'User 1', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face' },
      { id: '2', name: 'User 2', avatar: 'https://images.unsplash.com/photo-1494790108755-2616c2d6bb0e?w=32&h=32&fit=crop&crop=face' }
    ],
    additionalCount: 2,
    exceptionType: 'Integration',
    severity: 'Critical',
    remedy: 'API timeout',
    status: 'New'
  }
]

export function Exceptions() {
  const [filters, setFilters] = useState({
    clientName: 'All clients',
    exceptionType: 'All types', 
    severity: 'All severities'
  })

  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Exceptions</h1>
      
      {/* Filter Controls */}
      <div className="flex gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Client name</label>
          <Select value={filters.clientName} onValueChange={(value) => handleFilterChange('clientName', value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All clients">All clients</SelectItem>
              <SelectItem value="Acme Corp">Acme Corp</SelectItem>
              <SelectItem value="Global Industries">Global Industries</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Exception type</label>
          <Select value={filters.exceptionType} onValueChange={(value) => handleFilterChange('exceptionType', value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All types">All types</SelectItem>
              <SelectItem value="Integration">Integration</SelectItem>
              <SelectItem value="Authentication">Authentication</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Severity</label>
          <Select value={filters.severity} onValueChange={(value) => handleFilterChange('severity', value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All severities">All severities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Exceptions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('datetimeReported')}
                >
                  <div className="flex items-center">
                    Datetime reported
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Client name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Workflow name</TableHead>
                <TableHead>Notifications</TableHead>
                <TableHead>Exception type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Remedy</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exceptionsData.map((exception) => (
                <TableRow key={exception.id}>
                  <TableCell className="font-medium">
                    {exception.datetimeReported}
                  </TableCell>
                  <TableCell>{exception.clientName}</TableCell>
                  <TableCell>{exception.department}</TableCell>
                  <TableCell>{exception.workflowName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {exception.notifications.slice(0, 2).map((user) => (
                        <Avatar key={user.id} className="h-6 w-6">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {exception.additionalCount > 0 && (
                        <span className="text-xs text-gray-500 ml-1">
                          +{exception.additionalCount} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{exception.exceptionType}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={exception.severity === 'Critical' ? 'destructive' : 'secondary'}
                      className={exception.severity === 'Critical' ? 'bg-red-100 text-red-800' : ''}
                    >
                      {exception.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{exception.remedy}</TableCell>
                  <TableCell>
                    <Select value={exception.status}>
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}