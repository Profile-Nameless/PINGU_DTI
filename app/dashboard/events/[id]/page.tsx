"use client"

import { use } from "react"
import EventEditor from "./EventEditor"

interface EventEditorPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EventEditorPage({ params }: EventEditorPageProps) {
  const resolvedParams = use(params)
  return <EventEditor id={resolvedParams.id} />
} 