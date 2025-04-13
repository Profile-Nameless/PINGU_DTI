"use client"

import { use } from "react"
import EventDetails from "./EventDetails"

interface EventPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    source?: string
    mode?: string
  }>
}

export default function EventPage({ params, searchParams }: EventPageProps) {
  const resolvedParams = use(params)
  const resolvedSearchParams = use(searchParams)
  
  return <EventDetails 
    id={resolvedParams.id} 
    fromDashboard={resolvedSearchParams.source === 'dashboard'} 
    mode={resolvedSearchParams.mode}
  />
}

