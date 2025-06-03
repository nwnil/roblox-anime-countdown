'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; messageId?: string } | null>(null)
  const [healthStatus, setHealthStatus] = useState<any>(null)

  const testTypes = [
    { value: 'verification', label: 'Email Verification' },
    { value: 'oneDayBefore', label: 'One Day Before Release' },
    { value: 'oneHourBefore', label: 'One Hour Before Release' },
    { value: 'fifteenMinutesBefore', label: 'Fifteen Minutes Before Release' },
    { value: 'onRelease', label: 'Game Released' }
  ]

  const handleSendTest = async () => {
    if (!email || !notificationType) {
      setResult({ success: false, message: 'Please fill in all fields' })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          gameName: 'Test Game - Anime Adventure',
          gameId: 'test-game-123',
          notificationType
        })
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.demo 
            ? 'Demo mode: Email logged to console (configure MailerSend to send real emails)'
            : `Email sent successfully! Message ID: ${data.messageId || 'N/A'}`,
          messageId: data.messageId
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to send email'
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Network error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkHealth = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/send-notification')
      const data = await response.json()
      setHealthStatus(data)
    } catch (error) {
      setHealthStatus({
        status: 'error',
        message: 'Failed to check health'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-2">MailerSend Email Test</h1>
          <p className="text-gray-400">Test your MailerSend email configuration</p>
        </div>

        {/* Health Check */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Service Health Check
            </CardTitle>
            <CardDescription>Check if MailerSend is properly configured</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={checkHealth} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                'Check Configuration'
              )}
            </Button>

            {healthStatus && (
              <Alert className={`${
                healthStatus.configured 
                  ? 'border-green-500 bg-green-500/10 text-green-400' 
                  : 'border-red-500 bg-red-500/10 text-red-400'
              }`}>
                <div className="flex items-center gap-2">
                  {healthStatus.configured ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    <strong>Status:</strong> {healthStatus.configured ? 'Configured' : 'Not Configured'}
                    <br />
                    <strong>Service:</strong> {healthStatus.service}
                    <br />
                    <strong>Message:</strong> {healthStatus.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Email Test */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Send Test Email</CardTitle>
            <CardDescription>Send a test notification email to verify functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Test Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-white">Notification Type</Label>
              <Select value={notificationType} onValueChange={setNotificationType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {testTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-white">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSendTest} 
              disabled={isLoading || !email || !notificationType}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                'Send Test Email'
              )}
            </Button>

            {result && (
              <Alert className={`${
                result.success 
                  ? 'border-green-500 bg-green-500/10 text-green-400' 
                  : 'border-red-500 bg-red-500/10 text-red-400'
              }`}>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {result.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-300">
            <div className="space-y-2">
              <h4 className="font-semibold text-white">1. Create MailerSend Account</h4>
              <p className="text-sm">Sign up at <a href="https://www.mailersend.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">mailersend.com</a></p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-white">2. Verify Your Domain</h4>
              <p className="text-sm">Add and verify your domain in the MailerSend dashboard</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-white">3. Get API Token</h4>
              <p className="text-sm">Generate an API token in Settings &gt; API tokens</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-white">4. Configure Environment</h4>
              <p className="text-sm">Add these variables to your <code className="bg-slate-700 px-1 py-0.5 rounded">.env.local</code> file:</p>
              <pre className="bg-slate-900 p-3 rounded text-xs overflow-x-auto">
{`MAILERSEND_API_TOKEN=your_api_token_here
MAILERSEND_FROM_EMAIL=noreply@yourdomain.com
MAILERSEND_FROM_NAME=AniBlox Calendar`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 