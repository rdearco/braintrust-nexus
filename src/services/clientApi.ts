import { mockClients } from '@/data/mockData'
import type { PaginatedResponse, ApiResponse } from './api';
import { simulateApiDelay } from './api';

// Mock API service for client data
export class ClientApiService {
  /**
   * Get all clients with optional pagination and filtering
   */
  static async getAllClients(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<typeof mockClients[0]>> {
    await simulateApiDelay(300)

    let filteredClients = [...mockClients]

    // Apply search filter
    if (params?.search) {
      const searchTerm = params.search.toLowerCase()
      filteredClients = filteredClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.url.toLowerCase().includes(searchTerm)
      )
    }

    // Apply sorting
    if (params?.sortBy) {
      filteredClients.sort((a, b) => {
        const aValue = a[params.sortBy as keyof typeof a]
        const bValue = b[params.sortBy as keyof typeof b]
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return params.sortOrder === 'desc' 
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue)
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return params.sortOrder === 'desc' 
            ? bValue - aValue
            : aValue - bValue
        }
        
        return 0
      })
    }

    // Apply pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedClients = filteredClients.slice(startIndex, endIndex)

    return {
      data: paginatedClients,
      success: true,
      pagination: {
        page,
        limit,
        total: filteredClients.length,
        totalPages: Math.ceil(filteredClients.length / limit)
      }
    }
  }

  /**
   * Get a single client by ID
   */
  static async getClientById(id: string): Promise<ApiResponse<typeof mockClients[0]>> {
    await simulateApiDelay(200)

    const client = mockClients.find(c => c.id === id)
    
    if (!client) {
      return {
        data: null as any,
        success: false,
        error: 'Client not found'
      }
    }

    return {
      data: client,
      success: true
    }
  }

  /**
   * Get dashboard metrics
   */
  static async getDashboardMetrics(): Promise<ApiResponse<{
    totalClients: number
    totalWorkflows: number
    totalExecutions: number
    totalRevenue: number
    totalExceptions: number
    totalTimeSaved: number
    totalMoneySaved: number
  }>> {
    await simulateApiDelay(400)

    const metrics = {
      totalClients: mockClients.length,
      totalWorkflows: mockClients.reduce((sum, client) => sum + client.totalWorkflows, 0),
      totalExecutions: mockClients.reduce((sum, client) => sum + client.executions, 0),
      totalRevenue: mockClients.reduce((sum, client) => sum + client.totalRevenue, 0),
      totalExceptions: mockClients.reduce((sum, client) => sum + client.exceptions, 0),
      totalTimeSaved: mockClients.reduce((sum, client) => sum + client.timeSaved, 0),
      totalMoneySaved: mockClients.reduce((sum, client) => sum + client.moneySaved, 0)
    }

    return {
      data: metrics,
      success: true
    }
  }

  /**
   * Update client information
   */
  static async updateClient(id: string, updates: Partial<typeof mockClients[0]>): Promise<ApiResponse<typeof mockClients[0]>> {
    await simulateApiDelay(500)

    const clientIndex = mockClients.findIndex(c => c.id === id)
    
    if (clientIndex === -1) {
      return {
        data: null as any,
        success: false,
        error: 'Client not found'
      }
    }

    // Simulate updating the client
    const updatedClient = {
      ...mockClients[clientIndex],
      ...updates,
      updatedAt: new Date()
    }

    // In a real app, this would update the database
    // mockClients[clientIndex] = updatedClient

    return {
      data: updatedClient,
      success: true,
      message: 'Client updated successfully'
    }
  }

  /**
   * Delete a client
   */
  static async deleteClient(id: string): Promise<ApiResponse<null>> {
    await simulateApiDelay(300)

    const clientIndex = mockClients.findIndex(c => c.id === id)
    
    if (clientIndex === -1) {
      return {
        data: null,
        success: false,
        error: 'Client not found'
      }
    }

    // In a real app, this would delete from the database
    // mockClients.splice(clientIndex, 1)

    return {
      data: null,
      success: true,
      message: 'Client deleted successfully'
    }
  }

  /**
   * Create a new client
   */
  static async createClient(clientData: Omit<typeof mockClients[0], 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<typeof mockClients[0]>> {
    await simulateApiDelay(600)

    const newClient = {
      ...clientData,
      id: `client-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // In a real app, this would save to the database
    // mockClients.push(newClient)

    return {
      data: newClient,
      success: true,
      message: 'Client created successfully'
    }
  }
}

// Export convenience functions
export const clientApi = {
  getAll: ClientApiService.getAllClients,
  getById: ClientApiService.getClientById,
  getMetrics: ClientApiService.getDashboardMetrics,
  update: ClientApiService.updateClient,
  delete: ClientApiService.deleteClient,
  create: ClientApiService.createClient
} 