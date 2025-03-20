"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Music, Briefcase, GraduationCapIcon as Graduation, Users, Mic2, Book, Calendar, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

const categories = [
  { id: 1, name: "Music", icon: Music },
  { id: 2, name: "Business", icon: Briefcase },
  { id: 3, name: "Academic", icon: Graduation },
  { id: 4, name: "Social", icon: Users },
  { id: 5, name: "Cultural", icon: Mic2 },
  { id: 6, name: "Workshop", icon: Book },
]

const categoryEvents = {
  Music: [
    {
      id: 1,
      title: "Spring Concert",
      date: "2024-03-15",
      location: "Auditorium",
      image: "/placeholder.svg?height=200&width=300&text=Spring+Concert",
    },
    {
      id: 2,
      title: "Jazz Night",
      date: "2024-03-20",
      location: "Student Center",
      image: "/placeholder.svg?height=200&width=300&text=Jazz+Night",
    },
  ],
  Business: [
    {
      id: 3,
      title: "Startup Weekend",
      date: "2024-03-25",
      location: "Business School",
      image: "/placeholder.svg?height=200&width=300&text=Startup+Weekend",
    },
    {
      id: 4,
      title: "Networking Mixer",
      date: "2024-03-30",
      location: "Conference Hall",
      image: "/placeholder.svg?height=200&width=300&text=Networking+Mixer",
    },
  ],
  Academic: [
    {
      id: 5,
      title: "Research Symposium",
      date: "2024-04-05",
      location: "Science Building",
      image: "/placeholder.svg?height=200&width=300&text=Research+Symposium",
    },
    {
      id: 6,
      title: "Guest Lecture Series",
      date: "2024-04-10",
      location: "Main Hall",
      image: "/placeholder.svg?height=200&width=300&text=Guest+Lecture+Series",
    },
  ],
  Social: [
    {
      id: 7,
      title: "Welcome Week Party",
      date: "2024-04-15",
      location: "Student Union",
      image: "/placeholder.svg?height=200&width=300&text=Welcome+Week+Party",
    },
    {
      id: 8,
      title: "International Food Festival",
      date: "2024-04-20",
      location: "Campus Green",
      image: "/placeholder.svg?height=200&width=300&text=Food+Festival",
    },
  ],
  Cultural: [
    {
      id: 9,
      title: "Diversity Celebration",
      date: "2024-04-25",
      location: "Performing Arts Center",
      image: "/placeholder.svg?height=200&width=300&text=Diversity+Celebration",
    },
    {
      id: 10,
      title: "Film Festival",
      date: "2024-04-30",
      location: "Campus Theater",
      image: "/placeholder.svg?height=200&width=300&text=Film+Festival",
    },
  ],
  Workshop: [
    {
      id: 11,
      title: "Creative Writing Workshop",
      date: "2024-05-05",
      location: "Library",
      image: "/placeholder.svg?height=200&width=300&text=Writing+Workshop",
    },
    {
      id: 12,
      title: "Tech Skills Bootcamp",
      date: "2024-05-10",
      location: "Computer Lab",
      image: "/placeholder.svg?height=200&width=300&text=Tech+Bootcamp",
    },
  ],
}

export function CategorySection() {
  const [selectedCategory, setSelectedCategory] = useState("Music")
  const [hoveredEventId, setHoveredEventId] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <motion.section
      className="py-12 bg-white"
      initial={isMounted ? { opacity: 0, y: 20 } : false}
      animate={isMounted ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.5 }}
    >
      <div className="container px-4">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={cn(
                  "p-4 rounded-lg transition-colors hover-lift border border-gray-200",
                  selectedCategory === category.name
                    ? "bg-black text-white"
                    : "bg-white hover:bg-secondary text-foreground",
                )}
                whileHover={isMounted ? { scale: 1.02 } : false}
                whileTap={isMounted ? { scale: 0.98 } : false}
              >
                <Icon className="h-8 w-8 mx-auto mb-2" />
                <span className="block text-sm font-medium">{category.name}</span>
              </motion.button>
            )
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={isMounted ? { opacity: 0, y: 20 } : false}
            animate={isMounted ? { opacity: 1, y: 0 } : false}
            exit={isMounted ? { opacity: 0, y: -20 } : false}
            transition={{ duration: 0.3 }}
          >
            {categoryEvents[selectedCategory as keyof typeof categoryEvents]?.map((event) => (
              <motion.div
                key={event.id}
                className="flex-shrink-0"
                whileHover={isMounted ? { scale: 1.02, zIndex: 1 } : false}
                onHoverStart={() => setHoveredEventId(event.id)}
                onHoverEnd={() => setHoveredEventId(null)}
              >
                <Card
                  className={`overflow-hidden transition-shadow duration-300 ${
                    hoveredEventId === event.id ? "shadow-lg" : "shadow"
                  }`}
                >
                  <div className="relative h-[200px] overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-foreground">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link
                      href={`/events/${event.id}`}
                      className="text-accent hover:text-accent/80 transition-colors duration-300"
                    >
                      View Details
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  )
}

