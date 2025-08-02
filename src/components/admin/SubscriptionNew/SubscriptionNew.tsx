import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCancel = () => {
    navigate('/admin/subscriptions')
  }

  const handleCreatePlan = () => {
    // Here you would typically save the plan data
    console.log('Creating plan:', formData)
    navigate('/admin/subscriptions')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Add New Plan</h1>
      
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
              className="px-6 bg-black hover:bg-gray-800 text-white"
            >
              Create Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}