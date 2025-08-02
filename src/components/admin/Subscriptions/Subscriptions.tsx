import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { mockSubscriptionPlans } from '@/data/mockData'

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
        <Button asChild className="bg-black hover:bg-gray-800 text-white whitespace-nowrap">
          <Link to="/admin/subscriptions/new" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Link>
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
              {mockSubscriptionPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{plan.pricingModel}</TableCell>
                  <TableCell>{plan.contractLength} { plan.contractCadence }{plan.contractLength > 0 ? "s" : ""}</TableCell>
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