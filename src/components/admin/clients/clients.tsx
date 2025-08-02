import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Check,
  Circle,
  ExternalLink,
  Phone,
  Mail,
  FileText,
  Plus
} from 'lucide-react'

const clientWorkflows = [
  {
    id: '1',
    createDate: 'Jan 15, 2025',
    department: 'Sales',
    workflowName: 'Lead Processing',
    nodes: 12,
    executions: 234,
    exceptions: 2,
    timeSaved: 30,
    moneySaved: 75,
    status: 'active'
  },
  {
    id: '2', 
    createDate: 'Jan 10, 2025',
    department: 'HR',
    workflowName: 'Onboarding',
    nodes: 8,
    executions: 45,
    exceptions: 0,
    timeSaved: 120,
    moneySaved: 180,
    status: 'active'
  }
]

const supportEngineers = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Lead SE',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: '2', 
    name: 'Sarah Johnson',
    role: 'Support SE',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c2d6bb0e?w=32&h=32&fit=crop&crop=face'
  }
]

const clientUsers = [
  {
    id: '1',
    name: 'Robert Wilson',
    email: 'robert@company.com',
    phone: '+1 555-0123',
    billing: true,
    admin: true,
    notes: 'Primary contact'
  },
  {
    id: '2',
    name: 'Emily Brown', 
    email: 'emily@company.com',
    phone: '+1 555-0124',
    billing: false,
    admin: false,
    notes: 'Technical lead'
  }
]

const documentLinks = [
  { label: 'Survey Questions', url: 'https://docs.example.com/survey' },
  { label: 'Survey Results', url: 'https://docs.example.com/results' },
  { label: 'Process Documentation', url: 'https://docs.example.com/process' },
  { label: 'ADA Proposal', url: 'https://docs.example.com/proposal' },
  { label: 'Contract', url: 'https://docs.example.com/contract' },
  { label: 'Factory Markdown', url: 'https://docs.example.com/factory-markdown' },
  { label: 'Test Plan', url: 'https://docs.example.com/test-plan' }
]

const pipelineSteps = [
  { label: 'Discovery: Initial Survey', completed: true, date: 'Jan 15, 2025' },
  { label: 'Discovery: Process Deep Dive', completed: true, date: 'Jan 20, 2025' },
  { label: 'ADA Proposal Sent', completed: true, date: 'Jan 25, 2025' },
  { label: 'ADA Proposal Review', completed: false, inProgress: true },
  { label: 'ADA Contract Sent', completed: false },
  { label: 'ADA Contract Signed', completed: false },
  { label: 'Credentials Collected', completed: false },
  { label: 'Factory Build Initiated', completed: false },
  { label: 'Test Plan Generated', completed: false },
  { label: 'Testing Started', completed: false },
  { label: 'Production Deploy', completed: false }
]

export function Clients() {
  const [activeTab, setActiveTab] = useState('overview')
  const [workflowStatuses, setWorkflowStatuses] = useState<Record<string, boolean>>(
    Object.fromEntries(clientWorkflows.map(w => [w.id, w.status === 'active']))
  )

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflowStatuses(prev => ({
      ...prev,
      [workflowId]: !prev[workflowId]
    }))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Client Manager</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows" className="text-gray-500">Client Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Assigned Support Engineers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assigned Support Engineers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {supportEngineers.map((engineer) => (
                      <div key={engineer.id} className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={engineer.avatar} alt={engineer.name} />
                          <AvatarFallback>{engineer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{engineer.name}</div>
                          <div className="text-sm text-gray-500">{engineer.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Client Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Client Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Billing</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {user.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              {user.phone}
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.billing ? <Check className="h-4 w-4 text-green-600" /> : '—'}
                          </TableCell>
                          <TableCell>
                            {user.admin ? <Check className="h-4 w-4 text-green-600" /> : '—'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{user.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Pipeline Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pipeline Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pipelineSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {step.completed ? (
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                          ) : step.inProgress ? (
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <Circle className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${step.completed ? 'text-gray-900' : step.inProgress ? 'text-blue-900' : 'text-gray-500'}`}>
                            {step.label}
                          </div>
                          {step.date && (
                            <div className="text-sm text-gray-500">Completed on {step.date}</div>
                          )}
                        </div>
                        {step.inProgress && (
                          <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Document Links Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Document Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documentLinks.map((doc, index) => (
                      <div key={index}>
                        <div className="text-sm font-medium text-gray-900 mb-1">{doc.label}</div>
                        <a 
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          {doc.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Workflows</h2>
            <Button className="bg-black hover:bg-gray-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Workflow
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Create Date</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Workflow Name</TableHead>
                    <TableHead># of Nodes</TableHead>
                    <TableHead># of Executions</TableHead>
                    <TableHead># of Exceptions</TableHead>
                    <TableHead>Time Saved</TableHead>
                    <TableHead>$ Saved</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientWorkflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell className="font-medium">{workflow.createDate}</TableCell>
                      <TableCell>{workflow.department}</TableCell>
                      <TableCell>{workflow.workflowName}</TableCell>
                      <TableCell>{workflow.nodes}</TableCell>
                      <TableCell className="text-blue-600">{workflow.executions}</TableCell>
                      <TableCell>{workflow.exceptions}</TableCell>
                      <TableCell>
                        <div>{workflow.timeSaved}</div>
                        <div className="text-xs text-gray-500">min</div>
                      </TableCell>
                      <TableCell>
                        <div>{workflow.moneySaved}</div>
                        <div className="text-xs text-gray-500">USD</div>
                      </TableCell>
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
                      <TableCell>
                        <Button variant="link" className="text-blue-600 p-0 h-auto">
                          ROI Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}