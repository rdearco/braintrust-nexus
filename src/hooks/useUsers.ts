import { useState, useEffect } from 'react'
import type { PaginatedResponse, ApiResponse } from '@/services/api';
import { userApi } from '@/services/userApi'
import type { User } from '@/types'

interface UseUsersOptions {
  page?: number
  limit?: number
  search?: string
  role?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  autoFetch?: boolean
}

interface UseUsersReturn {
  users: User[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null
  refetch: () => Promise<void>
  updateSearch: (search: string) => void
  updateRole: (role: string) => void
  updateSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  updatePage: (page: number) => void
}

export function useUsers(options: UseUsersOptions = {}): UseUsersReturn {
  const {
    page = 1,
    limit = 10,
    search = '',
    role = 'all',
    sortBy = '',
    sortOrder = 'asc',
    autoFetch = true
  } = options

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<UseUsersReturn['pagination']>(null)
  const [currentParams, setCurrentParams] = useState({
    page,
    limit,
    search,
    role,
    sortBy,
    sortOrder
  })

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      const response: PaginatedResponse<User> = await userApi.getAll({
        page: currentParams.page,
        limit: currentParams.limit,
        search: currentParams.search,
        role: currentParams.role,
        sortBy: currentParams.sortBy,
        sortOrder: currentParams.sortOrder
      })

      if (response.success) {
        setUsers(response.data)
        setPagination(response.pagination)
      } else {
        setError(response.error || 'Failed to fetch users')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchUsers()
    }
  }, [currentParams, autoFetch])

  const updateSearch = (search: string) => {
    setCurrentParams(prev => ({ ...prev, search, page: 1 }))
  }

  const updateRole = (role: string) => {
    setCurrentParams(prev => ({ ...prev, role, page: 1 }))
  }

  const updateSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setCurrentParams(prev => ({ ...prev, sortBy, sortOrder }))
  }

  const updatePage = (page: number) => {
    setCurrentParams(prev => ({ ...prev, page }))
  }

  return {
    users,
    loading,
    error,
    pagination,
    refetch: fetchUsers,
    updateSearch,
    updateRole,
    updateSort,
    updatePage
  }
}

// Hook for user statistics
interface UseUserStatsReturn {
  stats: {
    totalUsers: number
    totalAdmins: number
    totalSEs: number
    totalClients: number
  } | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUserStats(): UseUserStatsReturn {
  const [stats, setStats] = useState<UseUserStatsReturn['stats']>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await userApi.getStats()

      if (response.success) {
        setStats(response.data)
      } else {
        setError(response.error || 'Failed to fetch user statistics')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

// Hook for single user
interface UseUserReturn {
  user: User | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUser(id: string): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const response: ApiResponse<User> = await userApi.getById(id)

      if (response.success) {
        setUser(response.data)
      } else {
        setError(response.error || 'Failed to fetch user')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [id])

  return {
    user,
    loading,
    error,
    refetch: fetchUser
  }
}