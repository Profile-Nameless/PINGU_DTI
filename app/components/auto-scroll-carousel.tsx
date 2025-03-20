"use client"

import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"

interface Event {
  id: number
  title: string
  date: string
  location: string
  image: string
  category: string
}

export function AutoScrollCarousel({ events, title }: { events: Event[]; title: string }) {
  const [isMounted, setIsMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Create a triple-length array for infinite scroll effect
  const displayEvents = [...events, ...events, ...events]
  const visibleCount = events.length
  const startIndex = visibleCount

  useEffect(() => {
    // Initialize to the middle set of items
    x.set(-(startIndex * (300 + 24)))
  }, [])

  const handleDragEnd = () => {
    if (!containerRef.current) return

    const cardWidth = 300 // Width of each card
    const gap = 24 // Gap between cards
    const currentScroll = x.get()
    
    let targetIndex = Math.round(-currentScroll / (cardWidth + gap))

    // Handle infinite scroll wrapping
    if (targetIndex < 0) {
      // If we're at the start, jump to the middle set
      targetIndex = visibleCount + (targetIndex % visibleCount)
      if (targetIndex < 0) targetIndex += visibleCount
    } else if (targetIndex >= visibleCount * 2) {
      // If we're at the end, jump to the middle set
      targetIndex = visibleCount + (targetIndex % visibleCount)
    }

    animate(x, -(targetIndex * (cardWidth + gap)), {
      type: "spring",
      stiffness: 400,
      damping: 30
    })
    
    setCurrentIndex(targetIndex % visibleCount)
  }

  const handleDotClick = (index: number) => {
    const cardWidth = 300
    const gap = 24
    const targetIndex = startIndex + index
    
    animate(x, -(targetIndex * (cardWidth + gap)), {
      type: "spring",
      stiffness: 400,
      damping: 30
    })
    setCurrentIndex(index)
  }

  return (
    <motion.section
      className="py-8 bg-secondary relative"
      initial={isMounted ? { opacity: 0, y: 20 } : undefined}
      animate={isMounted ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5 }}
    >
      <div className="container px-4">
        <h2 className="text-3xl font-bold mb-6 text-foreground">{title}</h2>
        <div className="relative overflow-hidden">
          <motion.div
            ref={containerRef}
            className="flex gap-6"
            drag="x"
            dragConstraints={{ 
              right: -(startIndex * (300 + 24) - (300 + 24)),
              left: -((displayEvents.length - visibleCount) * (300 + 24))
            }}
            style={{ x }}
            onDragEnd={handleDragEnd}
            dragElastic={0.1}
            dragMomentum={false}
          >
            {displayEvents.map((event, index) => (
              <motion.div
                key={`${event.id}-${index}`}
                className="relative flex-shrink-0"
                initial={isMounted ? { scale: 1 } : undefined}
                whileHover={isMounted ? {
                  scale: 1.02,
                  zIndex: 50,
                  transition: { duration: 0.2 },
                } : undefined}
                style={{
                  transformOrigin: "center center",
                }}
              >
                <Card className="w-[300px] bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group relative">
                  <div className="relative h-[160px] overflow-hidden">
                    <Image 
                      src={event.image || "/placeholder.svg"} 
                      alt={event.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 text-xs font-medium bg-black/5 rounded-full text-black/70">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-2 group-hover:text-black/80 transition-colors">
                      {event.title}
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 flex-shrink-0 text-black/50" />
                        <span className="line-clamp-1">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-black/50" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link
                      href={`/events/${event.id}`}
                      className="inline-flex items-center text-sm font-medium text-black/70 hover:text-black transition-colors group/link"
                    >
                      View Details
                      <motion.span
                        className="inline-block ml-1"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {events.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-black w-8" 
                    : "bg-black/20 w-2 hover:bg-black/40"
                }`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

