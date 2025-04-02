"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, MapPin, Search, PlusCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock events data - replace with actual data fetching
  const events = [
    {
      id: "1",
      title: "Freshman Orientation",
      date: "2023-08-25",
      time: "9:00 AM",
      location: "Main Auditorium",
      description: "Welcome event for incoming freshmen",
      category: "Orientation",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&q=80"
    },
    {
      id: "2",
      title: "Career Fair",
      date: "2023-09-15",
      time: "10:00 AM",
      location: "Student Center",
      description: "Connect with potential employers",
      category: "Career",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&q=80"
    },
    {
      id: "3",
      title: "Alumni Networking Night",
      date: "2023-10-05",
      time: "6:00 PM",
      location: "Grand Hall",
      description: "Network with successful alumni",
      category: "Networking",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&q=80"
    },
    {
      id: "4",
      title: "Tech Symposium",
      date: "2023-11-10",
      time: "11:00 AM",
      location: "Engineering Building",
      description: "Latest technology trends and innovations",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&q=80"
    },
    {
      id: "5",
      title: "Winter Concert",
      date: "2023-12-01",
      time: "7:00 PM",
      location: "Performing Arts Center",
      description: "Annual winter music festival",
      category: "Arts",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&q=80"
    }
  ]

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Events</h1>
          <p className="text-gray-600 mt-1">Discover and join exciting events</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-[300px]"
            />
          </div>
          <Link href="/events/create">
            <Button className="bg-black text-white hover:bg-gray-800 gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/events/${event.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 text-gray-900 rounded-full text-sm font-medium">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-purple-500" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-red-500" />
                      {event.location}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

