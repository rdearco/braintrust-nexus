import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const executionLogs = [
  {
    id: '1',
    timestamp: '2025-05-14 02:15:47',
    workflow: 'Invoice Processing',
    executionDetails: 'Successfully processed invoice #INV-2025-001'
  },
  {
    id: '2',
    timestamp: '2025-05-14 02:14:32',
    workflow: 'Invoice Processing',
    executionDetails: 'Data extraction completed for invoice #INV-2025-002'
  },
  {
    id: '3',
    timestamp: '2025-05-14 02:13:15',
    workflow: 'Invoice Processing',
    executionDetails: 'Started processing invoice batch #BATCH-051'
  },
  {
    id: '4',
    timestamp: '2025-05-14 02:12:03',
    workflow: 'Invoice Processing',
    executionDetails: 'Validation checks passed for invoice #INV-2025-003'
  },
  {
    id: '5',
    timestamp: '2025-05-14 02:10:47',
    workflow: 'Invoice Processing',
    executionDetails: 'New invoice detected in input folder'
  }
]

const workflows = [
  'Invoice Processing Workflow',
  'Employee Onboarding Workflow',
  'Purchase Order Processing',
  'Expense Report Automation'
]

export function Reporting() {
  const [selectedWorkflow, setSelectedWorkflow] = useState('Invoice Processing Workflow')

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Workflow Execution Logs</h1>
        <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
          <SelectTrigger className="w-80">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {workflows.map((workflow) => (
              <SelectItem key={workflow} value={workflow}>
                {workflow}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Execution Logs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead>Execution Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executionLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>{log.workflow}</TableCell>
                  <TableCell>{log.executionDetails}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}