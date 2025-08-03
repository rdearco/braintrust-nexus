import type { Client, User, Workflow, WorkflowException, DashboardMetrics, SubscriptionPlan } from '@/types'

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Acme Corporation',
    url: 'https://acme.com',
    contractStartDate: new Date('2024-01-15'),
    totalWorkflows: 12,
    totalNodes: 45,
    executions: 2847,
    exceptions: 23,
    totalRevenue: 450000,
    timeSaved: 1200,
    moneySaved: 180000,
    departments: [
      {
        id: 'dept-1',
        name: 'Customer Service',
        clientId: 'client-1',
        workflows: []
      },
      {
        id: 'dept-2', 
        name: 'Finance',
        clientId: 'client-1',
        workflows: []
      }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'client-2',
    name: 'Global Industries',
    url: 'https://globalind.com',
    contractStartDate: new Date('2024-03-10'),
    totalWorkflows: 8,
    totalNodes: 28,
    executions: 1653,
    exceptions: 12,
    totalRevenue: 320000,
    timeSaved: 840,
    moneySaved: 125000,
    departments: [
      {
        id: 'dept-3',
        name: 'HR',
        clientId: 'client-2',
        workflows: []
      }
    ],
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'client-3',
    name: 'TechStart Inc',
    url: 'https://techstart.io',
    contractStartDate: new Date('2024-06-01'),
    totalWorkflows: 5,
    totalNodes: 18,
    executions: 892,
    exceptions: 8,
    totalRevenue: 180000,
    timeSaved: 420,
    moneySaved: 65000,
    departments: [
      {
        id: 'dept-4',
        name: 'Operations',
        clientId: 'client-3',
        workflows: []
      }
    ],
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-12-01'),
  }
]

export const mockWorkflows: Workflow[] = [
  {
    id: 'workflow-1',
    name: 'Invoice Processing Automation',
    description: 'Automatically process incoming invoices from email and integrate with accounting system',
    status: 'production_deploy',
    departmentId: 'dept-2',
    nodes: [
      {
        id: 'node-1',
        type: 'email_monitor',
        name: 'Email Monitor',
        description: 'Monitor inbox for invoice emails',
        config: { inbox: 'invoices@acme.com' },
        workflowId: 'workflow-1'
      },
      {
        id: 'node-2',
        type: 'bill_com_api',
        name: 'Bill.com Integration',
        description: 'Post invoices to Bill.com',
        config: { apiKey: 'encrypted' },
        workflowId: 'workflow-1'
      }
    ],
    executions: [
      {
        id: 'exec-1',
        workflowId: 'workflow-1',
        status: 'success',
        startTime: new Date('2024-12-01T09:00:00'),
        endTime: new Date('2024-12-01T09:05:00'),
        logs: ['Started execution', 'Email processed', 'Invoice posted to Bill.com'],
        timeSaved: 25
      }
    ],
    exceptions: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'workflow-2',
    name: 'Customer Support Ticket Routing',
    description: 'Automatically route support tickets based on priority and category',
    status: 'testing_started',
    departmentId: 'dept-1',
    nodes: [
      {
        id: 'node-3',
        type: 'custom_agent',
        name: 'Support Agent',
        description: 'AI agent for ticket classification',
        config: { model: 'gpt-4' },
        workflowId: 'workflow-2'
      }
    ],
    executions: [],
    exceptions: [
      {
        id: 'exc-1',
        workflowId: 'workflow-2',
        message: 'Unable to classify ticket priority',
        details: 'Ticket content was unclear and required human review',
        status: 'open',
        assignedTo: 'se@contractor.com',
        createdAt: new Date('2024-11-28'),
      }
    ],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-11-28'),
  }
]

