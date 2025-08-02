import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

// Mock billing data for admin view
const mockAdminBillingData = {
  currentPlan: {
    name: 'Enterprise',
    baseFee: 2000,
    period: 'month'
  },
  credits: {
    remaining: 8450,
    renewDate: new Date('2025-05-01')
  },
  seHours: {
    used: 12.5,
    total: 20,
    remaining: 7.5
  },
  usage: {
    apiCalls: 245678,
    storageUsed: '1.2 TB',
    activeUsers: 127
  },
  recentInvoices: [
    {
      id: 'inv-1',
      month: 'April 2025',
      invoiceNumber: 'Invoice #2025-04',
      amount: 2450.00
    },
    {
      id: 'inv-2',
      month: 'March 2025',
      invoiceNumber: 'Invoice #2025-03',
      amount: 2450.00
    },
    {
      id: 'inv-3',
      month: 'February 2025',
      invoiceNumber: 'Invoice #2025-02',
      amount: 2450.00
    }
  ],
  paymentMethod: {
    type: 'Visa',
    lastFour: '4242',
    expires: '12/25'
  }
}

export function Billing() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing Overview</h1>
      </div>

             {/* Billing Overview Cards */}
       <div className="space-y-4">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Current Plan Card */}
           <Card>
             <CardContent className="pt-6">
               <div className="text-center">
                 <div className="text-sm font-medium text-gray-600 mb-2">Current Plan</div>
                 <div className="text-2xl font-bold text-gray-900 mb-1">Enterprise</div>
                 <div className="text-sm text-gray-500">$2,000/month base fee</div>
               </div>
             </CardContent>
           </Card>

           {/* Credits Remaining Card */}
           <Card>
             <CardContent className="pt-6">
               <div className="text-center">
                 <div className="text-sm font-medium text-gray-600 mb-2">Credits Remaining</div>
                 <div className="text-2xl font-bold text-gray-900 mb-1">8,450</div>
                 <div className="text-sm text-gray-500">Renews on May 1, 2025</div>
               </div>
             </CardContent>
           </Card>

           {/* SE Hours Card */}
           <Card>
             <CardContent className="pt-6">
               <div className="text-center">
                 <div className="text-sm font-medium text-gray-600 mb-2">SE Hours This Month</div>
                 <div className="text-2xl font-bold text-gray-900 mb-1">12.5 / 20</div>
                 <div className="text-sm text-gray-500">7.5 hours remaining</div>
               </div>
             </CardContent>
           </Card>
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Left Column */}
         <div className="space-y-6">

          {/* Usage Summary */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">Usage Summary</CardTitle>
                <Button variant="link" className="text-blue-600 p-0 h-auto">
                  View detailed report →
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">API Calls</span>
                <span className="font-medium">245,678</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Storage Used</span>
                <span className="font-medium">1.2 TB</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Active Users</span>
                <span className="font-medium">127</span>
              </div>
            </CardContent>
          </Card>

          {/* Billing Actions */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">Billing Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
                <div className="bg-white border rounded-lg p-4 flex items-center gap-3">
                  <div className="h-8 w-12 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div>
                    <div className="font-medium">Visa ending in 4242</div>
                    <div className="text-sm text-gray-600">Expires 12/25</div>
                  </div>
                </div>
                <Button variant="link" className="text-blue-600 p-0 h-auto mt-2">
                  Update payment method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Invoices */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAdminBillingData.recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div>
                    <div className="font-medium text-gray-900">{invoice.month}</div>
                    <div className="text-sm text-gray-600">{invoice.invoiceNumber}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="link" className="text-blue-600 p-0 h-auto">
                View all invoices →
              </Button>
            </CardContent>
          </Card>

          {/* Need Help? */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Need Help?</CardTitle>
            </CardHeader>
                         <CardContent className="space-y-3">
               <Button variant="outline" className="w-full justify-start">
                 Download Contract
               </Button>
               <Button className="w-full justify-center">
                 Contact Support
               </Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 