"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Music, Users, Briefcase, Book, Trophy, Palette, Mic, Clock, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getRandomEvents, getEventsByCategory, DisplayEvent } from "../utils/events"

const categories = [
  {
    id: 1,
    title: "Academic",
    icon: Book,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    textColor: "text-blue-500",
  },
  {
    id: 2,
    title: "Cultural",
    icon: Palette,
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
    textColor: "text-purple-500",
  },
  {
    id: 3,
    title: "Career",
    icon: Briefcase,
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
    textColor: "text-orange-500",
  },
  {
    id: 4,
    title: "Sports",
    icon: Trophy,
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    textColor: "text-green-500",
  },
  {
    id: 5,
    title: "Entertainment",
    icon: Music,
    color: "bg-pink-500",
    hoverColor: "hover:bg-pink-600",
    textColor: "text-pink-500",
  },
  {
    id: 6,
    title: "Workshops",
    icon: Users,
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
    textColor: "text-yellow-500",
  },
  {
    id: 7,
    title: "Seminars",
    icon: Mic,
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
    textColor: "text-red-500",
  },
  {
    id: 8,
    title: "Social",
    icon: Calendar,
    color: "bg-indigo-500",
    hoverColor: "hover:bg-indigo-600",
    textColor: "text-indigo-500",
  },
]

export default function CategorySection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [events, setEvents] = useState<DisplayEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        if (selectedCategory) {
          const categoryEvents = await getEventsByCategory(selectedCategory, 8)
          setEvents(categoryEvents)
        } else {
          // If no category is selected, show random events
          const randomEvents = await getRandomEvents(8)
          setEvents(randomEvents)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
        setEvents([]) // Set empty array to show "No events at this moment"
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [selectedCategory])

  return (
    <div className="container mx-auto px-4 space-y-12">
      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(selectedCategory === category.title ? null : category.title)}
            className={`relative p-4 rounded-xl transition-all duration-300 ${
              selectedCategory === category.title
                ? category.color + " shadow-lg"
                : "bg-white hover:shadow-md border border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              {<category.icon className={`h-6 w-6 ${
                selectedCategory === category.title ? "text-white" : category.textColor
              }`} />}
              <span className={`text-sm font-medium ${
                selectedCategory === category.title ? "text-white" : "text-gray-700"
              }`}>
                {category.title}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="group"
            >
              <Link href={`/events/${event.id}`}>
                <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-x border-b border-gray-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-10" />
                  <div className="relative h-48">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900 shadow-sm mb-2">
                        {event.category}
                      </span>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors duration-200">
                        {event.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1.5 text-blue-500" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1.5 text-purple-500" />
                        {event.time}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1.5 text-pink-500" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {event.attendees} attending
                      </span>
                      <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-500">
                        View Event
                        <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No events found for this category.</p>
        </div>
      )}
    </div>
  )
} 