// Types for API responses
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Simulate API delay
export const simulateApiDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))