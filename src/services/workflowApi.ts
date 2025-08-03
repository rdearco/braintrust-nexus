import { mockWorkflowData } from '@/data/mockData'
import type { PaginatedResponse, ApiResponse } from './api';
import { simulateApiDelay } from './api';
import type { WorkflowData } from '@/types';

// Mock API service for workflow data
export class WorkflowApiService {
  /**
   * Get all workflows with optional pagination and filtering
   */
  static async getAllWorkflows(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    department?: string
    status?: string
  }): Promise<PaginatedResponse<WorkflowData>> {
    await simulateApiDelay(300)

    let filteredWorkflows = [...mockWorkflowData]

    // Apply search filter
    if (params?.search) {
      const searchTerm = params.search.toLowerCase()
      filteredWorkflows = filteredWorkflows.filter(workflow =>
        workflow.workflowName.toLowerCase().includes(searchTerm) ||
        workflow.description.toLowerCase().includes(searchTerm) ||
        workflow.department.toLowerCase().includes(searchTerm)
      )
    }

    // Apply department filter
    if (params?.department) {
      filteredWorkflows = filteredWorkflows.filter(workflow =>
        workflow.department === params.department
      )
    }

    // Apply status filter
    if (params?.status) {
      filteredWorkflows = filteredWorkflows.filter(workflow =>
        workflow.status === params.status
      )
    }

    // Apply sorting
    if (params?.sortBy) {
      filteredWorkflows.sort((a, b) => {
        const aValue = a[params.sortBy as keyof WorkflowData]
        const bValue = b[params.sortBy as keyof WorkflowData]
        
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
    const paginatedWorkflows = filteredWorkflows.slice(startIndex, endIndex)

    return {
      data: paginatedWorkflows,
      success: true,
      pagination: {
        page,
        limit,
        total: filteredWorkflows.length,
        totalPages: Math.ceil(filteredWorkflows.length / limit)
      }
    }
  }

  /**
   * Get a single workflow by ID
   */
  static async getWorkflowById(id: string): Promise<ApiResponse<WorkflowData>> {
    await simulateApiDelay(200)

    const workflow = mockWorkflowData.find(w => w.id === id)
    
    if (!workflow) {
      return {
        data: null as any,
        success: false,
        error: 'Workflow not found'
      }
    }

    return {
      data: workflow,
      success: true
    }
  }

  /**
   * Get workflow statistics
   */
  static async getWorkflowStats(): Promise<ApiResponse<{
    totalWorkflows: number
    totalExecutions: number
    totalExceptions: number
    totalTimeSaved: number
    totalCostSaved: number
    activeWorkflows: number
  }>> {
    await simulateApiDelay(400)

    const stats = {
      totalWorkflows: mockWorkflowData.length,
      totalExecutions: mockWorkflowData.reduce((sum, workflow) => sum + workflow.executions, 0),
      totalExceptions: mockWorkflowData.reduce((sum, workflow) => sum + workflow.exceptions, 0),
      totalTimeSaved: mockWorkflowData.reduce((sum, workflow) => sum + workflow.timeSaved, 0),
      totalCostSaved: mockWorkflowData.reduce((sum, workflow) => sum + workflow.costSaved, 0),
      activeWorkflows: mockWorkflowData.filter(workflow => workflow.status === 'active').length
    }

    return {
      data: stats,
      success: true
    }
  }

  /**
   * Update workflow information
   */
  static async updateWorkflow(id: string, updates: Partial<WorkflowData>): Promise<ApiResponse<WorkflowData>> {
    await simulateApiDelay(500)

    const workflowIndex = mockWorkflowData.findIndex(w => w.id === id)
    
    if (workflowIndex === -1) {
      return {
        data: null as any,
        success: false,
        error: 'Workflow not found'
      }
    }

    // Simulate updating the workflow
    const updatedWorkflow = {
      ...mockWorkflowData[workflowIndex],
      ...updates
    }

    // In a real app, this would update the database
    mockWorkflowData[workflowIndex] = updatedWorkflow

    return {
      data: updatedWorkflow,
      success: true,
      message: 'Workflow updated successfully'
    }
  }

  /**
   * Delete a workflow
   */
  static async deleteWorkflow(id: string): Promise<ApiResponse<null>> {
    await simulateApiDelay(300)

    const workflowIndex = mockWorkflowData.findIndex(w => w.id === id)
    
    if (workflowIndex === -1) {
      return {
        data: null,
        success: false,
        error: 'Workflow not found'
      }
    }

    // In a real app, this would delete from the database
    mockWorkflowData.splice(workflowIndex, 1)

    return {
      data: null,
      success: true,
      message: 'Workflow deleted successfully'
    }
  }

  /**
   * Create a new workflow
   */
  static async createWorkflow(workflowData: Omit<WorkflowData, 'id'>): Promise<ApiResponse<WorkflowData>> {
    await simulateApiDelay(600)

    const newWorkflow = {
      ...workflowData,
      id: `workflow-${Date.now()}`
    }

    // Add to mockWorkflowData to update the data
    mockWorkflowData.push(newWorkflow)

    return {
      data: newWorkflow,
      success: true,
      message: 'Workflow created successfully'
    }
  }

  /**
   * Toggle workflow status
   */
  static async toggleWorkflowStatus(id: string): Promise<ApiResponse<WorkflowData>> {
    await simulateApiDelay(300)

    const workflowIndex = mockWorkflowData.findIndex(w => w.id === id)
    
    if (workflowIndex === -1) {
      return {
        data: null as any,
        success: false,
        error: 'Workflow not found'
      }
    }

    const workflow = mockWorkflowData[workflowIndex]
    const newStatus = workflow.status === 'active' ? 'inactive' : 'active'
    
    const updatedWorkflow = {
      ...workflow,
      status: newStatus
    }

    // In a real app, this would update the database
    mockWorkflowData[workflowIndex] = updatedWorkflow

    return {
      data: updatedWorkflow,
      success: true,
      message: `Workflow ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
    }
  }
}

// Export convenience functions
export const workflowApi = {
  getAll: WorkflowApiService.getAllWorkflows,
  getById: WorkflowApiService.getWorkflowById,
  getStats: WorkflowApiService.getWorkflowStats,
  update: WorkflowApiService.updateWorkflow,
  delete: WorkflowApiService.deleteWorkflow,
  create: WorkflowApiService.createWorkflow,
  toggleStatus: WorkflowApiService.toggleWorkflowStatus
}