import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle } from 'lucide-react'

const pipelineSteps = [
  { id: 1, name: 'Discovery: Initial Survey', status: 'completed', completedDate: 'Jan 15, 2025' },
  { id: 2, name: 'Discovery: Process deep dive', status: 'completed', completedDate: 'Jan 20, 2025' },
  { id: 3, name: 'ADA Proposal Sent', status: 'completed', completedDate: 'Jan 25, 2025' },
  { id: 4, name: 'ADA Proposal Review', status: 'in_progress', completedDate: null },
  { id: 5, name: 'ADA Contract Sent', status: 'pending', completedDate: null },
  { id: 6, name: 'ADA Contract Signed', status: 'pending', completedDate: null },
  { id: 7, name: 'Credentials collected', status: 'pending', completedDate: null },
  { id: 8, name: 'Factory build initiated', status: 'pending', completedDate: null },
]

export function ClientDashboard() {
  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'in_progress':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-gray-300 rounded-full" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Pipeline Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    {getStepStatusIcon(step.status)}
                    {index < pipelineSteps.length - 1 && (
                      <div className="w-px h-8 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{step.name}</div>
                    {step.completedDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Completed: {step.completedDate}
                      </div>
                    )}
                    {step.status === 'in_progress' && (
                      <div className="text-xs text-blue-600 mt-1">
                        In Progress
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Metrics and User */}
        <div className="space-y-6">
          {/* Time Saved */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Time Saved</div>
                <div className="text-3xl font-bold">24.5 hrs</div>
                <div className="text-xs text-gray-500">Last 7 days</div>
              </div>
              <div className="mt-4 pt-4 border-t text-center">
                <div className="text-3xl font-bold">168.2 hrs</div>
                <div className="text-xs text-gray-500">All time</div>
              </div>
            </CardContent>
          </Card>

          {/* Money Saved */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Money Saved</div>
                <div className="text-3xl font-bold">$2,450</div>
                <div className="text-xs text-gray-500">Last 7 days</div>
              </div>
              <div className="mt-4 pt-4 border-t text-center">
                <div className="text-3xl font-bold">$16,820</div>
                <div className="text-xs text-gray-500">All time</div>
              </div>
            </CardContent>
          </Card>

          {/* Active Workflows */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Active Workflows</div>
                <div className="text-3xl font-bold">12</div>
                <Button variant="link" className="text-blue-600 p-0 h-auto mt-2">
                  View workflows →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Profile */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" alt="John Smith" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">John Smith</div>
                  <div className="text-sm text-gray-600">Solutions Engineer</div>
                </div>
              </div>
              <Button className="w-full bg-black hover:bg-gray-800 text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message SE
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}