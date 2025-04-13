"use client"

import EventDetails from "./EventDetails"

interface EventPageProps {
  params: {
    id: string
  }
  searchParams: {
    source?: string
    mode?: string
  }
}

export default function EventPage({ params, searchParams }: EventPageProps) {
  return <EventDetails 
    id={params.id} 
    fromDashboard={searchParams.source === 'dashboard'} 
    mode={searchParams.mode}
  />
}

