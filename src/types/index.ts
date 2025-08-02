export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'se' | 'client'
  phone?: string
  costRate?: number
  billRate?: number
  avatar?: string
  companyId?: string
  assignedClients?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Client {
  id: string
  name: string
  url: string
  contractStartDate: Date
  totalWorkflows: number
  totalNodes: number
  executions: number
  exceptions: number
  totalRevenue: number
  timeSaved: number
  moneySaved: number
  departments: Department[]
  createdAt: Date
  updatedAt: Date
}

export interface Department {
  id: string
  name: string
  clientId: string
  workflows: Workflow[]
}

export interface Workflow {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  departmentId: string
  nodes: WorkflowNode[]
  executions: WorkflowExecution[]
  exceptions: WorkflowException[]
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowNode {
  id: string
  type: NodeType
  name: string
  description: string
  config: Record<string, unknown>
  workflowId: string
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'success' | 'failed' | 'running'
  startTime: Date
  endTime?: Date
  logs: string[]
  timeSaved?: number
}

export interface WorkflowException {
  id: string
  workflowId: string
  message: string
  details: string
  status: 'open' | 'resolved'
  assignedTo?: string
  resolution?: string
  createdAt: Date
  resolvedAt?: Date
}

export interface CustomAgent {
  id: string
  name: string
  description: string
  capabilities: string[]
  clientId: string
  status: 'active' | 'inactive'
  interactions: AgentInteraction[]
}

export interface AgentInteraction {
  id: string
  agentId: string
  channel: 'chat' | 'email' | 'phone' | 'slack' | 'video'
  message: string
  response: string
  timestamp: Date
}

export type WorkflowStatus = 
  | 'design_approved'
  | 'requirements_gathering'
  | 'technical_design'
  | 'development'
  | 'code_review'
  | 'client_review'
  | 'testing_plan'
  | 'testing_started'
  | 'production_deploy'

export type NodeType = 
  | 'email_monitor'
  | 'salesforce_api'
  | 'kronos_api'
  | 'ariba_api'
  | 'bill_com_api'
  | 'custom_agent'

export interface DashboardMetrics {
  totalWorkflows: number
  totalExceptions: number
  timeSaved: number
  revenue: number
  activeClients: number
  previousPeriodComparison: {
    totalWorkflows: number
    totalExceptions: number
    timeSaved: number
    revenue: number
    activeClients: number
  }
}

export interface TimeFilter {
  label: string
  value: '7d' | '30d' | 'mtd' | 'qtd' | 'ytd' | 'itd'
}

export interface SubscriptionPlan {
  id: string
  name: string
  pricingModel: 'Tiered' | 'Fixed' | 'Usage'
  contractLength: number
  contractCadence: 'Month' | 'Quarter' | 'Year'
  billingCadence: 'Monthly' | 'Quarterly' | 'Annually'
  setupFee: number
  prepaymentPercent: number
  cap: number
  overageCost: number
  clients: number
}