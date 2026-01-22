import { Card, CardContent } from '../../../../ui/card'
import { CheckCircle } from 'lucide-react'
import { Button } from '../../../../ui/button'

interface Props {
  userEmail: string
}

export function ServiceProviderConfirmation({ userEmail }: Props) {
  const handleGoToDashboard = () => {
    // ✅ Use VITE_SAAS_APP_URL from .env (localhost:8080 = frontend v2)
    const platformUrl = import.meta.env.VITE_SAAS_APP_URL || 'http://localhost:8080'
    
    // ✅ Redirect to /dashboard/partners route (found in DashboardRoutes.tsx line 77)
    const redirectUrl = `${platformUrl}/dashboard/partners`
    
    console.log('[SERVICE_PROVIDER] Redirecting to:', redirectUrl)
    window.location.href = redirectUrl
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="text-center py-12 space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold">Registration Successful!</h2>
          <p className="text-gray-600">
            Thank you for registering as a service provider. Your profile has been created successfully.
          </p>
          <p className="text-sm text-gray-500">
            Confirmation sent to: <strong>{userEmail}</strong>
          </p>
          <Button 
            onClick={handleGoToDashboard} 
            className="mt-4 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
          >
            Go to Partner Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
