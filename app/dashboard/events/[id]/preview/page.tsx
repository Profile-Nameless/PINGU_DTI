"use client"

import { use } from "react"
import EventDetails from "@/app/events/[id]/EventDetails"

interface EventPreviewPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EventPreviewPage({ params }: EventPreviewPageProps) {
  const resolvedParams = use(params)
  return <EventDetails 
    id={resolvedParams.id} 
    fromDashboard={true} 
    mode="preview"
  />
} 