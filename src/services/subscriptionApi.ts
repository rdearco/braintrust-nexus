import { mockSubscriptionPlans } from '@/data/mockData'
import type { PaginatedResponse, ApiResponse } from './api';
import { simulateApiDelay } from './api';

// Mock API service for subscription plan data
export class SubscriptionApiService {
  /**
   * Get all subscription plans with optional pagination and filtering
   */
  static async getAllPlans(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<typeof mockSubscriptionPlans[0]>> {
    await simulateApiDelay(300)

    let filteredPlans = [...mockSubscriptionPlans]

    // Apply search filter
    if (params?.search) {
      const searchTerm = params.search.toLowerCase()
      filteredPlans = filteredPlans.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm) ||
        plan.pricingModel.toLowerCase().includes(searchTerm)
      )
    }

    // Apply sorting
    if (params?.sortBy) {
      filteredPlans.sort((a, b) => {
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
    const paginatedPlans = filteredPlans.slice(startIndex, endIndex)

    return {
      data: paginatedPlans,
      success: true,
      pagination: {
        page,
        limit,
        total: filteredPlans.length,
        totalPages: Math.ceil(filteredPlans.length / limit)
      }
    }
  }

  /**
   * Get a single subscription plan by ID
   */
  static async getPlanById(id: string): Promise<ApiResponse<typeof mockSubscriptionPlans[0]>> {
    await simulateApiDelay(200)

    const plan = mockSubscriptionPlans.find(p => p.id === id)
    
    if (!plan) {
      return {
        data: null as any,
        success: false,
        error: 'Subscription plan not found'
      }
    }

    return {
      data: plan,
      success: true
    }
  }

  /**
   * Create a new subscription plan
   */
  static async createPlan(planData: Omit<typeof mockSubscriptionPlans[0], 'id'>): Promise<ApiResponse<typeof mockSubscriptionPlans[0]>> {
    await simulateApiDelay(600)

    const newPlan = {
      ...planData,
      id: `plan-${Date.now()}`
    }

    // Add to mockSubscriptionPlans to update the data
    mockSubscriptionPlans.push(newPlan)

    return {
      data: newPlan,
      success: true,
      message: 'Subscription plan created successfully'
    }
  }

  /**
   * Update subscription plan information
   */
  static async updatePlan(id: string, updates: Partial<typeof mockSubscriptionPlans[0]>): Promise<ApiResponse<typeof mockSubscriptionPlans[0]>> {
    await simulateApiDelay(500)

    const planIndex = mockSubscriptionPlans.findIndex(p => p.id === id)
    
    if (planIndex === -1) {
      return {
        data: null as any,
        success: false,
        error: 'Subscription plan not found'
      }
    }

    // Simulate updating the plan
    const updatedPlan = {
      ...mockSubscriptionPlans[planIndex],
      ...updates
    }

    // In a real app, this would update the database
    mockSubscriptionPlans[planIndex] = updatedPlan

    return {
      data: updatedPlan,
      success: true,
      message: 'Subscription plan updated successfully'
    }
  }

  /**
   * Delete a subscription plan
   */
  static async deletePlan(id: string): Promise<ApiResponse<null>> {
    await simulateApiDelay(300)

    const planIndex = mockSubscriptionPlans.findIndex(p => p.id === id)
    
    if (planIndex === -1) {
      return {
        data: null,
        success: false,
        error: 'Subscription plan not found'
      }
    }

    // In a real app, this would delete from the database
    mockSubscriptionPlans.splice(planIndex, 1)

    return {
      data: null,
      success: true,
      message: 'Subscription plan deleted successfully'
    }
  }

  /**
   * Get subscription plan statistics
   */
  static async getPlanStats(): Promise<ApiResponse<{
    totalPlans: number
    totalClients: number
    averageSetupFee: number
    mostPopularPricingModel: string
  }>> {
    await simulateApiDelay(400)

    const totalClients = mockSubscriptionPlans.reduce((sum, plan) => sum + plan.clients, 0)
    const averageSetupFee = mockSubscriptionPlans.reduce((sum, plan) => sum + plan.setupFee, 0) / mockSubscriptionPlans.length
    
    // Find most popular pricing model
    const pricingModelCounts = mockSubscriptionPlans.reduce((acc, plan) => {
      acc[plan.pricingModel] = (acc[plan.pricingModel] || 0) + plan.clients
      return acc
    }, {} as Record<string, number>)
    
    const mostPopularPricingModel = Object.entries(pricingModelCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Fixed'

    const stats = {
      totalPlans: mockSubscriptionPlans.length,
      totalClients,
      averageSetupFee,
      mostPopularPricingModel
    }

    return {
      data: stats,
      success: true
    }
  }
}

// Export convenience functions
export const subscriptionApi = {
  getAll: SubscriptionApiService.getAllPlans,
  getById: SubscriptionApiService.getPlanById,
  getStats: SubscriptionApiService.getPlanStats,
  create: SubscriptionApiService.createPlan,
  update: SubscriptionApiService.updatePlan,
  delete: SubscriptionApiService.deletePlan
}