import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Plus, 
  Search, 
  Building2, 
  CreditCard,
  Calendar,
  TrendingUp,
  Download,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { mockClients } from '@/data/mockData'

// Mock billing data
const mockBillingData = [
  {
    id: 'bill-1',
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    invoiceNumber: 'INV-2024-001',
    amount: 45000,
    status: 'paid',
    dueDate: new Date('2024-12-15'),
    paidDate: new Date('2024-12-10'),
    period: 'December 2024',
    description: 'Monthly subscription - Premium Plan',
    workflows: 12,
    executions: 2847,
  },
  {
    id: 'bill-2',
    clientId: 'client-2',
    clientName: 'Global Industries',
    invoiceNumber: 'INV-2024-002',
    amount: 32000,
    status: 'pending',
    dueDate: new Date('2024-12-20'),
    paidDate: null,
    period: 'December 2024',
    description: 'Monthly subscription - Standard Plan',
    workflows: 8,
    executions: 1653,
  },
  {
    id: 'bill-3',
    clientId: 'client-3',
    clientName: 'TechStart Inc',
    invoiceNumber: 'INV-2024-003',
    amount: 18000,
    status: 'overdue',
    dueDate: new Date('2024-12-10'),
    paidDate: null,
    period: 'December 2024',
    description: 'Monthly subscription - Basic Plan',
    workflows: 5,
    executions: 892,
  },
  {
    id: 'bill-4',
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    invoiceNumber: 'INV-2024-004',
    amount: 45000,
    status: 'draft',
    dueDate: new Date('2025-01-15'),
    paidDate: null,
    period: 'January 2025',
    description: 'Monthly subscription - Premium Plan',
    workflows: 12,
    executions: 0,
  },
]

export function Billing() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedClient, setSelectedClient] = useState<string>('all')

  const filteredBilling = mockBillingData.filter(bill => {
    const matchesSearch = bill.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || bill.status === selectedStatus
    const matchesClient = selectedClient === 'all' || bill.clientId === selectedClient
    return matchesSearch && matchesStatus && matchesClient
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'overdue':
        return 'destructive'
      case 'draft':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-3 w-3" />
      case 'pending':
        return <Clock className="h-3 w-3" />
      case 'overdue':
        return <AlertCircle className="h-3 w-3" />
      case 'draft':
        return <Edit className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const totalRevenue = mockBillingData.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0)
  const pendingAmount = mockBillingData.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0)
  const overdueAmount = mockBillingData.filter(bill => bill.status === 'overdue').reduce((sum, bill) => sum + bill.amount, 0)
  const totalInvoices = mockBillingData.length

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-600">Total Revenue</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  ${pendingAmount.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-600">Pending Amount</div>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  ${overdueAmount.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-600">Overdue Amount</div>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalInvoices}</div>
                <div className="text-sm font-medium text-gray-600">Total Invoices</div>
              </div>
              <CreditCard className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search invoices or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="draft">Draft</option>
          </select>
          <select 
            className="h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="all">All Clients</option>
            {mockClients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Billing Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices ({filteredBilling.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBilling.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{bill.clientName}</div>
                        <div className="text-sm text-gray-600">{bill.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{bill.invoiceNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${bill.amount.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(bill.status)}>
                      {getStatusIcon(bill.status)}
                      <span className="ml-1 capitalize">{bill.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {bill.dueDate.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{bill.period}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{bill.workflows} workflows</div>
                      <div className="text-gray-600">{bill.executions.toLocaleString()} executions</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBillingData
                .filter(bill => bill.status === 'paid')
                .slice(0, 5)
                .map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{bill.clientName}</div>
                      <div className="text-sm text-gray-600">{bill.invoiceNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">${bill.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">
                        {bill.paidDate?.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overdue Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBillingData
                .filter(bill => bill.status === 'overdue')
                .slice(0, 5)
                .map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium">{bill.clientName}</div>
                      <div className="text-sm text-gray-600">{bill.invoiceNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-600">${bill.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">
                        Due: {bill.dueDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 