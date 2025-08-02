import { mockUsers } from '@/data/mockData'
import type { PaginatedResponse, ApiResponse } from './api'
import { simulateApiDelay } from './api'
import type { User } from '@/types'

// Mock API service for user data
export class UserApiService {
  /**
   * Get all users with optional pagination and filtering
   */
  static async getAllUsers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<User>> {
    await simulateApiDelay(300)

    let filteredUsers = [...mockUsers]

    // Apply search filter
    if (params?.search) {
      const searchTerm = params.search.toLowerCase()
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      )
    }

    // Apply role filter
    if (params?.role && params.role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === params.role)
    }

    // Apply sorting
    if (params?.sortBy) {
      filteredUsers.sort((a, b) => {
        const aValue = a[params.sortBy as keyof User]
        const bValue = b[params.sortBy as keyof User]
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return params.sortOrder === 'desc' 
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue)
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return params.sortOrder === 'desc' 
            ? bValue.getTime() - aValue.getTime()
            : aValue.getTime() - bValue.getTime()
        }
        
        return 0
      })
    }

    // Apply pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return {
      data: paginatedUsers,
      success: true,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    }
  }

  /**
   * Get a single user by ID
   */
  static async getUserById(id: string): Promise<ApiResponse<User>> {
    await simulateApiDelay(200)

    const user = mockUsers.find(u => u.id === id)
    
    if (!user) {
      return {
        data: null as any,
        success: false,
        error: 'User not found'
      }
    }

    return {
      data: user,
      success: true
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<ApiResponse<{
    totalUsers: number
    totalAdmins: number
    totalSEs: number
    totalClients: number
  }>> {
    await simulateApiDelay(300)

    const stats = {
      totalUsers: mockUsers.length,
      totalAdmins: mockUsers.filter(u => u.role === 'admin').length,
      totalSEs: mockUsers.filter(u => u.role === 'se').length,
      totalClients: mockUsers.filter(u => u.role === 'client').length
    }

    return {
      data: stats,
      success: true
    }
  }

  /**
   * Update user information
   */
  static async updateUser(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    await simulateApiDelay(500)

    const userIndex = mockUsers.findIndex(u => u.id === id)
    
    if (userIndex === -1) {
      return {
        data: null as any,
        success: false,
        error: 'User not found'
      }
    }

    // Simulate updating the user
    const updatedUser = {
      ...mockUsers[userIndex],
      ...updates,
      updatedAt: new Date()
    }

    // In a real app, this would update the database
    // mockUsers[userIndex] = updatedUser

    return {
      data: updatedUser,
      success: true,
      message: 'User updated successfully'
    }
  }

  /**
   * Delete a user
   */
  static async deleteUser(id: string): Promise<ApiResponse<null>> {
    await simulateApiDelay(300)

    const userIndex = mockUsers.findIndex(u => u.id === id)
    
    if (userIndex === -1) {
      return {
        data: null,
        success: false,
        error: 'User not found'
      }
    }

    // In a real app, this would delete from the database
    // mockUsers.splice(userIndex, 1)

    return {
      data: null,
      success: true,
      message: 'User deleted successfully'
    }
  }

  /**
   * Create a new user
   */
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
    await simulateApiDelay(600)

    const newUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // In a real app, this would save to the database
    // mockUsers.push(newUser)

    return {
      data: newUser,
      success: true,
      message: 'User created successfully'
    }
  }
}

// Export convenience functions
export const userApi = {
  getAll: UserApiService.getAllUsers,
  getById: UserApiService.getUserById,
  getStats: UserApiService.getUserStats,
  update: UserApiService.updateUser,
  delete: UserApiService.deleteUser,
  create: UserApiService.createUser
}