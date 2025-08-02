import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserApiService, userApi } from './userApi'
import type { User } from '@/types'

// Mock the data
vi.mock('@/data/mockData', () => ({
  mockUsers: [
    {
      id: '1',
      email: 'admin@usebraintrust.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      id: '2',
      email: 'se@contractor.com',
      name: 'Solutions Engineer',
      role: 'se',
      assignedClients: ['client-1', 'client-2'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      id: '3',
      email: 'client@company.com',
      name: 'Client User',
      role: 'client',
      companyId: 'client-1',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-12-01'),
    }
  ]
}))

// Mock simulateApiDelay to make tests faster
vi.mock('./api', () => ({
  simulateApiDelay: vi.fn(() => Promise.resolve())
}))

describe('UserApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllUsers', () => {
    it('returns all users with pagination', async () => {
      const result = await UserApiService.getAllUsers()
      
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(3)
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1
      })
    })

    it('filters users by search term', async () => {
      const result = await UserApiService.getAllUsers({ search: 'admin' })
      
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('Admin User')
    })

    it('filters users by role', async () => {
      const result = await UserApiService.getAllUsers({ role: 'se' })
      
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.data[0].role).toBe('se')
    })

    it('applies pagination correctly', async () => {
      const result = await UserApiService.getAllUsers({ page: 1, limit: 2 })
      
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(result.pagination).toEqual({
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2
      })
    })

    it('sorts users by name', async () => {
      const result = await UserApiService.getAllUsers({ 
        sortBy: 'name', 
        sortOrder: 'asc' 
      })
      
      expect(result.success).toBe(true)
      expect(result.data[0].name).toBe('Admin User')
      expect(result.data[1].name).toBe('Client User')
      expect(result.data[2].name).toBe('Solutions Engineer')
    })

    it('sorts users by date', async () => {
      const result = await UserApiService.getAllUsers({ 
        sortBy: 'createdAt', 
        sortOrder: 'desc' 
      })
      
      expect(result.success).toBe(true)
      expect(result.data[0].name).toBe('Client User') // Latest date
    })
  })

  describe('getUserById', () => {
    it('returns user when found', async () => {
      const result = await UserApiService.getUserById('1')
      
      expect(result.success).toBe(true)
      expect(result.data?.name).toBe('Admin User')
      expect(result.data?.email).toBe('admin@usebraintrust.com')
    })

    it('returns error when user not found', async () => {
      const result = await UserApiService.getUserById('999')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('User not found')
    })
  })

  describe('getUserStats', () => {
    it('returns correct user statistics', async () => {
      const result = await UserApiService.getUserStats()
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        totalUsers: 3,
        totalAdmins: 1,
        totalSEs: 1,
        totalClients: 1
      })
    })
  })

  describe('updateUser', () => {
    it('returns updated user data', async () => {
      const updates = { name: 'Updated Admin' }
      const result = await UserApiService.updateUser('1', updates)
      
      expect(result.success).toBe(true)
      expect(result.data?.name).toBe('Updated Admin')
      expect(result.message).toBe('User updated successfully')
    })

    it('returns error when user not found', async () => {
      const result = await UserApiService.updateUser('999', { name: 'Test' })
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('User not found')
    })
  })

  describe('deleteUser', () => {
    it('returns success when user exists', async () => {
      const result = await UserApiService.deleteUser('1')
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('User deleted successfully')
    })

    it('returns error when user not found', async () => {
      const result = await UserApiService.deleteUser('999')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('User not found')
    })
  })

  describe('createUser', () => {
    it('creates new user successfully', async () => {
      const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
        email: 'new@test.com',
        name: 'New User',
        role: 'client'
      }
      
      const result = await UserApiService.createUser(userData)
      
      expect(result.success).toBe(true)
      expect(result.data?.name).toBe('New User')
      expect(result.data?.email).toBe('new@test.com')
      expect(result.data?.id).toMatch(/^user-\d+$/)
      expect(result.message).toBe('User created successfully')
    })
  })
})

describe('userApi convenience object', () => {
  it('exports all methods correctly', () => {
    expect(userApi.getAll).toBe(UserApiService.getAllUsers)
    expect(userApi.getById).toBe(UserApiService.getUserById)
    expect(userApi.getStats).toBe(UserApiService.getUserStats)
    expect(userApi.update).toBe(UserApiService.updateUser)
    expect(userApi.delete).toBe(UserApiService.deleteUser)
    expect(userApi.create).toBe(UserApiService.createUser)
  })
})