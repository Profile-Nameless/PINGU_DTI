"use client"

import EventDetails from "@/app/events/[id]/EventDetails"

interface EventPreviewPageProps {
  params: {
    id: string
  }
}

export default function EventPreviewPage({ params }: EventPreviewPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <EventDetails 
        id={params.id} 
        fromDashboard={true} 
        mode="preview"
      />
    </div>
  )
} 