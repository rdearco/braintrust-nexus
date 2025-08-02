import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowUpDown } from 'lucide-react'

const workflowData = [
  {
    id: '1',
    createDateTime: '2025-05-14 09:30',
    department: 'Finance',
    workflowName: 'Invoice Processing',
    description: 'Automated invoice processing workflow',
    nodes: 12,
    executions: 1234,
    exceptions: 23,
    timeSaved: '156.5 hrs',
    costSaved: '$15,650',
    status: 'active'
  },
  {
    id: '2',
    createDateTime: '2025-05-13 14:15',
    department: 'HR',
    workflowName: 'Employee Onboarding',
    description: 'New employee onboarding automation',
    nodes: 8,
    executions: 456,
    exceptions: 5,
    timeSaved: '89.2 hrs',
    costSaved: '$8,920',
    status: 'active'
  }
]

export function WorkflowManagement() {
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [workflowStatuses, setWorkflowStatuses] = useState<{ [key: string]: boolean }>({
    '1': true,
    '2': true
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflowStatuses(prev => ({
      ...prev,
      [workflowId]: !prev[workflowId]
    }))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Workflow ROI</h1>
        <Button className="bg-black hover:bg-gray-800 text-white">
          + New Workflow
        </Button>
      </div>

      {/* Workflow ROI Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('createDateTime')}
                >
                  <div className="flex items-center">
                    Create Date/Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center">
                    Department
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('workflowName')}
                >
                  <div className="flex items-center">
                    Workflow Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('nodes')}
                >
                  <div className="flex items-center">
                    Nodes
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('executions')}
                >
                  <div className="flex items-center">
                    Executions
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('exceptions')}
                >
                  <div className="flex items-center">
                    Exceptions
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('timeSaved')}
                >
                  <div className="flex items-center">
                    Time Saved
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('costSaved')}
                >
                  <div className="flex items-center">
                    Cost Saved
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflowData.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">
                    {workflow.createDateTime}
                  </TableCell>
                  <TableCell>{workflow.department}</TableCell>
                  <TableCell>
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {workflow.workflowName}
                    </span>
                  </TableCell>
                  <TableCell>{workflow.description}</TableCell>
                  <TableCell>{workflow.nodes}</TableCell>
                  <TableCell>
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {workflow.executions}
                    </span>
                  </TableCell>
                  <TableCell>{workflow.exceptions}</TableCell>
                  <TableCell>{workflow.timeSaved}</TableCell>
                  <TableCell>{workflow.costSaved}</TableCell>
                  <TableCell>
                    <Button
                      variant={workflowStatuses[workflow.id] ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleWorkflowStatus(workflow.id)}
                      className={`w-16 h-6 text-xs ${
                        workflowStatuses[workflow.id] 
                          ? 'bg-black hover:bg-gray-800 text-white' 
                          : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300'
                      }`}
                    >
                      {workflowStatuses[workflow.id] ? 'ON' : 'OFF'}
                    </Button>
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