export const mockExceptions: WorkflowException[] = [
  {
    id: 'exc-1',
    workflowId: 'workflow-2',
    message: 'Unable to classify ticket priority',
    details: 'Ticket content was unclear and required human review',
    status: 'open',
    assignedTo: 'se@contractor.com',
    createdAt: new Date('2024-11-28'),
  },
  {
    id: 'exc-2',
    workflowId: 'workflow-1',
    message: 'Bill.com API timeout',
    details: 'API call exceeded 30 second timeout limit',
    status: 'resolved',
    assignedTo: 'client@company.com',
    resolution: 'Increased timeout limit and retried successfully',
    createdAt: new Date('2024-11-25'),
    resolvedAt: new Date('2024-11-26'),
  }
]

export const mockDashboardMetrics: DashboardMetrics = {
  totalWorkflows: 25,
  totalExceptions: 43,
  timeSaved: 2460,
  revenue: 950000,
  activeClients: 3,
  previousPeriodComparison: {
    totalWorkflows: 22,
    totalExceptions: 38,
    timeSaved: 2100,
    revenue: 850000,
    activeClients: 3,
  }
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@usebraintrust.com',
    name: 'Admin User',
    role: 'admin',
    phone: '+1 234 567 8900',
    costRate: 120,
    billRate: 200,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin&backgroundColor=b6e3f4',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '2',
    email: 'john@example.com',
    name: 'John Smith',
    role: 'se',
    phone: '+1 234 567 8900',
    costRate: 75,
    billRate: 150,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john&backgroundColor=c0aede',
    assignedClients: ['client-1', 'client-2'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '3',
    email: 'client@company.com',
    name: 'Client User',
    role: 'client',
    phone: '+1 234 567 8901',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client&backgroundColor=ffd93d',
    companyId: 'client-1',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '4',
    email: 'sarah@example.com',
    name: 'Sarah Johnson',
    role: 'se',
    phone: '+1 234 567 8902',
    costRate: 80,
    billRate: 160,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=ffb3ba',
    assignedClients: ['client-1'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '5',
    email: 'mike@globalind.com',
    name: 'Mike Wilson',
    role: 'client',
    phone: '+1 234 567 8903',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike&backgroundColor=bae1ff',
    companyId: 'client-2',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '6',
    email: 'emma@usebraintrust.com',
    name: 'Emma Davis',
    role: 'admin',
    phone: '+1 234 567 8904',
    costRate: 125,
    billRate: 210,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma&backgroundColor=caffbf',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '7',
    email: 'alex@example.com',
    name: 'Alex Chen',
    role: 'se',
    phone: '+1 234 567 8905',
    costRate: 78,
    billRate: 155,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=f4a261',
    assignedClients: ['client-2'],
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '8',
    email: 'lisa@techcorp.com',
    name: 'Lisa Rodriguez',
    role: 'client',
    phone: '+1 234 567 8906',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa&backgroundColor=e76f51',
    companyId: 'client-3',
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-12-01'),
  }
]

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Enterprise Pro',
    pricingModel: 'Tiered',
    contractLength: 2,
    contractCadence: 'Quarter',
    billingCadence: 'Monthly',
    setupFee: 5000,
    prepaymentPercent: 25,
    cap: 100000,
    overageCost: 150,
    clients: 12
  },
  {
    id: '2',
    name: 'Business Plus',
    pricingModel: 'Fixed',
    contractLength: 6,
    contractCadence: 'Month',
    billingCadence: 'Quarterly',
    setupFee: 2500,
    prepaymentPercent: 15,
    cap: 50000,
    overageCost: 125,
    clients: 28
  },
  {
    id: '3',
    name: 'Starter',
    pricingModel: 'Usage',
    contractLength: 3,
    contractCadence: 'Year',
    billingCadence: 'Monthly',
    setupFee: 1000,
    prepaymentPercent: 10,
    cap: 25000,
    overageCost: 100,
    clients: 45
  }
]

export const mockWorkflowData = [
  {
    id: '1',
    createDateTime: '2025-05-14 09:30',
    department: 'Finance',
    workflowName: 'Invoice Processing',
    description: 'Automated invoice processing workflow',
    nodes: 12,
    executions: 1234,
    exceptions: 23,
    timeSaved: 156.5,
    costSaved: 15650,
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
    timeSaved: 89.2,
    costSaved: 8920,
    status: 'active'
  }
]