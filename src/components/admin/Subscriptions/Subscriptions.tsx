import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'

const subscriptionPlans = [
  {
    id: '1',
    name: 'Enterprise Pro',
    pricingModel: 'Tiered',
    contractLength: '12 months',
    billingCadence: 'Monthly',
    setupFee: 5000,
    prepaymentPercent: 25,
    cap: 100000,
    overageCost: 150,
    clients: 12
  },
  {
    id: '2',
    name: 'Business Plus',
    pricingModel: 'Fixed',
    contractLength: '6 months',
    billingCadence: 'Quarterly',
    setupFee: 2500,
    prepaymentPercent: 15,
    cap: 50000,
    overageCost: 125,
    clients: 28
  },
  {
    id: '3',
    name: 'Starter',
    pricingModel: 'Usage',
    contractLength: '3 months',
    billingCadence: 'Monthly',
    setupFee: 1000,
    prepaymentPercent: 10,
    cap: 25000,
    overageCost: 100,
    clients: 45
  }
]

export function Subscriptions() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Plan Manager</h1>
        <Button className="bg-black hover:bg-gray-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Pricing Model</TableHead>
                <TableHead>Contract Length</TableHead>
                <TableHead>Billing Cadence</TableHead>
                <TableHead>Setup Fee</TableHead>
                <TableHead>Prepayment %</TableHead>
                <TableHead>$ Cap</TableHead>
                <TableHead>Overage Cost</TableHead>
                <TableHead># Clients</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{plan.pricingModel}</TableCell>
                  <TableCell>{plan.contractLength}</TableCell>
                  <TableCell>{plan.billingCadence}</TableCell>
                  <TableCell>{formatCurrency(plan.setupFee)}</TableCell>
                  <TableCell>{plan.prepaymentPercent}%</TableCell>
                  <TableCell>{formatCurrency(plan.cap)}</TableCell>
                  <TableCell>${plan.overageCost}/hr</TableCell>
                  <TableCell>{plan.clients}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}