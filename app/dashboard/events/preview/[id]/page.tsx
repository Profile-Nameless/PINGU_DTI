"use client"

import { useParams } from "next/navigation"
import EventDetails from "@/app/events/[id]/EventDetails"

export default function EventPreviewPage() {
  // Get the id parameter from the URL
  const params = useParams()
  const eventId = params.id as string
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <EventDetails 
        id={eventId} 
        fromDashboard={true} 
        mode="preview"
      />
    </div>
  )
} 