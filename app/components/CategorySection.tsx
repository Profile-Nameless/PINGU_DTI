"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Music, Users, Briefcase, Book, Trophy, Palette, Mic, Clock, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

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

// Updated mock events data with more information
const mockEvents = [
  {
    id: 1,
    title: "Research Symposium",
    date: "March 15, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Science Building",
    venue: "Auditorium A",
    category: 1, // Academic
    image: "/placeholder.svg?height=400&width=600",
    organizer: "Department of Science",
    attendees: 200
  },
  {
    id: 2,
    title: "Cultural Festival",
    date: "April 1, 2024",
    time: "11:00 AM - 8:00 PM",
    location: "Main Auditorium",
    venue: "Central Hall",
    category: 2, // Cultural
    image: "/placeholder.svg?height=400&width=600",
    organizer: "Cultural Committee",
    attendees: 500
  },
  {
    id: 3,
    title: "Job Fair 2024",
    date: "March 20, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Business School",
    venue: "Conference Center",
    category: 3, // Career
    image: "/placeholder.svg?height=400&width=600",
    organizer: "Career Development Cell",
    attendees: 1000
  },
  {
    id: 4,
    title: "Inter-College Sports Meet",
    date: "April 5, 2024",
    time: "8:00 AM - 6:00 PM",
    location: "Sports Complex",
    venue: "Main Stadium",
    category: 4, // Sports
    image: "/placeholder.svg?height=400&width=600",
    organizer: "Sports Department",
    attendees: 300
  },
  {
    id: 5,
    title: "Battle of Bands",
    date: "March 25, 2024",
    time: "6:00 PM - 10:00 PM",
    location: "Student Center",
    venue: "Amphitheater",
    category: 5, // Entertainment
    image: "/placeholder.svg?height=400&width=600",
    organizer: "Music Club",
    attendees: 400
  },
  {
    id: 6,
    title: "Web Development Workshop",
    date: "April 10, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Tech Hub",
    venue: "Lab 101",
    category: 6, // Workshops
    image: "/placeholder.svg?height=400&width=600",
    organizer: "Computer Science Society",
    attendees: 50
  },
  {
    id: 7,
    title: "AI in Education Seminar",
    date: "March 30, 2024",
    time: "3:00 PM - 6:00 PM",
    location: "Conference Hall",
    venue: "Seminar Room B",
    category: 7, // Seminars
    image: "/placeholder.svg?height=400&width=600",
    organizer: "AI Research Group",
    attendees: 150
  },
  {
    id: 8,
    title: "Freshman Mixer",
    date: "April 15, 2024",
    time: "4:00 PM - 8:00 PM",
    location: "Student Lounge",
    venue: "Main Hall",
    category: 8, // Social
    image: "/placeholder.svg?height=400&width=600",
    organizer: "Student Council",
    attendees: 250
  },
]

export default function CategorySection() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const filteredEvents = selectedCategory
    ? mockEvents.filter(event => event.category === selectedCategory)
    : mockEvents

  return (
    <div className="container mx-auto px-4 space-y-12">
      <h2 className="text-3xl font-bold text-gray-900">
        Browse by Category
      </h2>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            className={`relative p-4 rounded-xl transition-all duration-300 ${
              selectedCategory === category.id
                ? category.color + " shadow-lg"
                : "bg-white hover:shadow-md"
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              {<category.icon className={`h-6 w-6 ${
                selectedCategory === category.id ? "text-white" : category.textColor
              }`} />}
              <span className={`text-sm font-medium ${
                selectedCategory === category.id ? "text-white" : "text-gray-700"
              }`}>
                {category.title}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEvents.map((event) => (
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
              <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-10" />
                <div className="relative h-48">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {categories.find(cat => cat.id === event.category) && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900 shadow-sm mb-2">
                        {categories.find(cat => cat.id === event.category)?.title}
                      </span>
                    )}
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
                    <span className="line-clamp-1">{event.location} • {event.venue}</span>
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
    </div>
  )
} 