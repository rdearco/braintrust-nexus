import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ClientApiService, clientApi } from './clientApi'
// import { mockClients } from '@/data/mockData'

// Mock the mockData import
vi.mock('@/data/mockData', () => ({
  mockClients: [
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
      departments: [],
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
      departments: [],
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-12-01'),
    }
  ]
}))

describe('ClientApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllClients', () => {
    it('returns all clients without parameters', async () => {
      const result = await ClientApiService.getAllClients()
      
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1
      })
    })

    it('filters clients by search term', async () => {
      const result = await ClientApiService.getAllClients({ search: 'Acme' })
      
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('Acme Corporation')
    })

    it('sorts clients by name in ascending order', async () => {
      const result = await ClientApiService.getAllClients({ 
        sortBy: 'name', 
        sortOrder: 'asc' 
      })
      
      expect(result.success).toBe(true)
      expect(result.data[0].name).toBe('Acme Corporation')
      expect(result.data[1].name).toBe('Global Industries')
    })

    it('sorts clients by name in descending order', async () => {
      const result = await ClientApiService.getAllClients({ 
        sortBy: 'name', 
        sortOrder: 'desc' 
      })
      
      expect(result.success).toBe(true)
      expect(result.data[0].name).toBe('Global Industries')
      expect(result.data[1].name).toBe('Acme Corporation')
    })

    it('sorts clients by revenue in descending order', async () => {
      const result = await ClientApiService.getAllClients({ 
        sortBy: 'totalRevenue', 
        sortOrder: 'desc' 
      })
      
      expect(result.success).toBe(true)
      expect(result.data[0].totalRevenue).toBe(450000)
      expect(result.data[1].totalRevenue).toBe(320000)
    })

    it('applies pagination correctly', async () => {
      const result = await ClientApiService.getAllClients({ 
        page: 1, 
        limit: 1 
      })
      
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.pagination).toEqual({
        page: 1,
        limit: 1,
        total: 2,
        totalPages: 2
      })
    })
  })

  describe('getClientById', () => {
    it('returns client when found', async () => {
      const result = await ClientApiService.getClientById('client-1')
      
      expect(result.success).toBe(true)
      expect(result.data?.name).toBe('Acme Corporation')
    })

    it('returns error when client not found', async () => {
      const result = await ClientApiService.getClientById('non-existent')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Client not found')
    })
  })

  describe('getDashboardMetrics', () => {
    it('returns aggregated metrics from all clients', async () => {
      const result = await ClientApiService.getDashboardMetrics()
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        totalClients: 2,
        totalWorkflows: 20, // 12 + 8
        totalExecutions: 4500, // 2847 + 1653
        totalRevenue: 770000, // 450000 + 320000
        totalExceptions: 35, // 23 + 12
        totalTimeSaved: 2040, // 1200 + 840
        totalMoneySaved: 305000 // 180000 + 125000
      })
    })
  })

  describe('updateClient', () => {
    it('returns updated client data', async () => {
      const updates = { name: 'Updated Acme Corp' }
      const result = await ClientApiService.updateClient('client-1', updates)
      
      expect(result.success).toBe(true)
      expect(result.data?.name).toBe('Updated Acme Corp')
      expect(result.message).toBe('Client updated successfully')
    })

    it('returns error when client not found', async () => {
      const result = await ClientApiService.updateClient('non-existent', { name: 'Test' })
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Client not found')
    })
  })

  describe('deleteClient', () => {
    it('returns success for existing client', async () => {
      const result = await ClientApiService.deleteClient('client-1')
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('Client deleted successfully')
    })

    it('returns error when client not found', async () => {
      const result = await ClientApiService.deleteClient('non-existent')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Client not found')
    })
  })

  describe('createClient', () => {
    it('returns new client with generated id', async () => {
      const newClientData = {
        name: 'New Client',
        url: 'https://newclient.com',
        contractStartDate: new Date('2024-01-01'),
        totalWorkflows: 5,
        totalNodes: 20,
        executions: 1000,
        exceptions: 5,
        totalRevenue: 100000,
        timeSaved: 500,
        moneySaved: 75000,
        departments: []
      }

      const result = await ClientApiService.createClient(newClientData)
      
      expect(result.success).toBe(true)
      expect(result.data?.name).toBe('New Client')
      expect(result.data?.id).toMatch(/^client-\d+$/)
      expect(result.message).toBe('Client created successfully')
    })
  })
})

describe('clientApi convenience functions', () => {
  it('exports all service methods', () => {
    expect(clientApi.getAll).toBe(ClientApiService.getAllClients)
    expect(clientApi.getById).toBe(ClientApiService.getClientById)
    expect(clientApi.getMetrics).toBe(ClientApiService.getDashboardMetrics)
    expect(clientApi.update).toBe(ClientApiService.updateClient)
    expect(clientApi.delete).toBe(ClientApiService.deleteClient)
    expect(clientApi.create).toBe(ClientApiService.createClient)
  })
}) 