import { useState, useEffect } from 'react'
import type { PaginatedResponse, ApiResponse } from '@/services/api';
import { clientApi } from '@/services/clientApi'
import type { Client } from '@/types'

interface UseClientsOptions {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  autoFetch?: boolean
}

interface UseClientsReturn {
  clients: Client[]
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
  updateSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  updatePage: (page: number) => void
}

export function useClients(options: UseClientsOptions = {}): UseClientsReturn {
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = '',
    sortOrder = 'asc',
    autoFetch = true
  } = options

  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<UseClientsReturn['pagination']>(null)
  const [currentParams, setCurrentParams] = useState({
    page,
    limit,
    search,
    sortBy,
    sortOrder
  })

  const fetchClients = async () => {
    setLoading(true)
    setError(null)

    try {
      const response: PaginatedResponse<Client> = await clientApi.getAll({
        page: currentParams.page,
        limit: currentParams.limit,
        search: currentParams.search,
        sortBy: currentParams.sortBy,
        sortOrder: currentParams.sortOrder
      })

      if (response.success) {
        setClients(response.data)
        setPagination(response.pagination)
      } else {
        setError(response.error || 'Failed to fetch clients')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchClients()
    }
  }, [currentParams, autoFetch])

  const updateSearch = (search: string) => {
    setCurrentParams(prev => ({ ...prev, search, page: 1 }))
  }

  const updateSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setCurrentParams(prev => ({ ...prev, sortBy, sortOrder }))
  }

  const updatePage = (page: number) => {
    setCurrentParams(prev => ({ ...prev, page }))
  }

  return {
    clients,
    loading,
    error,
    pagination,
    refetch: fetchClients,
    updateSearch,
    updateSort,
    updatePage
  }
}

// Hook for dashboard metrics
interface UseDashboardMetricsReturn {
  metrics: {
    totalClients: number
    totalWorkflows: number
    totalExecutions: number
    totalRevenue: number
    totalExceptions: number
    totalTimeSaved: number
    totalMoneySaved: number
  } | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboardMetrics(): UseDashboardMetricsReturn {
  const [metrics, setMetrics] = useState<UseDashboardMetricsReturn['metrics']>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await clientApi.getMetrics()

      if (response.success) {
        setMetrics(response.data)
      } else {
        setError(response.error || 'Failed to fetch metrics')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics
  }
}

// Hook for single client
interface UseClientReturn {
  client: Client | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useClient(id: string): UseClientReturn {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClient = async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const response: ApiResponse<Client> = await clientApi.getById(id)

      if (response.success) {
        setClient(response.data)
      } else {
        setError(response.error || 'Failed to fetch client')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClient()
  }, [id])

  return {
    client,
    loading,
    error,
    refetch: fetchClient
  }
} 