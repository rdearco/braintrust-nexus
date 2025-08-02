import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Github, Slack, Zap, Cloud, Database } from 'lucide-react'

const thirdPartyServices = [
  { id: 'slack', name: 'Slack', icon: Slack, connected: true },
  { id: 'github', name: 'GitHub', icon: Github, connected: false },
  { id: 'jira', name: 'Jira', icon: Zap, connected: false },
  { id: 'salesforce', name: 'Salesforce', icon: Cloud, connected: false },
  { id: 'aws', name: 'AWS', icon: Database, connected: false },
]

export function Exceptions() {
  const [credentials, setCredentials] = useState({
    workspaceUrl: 'acme-corp.slack.com',
    botToken: 'xoxb-************',
    signingSecret: '********'
  })

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveChanges = () => {
    console.log('Saving credentials:', credentials)
    // Here you would typically save the credentials
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Third Party Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Third Party Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {thirdPartyServices.map((service) => {
                const IconComponent = service.icon
                return (
                  <div key={service.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">{service.name}</span>
                    </div>
                    {service.connected && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Slack Credentials */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Slack className="h-6 w-6" />
              <CardTitle className="text-lg">Slack Credentials</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Connected</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Workspace URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Workspace URL
              </label>
              <Input
                value={credentials.workspaceUrl}
                onChange={(e) => handleInputChange('workspaceUrl', e.target.value)}
                className="bg-gray-50"
              />
            </div>

            {/* Bot User OAuth Token */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Bot User OAuth Token
              </label>
              <Input
                type="password"
                value={credentials.botToken}
                onChange={(e) => handleInputChange('botToken', e.target.value)}
                className="bg-gray-50 font-mono"
              />
            </div>

            {/* Signing Secret */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Signing Secret
              </label>
              <Input
                type="password"
                value={credentials.signingSecret}
                onChange={(e) => handleInputChange('signingSecret', e.target.value)}
                className="bg-gray-50 font-mono"
              />
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button 
                onClick={handleSaveChanges}
                className="bg-black hover:bg-gray-800 text-white"
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}