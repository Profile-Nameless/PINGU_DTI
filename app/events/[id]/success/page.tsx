"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"

interface EventSuccessPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EventSuccessPage({ params }: EventSuccessPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
        <p className="text-gray-600 mb-6">
          You have successfully registered for this event. We've sent a confirmation email with all the details.
        </p>
        
        <div className="space-y-3">
          <Button 
            className="w-full bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300"
            onClick={() => router.push(`/events/${resolvedParams.id}`)}
          >
            View Event Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-2 border-orange-500/20 text-gray-700 hover:bg-orange-50 hover:border-orange-500/30 hover:text-black transition-all duration-300"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
} 