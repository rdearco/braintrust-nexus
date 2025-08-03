import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowUpDown } from 'lucide-react'
import { useWorkflows } from '@/hooks/useWorkflows'
import { workflowApi } from '@/services/workflowApi'
import type { WorkflowData } from '@/types'

export function Workflows() {
  const { workflows, loading, error, refetch } = useWorkflows({ limit: 100 })
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showAddWorkflowForm, setShowAddWorkflowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string>('')
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowData | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    workflowName: '',
    description: '',
    department: '',
    nodes: 0,
    timeSaved: 0,
    costSaved: 0,
    status: 'active'
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const toggleWorkflowStatus = async (workflowId: string) => {
    try {
      await workflowApi.toggleStatus(workflowId)
      refetch() // Refresh the workflows list to get updated status
    } catch (error) {
      console.error('Failed to toggle workflow status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      workflowName: '',
      description: '',
      department: '',
      nodes: 0,
      timeSaved: 0,
      costSaved: 0,
      status: 'active'
    })
    setFormError('')
  }

  const handleCloseForm = () => {
    setShowAddWorkflowForm(false)
    setIsEditMode(false)
    setEditingWorkflow(null)
    resetForm()
  }

  const handleEditWorkflow = (workflow: WorkflowData) => {
    setEditingWorkflow(workflow)
    setIsEditMode(true)
    setFormData({
      workflowName: workflow.workflowName,
      description: workflow.description,
      department: workflow.department,
      nodes: workflow.nodes,
      timeSaved: workflow.timeSaved,
      costSaved: workflow.costSaved,
      status: workflow.status
    })
    setShowAddWorkflowForm(true)
  }

  const handleSubmit = async () => {
    setFormError('')
    
    // Validation
    if (!formData.workflowName.trim()) {
      setFormError('Workflow name is required')
      return
    }
    
    if (!formData.description.trim()) {
      setFormError('Description is required')
      return
    }
    
    if (!formData.department.trim()) {
      setFormError('Department is required')
      return
    }

    if (formData.nodes <= 0) {
      setFormError('Nodes must be greater than 0')
      return
    }

    if (formData.timeSaved < 0) {
      setFormError('Time saved cannot be negative')
      return
    }

    if (formData.costSaved < 0) {
      setFormError('Cost saved cannot be negative')
      return
    }

    setIsSubmitting(true)
    
    try {
      if (isEditMode && editingWorkflow) {
        // Update existing workflow
        const updates: Partial<WorkflowData> = {
          workflowName: formData.workflowName.trim(),
          description: formData.description.trim(),
          department: formData.department.trim(),
          nodes: formData.nodes,
          timeSaved: formData.timeSaved,
          costSaved: formData.costSaved,
          status: formData.status
        }

        const response = await workflowApi.update(editingWorkflow.id, updates)
        
        if (response.success) {
          handleCloseForm()
          refetch() // Refresh the workflows list
        } else {
          setFormError(response.error || 'Failed to update workflow')
        }
      } else {
        // Create new workflow
        const workflowData: Omit<WorkflowData, 'id'> = {
          workflowName: formData.workflowName.trim(),
          description: formData.description.trim(),
          department: formData.department.trim(),
          nodes: formData.nodes,
          timeSaved: formData.timeSaved,
          costSaved: formData.costSaved,
          status: formData.status,
          createDateTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
          executions: 0,
          exceptions: 0
        }

        const response = await workflowApi.create(workflowData)
        
        if (response.success) {
          handleCloseForm()
          refetch() // Refresh the workflows list
        } else {
          setFormError(response.error || 'Failed to create workflow')
        }
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} workflow:`, error)
      setFormError(`An unexpected error occurred while ${isEditMode ? 'updating' : 'creating'} the workflow`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const newWorkflowForm = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Workflow' : 'Add New Workflow'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {formError}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Workflow Name *</label>
                <Input 
                  placeholder="Enter workflow name" 
                  value={formData.workflowName}
                  onChange={(e) => setFormData(prev => ({ ...prev, workflowName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Department *</label>
                <Input 
                  placeholder="Enter department" 
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description *</label>
                <Input 
                  placeholder="Enter workflow description" 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nodes *</label>
                <Input 
                  placeholder="Number of nodes" 
                  type="number" 
                  min="1"
                  value={formData.nodes || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, nodes: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Time Saved (hours)</label>
                <Input 
                  placeholder="Hours saved" 
                  type="number" 
                  step="0.1" 
                  min="0"
                  value={formData.timeSaved || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeSaved: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cost Saved ($)</label>
                <Input 
                  placeholder="Cost saved in dollars" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={formData.costSaved || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, costSaved: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="testing">Testing</option>
                  <option value="development">Development</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleCloseForm}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Workflow' : 'Add Workflow')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Workflow ROI</h1>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading workflows...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Workflow ROI</h1>
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Workflow ROI</h1>
        <Button 
          className="bg-black hover:bg-gray-800 text-white"
          onClick={() => setShowAddWorkflowForm(true)}
        >
          + New Workflow
        </Button>
      </div>

      {/* Workflow ROI Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('createDateTime')}
                >
                  <div className="flex items-center">
                    Create Date/Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center">
                    Department
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('workflowName')}
                >
                  <div className="flex items-center">
                    Workflow Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('nodes')}
                >
                  <div className="flex items-center">
                    Nodes
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('executions')}
                >
                  <div className="flex items-center">
                    Executions
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('exceptions')}
                >
                  <div className="flex items-center">
                    Exceptions
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('timeSaved')}
                >
                  <div className="flex items-center">
                    Time Saved
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('costSaved')}
                >
                  <div className="flex items-center">
                    Cost Saved
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">
                    {workflow.createDateTime}
                  </TableCell>
                  <TableCell>{workflow.department}</TableCell>
                  <TableCell>
                    <span 
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => handleEditWorkflow(workflow)}
                    >
                      {workflow.workflowName}
                    </span>
                  </TableCell>
                  <TableCell>{workflow.description}</TableCell>
                  <TableCell>{workflow.nodes}</TableCell>
                  <TableCell>
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {workflow.executions}
                    </span>
                  </TableCell>
                  <TableCell>{workflow.exceptions}</TableCell>
                  <TableCell>{workflow.timeSaved} hrs</TableCell>
                  <TableCell>${workflow.costSaved.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant={workflow.status === 'active' ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleWorkflowStatus(workflow.id)}
                      className={`w-16 h-6 text-xs ${
                        workflow.status === 'active'
                          ? 'bg-black hover:bg-gray-800 text-white' 
                          : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300'
                      }`}
                    >
                      {workflow.status === 'active' ? 'ON' : 'OFF'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Workflow Form */}
      {showAddWorkflowForm && newWorkflowForm()}
    </div>
  )
}