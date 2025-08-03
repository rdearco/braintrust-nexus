import { useState, useEffect } from 'react'
import type { PaginatedResponse, ApiResponse } from '@/services/api';
import { workflowApi } from '@/services/workflowApi'
import type { WorkflowData } from '@/types'

interface UseWorkflowsOptions {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  department?: string
  status?: string
  autoFetch?: boolean
}

interface UseWorkflowsReturn {
  workflows: WorkflowData[]
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
  updateFilters: (filters: { department?: string; status?: string }) => void
}

export function useWorkflows(options: UseWorkflowsOptions = {}): UseWorkflowsReturn {
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = '',
    sortOrder = 'asc',
    department = '',
    status = '',
    autoFetch = true
  } = options

  const [workflows, setWorkflows] = useState<WorkflowData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<UseWorkflowsReturn['pagination']>(null)
  const [currentParams, setCurrentParams] = useState({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    department,
    status
  })

  const fetchWorkflows = async () => {
    setLoading(true)
    setError(null)

    try {
      const response: PaginatedResponse<WorkflowData> = await workflowApi.getAll({
        page: currentParams.page,
        limit: currentParams.limit,
        search: currentParams.search,
        sortBy: currentParams.sortBy,
        sortOrder: currentParams.sortOrder,
        department: currentParams.department || undefined,
        status: currentParams.status || undefined
      })

      if (response.success) {
        setWorkflows(response.data)
        setPagination(response.pagination)
      } else {
        setError(response.error || 'Failed to fetch workflows')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchWorkflows()
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

  const updateFilters = (filters: { department?: string; status?: string }) => {
    setCurrentParams(prev => ({ 
      ...prev, 
      department: filters.department || '', 
      status: filters.status || '',
      page: 1 
    }))
  }

  return {
    workflows,
    loading,
    error,
    pagination,
    refetch: fetchWorkflows,
    updateSearch,
    updateSort,
    updatePage,
    updateFilters
  }
}

// Hook for workflow statistics
interface UseWorkflowStatsReturn {
  stats: {
    totalWorkflows: number
    totalExecutions: number
    totalExceptions: number
    totalTimeSaved: number
    totalCostSaved: number
    activeWorkflows: number
  } | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useWorkflowStats(): UseWorkflowStatsReturn {
  const [stats, setStats] = useState<UseWorkflowStatsReturn['stats']>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await workflowApi.getStats()

      if (response.success) {
        setStats(response.data)
      } else {
        setError(response.error || 'Failed to fetch workflow stats')
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

// Hook for single workflow
interface UseWorkflowReturn {
  workflow: WorkflowData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useWorkflow(id: string): UseWorkflowReturn {
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkflow = async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const response: ApiResponse<WorkflowData> = await workflowApi.getById(id)

      if (response.success) {
        setWorkflow(response.data)
      } else {
        setError(response.error || 'Failed to fetch workflow')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkflow()
  }, [id])

  return {
    workflow,
    loading,
    error,
    refetch: fetchWorkflow
  }
}