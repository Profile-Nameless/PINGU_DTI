"use client"

import { use } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Edit } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface EventViewPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EventViewPage({ params }: EventViewPageProps) {
  const resolvedParams = use(params)
  
  // Mock event data - in real app, fetch from API
  const event = {
    id: resolvedParams.id,
    title: "Tech Symposium 2024",
    description: "Join us for the biggest technology event of the year",
    date: "March 15, 2024",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&q=80",
    status: "Upcoming"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">View Event</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/events/edit/${resolvedParams.id}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/events/preview/${resolvedParams.id}`}>
            <Button variant="default" size="sm" className="gap-1">
              <Eye className="h-4 w-4" />
              Preview & Edit
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-[200px] rounded-lg overflow-hidden">
            <Image 
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Date:</span>
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <span>{event.status}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 