import { useState, useEffect } from 'react'
import { subscriptionApi } from '@/services/subscriptionApi'
import type { SubscriptionPlan } from '@/types'

interface UseSubscriptionsParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface UseSubscriptionsReturn {
  plans: SubscriptionPlan[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null
  updateSearch: (search: string) => void
  updateSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  refetch: () => void
}

export function useSubscriptions(params: UseSubscriptionsParams = {}): UseSubscriptionsReturn {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<UseSubscriptionsReturn['pagination']>(null)
  const [searchTerm, setSearchTerm] = useState(params.search || '')
  const [sortBy, setSortBy] = useState(params.sortBy || '')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(params.sortOrder || 'asc')

  const fetchPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await subscriptionApi.getAll({
        page: params.page,
        limit: params.limit,
        search: searchTerm,
        sortBy: sortBy || undefined,
        sortOrder: sortBy ? sortOrder : undefined
      })

      if (response.success) {
        setPlans(response.data)
        setPagination(response.pagination)
      } else {
        setError('Failed to load subscription plans')
        setPlans([])
        setPagination(null)
      }
    } catch (err) {
      setError('An error occurred while loading subscription plans')
      setPlans([])
      setPagination(null)
      console.error('Error fetching subscription plans:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [params.page, params.limit, searchTerm, sortBy, sortOrder])

  const updateSearch = (search: string) => {
    setSearchTerm(search)
  }

  const updateSort = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
  }

  const refetch = () => {
    fetchPlans()
  }

  return {
    plans,
    loading,
    error,
    pagination,
    updateSearch,
    updateSort,
    refetch
  }
}

interface UseSubscriptionStatsReturn {
  stats: {
    totalPlans: number
    totalClients: number
    averageSetupFee: number
    mostPopularPricingModel: string
  } | null
  loading: boolean
  error: string | null
}

export function useSubscriptionStats(): UseSubscriptionStatsReturn {
  const [stats, setStats] = useState<UseSubscriptionStatsReturn['stats']>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await subscriptionApi.getStats()

        if (response.success) {
          setStats(response.data)
        } else {
          setError('Failed to load subscription statistics')
          setStats(null)
        }
      } catch (err) {
        setError('An error occurred while loading subscription statistics')
        setStats(null)
        console.error('Error fetching subscription stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error
  }
}