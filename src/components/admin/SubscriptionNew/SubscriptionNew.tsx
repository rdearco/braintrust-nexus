import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { subscriptionApi } from '@/services/subscriptionApi'
import type { SubscriptionPlan } from '@/types'

export function SubscriptionNew() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    planName: '',
    pricingModel: 'Fixed',
    contractLength: '',
    contractCadence: 'Month',
    billingCadence: 'AIR Direct',
    billingFrequency: 'Month',
    setupFee: '',
    prepaymentPercent: '',
    cap: '',
    overageCost: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const errorMessageRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCancel = () => {
    navigate('/admin/subscriptions')
  }

  const handleCreatePlan = async () => {
    // Clear previous messages
    setFormError('')
    setSuccessMessage('')

    // Validate required fields
    if (!formData.planName.trim()) {
      setFormError('Please fill in required field: Plan Name')
      // Scroll to error message after it's rendered
      setTimeout(() => {
        errorMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return
    }

    // Validate numeric fields
    const contractLength = parseInt(formData.contractLength)
    const setupFee = parseFloat(formData.setupFee)
    const prepaymentPercent = parseFloat(formData.prepaymentPercent)
    const cap = parseFloat(formData.cap)
    const overageCost = parseFloat(formData.overageCost)

    if (!formData.contractLength || isNaN(contractLength) || contractLength <= 0) {
      setFormError('Please enter a valid contract length')
      setTimeout(() => {
        errorMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return
    }

    if (!formData.setupFee || isNaN(setupFee) || setupFee < 0) {
      setFormError('Please enter a valid setup fee')
      setTimeout(() => {
        errorMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return
    }

    if (!formData.prepaymentPercent || isNaN(prepaymentPercent) || prepaymentPercent < 0 || prepaymentPercent > 100) {
      setFormError('Please enter a valid prepayment percentage (0-100)')
      setTimeout(() => {
        errorMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return
    }

    if (!formData.cap || isNaN(cap) || cap < 0) {
      setFormError('Please enter a valid cap amount')
      setTimeout(() => {
        errorMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return
    }

    if (!formData.overageCost || isNaN(overageCost) || overageCost < 0) {
      setFormError('Please enter a valid overage cost')
      setTimeout(() => {
        errorMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return
    }

    setIsSubmitting(true)
    
    try {
      // Map billing frequency to billing cadence
      const getBillingCadence = (frequency: string): 'Monthly' | 'Quarterly' | 'Annually' => {
        switch (frequency) {
          case 'Month': return 'Monthly'
          case 'Quarter': return 'Quarterly'
          case 'Year': return 'Annually'
          default: return 'Monthly'
        }
      }

      const planData: Omit<SubscriptionPlan, 'id'> = {
        name: formData.planName.trim(),
        pricingModel: formData.pricingModel as 'Tiered' | 'Fixed' | 'Usage',
        contractLength: contractLength,
        contractCadence: formData.contractCadence as 'Month' | 'Quarter' | 'Year',
        billingCadence: getBillingCadence(formData.billingFrequency),
        setupFee: setupFee,
        prepaymentPercent: prepaymentPercent,
        cap: cap,
        overageCost: overageCost,
        clients: 0 // Start with 0 clients for new plans
      }

      const response = await subscriptionApi.create(planData)
      
      if (response.success) {
        setSuccessMessage('Subscription plan created successfully!')
        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate('/admin/subscriptions')
        }, 1500)
      } else {
        setFormError(response.error || 'Failed to create subscription plan')
        setTimeout(() => {
          errorMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    } catch (error) {
      console.error('Error creating subscription plan:', error)
      setFormError('An unexpected error occurred while creating the subscription plan')
      setTimeout(() => {
        errorMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Add New Plan</h1>
      
      {/* Error and Success Messages */}
      {formError && (
        <div ref={errorMessageRef} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 max-w-4xl mx-auto">
          {formError}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 max-w-4xl mx-auto">
          {successMessage}
        </div>
      )}
      
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Name */}
            <div className="space-y-2">
              <Input
                placeholder="Plan Name"
                value={formData.planName}
                onChange={(e) => handleInputChange('planName', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Pricing Model */}
            <div className="space-y-2">
              <Select value={formData.pricingModel} onValueChange={(value) => handleInputChange('pricingModel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed">Fixed</SelectItem>
                  <SelectItem value="Tiered">Tiered</SelectItem>
                  <SelectItem value="Usage">Usage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contract Length */}
            <div className="space-y-2">
              <Input
                placeholder="Contract Length"
                type="number"
                value={formData.contractLength}
                onChange={(e) => handleInputChange('contractLength', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Contract Frequency */}
            <div className="space-y-2">
              <Select value={formData.contractCadence} onValueChange={(value) => handleInputChange('contractCadence', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Month">Month</SelectItem>
                  <SelectItem value="Quarter">Quarter</SelectItem>
                  <SelectItem value="Year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Billing Cadence */}
            <div className="space-y-2">
              <Select value={formData.billingCadence} onValueChange={(value) => handleInputChange('billingCadence', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AIR Direct">AIR Direct</SelectItem>
                  <SelectItem value="Nexus Base">Nexus Base</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Billing Frequency */}
            <div className="space-y-2">
              <Select value={formData.billingFrequency} onValueChange={(value) => handleInputChange('billingFrequency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Month">Month</SelectItem>
                  <SelectItem value="Quarter">Quarter</SelectItem>
                  <SelectItem value="Year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Setup Fee */}
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  placeholder='Setup Fee'
                  value={formData.setupFee}
                  onChange={(e) => handleInputChange('setupFee', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Prepayment Percent */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="number"
                  placeholder='Prepayment %'
                  value={formData.prepaymentPercent}
                  onChange={(e) => handleInputChange('prepaymentPercent', e.target.value)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>

            {/* Cap */}
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  placeholder='Cap Amount'
                  value={formData.cap}
                  onChange={(e) => handleInputChange('cap', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Overage Cost */}
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  placeholder='Overage Cost'
                  value={formData.overageCost}
                  onChange={(e) => handleInputChange('overageCost', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePlan}
              disabled={isSubmitting}
              className="px-6 bg-black hover:bg-gray-800 text-white"
            >
              {isSubmitting ? 'Creating...' : 'Create Plan'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}